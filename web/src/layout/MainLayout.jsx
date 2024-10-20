// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { getUser, isLogin, logout } from "../config/helper";
// import { useEffect } from "react";

// const MainLayout = () => {

//     const user = getUser();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!isLogin()) {
//             navigate("login")
//         }
//     }, []);


//     const onLogout = () => {
//         logout();
//     }

//     if (!user) {
//         return null;
//     }

//     return (
//         <div>
//             <div style={{height: "200px", backgroundColor: "pink"}}>
//                 <div>
//                     Brand Name
//                     <h4>Welcome {user?.firstname} {user?.lastname}</h4>
//                     <button onClick={onLogout}>Logout</button>
//                 </div>
//                 <Link to="/" >Home</Link>
//                 <Link to="/login" >Login</Link>
//             </div>
//             <div>
//                 <Outlet />
//             </div>
//         </div>
//     )
// }

// export default MainLayout;

import React, { useEffect, useState } from 'react';
import {
    DashboardOutlined,
    ProductOutlined,
    PieChartOutlined,
    AntCloudOutlined,
    UserOutlined,
    LogoutOutlined,
    DesktopOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { getUser, isLogin, logout } from '../config/helper';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Dashboard', '/', <DashboardOutlined />),
    getItem('Customer', 'customer', <UserOutlined />),
    getItem('Employees', 'employee', <UserOutlined />),
    getItem('Poin Of Sale', 'poinofsalw', <DesktopOutlined />, [
        getItem('POS', 'pos'),
        getItem('Invoice', 'invoice'),
    ]),
    getItem('Production', 'production', <ProductOutlined />, [
        getItem('Category', 'category'),
        getItem('Product', 'product'),
    ]),
    getItem('System', 'system', <AntCloudOutlined />, [
        getItem('Order Status', 'orderstatus'),
        getItem('Paymeny Method', 'orderpaymentmethod'),
        getItem('Role', 'role'),
    ]),
    getItem('Option', 'option', <PieChartOutlined />, [
        getItem('Logout', 'logout', <LogoutOutlined />),
    ]),
];

const breadcrumbItems = [
    {
        title: 'Welcome',
    },
    {
        title: 'Bill',
    },
];
const App = () => {

    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        if (!isLogin()) {
            navigate("login")
        }
    }, []);

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const onClickMenu = (event) => {
        if (event.key == "logout") {
            logout();
            return;
        }
        navigate(event.key);
    }

    if (!user) {
        return null;
    }

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline" items={items}
                    onClick={onClickMenu} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                        items={breadcrumbItems}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default App;