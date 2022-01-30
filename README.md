# Description

This application has been developed for all those developers who want to implement Chainlink price feeds in a fast and reliable way.

The developer can easily obtain the value of the cryptocurrency with 18 decimal places without the need to do any additional calculation, the contract does it automatically according to the number of decimal places provided by Chainlink. This makes integration easy for the developer to focus on developing their use case, implementing the industry standard decentralized oracle network provided by Chainlink.

The user can manage any of the pairs provided by Chainlink for the Avalanche Blockchain.

Visit the following link to try it.

[Application](https://eft3ygowizon.usemoralis.com/)

[![Proxy Contracts](https://i.postimg.cc/VvkZcLMP/Captura.png)](https://postimg.cc/zb4FCN0x)

# Interface Methods

```jsx
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
```
 

# Contracts for Moralis x Avalanche Hackathon

Deployed on Avalanche Fuji testnet.

Fabric Contract Address:

```jsx
 0x0B9DDBd125aA31decF6B90108194fFF1216A09b1
 ```

# Chainlink Price Feed dApp


The main branch contains the Front-end Developed using Moralis Ethereum Boilerplate.

The contracts branch contains the contracts developed and tested using Hardhat.

## Chainlink Contracts

Contracts used:

AggregatorV2V3Interface
AggregatorInterface
Proxy Contracts