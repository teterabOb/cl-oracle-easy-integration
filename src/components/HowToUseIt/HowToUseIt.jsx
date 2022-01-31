/* eslint-disable react-hooks/exhaustive-deps */
import {
    Input,
    Typography,
    Button,
    Row,
    Col,
    Divider,
    Drawer,
    notification

} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getEllipsisTxt } from "helpers/formatters";
import { useMoralis, useChain } from "react-moralis";
import oneClickContract from "contracts/OneClickOracleBasic.json";
import fabric from "list/fabric.json";
import proxy from "list/priceFeedList.json";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, dracula, atomDark, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function HowToUseIt() {
    const { isInitialized, isWeb3Enabled, account, Moralis, web3 } = useMoralis();
    const { chainId } = useChain();

    const codeString = 
    `//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
    
contract MyProject is ReentrancyGuard {

    int256 private result;
    IOneClickOracleBasic myOracle;
    address private owner;

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
            
}`

    useEffect(() => {

    }, [])



    return (
        <>
            <Row>
                <Col span={24}>
                    <h2>1. Create your oracle going to Oracle Fabric Menu.</h2>
                    <br></br>
                    <h2>2. Go to Admin Panel and administrate your oracle.</h2>
                    <p>Link an address to at least one proxy contract provided by Chainlink.</p>
                    <p>For more information about Avalanche Feeds provided by Chainlink go to
                        <a href="https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard" target={"_blank"}>
                            Official Documentation</a>
                            </p>
                    <br></br>
                    <h2>3. Deploy by remix the next example contract.</h2>
                    <p>PS: In case you have already deployed your contract to use your oracle go to step 4.</p>
                    <p>We highly recommend using the ReentrancyGuard contract provided by Open Zeppelin to prevent a reentrancy attack.</p>
                    <p>For more information: <a href="https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard" target={"_blank"}>OpenZeppelin ReentrancyGuard Documentation</a></p>
                    <SyntaxHighlighter
                        language="solidity"
                        style={materialDark}
                        showLineNumbers={true}
                    >
                        {codeString}
                    </SyntaxHighlighter>
                    <br></br>
                    <h3>4. Add the contract Address as a trusted caller to allow the contract for calling methods.</h3>

                </Col>
            </Row>

        </>

    )
}
