/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useEffect, useState, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";

import { notification } from "antd";
import { networkConfigs } from "helpers/networks";

export const OracleContext = createContext({});

const OracleContextProvider = (props) => {
  const { children } = props;
  const {
    isWeb3Enabled,
    web3,
    isAuthenticated,
    isWeb3EnableLoading,
    enableWeb3,
    Moralis,
  } = useMoralis();

  const { chainId } = useChain();  
  const [isOracleInitialized, setIsOracleInitialized] = useState(false);  
  const [oracleProvider, setOracleProvider] = useState({});    
  

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading && chainId) {
      enableWeb3();
    }
  }, [isAuthenticated, isWeb3Enabled, chainId]);

  return (
    <OracleContext.Provider
      value={{ isOracleInitialized, oracleProvider }}
    >
      {children}
    </OracleContext.Provider>
  );
};

export default OracleContextProvider;

