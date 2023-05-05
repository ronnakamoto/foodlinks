// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./CBDC.sol";
import "./UserManagement.sol";

contract FoodSafetyInsurance {
  CBDC cbdc;
  UserManagement userManagement;

  mapping(bytes32 => uint) public foodSafetyInsurance;
  mapping(address => uint) public pendingConsumerClaims;

  modifier onlyRestaurant() {
    require(userManagement.hasRole(userManagement.RESTUARANT_ROLE(), msg.sender), "Caller is not a restaurant");
    _;
  }

  modifier onlyAdmin() {
    require(userManagement.hasRole(userManagement.DEFAULT_ADMIN_ROLE(), msg.sender), "Caller is not admin");
    _;
  }

  constructor(address _cbdcAddress, address _userManagementAddress) {
    cbdc = CBDC(_cbdcAddress);
    userManagement = UserManagement(_userManagementAddress);
  }

  function addInsuranceDeposit(bytes32 _restaurantId, uint _amount) public onlyRestaurant {
    cbdc.transferFrom(msg.sender, address(this), _amount);
    foodSafetyInsurance[_restaurantId] += _amount;
  }

  function slashAndCompensate(bytes32 _restaurantId, bytes32 _consumerId, uint _amount) public onlyAdmin {
    require(foodSafetyInsurance[_restaurantId] >= _amount, "Not enough insurance funds");
    foodSafetyInsurance[_restaurantId] -= _amount;
    address consumerWalletAddress = userManagement.getConsumerWalletAddress(_consumerId);
    pendingConsumerClaims[consumerWalletAddress] += _amount;
  }

  function withdrawClaimAmount() public {
    require(pendingConsumerClaims[msg.sender] > 0, "No pending claims");
    uint claimAmount = pendingConsumerClaims[msg.sender];
    pendingConsumerClaims[msg.sender] = 0;
    cbdc.transfer(msg.sender, claimAmount);
  }
}
