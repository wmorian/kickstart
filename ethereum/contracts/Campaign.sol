// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract CampaignFactory {
    address[] private deployedCampaigns;
    
    function createCampaign(uint256 minimumContribution) public payable returns (address) {
        address newCampaign = address(new Campaign(msg.sender, minimumContribution));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    struct Request {
        bool isActive;
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }
    
    address private _manager;
    uint256 private _minimumContribution;
    mapping(address => bool) private _approvers;
    uint256 private _approversCount;

    uint256 _numRequests;
    mapping(uint256 => Request) public requests;
    
    constructor(address creator, uint256 minimumContribution) {
        _manager = creator;
        _minimumContribution = minimumContribution;
    }
    
    modifier restricted() {
        require(msg.sender == _manager);
        _;
    }
    
    function contribute() public payable {
        require(msg.value > _minimumContribution);
        _approvers[msg.sender] = true;
        _approversCount++;
    }
    
    function createRequest(string memory description, uint256 value, address payable recipient) public restricted {
        uint256 campaignId = _numRequests++;
        Request storage r = requests[campaignId];
        r.isActive = true;
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
    }
    
    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        
        require(_approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }
    
    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (_approversCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
    function getManager() public view returns (address) {
        return _manager;
    }
    
    function isApprover(address approver) public view returns (bool) {
        return _approvers[approver];
    }

    function getMinimumContribution() public view returns (uint256) {
        return _minimumContribution;
    }

    function getRequestCount() public view returns (uint256) {
        return _numRequests;
    }
    
    function getSummary() public view returns (
        uint256, uint256, uint256, uint256, address
    ) {
        return (
            _minimumContribution,
            address(this).balance,
            _numRequests,
            _approversCount,
            _manager
        );
    }
}