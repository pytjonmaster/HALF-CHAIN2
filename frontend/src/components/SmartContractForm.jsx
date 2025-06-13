
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContractDetailsTab from '@/components/smart-contract-form/ContractDetailsTab';
import ReviewContractTab from '@/components/smart-contract-form/ReviewContractTab';
import DeployContractTab from '@/components/smart-contract-form/DeployContractTab';
import { contractTypes, blockchains } from '@/components/smart-contract-form/formUtils.js';
import { useSmartContractForm } from '@/components/smart-contract-form/useSmartContractForm';

const SmartContractForm = () => {
  const {
    activeTab,
    setActiveTab,
    isGenerating,
    isDeploying,
    deploymentStatus,
    deploymentError,
    contractGenerated,
    contractDeployed,
    transactionHash,
    explorerUrl,
    formData,
    handleChange,
    handleSelectChange,
    handleSwitchChange,
    handleGenerateContract,
    handleDeployContract,
  } = useSmartContractForm();

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card/60 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-border/30 shadow-2xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" disabled={isGenerating || isDeploying}>Contract Details</TabsTrigger>
          <TabsTrigger value="review" disabled={!contractGenerated || isGenerating || isDeploying}>Review</TabsTrigger>
          <TabsTrigger value="deploy" disabled={!contractGenerated || isGenerating || isDeploying || contractDeployed}>Deploy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ContractDetailsTab
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
            isGenerating={isGenerating}
            onGenerateContract={handleGenerateContract}
            contractTypes={contractTypes}
            blockchains={blockchains}
          />
        </TabsContent>
        
        <TabsContent value="review">
          <ReviewContractTab
            formData={formData}
            contractTypes={contractTypes}
            onBack={() => setActiveTab('details')}
            onContinue={() => setActiveTab('deploy')}
          />
        </TabsContent>
        
        <TabsContent value="deploy">
          <DeployContractTab
            formData={formData}
            contractTypes={contractTypes}
            blockchains={blockchains}
            isDeploying={isDeploying}
            deploymentStatus={deploymentStatus}
            deploymentError={deploymentError}
            contractDeployed={contractDeployed}
            transactionHash={transactionHash}
            explorerUrl={explorerUrl}
            onDeployContract={handleDeployContract}
            onBack={() => setActiveTab('review')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartContractForm;
