// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IOneClickOracleBasic{
  struct Oracle {
    int8 id;
    string name;
    address token;
    address priceFeed;
    bool state;
  }
  
  //@dev returns price with 18 decimals
  function getOraclePrice(address) external view returns (int256);    
  //@dev returns latest answer provided by proxy contract with default decimals
  function getLatestAnswer(address) external view returns (uint256);
  //@dev returns historical price providing address and roundId
  function getHistoricalPrice(address, uint256) external view returns(int256);

  event priceFeedAdded(address indexed _token, address indexed _priceFeed);
  event priceFeedUpdated(Oracle indexed _Oracle);
  event newOwner(address indexed _newOwner);
}
 