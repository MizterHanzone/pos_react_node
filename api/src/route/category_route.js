const { getList, create, update, remove } = require("../controller/category_controller");

const category = (app) => {
    app.get("/api/category/getlist", getList);
    app.post("/api/category/create", create);
    app.put("/api/category/update", update);
    app.delete("/api/category/remove", remove);
}

module.exports = category;