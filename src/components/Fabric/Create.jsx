/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Input,
  Typography,
  Button,
  notification,
  Space,
  message,
  Row,
  Col
} from "antd";
import { useEffect, useMemo, useState } from "react";
import fabricContract from "contracts/FabricOracle.json";
import Address from "components/Address/Address";
import { useMoralis, useChain } from "react-moralis";
import { useAPIContract } from "hooks/useAPIContract";
import fabric from "list/fabric.json";

export default function Create({ reaload, setReload }) {
  //const { enableWeb3, web3, isInitialized, isWeb3Enabled, account } = useMoralis();
  const { isInitialized, isWeb3Enabled, account, Moralis, web3 } = useMoralis();
  const { chainId } = useChain();
  const { contractNameFabric, abi } = fabricContract;
  const [isProcessingOracle, setIsProcessingOracle] = useState(false);
  const initialFabricForm = { name: "" };
  const [fabricForm, setFabricForm] = useState(initialFabricForm);

  const contractAddress = useMemo(() => fabric[chainId], [chainId]);

  const onSubmit = async (e) => {
    const name = fabricForm.name

    await e.preventDefault();

    if (name.length < 4 || name.length > 12) {
      message.warning('Please enter a valid name, length must be between 4 and 12!');
      /*} else if (!web3.utils.isAddress(fabricForm.trustedCaller)) {
        message.warning('Please enter a valid address as trusted caller!');    
        */
    } else {
      onCreateOracle()
    }
  };

  const onCreateOracle = async () => {
    setIsProcessingOracle(true)
    const options = {
      contractAddress: contractAddress,
      functionName: "newOneClickAdvancedOracle",
      abi: abi,
      params: {
        _name: fabricForm.name,
        _trustedCaller: account
      },
      awaitReceipt: false
    }

    const tx = await Moralis.executeFunction(options)
    tx.on("transactionHash", (hash) => {
      setIsProcessingOracle(true)
      notification.success({
        message: "Processing Your New Oracle!",
        description: "Your transaction has beent sent."
      })

    })
      .on("receipt", (receipt) => {
        setIsProcessingOracle(false)
        setFabricForm(initialFabricForm)
        reaload == false ? setReload(true) : setReload(false)
        notification.success({
          message: "Oracle created!",
          description: "The new oracle has beetn created."
        })
      })
      .on("error", (error) => {
        setIsProcessingOracle(false)
        notification.error({
          message: "There was an error processing the transaction!",
          description: "Error."
        })
      });
  };

  useEffect(() => {

    if (isInitialized && isWeb3Enabled) {
    }
  }, [isInitialized, isWeb3Enabled, contractAddress, abi, chainId]);


  return (
    <>
      <Card
        size="large"
        title="Fabric"
        style={{
          minWidth: "40vw",
          borderRadius: "0.5rem",
          textAlign: "center",
        }}
      >
        <form onSubmit={onSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <Typography.Text style={{ fontSize: "16px" }}>
              Oracle Name
            </Typography.Text>

            <Input
              placeholder="Oracle Name"
              size="large"
              disabled={isProcessingOracle}
              value={fabricForm.name}
              onChange={(e) =>
                setFabricForm({ ...fabricForm, name: e.target.value })
              }
              style={{ height: "40px", width: "100%" }}
            />
            <Button
              block
              loading={isProcessingOracle}
              type="primary"
              size="large"
              htmlType={"submit"}
            >
              {isProcessingOracle ? "Creating ..." : "Generate Oracle"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}
