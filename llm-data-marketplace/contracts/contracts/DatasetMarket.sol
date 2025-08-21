// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DatasetMarket is Ownable, ReentrancyGuard {
    struct Dataset {
        uint256 id;
        string title;
        string description;
        address payable owner;
        uint256 price;
        bool active;
        string storageURI;
        string dtype;
    }

    uint256 public datasetIdCounter;
    mapping(uint256 => Dataset) public datasets;
    mapping(address => mapping(uint256 => bool)) public hasPurchased;

    event DatasetRegistered(uint256 id, address owner, string title, uint256 price, string storageURI, string dtype);
    event Purchased(uint256 id, address buyer, uint256 price);
    event Activated(uint256 id, bool active);

    function registerDataset(
        string memory _title,
        string memory _description,
        string memory _storageURI,
        uint256 _price,
        string memory _dtype
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_storageURI).length > 0, "Storage URI cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        uint256 newId = ++datasetIdCounter;
        datasets[newId] = Dataset({
            id: newId,
            title: _title,
            description: _description,
            owner: payable(msg.sender),
            price: _price,
            active: true,
            storageURI: _storageURI,
            dtype: _dtype
        });
        
        emit DatasetRegistered(newId, msg.sender, _title, _price, _storageURI, _dtype);
    }

    function purchaseDataset(uint256 _id) external payable nonReentrant {
        Dataset storage dataset = datasets[_id];
        require(dataset.id != 0, "Dataset does not exist");
        require(dataset.active, "Dataset is not active");
        require(msg.value == dataset.price, "Incorrect payment amount");
        require(!hasPurchased[msg.sender][_id], "Already purchased");
        
        hasPurchased[msg.sender][_id] = true;
        (bool sent, ) = dataset.owner.call{value: msg.value}("");
        require(sent, "Failed to send payment");
        
        emit Purchased(_id, msg.sender, msg.value);
    }

    function setActive(uint256 _id, bool _active) external {
        Dataset storage dataset = datasets[_id];
        require(dataset.id != 0, "Dataset does not exist");
        require(msg.sender == dataset.owner, "Not the owner");
        dataset.active = _active;
        emit Activated(_id, _active);
    }

    function getDataset(uint256 _id) external view returns (Dataset memory) {
        return datasets[_id];
    }

    function hasUserPurchased(address _user, uint256 _id) external view returns (bool) {
        return hasPurchased[_user][_id];
    }
}
