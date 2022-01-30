//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "./OneClickOracleBasic.sol";
import "./TrustedCaller.sol";

contract FabricOracle {
    uint256 counter;

    struct Oracle {
        uint256 id;
        string name;
        address oracleAddress;
        address owner;
        uint256 createdDate;
        address trustedCaller;
    }

    Oracle[] oracleDetails;

    event newOracleCreated(
        uint256 indexed id,
        address indexed oracleAddress,
        address indexed ownerAddress
    );
    
    function newOneClickAdvancedOracle(        
        string memory _name        
    ) public {
        TrustedCaller trustedCaller = new TrustedCaller(msg.sender);
        OneClickOracleBasic newOracle = new OneClickOracleBasic(
            msg.sender,
            address(trustedCaller)
        );
        require(address(newOracle) != address(0), "Invalid address");
        counter++;
        oracleDetails.push(
            Oracle(
                counter,
                _name,
                address(newOracle),
                msg.sender,
                block.timestamp,
                address(trustedCaller)
            )
        );
        emit newOracleCreated(counter, address(newOracle), msg.sender);
    }

    function getOracles() public view returns (Oracle[] memory) {
        return oracleDetails;
    }

    function getOraclesLength() public view returns (uint256) {
        return oracleDetails.length;
    }

}
