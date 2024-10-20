import axios from "axios";
import { useEffect, useState } from "react";
import { request } from "../config/request";
import { Button, Input } from "antd";

const HomePage = () => {

    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getListCategory();
    }, []);

    const getListCategory = async () => {

        const res = await request("customer/getlist", "get", {});
        if (res) {
            setList(res.list);
        }
        console.log(res.list);
    }

    return (
        <div>
            <Button>Save</Button>
        </div>
    );
};

export default HomePage;