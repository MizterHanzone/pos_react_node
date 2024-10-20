const { initInfo, searchProduct, checkout } = require("../controller/pos_controller");

const pos = (app) => {
    app.get("/api/pos/initInfo", initInfo);
    app.get("/api/pos/searchProduct", searchProduct);
    app.post("/api/pos/checkout", checkout);
}

module.exports = pos;