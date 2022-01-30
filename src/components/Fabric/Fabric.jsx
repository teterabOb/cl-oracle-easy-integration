/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Skeleton,
  Table,
  Space,
  Row,
  Col,
  Avatar
} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from "react";
import fabricContract from "contracts/FabricOracle.json";
import { useMoralis, useChain } from "react-moralis";
import fabric from "list/fabric.json";
import { useAPIContract } from "hooks/useAPIContract";
import Create from "./Create"


export default function Fabric() {
  //const { enableWeb3, web3, isInitialized, isWeb3Enabled, account } = useMoralis();
  const { isInitialized, isWeb3Enabled, account } = useMoralis();
  const { chainId } = useChain();
  const { abi } = fabricContract;
  const [isLoadingContract, setIsLoadingContract] = useState(true);
  const { runContractFunction, contractResponse, error, isLoading } = useAPIContract();
  const [reload, setReload] = useState(false)
  const contractAddress = useMemo(() => fabric[chainId], [chainId]);


  const onGetOracles = ({ onSuccess, onError, onComplete }) => {
    runContractFunction({
      params: {
        chain: chainId,
        function_name: "getOracles",
        abi,
        address: contractAddress,
      },
      onSuccess,
      onError,
      onComplete,
    });
  };

  useEffect(() => {

    if (isInitialized && isWeb3Enabled) {
      onGetOracles({
        onSuccess: () => {
          setIsLoadingContract(false);
        },
      });
    }
  }, [isInitialized, isWeb3Enabled, contractAddress, abi, chainId, reload]);

  const columns = [
    {
      title: "#",
      dataIndex: 0,
      key: "id",
      render: (id) => id,
    },
    {
      title: "Oracle Name",
      dataIndex: 1,
      key: "name",
      render: (name) => name,
    },
    {
      title: "Oracle Address",
      dataIndex: 2,
      key: "oracleAddress",
      render: (oracleAddress) => oracleAddress,
    },
    {
      title: "Oracle Owner",
      dataIndex: 3,
      key: "oracleOwner",
      render: (oracleOwner) => oracleOwner,
    },
  ]

  const { Meta } = Card;

  return (
    <>
      <Space direction="vertical">
        <Row justify="center"
          gutter={[16, 16]}
          style={{ padding: "10px" }}
        >
          <Col span={10}
          >
            <Card style={{ textAlign: "center" }}>
              <Avatar size={64} src="https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png" />
              <h1><a href="https://docs.chain.link/docs/using-chainlink-reference-contracts/"
                target={"_blank"}>Visit Official Chainlink Documentation</a></h1>
            </Card>

          </Col>
          <Col span={16}>
            <Create reaload={reload} setReload={setReload} />
          </Col>
          <Col span={16}>
            <Card
              size="large"
              title="Oracles Created"
              style={{
                minWidth: "60vw",
                borderRadius: "0.5rem",
                textAlign: "center"

              }}
            >
              {!isLoading && !error ? (
                <Table
                  size="middle"
                  dataSource={contractResponse}
                  columns={columns}
                  pagination={{ pageSize: 5 }}
                  rowKey={(record) => {
                    return (record[0]);
                  }}
                />
              ) : (
                <Skeleton ></Skeleton>
              )}
            </Card>

          </Col>

        </Row>
      </Space>
    </>
  )
}
