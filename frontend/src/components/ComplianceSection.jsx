
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ComplianceSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Regulatory <span className="gradient-text">Compliance</span> Made Simple
          </h2>
          <p className="text-lg text-muted-foreground">
            HALF-CHAIN ensures all smart contracts meet regulatory requirements across jurisdictions with built-in compliance features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4">
                  <Shield className="h-10 w-10 text-blue-500" />
                </div>
                <CardTitle>KYC/AML Integration</CardTitle>
                <CardDescription>
                  Built-in Know Your Customer (KYC) and Anti-Money Laundering (AML) verification ensures all parties are properly identified and vetted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Identity verification for all contract participants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Automated risk assessment and screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Continuous monitoring for suspicious activities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Secure storage of verification documents</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4">
                  <FileCheck className="h-10 w-10 text-blue-500" />
                </div>
                <CardTitle>Regulatory Compliance</CardTitle>
                <CardDescription>
                  Our platform ensures all smart contracts comply with relevant regulations across different jurisdictions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Multi-jurisdictional compliance checks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Automated regulatory updates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Compliance reporting and documentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Audit trails for regulatory inspections</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <CardTitle className="text-xl">Compliance Checklist</CardTitle>
              </div>
              <CardDescription>
                Key compliance features that HALF-CHAIN implements in all smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Identity Verification</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    All parties involved in a smart contract must verify their identity through our secure KYC process.
                  </p>
                  <div className="bg-muted rounded-md p-3">
                    <code className="text-xs">
                      // Example KYC verification check in smart contract<br />
                      modifier onlyVerifiedParties() &#123;<br />
                      &nbsp;&nbsp;require(kycVerified[msg.sender], "KYC verification required");<br />
                      &nbsp;&nbsp;_;<br />
                      &#125;
                    </code>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Transaction Monitoring</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Continuous monitoring of transactions to detect and prevent suspicious activities.
                  </p>
                  <div className="bg-muted rounded-md p-3">
                    <code className="text-xs">
                      // Example transaction monitoring in smart contract<br />
                      function transfer(address to, uint256 amount) public onlyVerifiedParties &#123;<br />
                      &nbsp;&nbsp;require(amount &lt;= dailyLimit[msg.sender], "Exceeds daily transaction limit");<br />
                      &nbsp;&nbsp;// Transfer logic<br />
                      &nbsp;&nbsp;emit MonitoredTransfer(msg.sender, to, amount);<br />
                      &#125;
                    </code>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Regulatory Reporting</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automated generation of reports required by regulatory authorities.
                  </p>
                  <div className="bg-muted rounded-md p-3">
                    <code className="text-xs">
                      // Example regulatory reporting in smart contract<br />
                      function generateComplianceReport() public onlyAuthorized &#123;<br />
                      &nbsp;&nbsp;// Generate report data<br />
                      &nbsp;&nbsp;bytes32 reportHash = keccak256(abi.encodePacked(block.timestamp, contractData));<br />
                      &nbsp;&nbsp;emit ComplianceReportGenerated(reportHash, block.timestamp);<br />
                      &nbsp;&nbsp;return reportHash;<br />
                      &#125;
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ComplianceSection;
