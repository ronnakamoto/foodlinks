// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./UserManagement.sol";

contract Traceability is ERC1155, AccessControl {
  UserManagement userManagement;

  struct ProductBatchInfo {
    bytes32 id;
    uint amount;
    bytes32 producerId;
    uint productionDate;
    uint expirationDate;
    string location;
  }

  struct ProductBatch {
    ProductBatchInfo info;
    string metadataURI;
  }

  struct DishBatchInfo {
    bytes32 id;
    uint amount;
    bytes32 restaurantId;
    address restaurant;
    uint price;
    uint creationDate;
    uint expirationDate;
    string location;
  }

  struct DishBatch {
    DishBatchInfo info;
    string metadataURI;
  }

  // Mapping the batch id to the batch
  mapping(bytes32 => ProductBatch) public productBatches;
  mapping(bytes32 => DishBatch) public dishBatches;

  event ProductBatchCreated(
    bytes32 id,
    uint amount,
    bytes32 producerId,
    uint productionDate,
    uint expirationDate,
    string location,
    address createdBy
  );
  event ProductBatchTransferred(
    bytes32 id,
    uint tokenId,
    uint amount,
    bytes32 producerId,
    uint productionDate,
    uint expirationDate,
    string location,
    address transferredTo
  );
  event DishBatchCreated(
    bytes32 id,
    uint amount,
    bytes32 restaurantId,
    address restaurant,
    uint price,
    uint creationDate,
    uint expirationDate,
    string location
  );
  event DishPurchased(
    bytes32 id,
    uint amount,
    address restaurant,
    uint price,
    uint creationDate,
    uint expirationDate,
    string location
  );
  event BatchDishPurchased(
    bytes32 id,
    uint amount,
    address restaurant,
    uint price,
    uint creationDate,
    uint expirationDate,
    string location
  );

  constructor(address _userManagementAddress) ERC1155("") {
    userManagement = UserManagement(_userManagementAddress);
  }

  modifier onlySupplier() {
    require(userManagement.hasRole(userManagement.SUPPLIER_ROLE(), msg.sender), "Caller is not a supplier");
    _;
  }

  modifier onlyRestaurant() {
    require(userManagement.hasRole(userManagement.RESTUARANT_ROLE(), msg.sender), "Caller is not a restaurant");
    _;
  }

  modifier onlyInspector() {
    require(userManagement.hasRole(userManagement.INSPECTOR_ROLE(), msg.sender), "Caller is not an inspector");
    _;
  }

  modifier onlyConsumer() {
    require(userManagement.hasRole(userManagement.CONSUMER_ROLE(), msg.sender), "Caller is not a consumer");
    _;
  }

  modifier onlyAdmin() {
    require(userManagement.hasRole(userManagement.DEFAULT_ADMIN_ROLE(), msg.sender), "Caller is not the admin");
    _;
  }

  function setURI(string memory newuri) public onlyAdmin {
    _setURI(newuri);
  }

  /**
   * Producer creates a new batch of products
   * @param _info The product batch info
   * @param _metadataURI The metadata URI for the product batch
   */
  function createProductBatch(ProductBatchInfo memory _info, string memory _metadataURI) public onlySupplier {
    require(productBatches[_info.id].info.id == 0, "Product batch already exists");
    productBatches[_info.id] = ProductBatch(_info, _metadataURI);
    _mint(msg.sender, uint(_info.id), _info.amount, bytes(_metadataURI));
    emit ProductBatchCreated(
      _info.id,
      _info.amount,
      _info.producerId,
      _info.productionDate,
      _info.expirationDate,
      _info.location,
      msg.sender
    );
  }

  function approveContractForTransfers() public onlySupplier {
    setApprovalForAll(address(this), true);
  }

  function buyProductBatch(bytes32 _id, uint _amount) public onlyRestaurant {
    require(productBatches[_id].info.id != 0, "Product batch does not exist");
    require(productBatches[_id].info.amount >= _amount, "Not enough products in batch");
    productBatches[_id].info.amount -= _amount;
    address supplierAddress = userManagement.getSupplierWalletAddress(productBatches[_id].info.producerId);
    safeTransferFrom(supplierAddress, msg.sender, uint(_id), _amount, "");
    emit ProductBatchTransferred(
      _id,
      uint(_id),
      _amount,
      productBatches[_id].info.producerId,
      productBatches[_id].info.productionDate,
      productBatches[_id].info.expirationDate,
      productBatches[_id].info.location,
      msg.sender
    );
  }

  function createDishBatch(DishBatch memory _dishBatch, string memory _metadataURI) public onlyRestaurant {
    require(dishBatches[_dishBatch.info.id].info.id == 0, "Dish batch already exists");
    dishBatches[_dishBatch.info.id] = _dishBatch;
    _mint(msg.sender, uint(_dishBatch.info.id), _dishBatch.info.amount, bytes(_metadataURI));
    emit DishBatchCreated(
      _dishBatch.info.id,
      _dishBatch.info.amount,
      _dishBatch.info.restaurantId,
      _dishBatch.info.restaurant,
      _dishBatch.info.price,
      _dishBatch.info.creationDate,
      _dishBatch.info.expirationDate,
      _dishBatch.info.location
    );
  }

  function purchaseDish(bytes32 _dishId) public onlyConsumer {
    require(dishBatches[_dishId].info.id != 0, "Dish batch does not exist");
    require(dishBatches[_dishId].info.amount > 0, "Dish batch is empty");
    dishBatches[_dishId].info.amount -= 1;
    // INRToken.transferFrom(msg.sender, dishBatches[_dishId].info.restaurant, dishBatches[_dishId].info.price);
    emit DishPurchased(
      _dishId,
      1,
      dishBatches[_dishId].info.restaurant,
      dishBatches[_dishId].info.price,
      dishBatches[_dishId].info.creationDate,
      dishBatches[_dishId].info.expirationDate,
      dishBatches[_dishId].info.location
    );
  }

  function batchPurchaseDish(bytes32[] memory _dishIds) public onlyConsumer {
    uint256 totalPrice = 0;
    address restaurant;

    // Calculate the total price for all dishes in the batch
    for (uint256 i = 0; i < _dishIds.length; i++) {
      bytes32 dishId = _dishIds[i];
      require(dishBatches[dishId].info.id != 0, "Dish batch does not exist");
      require(dishBatches[dishId].info.amount > 0, "Dish batch is empty");

      // Ensure all dishes belong to the same restaurant
      if (i == 0) {
        restaurant = dishBatches[dishId].info.restaurant;
      } else {
        require(dishBatches[dishId].info.restaurant == restaurant, "All dishes must belong to the same restaurant");
      }

      totalPrice += dishBatches[dishId].info.price;
    }

    // Update the dish quantities
    for (uint256 i = 0; i < _dishIds.length; i++) {
      bytes32 dishId = _dishIds[i];
      dishBatches[dishId].info.amount -= 1;
    }

    // Transfer the total price from the buyer to the restaurant
    // INRToken.transferFrom(msg.sender, restaurant, totalPrice);
    emit BatchDishPurchased(
      _dishIds[0],
      _dishIds.length,
      restaurant,
      totalPrice,
      dishBatches[_dishIds[0]].info.creationDate,
      dishBatches[_dishIds[0]].info.expirationDate,
      dishBatches[_dishIds[0]].info.location
    );
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
