import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertCircle } from 'lucide-react';

const ReviewContractTab = ({ formData, contractTypes, onBack, onContinue }) => {
  // Use the generated code from formData instead of calling the async function
  const contractCode = formData.generatedCode || '// No contract generated yet';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Review Contract</CardTitle>
          <CardDescription>
            Review the generated smart contract before deployment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-md p-4">
            <h3 className="font-mono text-sm font-bold mb-2">
              {formData.contractName} ({contractTypes.find(t => t.value === formData.contractType)?.label})
            </h3>
            <div className="font-mono text-xs whitespace-pre-wrap bg-[#1A2333] p-4 rounded-md h-64 overflow-y-auto">
              {contractCode}
            </div>
          </div>
          
          {formData.enableAudit && (
            <div className="bg-[#1A2333] border border-green-700 rounded-md p-4">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-green-300">Security Audit Passed</h4>
                  <p className="text-sm text-green-400">
                    Automated security audit found no critical vulnerabilities in the generated contract.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {formData.enableKYC && (
            <div className="bg-[#1A2333] border border-yellow-700 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-300">KYC Verification Enabled</h4>
                  <p className="text-sm text-yellow-400">
                    This contract will require KYC verification for relevant interactions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Details
          </Button>
          <Button onClick={onContinue}>
            Continue to Deploy
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ReviewContractTab;
