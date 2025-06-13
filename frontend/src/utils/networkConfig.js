// Network configurations for popular testnets
export const TESTNET_CONFIGS = {
  // Ethereum Sepolia Testnet
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'SEP',
      decimals: 18
    },
    rpcUrls: [
      'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
      'https://rpc.sepolia.org',
      'https://ethereum-sepolia.blockpi.network/v1/rpc/public'
    ],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    faucets: [
      'https://sepoliafaucet.com/',
      'https://www.alchemy.com/faucets/ethereum-sepolia',
      'https://sepolia-faucet.pk910.de/'
    ]
  },

  // Polygon Mumbai Testnet
  mumbai: {
    chainId: '0x13881', // 80001 in hex
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: [
      'https://rpc-mumbai.maticvigil.com',
      'https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY',
      'https://rpc.ankr.com/polygon_mumbai'
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    faucets: [
      'https://faucet.polygon.technology/',
      'https://www.alchemy.com/faucets/polygon-mumbai',
      'https://mumbaifaucet.com/'
    ]
  },

  // BSC Testnet
  bscTestnet: {
    chainId: '0x61', // 97 in hex
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'tBNB',
      decimals: 18
    },
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545'
    ],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    faucets: [
      'https://testnet.binance.org/faucet-smart',
      'https://testnet.bnbchain.org/faucet-smart'
    ]
  },

  // Arbitrum Sepolia
  arbitrumSepolia: {
    chainId: '0x66eee', // 421614 in hex
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://sepolia-rollup.arbitrum.io/rpc',
      'https://arbitrum-sepolia.blockpi.network/v1/rpc/public'
    ],
    blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
    faucets: [
      'https://www.alchemy.com/faucets/arbitrum-sepolia'
    ]
  },

  // Optimism Sepolia
  optimismSepolia: {
    chainId: '0xaa37dc', // 11155420 in hex
    chainName: 'OP Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://sepolia.optimism.io',
      'https://optimism-sepolia.blockpi.network/v1/rpc/public'
    ],
    blockExplorerUrls: ['https://sepolia-optimism.etherscan.io/'],
    faucets: [
      'https://www.alchemy.com/faucets/optimism-sepolia'
    ]
  }
};

// Helper function to add network to MetaMask
export const addNetworkToMetaMask = async (networkKey) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const network = TESTNET_CONFIGS[networkKey];
  if (!network) {
    throw new Error(`Network ${networkKey} not found`);
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [network],
    });
    console.log(`✅ ${network.chainName} added to MetaMask`);
  } catch (error) {
    console.error(`❌ Failed to add ${network.chainName}:`, error);
    throw error;
  }
};

// Helper function to switch to a network
export const switchToNetwork = async (networkKey) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const network = TESTNET_CONFIGS[networkKey];
  if (!network) {
    throw new Error(`Network ${networkKey} not found`);
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
    console.log(`✅ Switched to ${network.chainName}`);
  } catch (error) {
    // If network doesn't exist, add it first
    if (error.code === 4902) {
      await addNetworkToMetaMask(networkKey);
      // Then switch to it
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } else {
      throw error;
    }
  }
};

// Get faucet URLs for a network
export const getFaucetUrls = (networkKey) => {
  const network = TESTNET_CONFIGS[networkKey];
  return network ? network.faucets : [];
};

// Get explorer URL for a network
export const getExplorerUrl = (networkKey, address = '') => {
  const network = TESTNET_CONFIGS[networkKey];
  if (!network || !network.blockExplorerUrls[0]) return '';
  
  return `${network.blockExplorerUrls[0]}${address ? `address/${address}` : ''}`;
}; 