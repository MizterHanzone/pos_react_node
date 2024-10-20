const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        var {
            txt_search,
            status,
            category_id
        } = req.query;
        var sql = "SELECT * FROM product WHERE 1=1"
        var sqlWhere = ""
        var param = {}
        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND name LIKE :txt_seach"
            param["txt_seach"] = "%" + txt_search + "%"
        }
        if (!isEmptyOrNull(status)) {
            sqlWhere += " AND status LIKE :status"
            param["status"] = status
        }
        if (!isEmptyOrNull(category_id)) {
            sqlWhere += " AND categoryId LIKE :category_id"
            param["category_id"] = category_id
        }
        sql = sql + sqlWhere;
        const [list] = await db.query(sql, param);
        const [category] = await db.query("SELECT * FROM category");
        res.json({
            list: list,
            category: category
        });
    } catch (err) {
        logError("product.getList", err, res);
    };
};

const create = async (req, res) => {
    try {
        var {
            categoryId,
            name,
            description,
            qty,
            price,
            discount,
            status
        } = req.body;

        var image = null;
        if (req.file) {
            image = req.file.filename;
        }
        var message = {};

        if (isEmptyOrNull(name)) {
            message.name = "name require!"
        }
        if (isEmptyOrNull(qty)) {
            message.qty = "qty require!"
        }
        if (isEmptyOrNull(price)) {
            message.price = "price require!"
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            })
            return false;
        }
        // categoryId	name	description	qty	price	discount	image	status	
        var sql = "INSERT INTO product (categoryId, name, description, qty, price, discount, image, status) VALUES (:categoryId, :name, :description, :qty, :price, :discount, :image, :status)";
        var param = {
            categoryId,
            name,
            description,
            qty,
            price,
            discount,
            image,
            status
        }

        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "INSERT 1 ROW" : "SOMETHING WRONG",
            data: data
        });

    } catch (err) {
        logError("product.creeate", err, res);
    };
};

const update = async (req, res) => {
    try {
        var {
            id,
            categoryId,
            name,
            description,
            qty,
            price,
            discount,
            status
        } = req.body;
        var image = null;
        if (req.file) {
            image = req.file.filename // change image | new image
        } else {
            image = req.body.preImage // get old image
        }
        var message = {}; // empty object
        if (isEmptyOrNull(id)) {
            message.id = "Id required!"
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            })
            return false;
        }
        var param = {
            id,
            categoryId,
            name,
            description,
            qty,
            price,
            discount,
            status,
            image
        }
        const [dataInfo] = await db.query("SELECT * FROM product WHERE id=:id", { id:id });
        if (dataInfo.length > 0) {
            var sql = "UPDATE product SET categoryId=:categoryId, name=:name ,description=:description, qty=:qty, price=:price, discount=:discount, image=:image, status=:status WHERE id=:id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows) {
                // image == null
                if (req.file && !isEmptyOrNull(req.body.image)) {
                    await removeFile(req.body.image) // remove old image
                }else {
                    Image = req.body.preImage // get old image
                }
            }
            res.json({
                message: (data.affectedRows != 0 ? "UPDATED 1 ROW" : "NOT FOUND"),
                error: true
            })
        } else {
            res.json({
                message: "NOT FOUND",
                error: true
            })
        }
    } catch (err) {
        logError("product.update", err, res)
    }
}

const remove = async (req, res) => {
    try {
        var param = {
            id: req.body.id,
        }
        const [dataInfo] = await db.query("SELECT * FROM product WHERE id =:id", param);
        if (dataInfo.length > 0) {
            var sql = "DELETE FROM product WHERE id =:id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows) {
                // if delete success then remove file
                await removeFile(dataInfo[0].image);
            }
            res.json({
                message: data.affectedRows != 0 ? "DELETED" : "SOMETHING WRONG!",
                data: data
            });
        } else {
            res.json({
                message: "NOT FOUND!",
                error: true
            });
        }
        
    } catch (err) {
        logError("product.remove", err, res);
    };
};

module.exports = { getList, create, update, remove };