//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

interface ITrustedCaller {

  function isTrustedCaller(address user) external view returns (bool);

}