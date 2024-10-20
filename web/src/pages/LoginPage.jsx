import { useState } from "react";
import { request } from "../config/request";
import { setUser } from "../config/helper";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form } from "antd";


const LoginPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onChangeUsername = () => {
        setEmail(event.target.value);
        console.log(event.target.value);
    }
    const onChangePassword = () => {
        setPassword(event.target.value);
        console.log(event.target.value);
    }

    const onLogin = async () => {
        if (email == "") {
            alert("Please fill in Email");
            return false;
        } else if (password == "") {
            alert("Please fill in Password");
            return false;
        }
        var data = {
            "email": email,
            "password": password
        }

        const res = await request("employee/login", "post", data);
        if (res) {
            if (res.error) {
                alert(res.message);
            } else {
                setUser(res.user);
                navigate("/");
            }
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
            <div style={{ margin: 20, backgroundColor: "pink", padding: 20 }}>
                <Input type="email" onChange={onChangeUsername} placeholder="Email Address" />
                <Input type="password" onChange={onChangePassword} placeholder="Password" />
                <Button onClick={onLogin}>Login</Button>
            </div>
        </div>
    )
}

export default LoginPage;