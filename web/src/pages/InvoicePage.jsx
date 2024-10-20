import React, { useEffect, useRef, useState } from 'react'
import { request } from '../config/request'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag } from 'antd';
import { Config, formartDateClient, formartDateServer } from '../config/helper';
import MainPage from './MainPage';
import dayjs from 'dayjs';
import Item from 'antd/es/list/Item';

const Employees = () => {

    const [list, setList] = useState([]);
    const [listDetails, setListDetails] = useState([]);
    const [loading, isLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getList();
    }, []);

    const filter = useRef({
        txt_search: null,
    })

    const getList = async () => {
        isLoading(true);
        var param = {
            txt_search: filter.current.txt_search
        }
        const res = await request("invoice/getlist", "get", param);
        isLoading(false);
        if (res) {
            setList(res.list);
        }
        console.log(res);
    }

    const onViewDetails = async (id) => {
        isLoading(true);
        const res = await request("invoice/details/"+id, "get", {});
        isLoading(false);
        if (res) {
            console.log(res.listDetails)
            setListDetails(res.listDetails);
        }
        setOpen(true);
        console.log(res);
    }

    const onTextSearch = (value) => {
        filter.current.txt_search = value;
        getList();
    }

    const onChangeSearch = (e) => {
        filter.current.txt_search = (e.target.value);
        getList();
    }


    return (
        // <MainPage>
        <MainPage loading={loading}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
                <h6>Invoice</h6>
                <div>
                    <Space>
                        <Input.Search placeholder='Type to search...' onSearch={onTextSearch} onChange={onChangeSearch}></Input.Search>
                    </Space>
                </div>
            </div>
            <Table
                rowKey="id"
                dataSource={list}
                size="small"
                columns={[
                    {
                        key: "No",
                        title: "No",
                        dataIndex: "name",
                        render: (value, item, index) => (index + 1)
                    },
                    {
                        key: "id",
                        title: "Invoice",
                        dataIndex: "id"
                    },
                    {
                        key: "EmployeeName",
                        title: "Employee",
                        dataIndex: "EmployeeName"
                    },
                    {
                        key: "CustomerName",
                        title: "Customer",
                        dataIndex: "CustomerName"
                    },
                    {
                        key: "totalQty",
                        title: "Total Quantity",
                        dataIndex: "totalQty"
                    },
                    {
                        key: "totalAmount",
                        title: "Total Amount",
                        dataIndex: "totalAmount",
                        render: (value, item, index) => ("$ " + value)
                    },
                    {
                        key: "totalPaid",
                        title: "Total Paid",
                        dataIndex: "totalPaid",
                        render: (value, item, index) => ("$ " + value)
                    },
                    {
                        key: "PaymentMethod",
                        title: "Payment Method",
                        dataIndex: "PaymentMethod"
                    },
                    {
                        key: "createAt",
                        title: "Invoice Date",
                        dataIndex: "createAt",
                        render: (value, item, index) => (formartDateClient(value))
                    },
                    {
                        key: "OrderStatus",
                        title: "Status",
                        dataIndex: "OrderStatus"
                    },
                    {
                        key: "details",
                        title: "Details",
                        dataIndex: "id",
                        render(value) {
                          return (
                            <div>
                              <Button onClick={()=>onViewDetails(value)} type='link'>Details</Button>
                            </div>
                          )
                        }
                    },
                ]}
            />
            <Modal
                open={open}
                onCancel={()=>{setOpen(false)}}
            >
                {
                    listDetails.map((item, index) => {
                        <div>
                            <Image src={Config.image_path + item.image} />
                        </div>
                    })
                }
                {/* <Table
                    rowKey="id"
                    dataSource={listDetails}
                    size="small"
                    columns={[
                        {
                            key: "image",
                            title: "",
                            dataIndex: "image",
                            render: (value) => {
                                return (
                                    <Image
                                        src={Config.image_path + value}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                )
                            }
                        },
                        {
                            key: "id",
                            title: "Invoice",
                            dataIndex: "name"
                        },
                    ]} 
                />*/}

            </Modal>
        </MainPage>
        // </MainPage>
    )
}

export default Employees
