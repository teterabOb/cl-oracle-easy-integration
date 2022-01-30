/* eslint-disable react-hooks/exhaustive-deps */
import {
    Card,
    Input,
    Typography,
    Skeleton,
    Button,
    Select,
    notification,
    Space,
    Avatar,
    Table,
    Modal,
    Alert,
    Row,
    Col
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getEllipsisTxt } from "helpers/formatters";
import { useMoralis, useChain } from "react-moralis";
import fabricContract from "contracts/FabricOracle.json";
import oneClickContract from "contracts/OneClickOracleBasic.json";
import fabric from "list/fabric.json";
import proxy from "list/priceFeedList.json";
import TrustedCaller from "./TrustedCaller";
import DrawerTryOut from "components/TryOracle/DrawerTryOut";
//import Column from "antd/lib/table/Column";
import StepsOracle from "components/Steps/StepsOracle";

export default function AdminPanel() {
    const { isInitialized, isWeb3Enabled, account, Moralis, web3 } = useMoralis();
    const { chainId } = useChain();
    const abiFabricContract = fabricContract["abi"];
    const abiOneClickContract = oneClickContract["abi"];

    const [isEdit, setIsEdit] = useState(false);
    // Variable used to block buttons and render table
    const [isLoadingPriceFeedToBeEdited, setIsLoadingPriceFeedToBeEdited] = useState(false);
    //Oracles deployed by selected address using Fabric 
    const [myOracles, setMyOracles] = useState(undefined);
    const [isLoadingMyOracle, setIsLoadingMyOracle] = useState(true);
    //Oracle selected to Administrate
    const [addressOracleToBeEdited, setOracleToBeEdited] = useState(undefined);
    //    
    const [priceFeedToAdministrate, setPriceFeedToAdministrate] = useState(undefined)
    // Loading the execution of add or update price feed
    const [isLoadingExec, setIsLoadingExec] = useState(false)

    const contractAddress = useMemo(() => fabric[chainId], [chainId]);
    const [listProxies, setListProxies] = useState([])

    const [isModalVisible, setIsModalVisible] = useState(false);
    const initialOracleForm = { id: "", name: "", proxy: "", token: "", state: "" }
    const [oracleForm, setOracleForm] = useState(initialOracleForm)

    const [trustedCallerAddres, setTrustedCallerAddress] = useState(undefined)

    const [priceFeedWithImages, setPriceFeedWithImages] = useState([])
    const [linkedAddress, setLinkedAddress] = useState(undefined)

    //States for DrawerTryOut
    const [isVisible, setIsVisible] = useState(false)
    //const [addressOneClick, setAddressOneClick] = useState(undefined)

    const onGetOraclesWeb3 = async () => {
        let myResult = "";
        const contract = new web3.eth.Contract(abiFabricContract, contractAddress)
        const result = await contract.methods.getOracles().call()
            .then((receipt) => {
                myResult = receipt.filter((el) => {
                    return account.toLowerCase() == el.owner.toLowerCase()
                });
                setMyOracles(myResult)
            });
    };

    const onGetPriceFeedToBeEditedByOracle = async () => {
        if (addressOracleToBeEdited != undefined) {
            setIsLoadingPriceFeedToBeEdited(true)

            const contract = new web3.eth.Contract(abiOneClickContract, addressOracleToBeEdited)
            const result = await contract.methods.getOracles().call()
                .then((receipt) => {
                    //console.log(receipt)
                    const resultado = []
                    setPriceFeedToAdministrate(receipt)

                    for (let index = 0; index < receipt.length; index++) {
                        const element = receipt[index];

                        var icons = listProxies.filter((el) => {
                            return element.priceFeed.toLowerCase() == el.proxy.toLowerCase()
                        });

                        var newItem = {
                            id: element.id,
                            name: element.name,
                            token: element.token,
                            priceFeed: element.priceFeed,
                            state: element.state,
                            firstIcon: icons[0].firstIcon,
                            secondIcon: icons[0].secondIcon,
                            pair: icons[0].pair,
                            scanner: icons[0].scanner

                        }
                        resultado.push(newItem)
                    }

                    console.log(resultado)

                    setPriceFeedWithImages(resultado)
                });

            setIsLoadingPriceFeedToBeEdited(false)
        }
    };

    const onSubmit = async (e) => {
        await e.preventDefault();

        console.log(oracleForm)
        let options = {}
        console.log(isEdit)

        if (isEdit) {
            const oracle = [
                oracleForm.id,
                oracleForm.name,
                oracleForm.token,
                oracleForm.proxy,
                oracleForm.state == "true" ? true : false
            ]

            //console.log(oracle)

            options = {
                contractAddress: addressOracleToBeEdited,
                functionName: "updateOracle",
                abi: abiOneClickContract,
                params: {
                    _oracle: oracle
                },
                awaitReceipt: false
            }
        }
        else {

            options = {
                contractAddress: addressOracleToBeEdited,
                functionName: "addOracle",
                abi: abiOneClickContract,
                params: {
                    _name: oracleForm.name,
                    _token: oracleForm.token,
                    _priceFeed: oracleForm.proxy,
                    _state: oracleForm.state == "true" ? true : false
                },
                awaitReceipt: false
            }
        }

        const tx = await Moralis.executeFunction(options)
        setIsLoadingExec(true)
        tx.on("transactionHash", (hash) => {
            setIsLoadingExec(true)
            notification.success({
                message: "Processing Your New Oracle!",
                description: "Your transaction has beent sent."
            })

        })
            .on("receipt", (receipt) => {
                setIsLoadingExec(false)
                onGetPriceFeedToBeEditedByOracle()
                handleCancel()
                //reload ? setReload(false) : setReload(true)
                notification.success({
                    message: "Oracle created!",
                    description: "The new oracle has beetn created."
                })
            })
            .on("error", (error) => {
                setIsLoadingExec(false)
                console.log(error);
                notification.error({
                    message: "There was an error processing the transaction!",
                    description: "Error."
                })
            });
    };

    const showModal = (id, oracle, isGoingToEdit) => {
        setIsEdit(isGoingToEdit)

        if (isGoingToEdit) {
            setOracleForm({
                id: id,
                name: oracle.name,
                token: oracle.token,
                proxy: oracle.priceFeed,
                state: oracle.state.toString()
            });
        }
        else {
            setOracleForm(initialOracleForm)
        }

        setIsModalVisible(true);

        //console.log(oracleForm)
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        onGetPriceFeedToBeEditedByOracle();
    }, [addressOracleToBeEdited])

    useEffect(() => {
        if (isInitialized && isWeb3Enabled) {
            const proxyList = proxy[chainId]
            setListProxies(proxyList.oracles)
            onGetOraclesWeb3()
            setIsLoadingMyOracle(false)
            setTrustedCallerAddress(undefined)
        }
    }, [isInitialized,
        isWeb3Enabled,
        contractAddress,
        abiFabricContract,
        abiOneClickContract,
        chainId,
        account]);

    const columnsOracleTable = [
        {
            title: "#",
            dataIndex: "id",
            key: 0,
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
            title: "Action",
            dataIndex: 0,
            key: "id",
            render: (id, oracle) => (<Button type="primary" style={{ fontSize: "14px" }}
                size="medium"
                htmlType={"submit"}
                block onClick={() => {
                    setOracleToBeEdited(oracle.oracleAddress)
                    setTrustedCallerAddress(oracle.trustedCaller)
                    console.log("trusted caller desde tabla: " + oracle.trustedCaller)
                }
                }>Administrate</Button>),
        },
    ]

    const columnsPriceFeedTable = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (id, obj) => (
                <Avatar.Group>
                    <Avatar src={obj.firstIcon} size={"small"} />
                    <Avatar src={obj.secondIcon} size={"small"} />
                </Avatar.Group>
            ),
        },
        {
            title: "Pair",
            dataIndex: "pair",
            key: "pair",
            render: (pair) => pair,
        },

        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => name,
        },
        {
            title: "Linked Address",
            dataIndex: "token",
            key: "token",
            render: (token, oracle) => <label href={oracle.scanner}>{token}</label>,
        },
        {
            title: "State",
            dataIndex: "state",
            key: "state",
            render: (state) => (state == true ? "Enabled" : "Disabled"),
        },
        {
            title: "Explorer",
            dataIndex: "scanner",
            key: "scanner",
            render: (scanner) => <a href={scanner}>Explorer</a>,
        },
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id, oracle) => (
                <>
                    <Button type="primary" size="small" style={{ fontSize: "14px" }}
                        size="small"
                        htmlType={"submit"}
                        block onClick={() => (showModal(id, oracle, true))}>Edit</Button>
                    <Button type="warning" size="small" style={{ fontSize: "14px" }}
                        size="small"
                        htmlType={"submit"}

                        block onClick={() => {
                            setIsVisible(true)
                            setLinkedAddress(oracle.token)
                        }}>🧿 Try out!</Button>
                </>
            ),
        },

    ]

    return (
        <>
            <Row justify="space-around"
                style={{ padding: "10px" }}
                gutter={[48, 16]}
            >
                <Col span={16}>
                    <StepsOracle />
                </Col>
                <Col span={16}>
                    {
                        addressOracleToBeEdited == undefined ?
                            (<Alert
                                message="Warning"
                                description="Please Select an Oracle to administrate."
                                type="warning"
                                textAlign="center"
                                showIcon
                            />)
                            :
                            (<Alert
                                message="You have selected the following Oracle"
                                description={addressOracleToBeEdited}
                                type="success"
                                textAlign="center"
                                showIcon
                            />)
                    }
                </Col>

                <Col span={16} >
                    <Card
                        size="small"
                        title="Oracles Created"
                        style={{
                            //minWidth: "45vw",
                            textAlign: "center"
                        }}
                    >
                        <Skeleton loading={isLoadingMyOracle}>
                            <Table
                                dataSource={myOracles}
                                size="small"
                                columns={columnsOracleTable}
                                pagination={{ pageSize: 2 }}
                                style={{
                                    borderColor: "#8c8c8c"
                                }}
                                rowKey={(record) => {
                                    return (record.id);
                                }}
                            />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={16} >
                    <Card
                        title="Price Feeds"
                        size="small"
                        style={{
                            //minWidth: "40vw",
                            textAlign: "center"
                        }}
                    >
                        <Space direction="vertical" size={"large"}>
                            <Button
                                type="primary"
                                size="small"
                                htmlType={"submit"}
                                block
                                disabled={addressOracleToBeEdited == undefined ? true : false}
                                loading={isLoadingPriceFeedToBeEdited}
                                onClick={() => showModal(null, null, false)}
                                style={{
                                    fontSize: "16px",
                                    //minWidth: "30vw" 
                                }}
                            >
                                ADD NEW PRICE FEED
                            </Button>


                            <Table
                                //dataSource={priceFeedToAdministrate}
                                dataSource={priceFeedWithImages}
                                size="large"
                                columns={columnsPriceFeedTable}
                                pagination={{ pageSize: 3 }}
                                style={{
                                    borderColor: "#8c8c8c"
                                }}
                                rowKey={(record) => {
                                    return (record.id);
                                }}
                            />


                        </Space>
                    </Card>
                </Col>
                <Col span={16} >
                    <TrustedCaller contractAddressTrustedCaller={trustedCallerAddres} />
                </Col>
            </Row>
            <Modal footer={null} title="Edit Price Feed" visible={isModalVisible} onCancel={handleCancel}>
                <form
                    onSubmit={onSubmit}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            //justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <Typography.Text strong style={{ fontSize: "16px" }}>
                            Select Proxy
                        </Typography.Text>
                        <Select
                            size="large"
                            placeholder={"Select Proxy"}
                            style={{ height: "45px", width: "100%" }}
                            disabled={isLoadingExec}
                            value={oracleForm.proxy}
                            onChange={(val) =>
                                setOracleForm({ ...oracleForm, proxy: val })
                            }
                        >
                            {
                                listProxies.length > 0 ?
                                    (
                                        listProxies.map((item, i) => {
                                            return (
                                                <Select.Option key={i} value={item.proxy}>
                                                    <Avatar.Group size="small" >
                                                        <Avatar src={item.firstIcon}></Avatar>
                                                        <Avatar src={item.secondIcon}></Avatar>
                                                    </Avatar.Group>
                                                    {item.pair} - {getEllipsisTxt(item.proxy, 5)}
                                                </Select.Option>


                                            )
                                        })
                                    ) : (<Select.Option value="0" ><strong>Select</strong></Select.Option>)
                            }
                        </Select>
                        <Typography.Text strong style={{ fontSize: "16px" }}>
                            Enter Token Name
                        </Typography.Text>
                        <Input
                            placeholder="Token Name"
                            value={oracleForm.name}
                            onChange={(e) =>
                                setOracleForm({ ...oracleForm, name: e.target.value })
                            }
                            disabled={isLoadingExec}
                            size="large"
                            style={{ height: "40px", width: "100%" }}
                        />

                        <Typography.Text strong style={{ fontSize: "16px" }}>
                            Enter Address of Token
                        </Typography.Text>
                        <Input
                            placeholder="Token Address"
                            size="large"
                            value={oracleForm.token}
                            onChange={(e) =>
                                setOracleForm({ ...oracleForm, token: e.target.value })
                            }
                            disabled={isLoadingExec}
                            style={{ height: "40px", width: "100%" }}
                        />
                        <Typography.Text strong style={{ fontSize: "16px" }}>
                            State
                        </Typography.Text>
                        <Select
                            value={oracleForm.state}
                            placeholder="Select State"
                            onChange={(val) =>
                                setOracleForm({ ...oracleForm, state: val })
                            }
                            disabled={isLoadingExec}
                            size="large"
                            style={{ height: "45px", width: "100%" }}
                        >
                            <Select.Option value="true">Enabled</Select.Option>
                            <Select.Option value="false">
                                Disabled
                            </Select.Option>
                        </Select>
                        <Button
                            type="primary"
                            size="large"
                            htmlType={"submit"}
                            block
                            loading={isLoadingExec}
                        >
                            {isEdit ? "Update" : "Add"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <DrawerTryOut
                addresOneClickContract={addressOracleToBeEdited}
                linkedAddress={linkedAddress}
                isDrawVisible={isVisible}
                setIsVisible={setIsVisible}
            />
        </>
    )
}
