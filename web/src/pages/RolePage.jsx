import React, { useEffect, useRef, useState } from 'react'
import { request } from '../config/request'
import { Button, DatePicker, Form, Input, message, Modal, Select, Space, Table, Tag } from 'antd';
import { formartDateClient } from '../config/helper';
import MainPage from './MainPage';

const RolePage = () => {

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
        status : null
    })

    const getList = async () => {
        isLoading(true);
        var param = {
            txt_search: filter.current.txt_search,
            status : filter.current.status
        }
        const res = await request("user/getlist", "get", param);
        isLoading(false);
        if (res) {
            setList(res.list);
        }
        console.log(res);
    }

    const onUpdate = (item) => {
        formRes.setFieldValue('id', item.id);
        formRes.setFieldValue('name', item.name);
        formRes.setFieldValue('code', item.code);
        formRes.setFieldValue('status', item.status + "");
        setOpen(true);
        console.log(item);
    }

    const onDetails = (item) => {
        formRes.setFieldValue('id', item.id);
        formRes.setFieldValue('name', item.name);
        formRes.setFieldValue('code', item.code);
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
                const res = await request("user/remove", "delete", data);
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
            id: id,
            name: item.name,
            code: item.code,
            status: item.status
        }

        var url = (id == null ? "user/create" : "user/update");
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
                <h6>Role</h6>
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
                        key: "name",
                        title: "Name",
                        dataIndex: "name"
                    },
                    {
                        key: "code",
                        title: "Code",
                        dataIndex: "code"
                    },
                    {
                        key: "status",
                        title: "Status",
                        dataIndex: "status",
                        render: (value, item, index) => (value == 1 ? <Tag color='green'>Active</Tag> : <Tag color='red'>Disable</Tag>)
                    },
                    {
                        key: "createAt",
                        title: "Create Date",
                        dataIndex: "createAt",
                        render: (value) => formartDateClient(value)
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
                title={formRes.getFieldValue("id") == null ? "New RolePage" : "Edit RolePage"}
                open={open}
                onCancel={onCloseModal}
                footer={false}
            >
                <Form
                    form={formRes}
                    layout='vertical'
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name={"name"}
                        rules={[{ required: true, message: 'Please enter Name', },]}
                    >
                        <Input placeholder='Name' />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name={"code"}
                        rules={[{ required: true, message: 'Please enter Description', },]}
                    >
                        <Input placeholder='Description' />
                    </Form.Item>
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
                    <Form.Item
                        label="Name"
                        name={"name"}
                    >
                        <Input readOnly style={{border: "none", outline: "none", backgroundColor: "#E5E7E9"}}/>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name={"code"}
                    >
                        <Input readOnly style={{border: "none", outline: "none", backgroundColor: "#E5E7E9"}}/>
                    </Form.Item>
                    <Form.Item
                        label="Create Date"
                        name={"createAt"}
                    >
                        <Input readOnly style={{border: "none", outline: "none", backgroundColor: "#E5E7E9"}}/>
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

export default RolePage
