/* eslint-disable react-hooks/exhaustive-deps */
import {
    Card,
    Input,
    Typography,
    Button,
    notification,
    Space,
    Avatar,
    Table,
    Modal,
    message
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getEllipsisTxt } from "helpers/formatters";
import { useMoralis, useChain } from "react-moralis";
import fabricContract from "contracts/FabricOracle.json";
import trustedCallerContract from "contracts/TrustedCaller.json";
import fabric from "list/fabric.json";
import proxy from "list/priceFeedList.json";


/* export default function AdminPanel({ oracles }) { */
export default function TrustedCaller({ contractAddressTrustedCaller }) {
    const { isInitialized, isWeb3Enabled, account, Moralis, web3 } = useMoralis();
    const { chainId } = useChain();

    const abiTrustedCaller = trustedCallerContract["abi"];
    // Variable used to block buttons and render table

    //Oracles deployed by selected address using Fabric     
    const [isLoadingTrustedCaller, setIsLoadingTrustedCaller] = useState(true);

    // Loading the execution of add or update price feed
    const [isLoadingExec, setIsLoadingExec] = useState(false)

    //const contractAddress = useMemo(() => fabric[chainId], [chainId]);
    const [trustedCallers, setTrustedCallers] = useState(undefined)

    const [isModalVisible, setIsModalVisible] = useState(false);
    //const initialOracleForm = { id: "", name: "", proxy: "", token: "", state: "" }
    const [newTrustedCaller, setNewTrustedCaller] = useState(undefined)

    const onGetTrustedCallers = async () => {                        
        const contract = new web3.eth.Contract(abiTrustedCaller, contractAddressTrustedCaller)
        const result = await contract.methods.getAlltrustedCallers().call()
            .then((receipt) => {
                setTrustedCallers(receipt)
            });          
    };


    const onSubmit = async (e) => {
        await e.preventDefault();


        if (!(web3.utils.isAddress(newTrustedCaller))) {
            message.warning('Please enter a valid address!');
        }
        else if (trustedCallers.includes(newTrustedCaller)) {
            message.warning('This address already exists!');
        }
        else {
            //setValidTrustedCaller(true)
            const options = {
                contractAddress: contractAddressTrustedCaller,
                functionName: "addTrustedCaller",
                abi: abiTrustedCaller,
                params: {
                    _trustedCaller: newTrustedCaller
                },
                awaitReceipt: false
            }

            const tx = await Moralis.executeFunction(options)
            setIsLoadingExec(true)
            tx.on("transactionHash", (hash) => {
                //setIsLoadingExec(true)
                notification.success({
                    message: "Processing Transaction!",
                    description: "Your transaction has beent sent."
                })

            })
                .on("receipt", (receipt) => {
                    setIsLoadingExec(false)
                    handleCancel()
                    onGetTrustedCallers()
                    //reload ? setReload(false) : setReload(true)
                    notification.success({
                        message: "Trusted caller!",
                        description: "New trusted caller has been added."
                    })
                })
                .on("error", (error) => {
                    setIsLoadingExec(false)
                    //console.log(error);
                    notification.error({
                        message: "There was an error processing the transaction!",
                        description: "Error."
                    })
                });
        }
    };

    const removeTrustedCaller = async (addressToRemove) => {
        //console.log("remove :" + addressToRemove)        
        const options = {
            contractAddress: contractAddressTrustedCaller,
            functionName: "removeTrustedCaller",
            abi: abiTrustedCaller,
            params: {
                _callerAddress: addressToRemove
            },
            awaitReceipt: false
        }

        const tx = await Moralis.executeFunction(options)

        tx.on("transactionHash", (hash) => {
            notification.success({
                message: "Processing Transaction!",
                description: "Your transaction has beent sent."
            })

        })
            .on("receipt", (receipt) => {             
                onGetTrustedCallers();

                notification.success({
                    message: "Trusted caller!",
                    description: "Trusted caller has been removed."
                })
            })
            .on("error", (error) => {
                notification.error({
                    message: "There was an error processing the transaction!",
                    description: "Error."
                })
            });
    }

    const showModal = () => {
        setNewTrustedCaller(undefined)
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        setIsLoadingTrustedCaller(true)
        if (contractAddressTrustedCaller != undefined) {
            setIsLoadingTrustedCaller(false)
            onGetTrustedCallers()
        }else{
            setTrustedCallers(undefined)
        }
    }, [contractAddressTrustedCaller]);

    useEffect(() => {
        if (isInitialized && isWeb3Enabled) {
            const proxyList = proxy[chainId]
        }
    }, [isInitialized,
        isWeb3Enabled,
        chainId
    ]);


    const columns = [
        {
            title: "Trusted Caller Address",
            dataIndex: [],
            key: "id",
            render: (id) => id,
        },
        {
            title: "Action",
            dataIndex: [],
            key: "id",
            render: (id, trusted) => (<Button type="primary" size="small" style={{ fontSize: "14px", backgroundColor: "black" }}
                onClick={() => removeTrustedCaller(trusted)}
                ghost
                htmlType={"submit"}
                block
                disabled={trusted.toLowerCase() == account.toLowerCase() ? true : false}
            >Remove</Button>),
        },
    ]

    return (
        <>
            <Card
                size="small"
                title="Trusted Caller"
                style={{
                    //minWidth: "10vw",
                    textAlign: "center"
                }}
            >
                <Space direction="vertical" size={"large"}>
                    <Button type="primary" 
                    disabled={isLoadingTrustedCaller}
                        ghost
                        block
                        style={{
                            fontSize: "16px",
                            //minWidth: "30vw"
                        }}
                        size="small"
                        onClick={() => showModal()}>🔑 ADD TRUSTED CALLER
                    </Button>
                    <Table
                        dataSource={trustedCallers}
                        size="small"
                        columns={columns}
                        style={{
                            borderColor: "#8c8c8c",
                            minWidth: "30vw",
                        }}
                        rowKey={(record) => {
                            return (record);
                        }}
                    />

                </Space>
            </Card>

            <Modal footer={null} title="Add Trusted Caller" visible={isModalVisible} onCancel={handleCancel}>
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
                            Enter Address
                        </Typography.Text>
                        <Input
                            placeholder="Address"

                            value={newTrustedCaller}
                            onChange={(e) =>
                                setNewTrustedCaller(e.target.value)
                            }
                            //disabled={isLoadingExec}

                            size="large"
                            style={{ height: "40px", width: "100%" }}
                        />


                        <Button
                            type="primary"
                            size="large"
                            htmlType={"submit"}
                            block
                            loading={isLoadingExec}
                        >
                            {"Add"}
                        </Button>

                    </div>
                </form>
            </Modal>

        </>
    )
}
