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
    Form
} from "antd";
import { useEffect, useMemo, useState } from "react";
import basicContract from "contracts/OneClickOracleBasic.json";
import Address from "components/Address/Address";
import { useMoralis, useChain } from "react-moralis";

import basicFabric from "list/basicFabric.json";
import { useAPIContract } from "hooks/useAPIContract";
import proxy from "list/priceFeedList.json";
import { getEllipsisTxt } from "helpers/formatters";


export default function ExampleAdminPanel() {
    const { isInitialized, isWeb3Enabled, account, Moralis } = useMoralis();
    const { chainId } = useChain();
    const { abi } = basicContract;
    const contractAddress = useMemo(() => basicFabric[chainId], [chainId]);

    const initialOracleForm = { id: "", name: "", proxy: "", token: "", state: "" }
    const [oracleForm, setOracleForm] = useState(initialOracleForm)
    const [isLoadingExec, setIsLoadingExec] = useState(false)
    const [reload, setReload] = useState(false)
    const [isEdit, setIsEdit] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [listProxies, setListProxies] = useState([])
    const { runContractFunction, contractResponse, error, isLoading } = useAPIContract();

    const Option = Select;

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

    const onSubmit = async (e) => {
        await e.preventDefault();
        console.log(oracleForm)
        let options = {}

        if (isEdit) {
            const oracle = [
                oracleForm.id,
                oracleForm.name,
                oracleForm.token,
                oracleForm.proxy,
                oracleForm.state == "true" ? true : false
            ]

            console.log(oracle)

            options = {
                contractAddress: contractAddress,
                functionName: "updateOracle",
                abi: abi,
                params: {
                    _oracle: oracle
                },
                awaitReceipt: false
            }
        }
        else {

            options = {
                contractAddress: contractAddress,
                functionName: "addOracle",
                abi: abi,
                params: {
                    _name: "First One",
                    _token: "0xBc4226e82B794672a150837b7637726711A5C463",
                    _priceFeed: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",
                    _state: true
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
                handleCancel()
                reload ? setReload(false) : setReload(true)
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

    useEffect(() => {
        if (isInitialized && isWeb3Enabled) {
            const proxyList = proxy[chainId]
            setListProxies(proxyList.oracles)

            onGetOracles({
                onSuccess: () => {

                }
            });
        }
    }, [isInitialized, isWeb3Enabled, contractAddress, abi, chainId, reload]);

    const columns = [
        {
            title: "Id",
            dataIndex: 0,
            key: "id",
            render: (id) => id,
        },
        {
            title: "Name",
            dataIndex: 1,
            key: "name",
            render: (name) => name,
        },
        {
            title: "Token",
            dataIndex: 2,
            key: "token",
            render: (token) => getEllipsisTxt(token, 5),
        },
        {
            title: "Proxy Contract",
            dataIndex: 3,
            key: "priceFeed",
            render: (priceFeed) => getEllipsisTxt(priceFeed, 5),
        },
        {
            title: "State",
            dataIndex: 4,
            key: "state",
            render: (state) => (state.toString() == "true" ? "Enabled" : "Disabled"),
        },
        {
            title: "Action",
            dataIndex: 0,
            key: "id",
            render: (id, oracle) => (<Button type="primary"
                size="large"
                htmlType={"submit"}
                block onClick={() => showModal(id, oracle, true)}>Edit</Button>),
        },
    ];



    const showModal = (id, oracle, isGoingToEdit) => {
        setIsEdit(isGoingToEdit)

        if (isGoingToEdit) {
            setOracleForm({
                id: id,
                name: oracle[1],
                token: oracle[2],
                proxy: oracle[3],
                state: oracle[4].toString()
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

    return (
        <>
            <Modal footer={null} title="Edit Price Feed" visible={isModalVisible} onCancel={handleCancel}>
                <form
                    onSubmit={onSubmit}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
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

            <Space direction="vertical">
                <Card
                    title="Add Price Feed"
                    size="large"
                    style={{
                        minWidth: "40vw",
                        textAlign: "center",
                        alignContent: "center"
                    }}
                >
                    <Button
                        type="primary"
                        size="large"
                        htmlType={"submit"}
                        block
                        onClick={() => showModal(null, null, false)}

                    >
                        ADD NEW PRICE FEED
                    </Button>
                </Card>
                <Card
                    title="Admin Panel"
                    size="large"
                    style={{
                        minWidth: "40vw",
                        textAlign: "center"
                    }}
                >
                    {!isLoading && !error ? (
                        <Table
                            dataSource={contractResponse}
                            columns={columns}
                            style={{
                                borderColor: "#8c8c8c"
                            }}
                            rowKey={(record) => {
                                return (record[0]);
                            }}
                        />
                    ) : (
                        <Skeleton ></Skeleton>
                    )}

                </Card>



            </Space >
        </>
    )
}
