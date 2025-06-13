import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Copy, Wallet, Coins, Network, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { TESTNET_CONFIGS, addNetworkToMetaMask, switchToNetwork, getFaucetUrls } from '@/utils/networkConfig';

const TestnetGuide = () => {
  const [addingNetwork, setAddingNetwork] = useState(null);
  const [copiedText, setCopiedText] = useState('');
  const [activeTab, setActiveTab] = useState('networks');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleAddNetwork = async (networkKey) => {
    setAddingNetwork(networkKey);
    try {
      await addNetworkToMetaMask(networkKey);
      alert(`✅ ${TESTNET_CONFIGS[networkKey].chainName} added successfully!`);
    } catch (error) {
      alert(`❌ Failed to add network: ${error.message}`);
    } finally {
      setAddingNetwork(null);
    }
  };

  const handleSwitchNetwork = async (networkKey) => {
    setAddingNetwork(networkKey);
    try {
      await switchToNetwork(networkKey);
      alert(`✅ Switched to ${TESTNET_CONFIGS[networkKey].chainName}!`);
    } catch (error) {
      alert(`❌ Failed to switch network: ${error.message}`);
    } finally {
      setAddingNetwork(null);
    }
  };

  const TabButton = ({ value, children, isActive, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Testnet Setup Guide
          </CardTitle>
          <CardDescription>
            Learn how to set up and use blockchain testnets for safe smart contract testing
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Start Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quick Start (3 Steps)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
              <h3 className="font-semibold mb-1">Add Testnet</h3>
              <p className="text-sm text-muted-foreground">Add a testnet to MetaMask</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
              <h3 className="font-semibold mb-1">Get Test Tokens</h3>
              <p className="text-sm text-muted-foreground">Use faucets to get free tokens</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
              <h3 className="font-semibold mb-1">Deploy & Test</h3>
              <p className="text-sm text-muted-foreground">Deploy your smart contracts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <TabButton value="networks" isActive={activeTab === 'networks'} onClick={setActiveTab}>
              Networks
            </TabButton>
            <TabButton value="faucets" isActive={activeTab === 'faucets'} onClick={setActiveTab}>
              Faucets
            </TabButton>
            <TabButton value="manual" isActive={activeTab === 'manual'} onClick={setActiveTab}>
              Manual Setup
            </TabButton>
            <TabButton value="tips" isActive={activeTab === 'tips'} onClick={setActiveTab}>
              Tips
            </TabButton>
          </div>
        </CardHeader>
        <CardContent>
          {/* Networks Tab */}
          {activeTab === 'networks' && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Click "Add to MetaMask" to automatically add these testnets to your wallet.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(TESTNET_CONFIGS).map(([key, network]) => (
                  <Card key={key}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{network.chainName}</CardTitle>
                        <Badge variant="outline">ID: {parseInt(network.chainId, 16)}</Badge>
                      </div>
                      <CardDescription>
                        {network.nativeCurrency.symbol} • {network.nativeCurrency.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Chain ID:</span>
                          <div className="flex items-center gap-1">
                            <code className="bg-gray-100 px-1 rounded">{parseInt(network.chainId, 16)}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(parseInt(network.chainId, 16).toString(), `${key}-chainid`)}
                            >
                              {copiedText === `${key}-chainid` ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Currency:</span>
                          <span>{network.nativeCurrency.symbol}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddNetwork(key)}
                          disabled={addingNetwork === key}
                          size="sm"
                          className="flex-1"
                        >
                          {addingNetwork === key ? (
                            <>Adding...</>
                          ) : (
                            <>
                              <Wallet className="w-4 h-4 mr-1" />
                              Add to MetaMask
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleSwitchNetwork(key)}
                          variant="outline"
                          size="sm"
                        >
                          Switch
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a href={network.blockExplorerUrls[0]} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Explorer
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Faucets Tab */}
          {activeTab === 'faucets' && (
            <div className="space-y-4">
              <Alert>
                <Coins className="h-4 w-4" />
                <AlertDescription>
                  Faucets provide free test tokens. You'll need these to pay for gas fees when deploying contracts.
                </AlertDescription>
              </Alert>

              {Object.entries(TESTNET_CONFIGS).map(([key, network]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {network.chainName}
                      <Badge>{network.nativeCurrency.symbol}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Get free {network.nativeCurrency.symbol} tokens for testing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {network.faucets.map((faucetUrl, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          asChild
                          className="justify-start"
                        >
                          <a href={faucetUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Faucet {index + 1}
                          </a>
                        </Button>
                      ))}
                    </div>
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Most faucets require social verification (Twitter, GitHub) to prevent abuse.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Manual Setup Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  If automatic addition doesn't work, you can manually add networks to MetaMask.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Network Addition Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                      <span>Open MetaMask and click the network dropdown at the top</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                      <span>Click "Add Network" or "Custom RPC"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                      <span>Fill in the network details (see below)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                      <span>Click "Save" and switch to the new network</span>
                    </li>
                  </ol>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Example: Sepolia Testnet</h4>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      {[
                        ['Network Name', 'Sepolia Testnet'],
                        ['New RPC URL', 'https://rpc.sepolia.org'],
                        ['Chain ID', '11155111'],
                        ['Currency Symbol', 'SEP'],
                        ['Block Explorer URL', 'https://sepolia.etherscan.io/']
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{label}:</span>
                          <div className="flex items-center gap-2">
                            <code className="bg-white px-2 py-1 rounded text-sm">{value}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(value, label)}
                            >
                              {copiedText === label ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Always test on testnets before mainnet deployment</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Keep separate wallets for testing and production</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Test all contract functions thoroughly</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Document your test results</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⚠️ Common Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Faucets may have daily limits</span>
                  </div>
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Some faucets require social media verification</span>
                  </div>
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Testnet tokens have no real value</span>
                  </div>
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Testnets can be reset/wiped occasionally</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚀 Recommended Testnets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Sepolia:</strong> Ethereum's main testnet</div>
                  <div><strong>Mumbai:</strong> Fast and cheap Polygon testnet</div>
                  <div><strong>BSC Testnet:</strong> Binance Smart Chain testing</div>
                  <div><strong>Arbitrum Sepolia:</strong> L2 scaling solution</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔍 Useful Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>• <strong>Etherscan:</strong> Block explorer for viewing transactions</div>
                  <div>• <strong>Faucets:</strong> Get free test tokens</div>
                  <div>• <strong>Testnet RPCs:</strong> Connect to networks</div>
                  <div>• <strong>MetaMask:</strong> Wallet for managing testnet accounts</div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestnetGuide; 