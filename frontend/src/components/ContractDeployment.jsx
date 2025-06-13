import React, { useState, useRef } from 'react';
import { useContractDeployment } from '@/hooks/useContractDeployment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const ContractDeployment = ({ 
  contractData = null, 
  onDeploymentSuccess = () => {},
  onDeploymentError = () => {} 
}) => {
  const {
    isConnected,
    account,
    network,
    isDeploying,
    deploymentResult,
    error,
    estimatedCost,
    isMetaMaskInstalled,
    connect,
    deploy,
    estimateCost,
    verifyDeployment,
    changeNetwork,
    reset
  } = useContractDeployment();

  const [constructorArgs, setConstructorArgs] = useState('');
  const [uploadedContract, setUploadedContract] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file upload for contract data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const contractData = JSON.parse(e.target.result);
          setUploadedContract(contractData);
          reset();
        } catch (err) {
          console.error('Failed to parse contract file:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  // Get the contract data to use (prop or uploaded)
  const getContractData = () => contractData || uploadedContract;

  // Handle cost estimation
  const handleEstimateCost = async () => {
    const contract = getContractData();
    if (!contract) return;

    try {
      const args = constructorArgs ? JSON.parse(constructorArgs) : [];
      await estimateCost(contract, args);
    } catch (err) {
      console.error('Failed to estimate cost:', err);
    }
  };

  // Handle deployment
  const handleDeploy = async () => {
    const contract = getContractData();
    if (!contract) return;

    try {
      const args = constructorArgs ? JSON.parse(constructorArgs) : [];
      const result = await deploy(contract, args);
      onDeploymentSuccess(result);
    } catch (err) {
      onDeploymentError(err);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Switch to common testnets
  const switchToTestnet = (chainId) => {
    changeNetwork(chainId);
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            MetaMask Required
          </CardTitle>
          <CardDescription>
            MetaMask is required to deploy smart contracts to the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
              Install MetaMask
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Button onClick={connect} className="w-full">
              Connect to MetaMask
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{account?.slice(0, 6)}...{account?.slice(-4)}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network:</span>
                <Badge variant="secondary">{network?.name} (ID: {network?.chainId})</Badge>
              </div>
              
              {/* Quick Network Switch */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchToTestnet(11155111)} // Sepolia
                >
                  Sepolia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchToTestnet(80001)} // Mumbai
                >
                  Mumbai
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchToTestnet(97)} // BSC Testnet
                >
                  BSC Testnet
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Upload */}
      {!contractData && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Data</CardTitle>
            <CardDescription>
              Upload your compiled contract JSON file containing bytecode and ABI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Upload Contract JSON
              </Button>
              {uploadedContract && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Contract loaded successfully! Ready for deployment.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Form */}
      {(contractData || uploadedContract) && isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Deploy Contract</CardTitle>
            <CardDescription>
              Configure and deploy your smart contract to the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Constructor Arguments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Constructor Arguments (JSON Array)
              </label>
              <textarea
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
                placeholder='["param1", "param2", 123]'
                className="w-full p-3 border rounded-md min-h-[80px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter constructor arguments as a JSON array. Leave empty if no arguments required.
              </p>
            </div>

            {/* Cost Estimation */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleEstimateCost}
                disabled={!isConnected}
              >
                Estimate Deployment Cost
              </Button>
              
              {estimatedCost && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div>Estimated Gas: {Number(estimatedCost.estimatedGas).toLocaleString()}</div>
                      <div>Gas Price: {estimatedCost.gasPrice} Gwei</div>
                      <div className="font-semibold">Total Cost: {estimatedCost.totalCostEth} ETH</div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={!isConnected || isDeploying}
              className="w-full"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying Contract...
                </>
              ) : (
                'Deploy Contract'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Deployment Result */}
      {deploymentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Deployment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contract Address:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {deploymentResult.address}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(deploymentResult.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Hash:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {deploymentResult.transactionHash?.slice(0, 10)}...
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(deploymentResult.transactionHash)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Block Number:</span>
                <Badge variant="outline">{deploymentResult.blockNumber}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gas Used:</span>
                <Badge variant="outline">{Number(deploymentResult.gasUsed).toLocaleString()}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Fee:</span>
                <Badge variant="outline">{deploymentResult.transactionFee} ETH</Badge>
              </div>
            </div>

            {/* View on Explorer */}
            {network?.chainId && (
              <Button
                variant="outline"
                asChild
                className="w-full mt-4"
              >
                <a
                  href={getExplorerUrl(network.chainId, deploymentResult.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Block Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to get explorer URL
const getExplorerUrl = (chainId, address) => {
  const explorers = {
    '1': 'https://etherscan.io/address/',
    '11155111': 'https://sepolia.etherscan.io/address/',
    '137': 'https://polygonscan.com/address/',
    '80001': 'https://mumbai.polygonscan.com/address/',
    '56': 'https://bscscan.com/address/',
    '97': 'https://testnet.bscscan.com/address/',
  };
  
  return `${explorers[chainId] || 'https://etherscan.io/address/'}${address}`;
};

export default ContractDeployment; 