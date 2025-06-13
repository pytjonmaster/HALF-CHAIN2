import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

const ContractDetailsTab = ({
  formData,
  handleChange,
  handleSelectChange,
  handleSwitchChange,
  isGenerating,
  onGenerateContract,
  contractTypes,
  blockchains
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Main Contract Details Card */}
      <Card className="border-2 border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>
            Provide the details for your smart contract. Our AI will generate a secure and compliant contract based on your specifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="contractName" className="text-sm font-medium">
                Contract Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="contractName"
                name="contractName"
                placeholder="Enter contract name"
                value={formData.contractName}
                onChange={handleChange}
                disabled={isGenerating}
                className="border-2 border-gray-400 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contractType" className="text-sm font-medium">
                Contract Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => handleSelectChange('contractType', value)}
                disabled={isGenerating}
              >
                <SelectTrigger className="border-2 border-gray-400 focus:border-blue-500">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="blockchain" className="text-sm font-medium">
              Blockchain <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.blockchain}
              onValueChange={(value) => handleSelectChange('blockchain', value)}
              disabled={isGenerating}
            >
              <SelectTrigger className="border-2 border-gray-400 focus:border-blue-500">
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                {blockchains.map((blockchain) => (
                  <SelectItem key={blockchain.value} value={blockchain.value}>
                    {blockchain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Contract Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the purpose of this contract"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isGenerating}
              className="border-2 border-gray-400 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Parties and Terms Card */}
      <Card className="border-2 border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="parties" className="text-sm font-medium">
              Involved Parties
            </label>
            <Textarea
              id="parties"
              name="parties"
              placeholder="List the parties involved in this contract (e.g., wallet addresses, roles)"
              value={formData.parties}
              onChange={handleChange}
              rows={2}
              disabled={isGenerating}
              className="border-2 border-gray-400 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="terms" className="text-sm font-medium">
              Contract Terms
            </label>
            <Textarea
              id="terms"
              name="terms"
              placeholder="Specify the key terms and conditions of this contract"
              value={formData.terms}
              onChange={handleChange}
              rows={4}
              disabled={isGenerating}
              className="border-2 border-gray-400 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Compliance Options Card */}
      <Card className="border-2 border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-medium">Compliance Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="enableKYC" className="text-sm font-medium">
                Enable KYC/AML Verification
              </label>
              <p className="text-sm text-muted-foreground">
                Require identity verification for all parties
              </p>
            </div>
            <Switch
              id="enableKYC"
              checked={formData.enableKYC}
              onCheckedChange={(checked) => handleSwitchChange('enableKYC', checked)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="enableAudit" className="text-sm font-medium">
                Enable Security Audit
              </label>
              <p className="text-sm text-muted-foreground">
                Perform automated security audit before deployment
              </p>
            </div>
            <Switch
              id="enableAudit"
              checked={formData.enableAudit}
              onCheckedChange={(checked) => handleSwitchChange('enableAudit', checked)}
              disabled={isGenerating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="pt-4">
        <Button 
          onClick={onGenerateContract} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Contract...
            </>
          ) : (
            'Generate Smart Contract'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ContractDetailsTab;
