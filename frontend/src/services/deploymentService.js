import { ethers } from 'ethers';

// Initialize deployment service
let provider = null;
let signer = null;

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Connect to MetaMask wallet
 */
export const connectToMetaMask = async () => {
  console.log('🔗 Connecting to MetaMask...');
  
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    
    console.log('✅ MetaMask connected successfully');
    console.log('📱 Address:', address);
    console.log('🌐 Network:', network.name, `(Chain ID: ${network.chainId})`);
    console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');

    return {
      address,
      network: {
        name: network.name,
        chainId: network.chainId.toString()
      },
      balance: ethers.formatEther(balance)
    };
  } catch (error) {
    console.error('❌ MetaMask connection failed:', error);
    throw new Error(`Failed to connect to MetaMask: ${error.message}`);
  }
};

/**
 * Switch to a specific network
 */
export const switchNetwork = async (chainId) => {
  console.log(`🔄 Switching to network ${chainId}...`);
  
  if (!window.ethereum) {
    throw new Error('MetaMask is not available');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.toBeHex(chainId) }],
    });
    
    // Update provider after network switch
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    console.log('✅ Network switched successfully');
  } catch (error) {
    console.error('❌ Network switch failed:', error);
    throw new Error(`Failed to switch network: ${error.message}`);
  }
};

/**
 * Get current network information
 */
export const getCurrentNetwork = async () => {
  if (!provider) {
    throw new Error('Please connect to MetaMask first');
  }
  
  const network = await provider.getNetwork();
  return {
    name: network.name,
    chainId: network.chainId.toString()
  };
};

/**
 * Deploy smart contract to the blockchain
 * @param {Object} contractData - Contract compilation data
 * @param {string} contractData.bytecode - Contract bytecode
 * @param {Array} contractData.abi - Contract ABI
 * @param {Array} constructorArgs - Constructor arguments
 * @param {Object} options - Deployment options
 */
export const deployContract = async (contractData, constructorArgs = [], options = {}) => {
  console.log('🚀 Starting contract deployment...');
  
  if (!provider || !signer) {
    throw new Error('Please connect to MetaMask first');
  }

  const { bytecode, abi } = contractData;
  
  if (!bytecode || !abi) {
    throw new Error('Invalid contract data. Bytecode and ABI are required.');
  }

  try {
    // Get current gas price and estimate gas
    const gasPrice = await provider.getFeeData();
    console.log('⛽ Current gas price:', ethers.formatUnits(gasPrice.gasPrice, 'gwei'), 'Gwei');

    // Create contract factory
    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
    
    // Estimate gas for deployment
    const estimatedGas = await contractFactory.getDeployTransaction(...constructorArgs).then(tx => 
      provider.estimateGas(tx)
    );
    
    console.log('📊 Estimated gas:', estimatedGas.toString());
    
    // Prepare deployment options
    const deploymentOptions = {
      gasLimit: estimatedGas * BigInt(120) / BigInt(100), // Add 20% buffer
      ...options
    };

    console.log('📤 Deploying contract with args:', constructorArgs);
    console.log('⚙️ Deployment options:', deploymentOptions);

    // Deploy the contract
    const contract = await contractFactory.deploy(...constructorArgs, deploymentOptions);
    
    console.log('⏳ Contract deployment transaction sent...');
    console.log('📄 Transaction hash:', contract.deploymentTransaction().hash);
    
    // Wait for deployment confirmation
    console.log('⏳ Waiting for deployment confirmation...');
    const deployedContract = await contract.waitForDeployment();
    
    const contractAddress = await deployedContract.getAddress();
    const deploymentTx = contract.deploymentTransaction();
    const receipt = await deploymentTx.wait();
    
    console.log('✅ Contract deployed successfully!');
    console.log('📍 Contract address:', contractAddress);
    console.log('🧾 Block number:', receipt.blockNumber);
    console.log('⛽ Gas used:', receipt.gasUsed.toString());
    console.log('💰 Transaction fee:', ethers.formatEther(receipt.gasUsed * receipt.gasPrice), 'ETH');

    return {
      address: contractAddress,
      transactionHash: deploymentTx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      transactionFee: ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
      contract: deployedContract
    };
    
  } catch (error) {
    console.error('❌ Contract deployment failed:', error);
    
    // Provide more specific error messages
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for deployment. Please add more ETH to your wallet.');
    } else if (error.code === 'USER_REJECTED') {
      throw new Error('Deployment cancelled by user.');
    } else if (error.message.includes('gas')) {
      throw new Error(`Gas estimation failed: ${error.message}`);
    } else {
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
};

/**
 * Verify contract deployment by checking if code exists at address
 */
export const verifyContractDeployment = async (contractAddress) => {
  console.log('🔍 Verifying contract deployment...');
  
  if (!provider) {
    throw new Error('Please connect to MetaMask first');
  }

  try {
    const code = await provider.getCode(contractAddress);
    const isDeployed = code !== '0x';
    
    console.log('📋 Contract verification result:', isDeployed ? '✅ Deployed' : '❌ Not found');
    
    return isDeployed;
  } catch (error) {
    console.error('❌ Contract verification failed:', error);
    throw new Error(`Verification failed: ${error.message}`);
  }
};

/**
 * Get deployment transaction details
 */
export const getTransactionDetails = async (txHash) => {
  console.log('📄 Getting transaction details...');
  
  if (!provider) {
    throw new Error('Please connect to MetaMask first');
  }

  try {
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!tx || !receipt) {
      throw new Error('Transaction not found');
    }

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      gasLimit: tx.gasLimit.toString(),
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'Success' : 'Failed',
      confirmations: await tx.confirmations()
    };
  } catch (error) {
    console.error('❌ Failed to get transaction details:', error);
    throw new Error(`Failed to get transaction details: ${error.message}`);
  }
};

/**
 * Estimate deployment cost
 */
export const estimateDeploymentCost = async (contractData, constructorArgs = []) => {
  console.log('💰 Estimating deployment cost...');
  
  if (!provider || !signer) {
    throw new Error('Please connect to MetaMask first');
  }

  try {
    const { bytecode, abi } = contractData;
    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
    
    // Get gas estimation
    const estimatedGas = await contractFactory.getDeployTransaction(...constructorArgs).then(tx => 
      provider.estimateGas(tx)
    );
    
    // Get current gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    
    // Calculate cost
    const estimatedCost = estimatedGas * gasPrice;
    const estimatedCostInEth = ethers.formatEther(estimatedCost);
    
    console.log('📊 Deployment cost estimation:');
    console.log('⛽ Estimated gas:', estimatedGas.toString());
    console.log('💰 Gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'Gwei');
    console.log('💎 Total cost:', estimatedCostInEth, 'ETH');
    
    return {
      estimatedGas: estimatedGas.toString(),
      gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
      totalCostWei: estimatedCost.toString(),
      totalCostEth: estimatedCostInEth
    };
  } catch (error) {
    console.error('❌ Cost estimation failed:', error);
    throw new Error(`Cost estimation failed: ${error.message}`);
  }
};

// Export provider and signer for external use
export const getProvider = () => provider;
export const getSigner = () => signer; 