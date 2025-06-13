import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const DeployContractTab = ({
  formData,
  contractTypes,
  blockchains,
  isDeploying,
  deploymentStatus,
  deploymentError,
  contractDeployed,
  transactionHash,
  explorerUrl,
  onDeployContract,
  onBack
}) => {
  const selectedBlockchain = blockchains.find(b => b.value === formData.blockchain);

  // Calculate deployment cost based on contract type and blockchain
  const calculateDeploymentCost = () => {
    const basePrice = 0.0006; // Base price in ETH
    const contractTypeMultiplier = {
      'erc20': 1,
      'erc721': 1.2,
      'erc1155': 1.5,
      'custom': 2
    }[formData.contractType] || 1;

    const blockchainMultiplier = {
      'ethereum': 1,
      'polygon': 0.8,
      'bsc': 0.7,
      'avalanche': 0.9
    }[formData.blockchain] || 1;

    const rawAmount = basePrice * contractTypeMultiplier * blockchainMultiplier;
    // Round to 4 decimal places
    const amount = Number(Math.round(rawAmount + 'e4') + 'e-4').toFixed(4);
    const currency = blockchains.find(b => b.value === formData.blockchain)?.currency || 'ETH';
    
    return { amount, currency };
  };

  const handleViewOnExplorer = () => {
    if (explorerUrl) {
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Deploy Smart Contract</CardTitle>
          <CardDescription>
            Review your contract details and proceed with deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h3 className="font-medium text-yellow-800">Deployment Information</h3>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>Contract Type: {contractTypes.find(t => t.value === formData.contractType)?.label}</li>
                <li>Blockchain: {selectedBlockchain?.label}</li>
                <li>Estimated Cost: {calculateDeploymentCost().amount} {calculateDeploymentCost().currency}</li>
              </ul>
            </div>
          </div>
          
          {!isDeploying && !contractDeployed && (
            <Button
              onClick={onDeployContract}
              className="w-full"
            >
              Deploy Contract
            </Button>
          )}

          {isDeploying && (
            <div className="bg-[#1A2333] border border-indigo-700 rounded-md p-4">
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 text-indigo-500 mr-2 animate-spin" />
                <div>
                  <h4 className="font-medium text-indigo-300">Deployment In Progress</h4>
                  <p className="text-sm text-indigo-400">
                    {deploymentStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {deploymentError && !isDeploying && (
             <div className="bg-[#1A2333] border border-red-700 rounded-md p-4">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-red-300">Deployment Failed</h4>
                  <p className="text-sm text-red-400">
                    {deploymentError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {contractDeployed && (
            <div className="bg-green-50 rounded-md p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">Deployment Successful!</h4>
                  <p className="text-sm text-green-600 mt-1">
                    Your contract "{formData.contractName || 'Smart Contract'}" is now live on the {selectedBlockchain?.label} blockchain.
                  </p>
                  {transactionHash && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between bg-green-100 rounded-lg p-3">
                        <div className="text-sm text-green-700 font-mono truncate">
                          Transaction Hash: {transactionHash}
                        </div>
                        {explorerUrl && (
                          <button
                            onClick={handleViewOnExplorer}
                            className="ml-3 inline-flex items-center text-sm text-green-600 hover:text-green-500 shrink-0"
                          >
                            View on Explorer
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-green-600">
                        Your contract will be fully confirmed after a few block confirmations. You can track the status using the explorer link above.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button 
              variant="outline"
              onClick={onBack}
              disabled={isDeploying}
            >
              Back
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DeployContractTab;
