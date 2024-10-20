import React, { useEffect, useRef, useState } from 'react'
import { request } from '../config/request'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag } from 'antd';
import { formartDateClient } from '../config/helper';
import MainPage from './MainPage';
import dayjs from 'dayjs';

const CustomerPage = () => {

    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [loading, isLoading] = useState(false);

    const [formRes] = Form.useForm();

    useEffect(() => {
        getList();
    }, []);

    const filter = useRef({
        txt_search: null,
        status: null
    })

    const getList = async () => {
        isLoading(true);
        var param = {
            txt_search: filter.current.txt_search,
            status: filter.current.status
        }
        const res = await request("customer/getlist", "get", param);
        isLoading(false);
        if (res) {
            setList(res.list);
        }
        console.log(res);
    }

    const onUpdate = (item) => {
        formRes.setFieldValue('id', item.id);
        formRes.setFieldValue('firstname', item.firstname);
        formRes.setFieldValue('lastname', item.lastname);
        formRes.setFieldValue('gender', item.gender + "");
        formRes.setFieldValue('dob', dayjs(item.dob));
        formRes.setFieldValue('tel', item.tel);
        formRes.setFieldValue('email', item.email);
        formRes.setFieldValue('address', item.address);
        formRes.setFieldValue('status', item.status + "");
        setOpen(true);
    }



    const onDetails = (item) => {
        formRes.setFieldValue('id', item.id);
        formRes.setFieldValue('firstname', item.firstname);
        formRes.setFieldValue('lastname', item.lastname);
        formRes.setFieldValue('gender', item.gender + "");
        formRes.setFieldValue('dob', dayjs(item.dob));
        formRes.setFieldValue('tel', item.tel);
        formRes.setFieldValue('email', item.email);
        formRes.setFieldValue('address', item.address);
        formRes.setFieldValue('status', item.status + "");
        formRes.setFieldValue('createAt', formartDateClient(item.createAt));
        setOpenDetails(true);
        console.log(item);
    }

    const onDelete = async (item) => {
        Modal.confirm({
            title: "Delete",
            content: "Are you sure want to delete ?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                var data = {
                    id: item.id
                };
                const res = await request("customer/remove", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        })
        console.log(item);
    }

    const onFinish = async (item) => {
        var id = formRes.getFieldValue("id");

        var data = {
            ...item,
            id: id
        }

        var url = (id == null ? "customer/create" : "customer/update");
        var method = (id == null ? "post" : "put");
        const res = await request(url, method, data);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModal();
        }
    }

    const onCloseModal = () => {
        formRes.resetFields();
        setOpen(false);
    }

    const onCloseModalDetails = () => {
        formRes.resetFields();
        setOpenDetails(false);
    }

    const onTextSearch = (value) => {
        filter.current.txt_search = value;
        getList();
    }

    const onChangeSearch = (e) => {
        filter.current.txt_search = (e.target.value);
        getList();
    }

    const onChangeStatus = (value) => {
        filter.current.status = value;
        getList();
    }

    return (
        // <MainPage>
        <MainPage loading={loading}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
                <h6>CustomerPage</h6>
                <div>
                    <Space>
                        <Input.Search placeholder='Type to search...' onSearch={onTextSearch} onChange={onChangeSearch}></Input.Search>
                        <Select onChange={onChangeStatus} placeholder="Select" allowClear >
                            <Select.Option value={"1"}>Active</Select.Option>
                            <Select.Option value={"0"}>Disable</Select.Option>
                        </Select>
                        <h6>From</h6>
                        <DatePicker />
                        <h6>To</h6>
                        <DatePicker />
                        <Button type='primary' onClick={() => setOpen(true)}>New</Button>
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
                        key: "firstname",
                        title: "Firstname",
                        dataIndex: "firstname"
                    },
                    {
                        key: "lastname",
                        title: "Lastname",
                        dataIndex: "lastname"
                    },
                    {
                        key: "gender",
                        title: "Gender",
                        dataIndex: "gender",
                        render: (value, item, index) => (value == 1 ? "Male" : "Female")
                    },
                    {
                        key: "tel",
                        title: "Tel",
                        dataIndex: "tel"
                    },
                    {
                        key: "email",
                        title: "Email",
                        dataIndex: "email"
                    },
                    {
                        key: "status",
                        title: "Status",
                        dataIndex: "status",
                        render: (value, item, index) => (value == 1 ? <Tag color='green'>Active</Tag> : <Tag color='red'>Disable</Tag>)
                    },
                    {
                        key: "Action",
                        title: "Action",
                        dataIndex: "status",
                        render: (value, item, index) => (
                            <Space>
                                <Button onClick={() => onUpdate(item)} style={{ backgroundColor: 'green', color: 'white', borderColor: 'green' }}><i class="fa-solid fa-pen-to-square"></i></Button>
                                <Button onClick={() => onDetails(item)} style={{ backgroundColor: 'aqua', color: 'white', borderColor: 'aqua' }}><i class="fa-solid fa-eye"></i></Button>
                                <Button onClick={() => onDelete(item)} type="primary" danger><i class="fa-solid fa-trash"></i></Button>
                            </Space>
                        )
                    }
                ]}
            />

            <Modal
                title={formRes.getFieldValue("id") == null ? "New Customer" : "Edit Customer"}
                open={open}
                onCancel={onCloseModal}
                footer={false}
            >
                <Form
                    form={formRes}
                    layout='vertical'
                    onFinish={onFinish}
                >
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Firstname"
                                name={"firstname"}
                                rules={[{ required: true, message: 'Please enter Firstname', },]}
                            >
                                <Input placeholder='Firstame' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Lastname"
                                name={"lastname"}
                                rules={[{ required: true, message: 'Please enter Lastname', },]}
                            >
                                <Input placeholder='Lastname' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Gender"
                                name={"gender"}
                                rules={[{ required: true, message: 'Please Select Gender', },]}
                            >
                                <Select placeholder="Select Gender">
                                    <Select.Option value="1">Male</Select.Option>
                                    <Select.Option value="0">Female</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Birth Date"
                                name={"dob"}
                                rules={[{ required: true, message: 'Please Enter Birth Date', },]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format={"DD-MMMM-YYYY"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Tel"
                                name={"tel"}
                                rules={[{ required: true, message: 'Please Enter Tel', },]}
                            >
                                <Input placeholder='Tel' style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name={"email"}
                                rules={[{ required: true, message: 'Please Enter Email', },]}
                            >
                                <Input placeholder='Email' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Address"
                                name={"address"}
                                rules={[{ required: true, message: 'Please Enter Address', },]}
                            >
                                <Input placeholder='Address' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name={"status"}
                                rules={[{ required: true, message: 'Please select Status', },]}
                            >
                                <Select placeholder='Status'>
                                    <Select.Option value="1">Active</Select.Option>
                                    <Select.Option value="0">Disable</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ display: "flex", justifyContent: "right", alignItems: "right" }}>
                        <Space>
                            <Button onClick={() => onCloseModal()}>Cancel</Button>
                            <Button htmlType='submit' type='primary'>{formRes.getFieldValue("id") == null ? "Add" : "Update"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Details"
                open={openDetails}
                onCancel={onCloseModalDetails}
                footer={false}
            >
                <Form
                    form={formRes}
                    layout='vertical'
                    onFinish={onFinish}
                >
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Firstname"
                                name={"firstname"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Lastname"
                                name={"lastname"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item label="Gender" name={"gender"}>
                                {/* <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} /> */}
                                <Select disabled style={{ pointerEvents: "none", backgroundColor: "#E5E7E9", }}>
                                    <Select.Option value="1">Male</Select.Option>
                                    <Select.Option value="0">Female</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Birth Date" name={"dob"}>
                                <DatePicker style={{ width: "100%", pointerEvents: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item label="Tel" name={"tel"}>
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name={"email"}>
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item label="Address" name={"address"}>
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Create Date"
                                name={"createAt"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Status" name={"status"}>
                        <Select disabled style={{ pointerEvents: "none", backgroundColor: "#E5E7E9", }}>
                            <Select.Option value="1">Male</Select.Option>
                            <Select.Option value="0">Female</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "right", alignItems: "right" }}>
                        <Space>
                            <Button onClick={() => onCloseModalDetails()}>Close</Button>
                        </Space>
                    </Form.Item>
                </Form>

            </Modal>
        </MainPage>
        // </MainPage>
    )
}

export default CustomerPage
