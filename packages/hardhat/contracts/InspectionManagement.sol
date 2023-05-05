// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Traceability.sol";
import "./UserManagement.sol";

contract InspectionManagement {
  Traceability traceability;
  UserManagement userManagement;

  struct Inspection {
    bytes32 id;
    bytes32 restaurantId;
    uint timestamp;
    bytes32 inspectorId;
    string comments;
    uint kitchenSanityScore; // 0-100
    uint waterQualityScore; // 0-100
    bool foodSampleLabTestPassed;
  }

  mapping(bytes32 => Inspection) public inspections;
  //   restaurantId to inspection team ids
  mapping(bytes32 => bytes32[]) public inspectionTeams;

  constructor(address _traceability, address _userManagement) {
    traceability = Traceability(_traceability);
    userManagement = UserManagement(_userManagement);
  }

  modifier onlyAdmin() {
    require(userManagement.hasRole(userManagement.DEFAULT_ADMIN_ROLE(), msg.sender), "Caller is not admin");
    _;
  }

  modifier onlyInspector() {
    require(userManagement.hasRole(userManagement.INSPECTOR_ROLE(), msg.sender), "Caller is not an inspector");
    _;
  }

  function _getRandomIndex(uint256 _max) private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % _max;
  }

  function getRandomInspectionTeam(uint _teamSize) public view returns (bytes32[] memory) {
    uint inspectorCount = userManagement.getInspectorIds().length;
    bytes32[] memory availableInspectors = userManagement.getInspectorIds();
    require(_teamSize <= inspectorCount, "Team size cannot be larger than the number of inspectors");
    bytes32[] memory team = new bytes32[](_teamSize);
    bool[] memory selectedInspectors = new bool[](inspectorCount);

    for (uint i = 0; i < _teamSize; i++) {
      uint chosenIndex;
      bytes32 inspectorId;
      do {
        chosenIndex = _getRandomIndex(inspectorCount);
        inspectorId = availableInspectors[chosenIndex];
      } while (selectedInspectors[chosenIndex]);
      selectedInspectors[chosenIndex] = true;
      team[i] = inspectorId;
    }
    return team;
  }

  function assignInspectionTeam(bytes32 _restaurantId, uint _teamSize) public onlyAdmin {
    bytes32[] memory team = getRandomInspectionTeam(_teamSize);
    inspectionTeams[_restaurantId] = team;
  }

  function inspectRestaurant(
    bytes32 _restaurantId,
    bytes32 _inspectorId,
    string memory _comments,
    uint _kitchenSanityScore,
    uint _waterQualityScore
  ) public onlyInspector {
    bytes32[] memory team = inspectionTeams[_restaurantId];
    bool isTeamMember = false;
    for (uint i = 0; i < team.length; i++) {
      if (team[i] == _inspectorId) {
        isTeamMember = true;
        break;
      }
    }
    require(isTeamMember, "Inspector is not part of the inspection team");

    bytes32 inspectionId = keccak256(abi.encodePacked(_restaurantId, _inspectorId, block.timestamp));
    inspections[inspectionId] = Inspection({
      id: inspectionId,
      restaurantId: _restaurantId,
      timestamp: block.timestamp,
      inspectorId: _inspectorId,
      comments: _comments,
      kitchenSanityScore: _kitchenSanityScore,
      waterQualityScore: _waterQualityScore,
      foodSampleLabTestPassed: false
    });
  }
}
