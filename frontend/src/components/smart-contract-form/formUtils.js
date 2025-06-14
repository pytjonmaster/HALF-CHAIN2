// Template-based contract generation (AI removed)


export const generateContractCode = async (formData) => {
  if (!formData?.contractName || !formData?.contractType) {
    throw new Error('Contract name and type are required');
  }

  // Generate contract using templates
  const generatedCode = generateTemplateBasedContract(formData);
  if (!generatedCode || typeof generatedCode !== 'string') {
    throw new Error('Invalid contract generation response');
  }
  return generatedCode;
};

export const contractTypes = [
  { value: 'agreement', label: 'Service Agreement' },
  { value: 'escrow', label: 'Escrow Contract' },
  { value: 'nft', label: 'NFT Marketplace' },
  { value: 'dao', label: 'DAO Governance' },
  { value: 'defi', label: 'DeFi Protocol' },
  { value: 'custom', label: 'Custom Contract' },
];

export const blockchains = [
  { value: 'ethereum', label: 'Ethereum', currency: 'ETH', explorer: 'https://etherscan.io/tx/' },
  { value: 'polygon', label: 'Polygon', currency: 'MATIC', explorer: 'https://polygonscan.com/tx/' },
  { value: 'binance', label: 'Binance Smart Chain', currency: 'BNB', explorer: 'https://bscscan.com/tx/' },
  { value: 'solana', label: 'Solana', currency: 'SOL', explorer: 'https://explorer.solana.com/tx/' },
  { value: 'avalanche', label: 'Avalanche', currency: 'AVAX', explorer: 'https://snowtrace.io/tx/' },
];

export const generateTemplateBasedContract = (formData) => {
  try {
    const contractName = formData.contractName?.replace(/\s+/g, '') || 'MyContract';
    const description = formData.description || 'A smart contract generated by HALF-CHAIN';
    const parties = formData.parties || 'Not specified';
    const terms = formData.terms || 'Not specified';
    
    let specificFunctions = '';
    let specificEvents = '';
    let specificState = '';

    switch (formData.contractType) {
      case 'escrow':
        specificEvents = `
    event EscrowDeposit(address indexed depositor, uint256 amount);
    event EscrowRelease(address indexed recipient, uint256 amount);
    event EscrowRefund(address indexed depositor, uint256 amount);`;
        
        specificFunctions = `
    function deposit() public payable whenActive ${formData.enableKYC ? 'onlyVerified' : ''} {
        require(msg.value > 0, "Must deposit some amount");
        balances[msg.sender] += msg.value;
        emit EscrowDeposit(msg.sender, msg.value);
    }
    
    function releaseFunds(address payable recipient) public onlyOwner whenActive {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to release");
        require(recipient != address(0), "Invalid recipient address");
        
        // Reset balance before transfer to prevent reentrancy
        uint256 transferAmount = amount;
        balances[msg.sender] = 0;
        
        // Transfer funds
        (bool success, ) = recipient.call{value: transferAmount}("");
        require(success, "Transfer failed");
        
        emit EscrowRelease(recipient, transferAmount);
    }
    
    function refund(address payable depositor) public onlyOwner whenActive {
        uint256 amount = balances[depositor];
        require(amount > 0, "No funds to refund");
        
        // Reset balance before transfer to prevent reentrancy
        balances[depositor] = 0;
        
        // Transfer funds
        (bool success, ) = depositor.call{value: amount}("");
        require(success, "Refund failed");
        
        emit EscrowRefund(depositor, amount);
    }`;
        break;

      case 'nft':
        specificState = `
    uint256 public tokenIdCounter;
    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => string) public tokenURI;
    mapping(address => uint256[]) public ownedTokens;`;
        
        specificEvents = `
    event NFTMinted(address indexed owner, uint256 indexed tokenId, string uri);
    event NFTTransferred(address indexed from, address indexed to, uint256 indexed tokenId);`;
        
        specificFunctions = `
    function mintNFT(address recipient, string memory uri) public onlyOwner whenActive returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(uri).length > 0, "URI cannot be empty");
        
        tokenIdCounter++;
        uint256 newTokenId = tokenIdCounter;
        
        tokenOwner[newTokenId] = recipient;
        tokenURI[newTokenId] = uri;
        ownedTokens[recipient].push(newTokenId);
        
        emit NFTMinted(recipient, newTokenId, uri);
        return newTokenId;
    }
    
    function transferNFT(address to, uint256 tokenId) public whenActive {
        require(to != address(0), "Invalid recipient address");
        require(tokenOwner[tokenId] == msg.sender, "Not the token owner");
        
        tokenOwner[tokenId] = to;
        
        // Update owned tokens arrays
        uint256[] storage fromTokens = ownedTokens[msg.sender];
        uint256[] storage toTokens = ownedTokens[to];
        
        // Remove from sender
        for (uint i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] == tokenId) {
                fromTokens[i] = fromTokens[fromTokens.length - 1];
                fromTokens.pop();
                break;
            }
        }
        
        // Add to recipient
        toTokens.push(tokenId);
        
        emit NFTTransferred(msg.sender, to, tokenId);
    }
    
    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        return ownedTokens[owner];
    }`;
        break;

      case 'dao':
        specificState = `
    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant QUORUM = 10; // Minimum number of total votes required
    mapping(uint256 => Proposal) public proposals;`;
        
        specificEvents = `
    event ProposalCreated(uint256 indexed id, string description, uint256 deadline);
    event Voted(address indexed voter, uint256 indexed proposalId, bool support);
    event ProposalExecuted(uint256 indexed id);`;
        
        specificFunctions = `
    function createProposal(string memory _description) public whenActive ${formData.enableKYC ? 'onlyVerified' : ''} {
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        proposalCounter++;
        uint256 proposalId = proposalCounter;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + VOTING_PERIOD;
        
        emit ProposalCreated(proposalId, _description, newProposal.deadline);
    }

    function vote(uint256 proposalId, bool support) public whenActive ${formData.enableKYC ? 'onlyVerified' : ''} {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        emit Voted(msg.sender, proposalId, support);
    }
    
    function executeProposal(uint256 proposalId) public whenActive {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id != 0, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        
        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        require(totalVotes >= QUORUM, "Quorum not reached");
        
        proposal.executed = true;
        
        // Add custom execution logic here based on the proposal
        
        emit ProposalExecuted(proposalId);
    }
    
    function getProposalDetails(uint256 proposalId) public view returns (
        uint256 id,
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        
        return (
            proposal.id,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.deadline,
            proposal.executed
        );
    }`;
        break;

      case 'defi':
        specificState = `
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingTimestamp;
    uint256 public constant REWARD_RATE = 100; // 1% per day
    uint256 public constant REWARD_PERIOD = 1 days;`;
        
        specificEvents = `
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);`;
        
        specificFunctions = `
    function stake() public payable whenActive ${formData.enableKYC ? 'onlyVerified' : ''} {
        require(msg.value > 0, "Must stake some amount");
        
        stakingBalance[msg.sender] += msg.value;
        stakingTimestamp[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, msg.value);
    }
    
    function calculateReward(address user) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - stakingTimestamp[user];
        uint256 periods = timeElapsed / REWARD_PERIOD;
        return (stakingBalance[user] * REWARD_RATE * periods) / 10000;
    }
    
    function claimReward() public whenActive {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards to claim");
        
        stakingTimestamp[msg.sender] = block.timestamp;
        
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Reward transfer failed");
        
        emit RewardClaimed(msg.sender, reward);
    }
    
    function unstake() public whenActive {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "No staked amount");
        
        // Claim any pending rewards first
        uint256 reward = calculateReward(msg.sender);
        
        // Reset staking info
        stakingBalance[msg.sender] = 0;
        stakingTimestamp[msg.sender] = 0;
        
        // Transfer staked amount plus rewards
        uint256 totalAmount = balance + reward;
        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Unstake transfer failed");
        
        emit Unstaked(msg.sender, balance);
        if (reward > 0) {
            emit RewardClaimed(msg.sender, reward);
        }
    }`;
        break;

      case 'agreement':
        specificState = `
    struct Agreement {
        address party1;
        address party2;
        string terms;
        bool party1Signed;
        bool party2Signed;
        bool isActive;
    }
    
    Agreement public agreement;`;
        
        specificEvents = `
    event AgreementSigned(address indexed party);
    event AgreementActivated();
    event AgreementTerminated();`;
        
        specificFunctions = `
    function setupAgreement(address _party2, string memory _terms) public onlyOwner whenActive {
        require(_party2 != address(0), "Invalid party address");
        require(bytes(_terms).length > 0, "Terms cannot be empty");
        
        agreement = Agreement({
            party1: msg.sender,
            party2: _party2,
            terms: _terms,
            party1Signed: false,
            party2Signed: false,
            isActive: false
        });
    }
    
    function signAgreement() public whenActive {
        require(msg.sender == agreement.party1 || msg.sender == agreement.party2, "Not a party to the agreement");
        
        if (msg.sender == agreement.party1) {
            agreement.party1Signed = true;
        } else {
            agreement.party2Signed = true;
        }
        
        emit AgreementSigned(msg.sender);
        
        if (agreement.party1Signed && agreement.party2Signed) {
            agreement.isActive = true;
            emit AgreementActivated();
        }
    }
    
    function terminateAgreement() public onlyOwner whenActive {
        require(agreement.isActive, "Agreement not active");
        agreement.isActive = false;
        emit AgreementTerminated();
    }`;
        break;

      default:
        // Custom or unknown contract type
        specificFunctions = `
    // Add your custom functions here
    function executeCustomLogic() public whenActive ${formData.enableKYC ? 'onlyVerified' : ''} {
        // Implement your custom logic
        revert("Custom logic not implemented");
    }`;
    }

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ${contractName}
 * @dev ${description}
 * @notice Parties involved: ${parties}
 * @notice Key terms: ${terms}
 * @custom:security-contact support@half-chain.com
 */
contract ${contractName} {
    address public owner;
    bool public isActive = true;
    
    mapping(address => bool) public verifiedParties;
    mapping(address => uint256) public balances;
    
    event ContractActivated(address indexed by);
    event ContractDeactivated(address indexed by);
    event PartyVerified(address indexed party);
    event TransactionExecuted(address indexed from, address indexed to, uint256 amount);${specificEvents}
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    modifier whenActive() {
        require(isActive, "Contract is not active");
        _;
    }
    
    ${formData.enableKYC ? `modifier onlyVerified() {
        require(verifiedParties[msg.sender], "KYC verification required for this action");
        _;
    }` : ''}${specificState}
    
    constructor() {
        owner = msg.sender;
        if (${formData.enableKYC}) {
            verifiedParties[owner] = true; // Owner is implicitly verified
            emit PartyVerified(owner);
        }
    }
    
    ${formData.enableKYC ? `function verifyParty(address party) public onlyOwner {
        require(party != address(0), "Invalid party address");
        require(!verifiedParties[party], "Party already verified");
        verifiedParties[party] = true;
        emit PartyVerified(party);
    }

    function revokePartyVerification(address party) public onlyOwner {
        require(party != address(0), "Invalid party address");
        require(party != owner, "Cannot revoke owner verification");
        require(verifiedParties[party], "Party not verified");
        verifiedParties[party] = false;
    }` : ''}
    
    function executeGenericTransaction(address to, uint256 amount) public whenActive ${formData.enableKYC ? 'onlyVerified' : ''} {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit TransactionExecuted(msg.sender, to, amount);
    }
    
    function activateContract() public onlyOwner {
        require(!isActive, "Contract is already active");
        isActive = true;
        emit ContractActivated(msg.sender);
    }
    
    function deactivateContract() public onlyOwner {
        require(isActive, "Contract is already inactive");
        isActive = false;
        emit ContractDeactivated(msg.sender);
    }
    
    // Contract type specific functions
    ${specificFunctions}

    // Receive and fallback functions with basic security checks
    receive() external payable {
        require(isActive, "Contract is not active");
        if (${formData.enableKYC}) {
            require(verifiedParties[msg.sender], "KYC verification required");
        }
        balances[msg.sender] += msg.value;
    }
    
    fallback() external payable {
        revert("Function does not exist");
    }
}`;
  } catch (error) {
    console.error('Error in template generation:', error);
    throw new Error('Failed to generate contract template');
  }
};
