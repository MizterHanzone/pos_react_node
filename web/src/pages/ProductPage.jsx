import React, { useEffect, useRef, useState } from 'react'
import { request } from '../config/request'
import { Button, Col, DatePicker, Form, Image, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag } from 'antd';
import { Config, formartDateClient } from '../config/helper';
import MainPage from './MainPage';
import { FileImageFilled } from '@ant-design/icons';

const ProductPage = () => {

    const [list, setList] = useState([]);
    const [category, setCategory] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [loading, isLoading] = useState(false);
    const [formRes] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        getList();
    }, []);

    const filter = useRef({
        txt_search: null,
        status: null,
        category_id: null
    })

    const fileRef = useRef(null)

    const getList = async () => {
        isLoading(true);
        var param = {
            txt_search: filter.current.txt_search,
            status: filter.current.status,
            category_id: filter.current.category_id
        }
        const res = await request("product/getlist", "get", param);
        isLoading(false);
        if (res) {
            setList(res.list);
            setCategory(res.category);
        }
        console.log(res);
    }

    const onUpdate = (item) => {
        // console.log(item)
        formRes.setFieldsValue({
            ...item,
            id: item.id,
            status: item.status + "",
            "image": item.image
        });
        setFilePreview(Config.image_path + item.image)
        setOpen(true);
    }

    const onDetails = (item) => {
        formRes.setFieldsValue({
            ...item,
            id: item.id,
            status: item.status + "",
            "image": item.image
        });
        setFilePreview(Config.image_path + item.image)
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
                const res = await request("product/remove", "delete", data);
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
        var formUpload = new FormData();
        formUpload.append("id", id);
        formUpload.append("name", item.name);
        formUpload.append("description", item.description);
        formUpload.append("qty", item.qty);
        formUpload.append("price", item.price);
        formUpload.append("discount", item.discount);
        formUpload.append("categoryId", item.categoryId);
        formUpload.append("status", item.status);
        formUpload.append("preImage", formRes.getFieldValue("image"));
        if (fileSelected != null) {
            formUpload.append("Image", fileSelected);
        }

        var url = (id == null ? "product/create" : "product/update");
        var method = (id == null ? "post" : "put");
        const res = await request(url, method, formUpload);
        if (res) {
            // if (res.error) {
            //     var msg = ""
            //     Object.keys(res.message).map((key, index) => {
            //         msg += res.message[key] + '\n'
            //     })
            //     message.error(msg);
            //     return false;
            // }
            message.success(res.message);
            getList();
            onCloseModal();
        }
    }

    const onCloseModal = () => {
        formRes.resetFields();
        setOpen(false);
        onRemoveFileSelected();
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

    const onSelectCategory = (value) => {
        filter.current.category_id = value;
        getList();
    }

    const onChangeFile = (e) => {
        var file = e.target.files[0];
        var filePreview = URL.createObjectURL(file);
        setFileSelected(file);
        setFilePreview(filePreview);
        console.log(file)
        console.log(filePreview)
    }

    const onRemoveFileSelected = () => {
        fileRef.current.value = null;
        setFileSelected(null);
        setFilePreview(null);
    }

    return (
        // <MainPage>
        <MainPage loading={loading}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
                <h6>Product</h6>
                <div>
                    <Space>
                        <Input.Search placeholder='Type to search...' onSearch={onTextSearch} onChange={onChangeSearch}></Input.Search>
                        <Select onChange={onChangeStatus} placeholder="Select" allowClear >
                            <Select.Option value={"1"}>Active</Select.Option>
                            <Select.Option value={"0"}>Disable</Select.Option>
                        </Select>
                        <Select
                            placeholder="Select Category for search"
                            showSearch
                            optionFilterProp='label'
                            onChange={onSelectCategory}
                            allowClear
                        >
                            {category.map((item, index) => (
                                <Select.Option label={item.name} key={index} value={item.id}>{item.name}</Select.Option>
                            ))}
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
                        dataIndex: "name"
                    },
                    {
                        key: "description",
                        title: "Description",
                        dataIndex: "description"
                    },
                    {
                        key: "qty",
                        title: "Quantity",
                        dataIndex: "qty"
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
                        render: (value) => (value + " %")
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
                title={formRes.getFieldValue("id") == null ? "New Product" : "Edit Product"}
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
                                label="Name"
                                name={"name"}
                                rules={[{ required: true, message: 'Please enter Name', },]}
                            >
                                <Input placeholder='Name' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Description"
                                name={"description"}
                                rules={[{ required: true, message: 'Please enter Description', },]}
                            >
                                <Input placeholder='Description' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Quantity"
                                name={"qty"}
                                rules={[{ required: true, message: 'Please enter Quantity', },]}
                            >
                                <Input placeholder='Quantity' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Price"
                                name={"price"}
                                rules={[{ required: true, message: 'Please enter Price', },]}
                            >
                                <InputNumber placeholder='Price' style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Discount"
                                name={"discount"}
                                rules={[{ required: true, message: 'Please enter Discount', },]}
                            >
                                <InputNumber placeholder='Discount' style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Category"
                                name={"categoryId"}
                                rules={[{ required: true, message: 'Please Select Category', },]}
                            >
                                <Select
                                    placeholder="Select Category"
                                    showSearch
                                    optionFilterProp='label'
                                >
                                    {category.map((item, index) => (
                                        <Select.Option label={item.name} key={index} value={item.id}>{item.name}</Select.Option>
                                    ))}
                                </Select>
                                {/* <Select
                                    placeholder="Select Role"
                                    showSearch
                                    optionFilterProp='label'
                                    options={role.map((item) => (
                                        {
                                            label : item.name
                                       }
                                    ))}
                                >
                                </Select> */}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Image"
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    onChange={onChangeFile}
                                    style={{ width: "100%" }}
                                    id="selectFile"
                                    class="form-control sm" aria-describedby="inputGroupFileAddon04" aria-label="Upload"
                                />
                                {/* <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('selectFile').click();
                                    }}
                                >
                                    Browse..
                                </button> */}
                                {/* <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" /> */}
                                {filePreview != null ? <img src={filePreview} alt='' style={{ width: 100, height: 100 }} /> : <div></div>}
                                {filePreview != null ? <button onClick={onRemoveFileSelected} style={{ border: "none", background: "none" }}><i class="fa-solid fa-trash" style={{ background: "transparence" }}></i></button> : <div></div>}

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

                            >
                                {filePreview != null ? <img src={filePreview} alt='' style={{ width: 150, height: 150, marginTop: 10, marginLeft: 10 }} /> : <div></div>}

                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Name"
                                name={"name"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name={"description"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Quantity"
                                name={"qty"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Price"
                                name={"price"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Discount"
                                name={"discount"}
                            >
                                <Input readOnly style={{ border: "none", outline: "none", backgroundColor: "#E5E7E9" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Status" name={"status"}>
                                <Select disabled style={{ pointerEvents: "none", backgroundColor: "#E5E7E9", }}>
                                    <Select.Option value="1">Active</Select.Option>
                                    <Select.Option value="0">InActive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
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

export default ProductPage
