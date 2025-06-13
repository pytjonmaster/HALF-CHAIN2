const onDeployContract = async () => {
  try {
    setIsDeploying(true);
    setDeploymentStatus('Initializing deployment...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s

    setDeploymentStatus('Connecting to network...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 2s

    setDeploymentStatus('Estimating gas fees...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 3s

    setDeploymentStatus('Waiting for wallet confirmation...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 4s

    setDeploymentStatus('Processing transaction...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 6s

    setDeploymentStatus('Submitting transaction...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 8s

    setDeploymentStatus('Waiting for confirmation...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 10s

    // Generate a random transaction hash
    const randomHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    setTransactionHash(randomHash);
    setContractDeployed(true);
    setIsDeploying(false);
    setDeploymentStatus('');
  } catch (error) {
    setIsDeploying(false);
    setDeploymentError(error.message || 'An unexpected error occurred during deployment.');
    setDeploymentStatus('');
  }
}; 