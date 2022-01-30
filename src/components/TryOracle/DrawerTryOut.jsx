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


export default function DrawerTryOut({ addresOneClickContract, linkedAddress, isDrawVisible, setIsVisible }) {
  const { isInitialized, isWeb3Enabled, account, Moralis, web3 } = useMoralis();
  const { chainId } = useChain();
  const contractAddress = useMemo(() => fabric[chainId], [chainId]);
  const abi = oneClickContract["abi"];
  const [myOracles, setMyOracles] = useState(undefined);

  const [oraclePrice, setOraclePrice] = useState(undefined);
  const [historicalPrice, setHistoricalPrice] = useState(undefined);
  const [latestAnswer, setLatestAnswer] = useState(undefined);
  const [roundId, setRoundId] = useState(undefined);
  
  const getContract = async () => {
    const contract = new web3.eth.Contract(abi, addresOneClickContract)
    return contract
  }

  const onGetOraclePrice = async () => {
    const contract = await getContract()
    const query = await contract.methods.getOraclePrice(linkedAddress).call({ from: account })
      .then((receipt) => {        
        setOraclePrice(receipt)
      });
  };

  const onGetLatestAnswer = async () => {
    const contract = await getContract()
    const query = await contract.methods.getLatestAnswer(linkedAddress).call({ from: account })
      .then((receipt) => {
        setLatestAnswer(receipt)
      });
  };

  const onGetHistoricalPrice = async () => {
    if(!Number.isInteger(parseInt(roundId))){
      notification.error({
        message: "Please insert valid Number",
        description: "Error."
      })
    }else{
      const contract = await getContract()
      const query = await contract.methods.getHistoricalPrice(linkedAddress, roundId).call({ from: account })
        .then((receipt) => {      
          setHistoricalPrice(receipt)
        })
    }
  };

  const showDrawer = () => {
    setIsVisible(true)


  };

  const onClose = () => {
    setIsVisible(false)
  };

  useEffect(() => {
    setHistoricalPrice(undefined)
    setLatestAnswer(undefined)
    setRoundId(undefined)
  },[setIsVisible])

  const columns = [
    {
      title: "Oracle Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Action",
      dataIndex: [],
      key: "id",
      render: (id, oracle) => (<Button type="primary" size="small" style={{ fontSize: "14px", backgroundColor: "black" }}
        onClick={() => console.log(oracle)}
        ghost
        htmlType={"submit"}
        block
      >Select</Button>),
    },
  ]

  return (
    <>
      <Drawer
        title="Try Out Your Oracle!"
        width={800}
        onClose={() => onClose()}
        visible={isDrawVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <form>
          <Row>
            <Col span={24}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Linked Address
              </Typography.Text>
              <Input placeholder="Linked Address" value={linkedAddress} disabled={true} />
            </Col>
          </Row>
          <Divider>Function</Divider>
          <Row gutter={[16, 16]}>

            <Col span={12}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Sixteen Decimals Contract Result
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Result"
                value={oraclePrice}
                disabled={true}
              />
            </Col>
            <Col span={12}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Formatted Result
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Result"
                value={oraclePrice != undefined ? web3.utils.fromWei(oraclePrice.toString()) : oraclePrice}
                disabled={true}
              />
            </Col>
            <Col span={24}>
              <Button type="primary" block onClick={() => onGetOraclePrice()}>getOraclePrice( )</Button>
            </Col>
          </Row>

          <Divider>Function</Divider>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Round Id
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Please insert Round Id"
                value={roundId}
                onChange={(e) => {
                  setRoundId(e.target.value)
                }}
              />
            </Col>
            <Col span={12}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Contract Result
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Result"
                value={historicalPrice}
                disabled={true}
              />
            </Col>
            <Col span={12}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Formatted Result
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Result"
                value={oraclePrice != undefined ? web3.utils.fromWei(oraclePrice.toString()) : oraclePrice}
                disabled={true}
              />
            </Col>
            <Col span={24}>
              <Button type="primary" block onClick={() => onGetHistoricalPrice()}>getHistoricalPrice( )</Button>
            </Col>
          </Row>

          <Divider>Function</Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Contract Result
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Result"
                value={latestAnswer}
                disabled={true}
              />
            </Col>
            <Col span={12}>
              <Typography.Text strong style={{ fontSize: "16px" }}>
                Formatted Result
              </Typography.Text>
              <Input
                style={{ width: '100%' }}
                placeholder="Result"
                value={latestAnswer != undefined ? web3.utils.fromWei(latestAnswer.toString(), "gwei") : latestAnswer}
                disabled={true}
              />
            </Col>
            <Col span={24}>
              <Button type="primary" block onClick={() => onGetLatestAnswer()}>getLatestAnswer( )</Button>
            </Col>
          </Row>
        </form>
      </Drawer>
    </>

  )
}
