// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ModelMarket
 * @dev A smart contract for buying and selling AI models on the blockchain
 */
contract ModelMarket is Ownable, ReentrancyGuard {
    // Model structure to store model details
    struct Model {
        uint256 id;
        string name;
        string description;
        string modelType;  // e.g., "LLM", "Diffusion", "Classification"
        string framework;  // e.g., "PyTorch", "TensorFlow"
        string version;
        string license;
        string storageURI; // IPFS or decentralized storage URI
        uint256 price;     // Price in wei
        address payable owner;
        bool active;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // Mapping from model ID to Model
    mapping(uint256 => Model) public models;
    
    // Track the next available model ID
    uint256 public nextModelId = 1;
    
    // Track purchases
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    mapping(uint256 => address[]) public modelPurchasers;
    
    // Events
    event ModelRegistered(
        uint256 indexed id,
        string name,
        address indexed owner,
        uint256 price,
        string storageURI
    );
    
    event ModelPurchased(
        uint256 indexed id,
        address indexed buyer,
        uint256 price
    );
    
    event ModelUpdated(
        uint256 indexed id,
        string name,
        uint256 price,
        bool active
    );
    
    event ModelDeactivated(uint256 indexed id);
    
    /**
     * @dev Register a new model for sale
     */
    function registerModel(
        string memory _name,
        string memory _description,
        string memory _modelType,
        string memory _framework,
        string memory _version,
        string memory _license,
        string memory _storageURI,
        uint256 _price
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_storageURI).length > 0, "Storage URI cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        uint256 modelId = nextModelId++;
        
        models[modelId] = Model({
            id: modelId,
            name: _name,
            description: _description,
            modelType: _modelType,
            framework: _framework,
            version: _version,
            license: _license,
            storageURI: _storageURI,
            price: _price,
            owner: payable(msg.sender),
            active: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit ModelRegistered(modelId, _name, msg.sender, _price, _storageURI);
    }
    
    /**
     * @dev Purchase a model
     */
    function purchaseModel(uint256 _modelId) external payable nonReentrant {
        Model storage model = models[_modelId];
        
        require(model.id != 0, "Model does not exist");
        require(model.active, "Model is not active");
        require(!hasPurchased[msg.sender][_modelId], "Already purchased this model");
        require(msg.value >= model.price, "Insufficient payment");
        
        // Transfer payment to the model owner (minus platform fee if any)
        uint256 platformFee = (model.price * 2) / 100; // 2% platform fee
        uint256 ownerAmount = model.price - platformFee;
        
        (bool sent, ) = model.owner.call{value: ownerAmount}("");
        require(sent, "Failed to send BNB to model owner");
        
        // Mark as purchased
        hasPurchased[msg.sender][_modelId] = true;
        modelPurchasers[_modelId].push(msg.sender);
        
        emit ModelPurchased(_modelId, msg.sender, model.price);
    }
    
    /**
     * @dev Update model details (only owner)
     */
    function updateModel(
        uint256 _modelId,
        string memory _name,
        string memory _description,
        string memory _version,
        uint256 _price,
        bool _active
    ) external {
        Model storage model = models[_modelId];
        
        require(model.id != 0, "Model does not exist");
        require(model.owner == msg.sender, "Not the model owner");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        model.name = _name;
        model.description = _description;
        model.version = _version;
        model.price = _price;
        model.active = _active;
        model.updatedAt = block.timestamp;
        
        emit ModelUpdated(_modelId, _name, _price, _active);
    }
    
    /**
     * @dev Deactivate a model (only owner)
     */
    function deactivateModel(uint256 _modelId) external {
        Model storage model = models[_modelId];
        
        require(model.id != 0, "Model does not exist");
        require(model.owner == msg.sender, "Not the model owner");
        
        model.active = false;
        model.updatedAt = block.timestamp;
        
        emit ModelDeactivated(_modelId);
    }
    
    /**
     * @dev Get model details
     */
    function getModel(uint256 _modelId) external view returns (
        uint256 id,
        string memory name,
        string memory description,
        string memory modelType,
        string memory framework,
        string memory version,
        string memory license,
        string memory storageURI,
        uint256 price,
        address owner,
        bool active,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Model storage model = models[_modelId];
        require(model.id != 0, "Model does not exist");
        
        return (
            model.id,
            model.name,
            model.description,
            model.modelType,
            model.framework,
            model.version,
            model.license,
            model.storageURI,
            model.price,
            model.owner,
            model.active,
            model.createdAt,
            model.updatedAt
        );
    }
    
    /**
     * @dev Check if an address has purchased a model
     */
    function hasAddressPurchased(address _buyer, uint256 _modelId) external view returns (bool) {
        return hasPurchased[_buyer][_modelId];
    }
    
    /**
     * @dev Get list of purchasers for a model
     */
    function getModelPurchasers(uint256 _modelId) external view returns (address[] memory) {
        return modelPurchasers[_modelId];
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Failed to withdraw funds");
    }
    
    // Fallback function to receive BNB
    receive() external payable {}
}
