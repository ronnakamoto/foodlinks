// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserManagement is AccessControl {
  bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
  bytes32 public constant RESTUARANT_ROLE = keccak256("RESTAURANT_ROLE");
  bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
  bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");
  bytes32 public constant LOCAL_AUTHORITY_ROLE = keccak256("LOCAL_AUTHORITY_ROLE");

  struct Supplier {
    bytes32 id;
    string name;
    string location;
    string contact;
    address walletAddress;
  }

  struct Restaurant {
    bytes32 id;
    string name;
    string location;
    string contact;
    address walletAddress;
    uint safetyRating;
  }

  struct Inspector {
    bytes32 id;
    string name;
    address walletAddress;
  }

  struct Consumer {
    bytes32 id;
    address walletAddress;
    string name;
  }

  event ConsumerRegistered(bytes32 id, address walletAddress, string name);
  event SupplierRegistered(bytes32 id, string name, string location, string contact, address walletAddress);
  event RestaurantRegistered(bytes32 id, string name, string location, string contact, address walletAddress);
  event InspectorRegistered(bytes32 id, string name, address walletAddress);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(LOCAL_AUTHORITY_ROLE, msg.sender);
    _grantRole(SUPPLIER_ROLE, msg.sender);
    _grantRole(RESTUARANT_ROLE, msg.sender);
    _grantRole(INSPECTOR_ROLE, msg.sender);
    _grantRole(CONSUMER_ROLE, msg.sender);
  }

  mapping(bytes32 => Supplier) public suppliers;
  mapping(bytes32 => Restaurant) public restaurants;
  mapping(bytes32 => Inspector) public inspectors;
  mapping(bytes32 => Consumer) public consumers;
  bytes32[] public inspectorIds;

  function addAdmin(address _user) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(DEFAULT_ADMIN_ROLE, _user);
  }

  function getInspectorIds() public view returns (bytes32[] memory) {
    return inspectorIds;
  }

  function getConsumerWalletAddress(bytes32 _id) public view returns (address) {
    return consumers[_id].walletAddress;
  }

  function getSupplierWalletAddress(bytes32 _id) public view returns (address) {
    return suppliers[_id].walletAddress;
  }

  function registerSupplier(Supplier memory _supplier) public {
    _setupRole(SUPPLIER_ROLE, _supplier.walletAddress);
    suppliers[_supplier.id] = _supplier;
    emit SupplierRegistered(
      _supplier.id,
      _supplier.name,
      _supplier.location,
      _supplier.contact,
      _supplier.walletAddress
    );
  }

  function registerRestaurant(Restaurant memory _restaurant) public {
    _setupRole(RESTUARANT_ROLE, _restaurant.walletAddress);
    restaurants[_restaurant.id] = _restaurant;
    emit RestaurantRegistered(
      _restaurant.id,
      _restaurant.name,
      _restaurant.location,
      _restaurant.contact,
      _restaurant.walletAddress
    );
  }

  function registerConsumer(Consumer memory _consumer) public {
    _setupRole(CONSUMER_ROLE, _consumer.walletAddress);
    consumers[_consumer.id] = _consumer;
    emit ConsumerRegistered(_consumer.id, _consumer.walletAddress, _consumer.name);
  }

  function registerInspector(Inspector memory _inspector) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(INSPECTOR_ROLE, _inspector.walletAddress);
    inspectors[_inspector.id] = _inspector;
    inspectorIds.push(_inspector.id);
    emit InspectorRegistered(_inspector.id, _inspector.name, _inspector.walletAddress);
  }

  function registerLocalAuthority(address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(LOCAL_AUTHORITY_ROLE, user);
  }
}
