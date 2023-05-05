// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./UserManagement.sol";
import "./Traceability.sol";
import "./FoodSafetyInsurance.sol";

contract ConsumerComplaint {
  UserManagement userManagement;
  Traceability traceability;
  FoodSafetyInsurance foodSafetyInsurance;

  enum ComplaintStatus {
    Submitted,
    Investigating,
    Resolved,
    Rejected
  }

  constructor(address _userManagementAddress, address _traceabilityAddress, address _foodSafetyInsuranceAddress) {
    userManagement = UserManagement(_userManagementAddress);
    traceability = Traceability(_traceabilityAddress);
    foodSafetyInsurance = FoodSafetyInsurance(_foodSafetyInsuranceAddress);
  }

  struct Complaint {
    uint id;
    bytes32 restaurantId;
    bytes32 consumerId;
    uint dishBatchId;
    uint productBatchId;
    string description;
    uint date;
    string location;
    uint compensationRequested;
    uint compensationPaid;
    ComplaintStatus status;
  }

  Complaint[] public complaints;

  event ComplaintCreated(
    uint id,
    bytes32 restaurantId,
    bytes32 consumerId,
    uint dishBatchId,
    uint productBatchId,
    string description,
    uint date,
    string location,
    uint compensationRequested,
    uint compensationPaid,
    uint status
  );

  event ComplaintStatusUpdated(uint id, uint status, uint compensationPaid);

  function createComplaint(
    bytes32 _restaurantId,
    bytes32 _consumerId,
    uint _dishBatchId,
    uint _productBatchId,
    string memory _description,
    uint _date,
    string memory _location,
    uint _compensationRequested
  ) public {
    require(userManagement.hasRole(userManagement.CONSUMER_ROLE(), msg.sender), "Caller is not a consumer");
    complaints.push(
      Complaint(
        complaints.length,
        _restaurantId,
        _consumerId,
        _dishBatchId,
        _productBatchId,
        _description,
        _date,
        _location,
        _compensationRequested,
        0,
        ComplaintStatus.Submitted
      )
    );
    emit ComplaintCreated(
      complaints.length,
      _restaurantId,
      _consumerId,
      _dishBatchId,
      _productBatchId,
      _description,
      _date,
      _location,
      _compensationRequested,
      0,
      uint(ComplaintStatus.Submitted)
    );
  }

  function updateComplaintStatus(uint _complaintId, ComplaintStatus _status, uint _compensationApproved) public {
    require(userManagement.hasRole(userManagement.DEFAULT_ADMIN_ROLE(), msg.sender), "Caller is not an admin");
    complaints[_complaintId].status = _status;
    if (_status == ComplaintStatus.Resolved) {
      foodSafetyInsurance.slashAndCompensate(
        complaints[_complaintId].restaurantId,
        complaints[_complaintId].consumerId,
        _compensationApproved
      );
      complaints[_complaintId].compensationPaid = _compensationApproved;
    }
    emit ComplaintStatusUpdated(_complaintId, uint(_status), _compensationApproved);
  }

  function getComplaints() public view returns (Complaint[] memory) {
    return complaints;
  }

  function getComplaint(uint _complaintId) public view returns (Complaint memory) {
    return complaints[_complaintId];
  }
}
