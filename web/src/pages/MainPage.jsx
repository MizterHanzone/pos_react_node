import { Spin } from "antd";
import React from "react";

const MainPage = ({ children, loading = false }) => {
    return (
        <div>
            <Spin spinning={loading}>
                {children}
            </Spin>
        </div>
    );
};

export default MainPage;
