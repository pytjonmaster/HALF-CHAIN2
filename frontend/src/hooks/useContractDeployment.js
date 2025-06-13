import { useState, useCallback } from 'react';
import {
  connectToMetaMask,
  deployContract,
  verifyContractDeployment,
  estimateDeploymentCost,
  switchNetwork,
  getCurrentNetwork,
  isMetaMaskInstalled
} from '@/services/deploymentService';

export const useContractDeployment = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [error, setError] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    try {
      setError(null);
      const connectionData = await connectToMetaMask();
      setAccount(connectionData.address);
      setNetwork(connectionData.network);
      setIsConnected(true);
      return connectionData;
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
      throw err;
    }
  }, []);

  // Deploy contract
  const deploy = useCallback(async (contractData, constructorArgs = [], options = {}) => {
    try {
      setError(null);
      setIsDeploying(true);
      setDeploymentResult(null);

      if (!isConnected) {
        throw new Error('Please connect to MetaMask first');
      }

      const result = await deployContract(contractData, constructorArgs, options);
      setDeploymentResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsDeploying(false);
    }
  }, [isConnected]);

  // Estimate deployment cost
  const estimateCost = useCallback(async (contractData, constructorArgs = []) => {
    try {
      setError(null);
      const cost = await estimateDeploymentCost(contractData, constructorArgs);
      setEstimatedCost(cost);
      return cost;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Verify deployment
  const verifyDeployment = useCallback(async (contractAddress) => {
    try {
      setError(null);
      return await verifyContractDeployment(contractAddress);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Switch network
  const changeNetwork = useCallback(async (chainId) => {
    try {
      setError(null);
      await switchNetwork(chainId);
      const newNetwork = await getCurrentNetwork();
      setNetwork(newNetwork);
      return newNetwork;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setError(null);
    setDeploymentResult(null);
    setEstimatedCost(null);
  }, []);

  return {
    // State
    isConnected,
    account,
    network,
    isDeploying,
    deploymentResult,
    error,
    estimatedCost,
    isMetaMaskInstalled: isMetaMaskInstalled(),

    // Actions
    connect,
    deploy,
    estimateCost,
    verifyDeployment,
    changeNetwork,
    reset
  };
}; 