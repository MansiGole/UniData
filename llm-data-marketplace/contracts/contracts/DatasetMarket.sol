// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DatasetMarket
 * @dev A smart contract for buying and selling datasets on the blockchain
 */
contract DatasetMarket is Ownable, ReentrancyGuard {
    // Platform fee percentage (2%)
    uint256 public constant PLATFORM_FEE_PERCENT = 2;
    
    // Track total platform fees collected
    uint256 public totalPlatformFees;
    struct DatasetInfo {
        string size;
        string format;
        string license;
    }

    struct Dataset {
        uint256 id;
        string title;
        string description;
        string author;
        string date;
        string download_details;
        DatasetInfo info;
        string schema;
        string sample_head;
        uint256 feasibility_score;
        string purchase_details;
        address payable owner;
        uint256 price;
        bool active;
        string storageURI;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // Track the next available dataset ID
    uint256 public nextDatasetId = 1;
    
    // Mapping from dataset ID to Dataset
    mapping(uint256 => Dataset) public datasets;
    
    // Track purchases and purchasers
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    mapping(uint256 => address[]) public datasetPurchasers;

    event DatasetRegistered(
        uint256 indexed id,
        string title,
        address indexed owner,
        uint256 price,
        string storageURI
    );
    
    event DatasetPurchased(
        uint256 indexed id,
        address indexed buyer,
        uint256 price,
        uint256 platformFee
    );
    
    event DatasetUpdated(
        uint256 indexed id,
        string title,
        uint256 price,
        bool active
    );
    
    event DatasetDeactivated(uint256 indexed id);
    
    event PlatformFeesWithdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Register a new dataset for sale
     */
    function registerDataset(
        string memory _title,
        string memory _description,
        string memory _author,
        string memory _date,
        string memory _download_details,
        string memory _size,
        string memory _format,
        string memory _license,
        string memory _schema,
        string memory _sample_head,
        uint256 _feasibility_score,
        string memory _purchase_details,
        string memory _storageURI,
        uint256 _price
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_storageURI).length > 0, "Storage URI cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        uint256 newId = nextDatasetId++;
        
        DatasetInfo memory info = DatasetInfo({
            size: _size,
            format: _format,
            license: _license
        });
        
        datasets[newId] = Dataset({
            id: newId,
            title: _title,
            description: _description,
            author: _author,
            date: _date,
            download_details: _download_details,
            info: info,
            schema: _schema,
            sample_head: _sample_head,
            feasibility_score: _feasibility_score,
            purchase_details: _purchase_details,
            owner: payable(msg.sender),
            price: _price,
            active: true,
            storageURI: _storageURI,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit DatasetRegistered(
            newId,
            _title,
            msg.sender,
            _price,
            _storageURI
        );
    }

    /**
     * @dev Purchase a dataset
     */
    function purchaseDataset(uint256 _id) external payable nonReentrant {
        Dataset storage dataset = datasets[_id];
        
        require(dataset.id != 0, "Dataset does not exist");
        require(dataset.active, "Dataset is not active");
        require(!hasPurchased[msg.sender][_id], "Already purchased this dataset");
        require(msg.value >= dataset.price, "Insufficient payment");
        
        // Calculate platform fee (2% of the price)
        uint256 platformFee = (dataset.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 ownerAmount = dataset.price - platformFee;
        
        // Transfer payment to the dataset owner (minus platform fee)
        (bool sent, ) = dataset.owner.call{value: ownerAmount}("");
        require(sent, "Failed to send BNB to dataset owner");
        
        // Track platform fees
        totalPlatformFees += platformFee;
        
        // Mark as purchased
        hasPurchased[msg.sender][_id] = true;
        datasetPurchasers[_id].push(msg.sender);
        
        emit DatasetPurchased(_id, msg.sender, dataset.price, platformFee);
    }

    /**
     * @dev Update dataset details (only owner)
     */
    function updateDataset(
        uint256 _id,
        string memory _title,
        string memory _description,
        string memory _purchase_details,
        uint256 _price,
        bool _active
    ) external {
        Dataset storage dataset = datasets[_id];
        
        require(dataset.id != 0, "Dataset does not exist");
        require(msg.sender == dataset.owner, "Not the dataset owner");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        dataset.title = _title;
        dataset.description = _description;
        dataset.purchase_details = _purchase_details;
        dataset.price = _price;
        dataset.active = _active;
        dataset.updatedAt = block.timestamp;
        
        emit DatasetUpdated(_id, _title, _price, _active);
    }
    
    /**
     * @dev Deactivate a dataset (only owner)
     */
    function deactivateDataset(uint256 _id) external {
        Dataset storage dataset = datasets[_id];
        
        require(dataset.id != 0, "Dataset does not exist");
        require(msg.sender == dataset.owner, "Not the dataset owner");
        
        dataset.active = false;
        dataset.updatedAt = block.timestamp;
        
        emit DatasetDeactivated(_id);
    }
    
    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = totalPlatformFees;
        require(amount > 0, "No platform fees to withdraw");
        
        // Reset the total platform fees before transferring to prevent reentrancy
        totalPlatformFees = 0;
        
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "Failed to withdraw platform fees");
        
        emit PlatformFeesWithdrawn(owner(), amount);
    }

    /**
     * @dev Get dataset details
     */
    function getDataset(uint256 _id) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory author,
        string memory date,
        string memory download_details,
        string memory size,
        string memory format,
        string memory license,
        string memory schema,
        string memory sample_head,
        uint256 feasibility_score,
        string memory purchase_details,
        address owner,
        uint256 price,
        bool active,
        string memory storageURI,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Dataset storage dataset = datasets[_id];
        require(dataset.id != 0, "Dataset does not exist");
        
        return (
            dataset.id,
            dataset.title,
            dataset.description,
            dataset.author,
            dataset.date,
            dataset.download_details,
            dataset.info.size,
            dataset.info.format,
            dataset.info.license,
            dataset.schema,
            dataset.sample_head,
            dataset.feasibility_score,
            dataset.purchase_details,
            dataset.owner,
            dataset.price,
            dataset.active,
            dataset.storageURI,
            dataset.createdAt,
            dataset.updatedAt
        );
    }

    /**
     * @dev Check if an address has purchased a dataset
     */
    function hasAddressPurchased(address _buyer, uint256 _id) external view returns (bool) {
        return hasPurchased[_buyer][_id];
    }
    
    /**
     * @dev Get list of purchasers for a dataset
     */
    function getDatasetPurchasers(uint256 _id) external view returns (address[] memory) {
        return datasetPurchasers[_id];
    }
    
    // Fallback function to receive BNB
    receive() external payable {}
}
