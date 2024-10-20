const { getList, create, update, remove } = require("../controller/product_controller");
const { upload } = require("../config/helper");

const product = (app) => {
    app.get("/api/product/getlist", getList);
    app.post("/api/product/create",upload.single("Image"), create);
    app.put("/api/product/update",upload.single("Image"), update);
    app.delete("/api/product/remove", remove);
}

module.exports = product;