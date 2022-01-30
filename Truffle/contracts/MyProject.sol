//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "./interfaces/IOneClickOracleBasic.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyProject is ReentrancyGuard {

    int256 private result;
    IOneClickOracleBasic myOracle;
    address owner;

    constructor(address _myOracle){
        myOracle = IOneClickOracleBasic(_myOracle);
        owner = msg.sender;
    }

    function myDexFunction(address _token1, address _token2) public nonReentrant {
        result = getOraclePrice(_token1) + getOraclePrice(_token2);
    }

    function getOraclePrice(address _token) public  onlyOwner view returns(int256){
        int256 result = myOracle.getOraclePrice(_token);
        require(result > 0 ,"Oracle returns 0");
        return result;
    }

    function updateMyOracle(address _newOracle) onlyOwner public{
        myOracle = IOneClickOracleBasic(_newOracle);
    }

    function getResult() public view returns(int256){
        return result;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner");
        _;
    }
    
}




