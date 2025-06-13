import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { blockchains } from '@/components/smart-contract-form/formUtils.js';
import { getExplorerUrl, simulateTransactionHash } from '@/components/smart-contract-form/deploymentUtils.js';
import { generateContractCode, generateTemplateBasedContract } from './formUtils';

const initialFormData = {
  contractName: '',
  contractType: '',
  blockchain: '',
  description: '',
  parties: '',
  terms: '',
  enableKYC: true,
  enableAudit: true,
  generatedCode: '',
};

const REQUIRED_FIELDS = ['contractName', 'contractType', 'blockchain'];

export const useSmartContractForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deploymentError, setDeploymentError] = useState('');
  const [contractGenerated, setContractGenerated] = useState(false);
  const [contractDeployed, setContractDeployed] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = useCallback(() => {
    const errors = {};
    REQUIRED_FIELDS.forEach(field => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleGenerateContract = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setContractGenerated(false);
    
    try {
      let generatedCode = '';
      let usedAI = false;
      
      try {
        console.log('Attempting AI generation with:', formData);
        generatedCode = await generateContractCode(formData);
        usedAI = true;
        console.log('AI generation successful');
      } catch (error) {
        console.warn('AI generation failed, falling back to template:', error);
        toast({
          variant: "warning",
          title: "Using Template",
          description: "AI service unavailable. Using template-based generation.",
        });
        generatedCode = generateTemplateBasedContract(formData);
        usedAI = false;
      }

      setFormData(prev => ({ ...prev, generatedCode: generatedCode || '' }));
      setContractGenerated(true);
      setActiveTab('review');
      
      // Show appropriate success message
      if (usedAI) {
        toast({
          title: "AI Contract Generated",
          description: "Your smart contract was generated using AI.",
        });
      } else {
        toast({
          title: "Template Contract Generated", 
          description: "Your smart contract was generated using templates.",
        });
      }
    } catch (error) {
      console.error('Contract generation failed:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate contract. Please try again.",
      });
      setFormData(prev => ({ ...prev, generatedCode: '' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeployContract = async () => {
    if (!formData.generatedCode) {
      toast({
        variant: "destructive",
        title: "No Contract",
        description: "Please generate a contract first.",
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('Initiating deployment...');
    setDeploymentError('');
    setContractDeployed(false);
    setTransactionHash('');
    setExplorerUrl('');

    const selectedBlockchainInfo = blockchains.find(b => b.value === formData.blockchain);

    try {
      // Deployment simulation steps
      const steps = [
        { message: `Connecting to ${selectedBlockchainInfo?.label} network...`, delay: 500 },
        { message: 'Simulating wallet connection...', delay: 1000 },
        { message: 'Estimating gas fees...', delay: 1000 },
        { message: 'Awaiting your confirmation in wallet (simulated)...', delay: 1000 },
        { message: 'Processing transaction...', delay: 2000 },
      ];

      for (const step of steps) {
        setDeploymentStatus(step.message);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      const simulatedTxHash = simulateTransactionHash();
      setTransactionHash(simulatedTxHash);
      setDeploymentStatus(`Submitting transaction ${simulatedTxHash.substring(0,10)}... to the blockchain...`);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      for (let i = 1; i <= 3; i++) {
        setDeploymentStatus(`Transaction confirmation (simulated ${i}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setIsDeploying(false);
      setContractDeployed(true);
      const url = getExplorerUrl(formData.blockchain, simulatedTxHash);
      setExplorerUrl(url);
      setDeploymentStatus('Deployment successful!');
      toast({
        title: "Contract Deployed",
        description: `Your smart contract "${formData.contractName}" has been successfully deployed.`,
      });

    } catch (error) {
      setIsDeploying(false);
      const errMsg = error.message || "An unexpected error occurred during deployment.";
      setDeploymentError(errMsg);
      setDeploymentStatus('Deployment failed.');
      toast({
        title: "Deployment Failed",
        description: errMsg,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setValidationErrors({});
    setContractGenerated(false);
    setContractDeployed(false);
    setTransactionHash('');
    setExplorerUrl('');
    setDeploymentStatus('');
    setDeploymentError('');
    setActiveTab('details');
  };

  return {
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
    validationErrors,
    handleChange,
    handleSelectChange,
    handleSwitchChange,
    handleGenerateContract,
    handleDeployContract,
    resetForm,
  };
};
