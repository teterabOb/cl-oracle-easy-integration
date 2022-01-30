const FabricOracle = artifacts.require("FabricOracle");

module.exports = async function(deployer) {    
    deployer.deploy(FabricOracle);  
};
