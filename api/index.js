const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json()); // alllow json
app.use(cors({
    "origin": "*",
    "methods": "GET, HEAD, PUT, PATCH, POST, DELETE"
}));

// register route

const user = require("./src/route/role_route");
const category = require("./src/route/category_route");
const order_payment_method = require("./src/route/order_payment_method_route");
const customer = require("./src/route/customer_route");
const employee = require("./src/route/employee_route");
const product = require("./src/route/product_route");
const order_status = require("./src/route/order_status_route");
const pos = require("./src/route/pos_route");
const invoice = require("./src/route/invoice_route");
user(app);
category(app);
order_payment_method(app);
customer(app);
employee(app);
product(app);
order_status(app);
pos(app);
invoice(app);

const port = 8081;
app.listen(port, () => {
    console.log("http://localhost:" + port);
});