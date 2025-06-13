import React from 'react';
import ContractDeployment from '@/components/ContractDeployment';

// Example: Sample ERC20 Token Contract Data
const sampleContractData = {
  // This would be your compiled contract bytecode
  bytecode: "0x608060405234801561001057600080fd5b506040516107083803806107088339818101604052810190610032919061012e565b81600390816100419190610359565b5080600490816100519190610359565b505050610457565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6100bf82610076565b810181811067ffffffffffffffff821117156100de576100dd610087565b5b80604052505050565b60006100f1610058565b90506100fd82826100b6565b919050565b600067ffffffffffffffff82111561011d5761011c610087565b5b61012682610076565b9050602081019050919050565b60008115159050919050565b600061015261014d84610102565b6100e7565b90508281526020810184848401111561016e5761016d610071565b5b610179848285610133565b509392505050565b600082601f8301126101965761019561006c565b5b81516101a684826020860161013f565b91505092915050565b6000819050919050565b6101c2816101af565b81146101cd57600080fd5b50565b6000815190506101df816101b9565b92915050565b600080600080608085870312156101ff576101fe610062565b5b600085015167ffffffffffffffff81111561021d5761021c610067565b5b61022987828801610181565b945050602085015167ffffffffffffffff81111561024a57610249610067565b5b61025687828801610181565b9350506040610267878288016101d0565b92505060606102788782880161026e565b91505092959194509250565b600081519050919050565b6000806000806080858703121561029b5761029a61025a565b5b60006102a985828601610233565b92505060206102ba85828601610233565b9150509250929050565b6102cd81610181565b82525050565b60006020820190506102e860008301846102c4565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061033c57607f821691505b60208210810361034f5761034e6102ee565b5b5091905056fea2646970667358221220c9a8b5b6e5c5f4c5e5c5f4c5e5c5f4c5e5c5f4c5e5c5f4c5e5c5f4c5e5c5f4c564736f6c63430008110033",
  
  // This would be your contract ABI
  abi: [
    {
      "inputs": [
        {"internalType": "string", "name": "_name", "type": "string"},
        {"internalType": "string", "name": "_symbol", "type": "string"},
        {"internalType": "uint256", "name": "_totalSupply", "type": "uint256"},
        {"internalType": "address", "name": "_owner", "type": "address"}
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "owner", "type": "address"},
        {"internalType": "address", "name": "spender", "type": "address"}
      ],
      "name": "allowance",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint264"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

const DeploymentExample = () => {
  const handleDeploymentSuccess = (result) => {
    console.log('✅ Deployment successful!', result);
    alert(`Contract deployed successfully at: ${result.address}`);
  };

  const handleDeploymentError = (error) => {
    console.error('❌ Deployment failed:', error);
    alert(`Deployment failed: ${error.message}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Smart Contract Deployment Example
      </h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Usage Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Connect your MetaMask wallet</li>
          <li>Switch to a testnet (Sepolia, Mumbai, etc.)</li>
          <li>Upload your compiled contract JSON file OR use the sample contract below</li>
          <li>Enter constructor arguments if required (JSON format)</li>
          <li>Estimate deployment cost</li>
          <li>Deploy your contract to the blockchain</li>
        </ol>
      </div>

      <ContractDeployment
        contractData={sampleContractData}
        onDeploymentSuccess={handleDeploymentSuccess}
        onDeploymentError={handleDeploymentError}
      />

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Sample Contract Info:</h3>
        <p className="text-sm text-gray-600 mb-2">
          The example above uses a sample ERC20 token contract that requires these constructor arguments:
        </p>
        <code className="block bg-white p-2 rounded text-sm">
          ["MyToken", "MTK", "1000000000000000000000000", "0xYourAddressHere"]
        </code>
        <p className="text-xs text-gray-500 mt-1">
          [name, symbol, totalSupply (with 18 decimals), owner address]
        </p>
      </div>
    </div>
  );
};

export default DeploymentExample; 