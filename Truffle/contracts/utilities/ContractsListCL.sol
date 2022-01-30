// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

library ContractsListCL {
    //internal ids for Tokens to be used as refference
    uint8 public constant AVAX_ID = 1;
    uint8 public constant BTC_ID = 2;
    uint8 public constant ETH_ID = 3;
    uint8 public constant LINK_ID = 4;
    //Only use these ids for fiat USD not USDT
    uint8 public constant USDT_ID = 4;
    uint8 public constant USD_ID = 5;
    
    //Testnet Avalanche 
    address public constant AVAX_USD  = address(100); //Native Token 
    address public constant BTC_ETH  = address(201);
    address public constant BTC_USD  = 0x0B0A7C1F6BD2024D930C9Ba5bE1ed44d93E5724F;
    address public constant ETH_USD  = 0xB767287A7143759f294CfB7b1Adbca1140F3de71;
    address public constant LINK_ETH  = address(403);
    address public constant LINK_USD  = 0x1C908AB14d7B1c579a8AF8bD2B9530C17c87f999;
    address public constant USDT_USD  = address(405);   

    //Testnet Avalanche Price Feed
    address public constant CL_AVAX_USD  = 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;
    address public constant CL_BTC_ETH  = 0x378E78509a907B1Ec5c24d9f0243BD39f7A7b007;
    address public constant CL_BTC_USD  = 0x31CF013A08c6Ac228C94551d535d5BAfE19c602a;
    address public constant CL_ETH_USD  = 0x86d67c3D38D2bCeE722E601025C25a575021c6EA;
    address public constant CL_LINK_ETH  = 0xf4060f80f295b34e0C2471461ba43745Aeb186d6;
    address public constant CL_LINK_USD  = 0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470;
    address public constant CL_USDT_USD  = 0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad;   

}