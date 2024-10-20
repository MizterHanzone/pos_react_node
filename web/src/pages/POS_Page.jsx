import React, { useEffect, useRef, useState } from 'react'
import { request } from '../config/request'
import { Button, Col, DatePicker, Form, Image, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag } from 'antd';
import { Config, formartDateClient, isEmptyOrNull } from '../config/helper';
import MainPage from './MainPage';
import { FileImageFilled } from '@ant-design/icons';

const POS_Page = () => {

    const [list, setList] = useState([]);
    const [loading, isLoading] = useState(false);
    const [customer, setCustomer] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalToPay, setTotalToPay] = useState(0);

    const [formRes] = Form.useForm();

    useEffect(() => {
        initInfo();
    }, []);

    const filter = useRef({
        txt_search: null
    })

    const fileRef = useRef(null);

    const initInfo = async () => {
        isLoading(true);
        const res = await request("pos/initInfo", "get", {});
        isLoading(false);
        if (res) {
            setPaymentMethod(res.payment_method);
            setCustomer(res.customer);
        }
        console.log(res);
    }

    const getList = async () => {
        if (isEmptyOrNull(filter.current.txt_search)) {
            return;
        }

        var param = {
            txt_search: filter.current.txt_search,
        }

        isLoading(true);
        const res = await request("pos/searchProduct", "get", param);
        isLoading(false);

        if (res) {
            if (res.list.length == 0) {
                message.error("Don't have this product!");
            } else {
                var listTmp = res.list;
                listTmp[0]["QtyOrder"] = 1; // create new key(QtyOrder)
                // check is exist => true => QtyOrder + 1
                var indexFind = list.findIndex((item) => item.id == listTmp[0].id);
                if (indexFind >= 0) {
                    // update Old QtyOrder
                    listTmp = list;
                    listTmp[indexFind].QtyOrder = (listTmp[indexFind].QtyOrder + 1)
                } else {
                    listTmp = [...list, ...listTmp] // concat array
                }
                // sub total
                // find discount price
                // find total to pay

                var findSubTotal = 0, findTotalDiscount = 0, findTotalToPay = 0, findDiscountPercent = 0;
                listTmp.map((item, index) => {
                    findSubTotal += (Number(item.QtyOrder) * Number(item.price));
                    findDiscountPercent += (Number(item.discount));
                    var dis = item.discount == null ? 0 : Number(item.discount);
                    findTotalDiscount += ((Number(item.QtyOrder) * Number(item.price)) * dis / 100);
                    findTotalToPay += ((Number(item.QtyOrder) * Number(item.price)) - findTotalDiscount);
                })

                setSubTotal(findSubTotal);
                setDiscountPercent(findDiscountPercent)
                setTotalDiscount(findTotalDiscount);
                setTotalToPay(findTotalToPay);
                setList(listTmp);
            }
        }

        console.log(listTmp);
    }

    const onFinish = async (item) => {
        console.log(item);
        return;
        var param =
        {
            "customerId": item.customerId,
            "orderPaymentMethodId": item.orderPaymentMethodId,
            "totalPaid": item.PaidAmount,
            "product": list
        }

        const res = await request("pos/checkout", "post", param);
        if (res) {
            if (res.message) {
                message.success(res.message);
                setList([]);
                setSubTotal(0);
                setTotalDiscount(0);
                setTotalToPay(0);
            } else {
                message.error("SOMETHING WRONG!");
            }
        }
    }

    const onDelete = async (item) => {
        console.log(item);
    }

    const onTextSearch = (value) => {
        filter.current.txt_search = value;
        getList();
    }

    const onChangeSearch = (e) => {
        filter.current.txt_search = (e.target.value);
        getList();
    }

    const onSelectPaymentMethod = (value) => {
        filter.current.category_id = value;
        getList();
    }

    return (
        // <MainPage>
        <MainPage loading={loading}>

            <Row gutter={15}>
                <Col span={16}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
                        <h6>POS</h6>
                        <div>
                            <Space>
                                <Input.Search placeholder='Type to search...' onSearch={onTextSearch}></Input.Search>
                            </Space>
                        </div>
                    </div>
                    <Table
                        rowKey="id"
                        dataSource={list}
                        pagination={null}
                        size="small"
                        columns={[
                            {
                                key: "No",
                                title: "No",
                                dataIndex: "name",
                                render: (value, item, index) => (index + 1)
                            },
                            {
                                key: "image",
                                title: "Image",
                                dataIndex: "image",
                                render: (value) => {
                                    if (value != null && value != "") {
                                        return (
                                            <Image
                                                src={Config.image_path + value}
                                                style={{ width: "50px", height: "50px" }}
                                            />
                                        )
                                    } else {
                                        return (
                                            <div style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #1a1a1a" }}>
                                                <FileImageOutlined style={{ fontSize: 20 }} />
                                            </div>
                                        )
                                    }
                                }
                            },
                            {
                                key: "name",
                                title: "Name",
                                dataIndex: "name",
                                render: (value, item, index) => {
                                    return (
                                        <div>
                                            <div>{item.name}</div>
                                            <div style={{ fontSize: 12, color: "#888" }}>{item.description}</div>
                                            <div style={{ fontSize: 12, color: "#888" }}>On hand <Tag color={(item.qty > 5) ? "green" : "red"}>{item.qty}</Tag></div>
                                        </div>
                                    )
                                }
                            },
                            {
                                key: "qtyorder",
                                title: "Quantity",
                                dataIndex: "QtyOrder"
                            },
                            {
                                key: "price",
                                title: "Price",
                                dataIndex: "price",
                                render: (value) => ("$ " + value)
                            },
                            {
                                key: "discount",
                                title: "Discount",
                                dataIndex: "discount",
                                render: (value) => ("% " + value)
                            },
                            {
                                key: "total",
                                title: "Total",
                                render: (value, items, index) => {
                                    var QtyOrder = items.QtyOrder;
                                    var Price = items.price;
                                    var Discount = items.discount == null ? 0 : items.discount;
                                    var DiscountPrice = (QtyOrder * Price) * (Discount / 100);
                                    var Total = (QtyOrder * Price) - (DiscountPrice);
                                    return "$ " + Total;
                                }
                            },
                            {
                                key: "Action",
                                title: "Action",
                                dataIndex: "status",
                                render: (value, item, index) => (
                                    <Space>
                                        {/* <Button onClick={() => onDelete(item)} type="primary" danger><i class="fa-solid fa-trash"></i></Button>
                                        <Button onClick={() => onDelete(item)} type="primary" danger><i class="fa-solid fa-trash"></i></Button> */}
                                        <i class="fa-solid fa-trash" onClick={() => onDelete(item)} style={{ color: "red", cursor: "pointer" }}></i>
                                    </Space>
                                )
                            }
                        ]}
                    />
                </Col>
                <Col span={8}>
                    <Form
                        onFinish={onFinish}
                        form={formRes}
                        layout='vertical'
                        style={{ padding: 10, borderRadius: 10, background: "#F8F9F9" }}
                    >
                        <Form.Item
                            label="Customer"
                            name={"customerId"}
                            rules={[{ required: true, message: 'Please select Customer', },]}
                        >
                            <Select
                                placeholder="Select Customer for search"
                                showSearch
                                optionFilterProp='label'
                                allowClear
                            >
                                {customer.map((item, index) => (
                                    <Select.Option label={item.name} key={index} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Payment Method"
                            name={"orderPaymentMethodId"}
                            rules={[{ required: true, message: 'Please select Payment Method', },]}
                        >
                            <Select
                                placeholder="Select Payment Method for search"
                                showSearch
                                optionFilterProp='label'
                                allowClear
                            >
                                {paymentMethod.map((item, index) => (
                                    <Select.Option label={item.name} key={index} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                            <div>Sub Total</div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: 100 }}>
                                <div>$</div>
                                <div>{subTotal}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                            <div>Discount</div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: 100 }}>
                                <div>%</div>
                                <div>{discountPercent}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                            <div>Discount</div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: 100 }}>
                                <div>$</div>
                                <div>{totalDiscount}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                            <div>Total</div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: 100 }}>
                                <div>$</div>
                                <div>{totalToPay}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                            <div>Amount to pay</div>
                            <Form.Item name={"PaidAmount"} style={{ display: "flex", justifyContent: "right", alignItems: "right" }}>
                                <Space>
                                    <InputNumber placeholder='Amount to pay' style={{ width: "100%" }} />
                                </Space>
                            </Form.Item>
                        </div>
                        <Form.Item style={{ display: "flex", justifyContent: "right", alignItems: "right" }}>
                            <Space>
                                <Button type='primary' danger>Clear</Button>
                                <Button htmlType='submit' type='primary'>Checkout</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </MainPage>
        // </MainPage>
    )
}

export default POS_Page
