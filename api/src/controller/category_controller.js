const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/helper");

const getList = async (req, res) => {
  try {
    var { txt_search, status } = req.query;
    
    var param = {};

    var sql = "SELECT * FROM category WHERE 1=1";

    if (!isEmptyOrNull(txt_search)) {
      sql += " AND name LIKE :txt_search OR description LIKE :txt_search";
      param["txt_search"] = "%" + txt_search + "%";
    }

    if (!isEmptyOrNull(status)) {
      sql += " AND status =:status";
      param["status"] = status;
    }

    sql += " ORDER BY id DESC";
    const [list] = await db.query(sql, param);
    res.json({
      list: list,
    });
  } catch (err) {
    logError("Category.getList", err, res);
  }
};

const create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO category (name, description, status) VALUES (:name, :description, :status)";
    var param = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: "INSERT 1 ROW",
      data: data,
    });
  } catch (err) {
    logError("Category.create", err, res);
  }
};

const update = async (req, res) => {
  try {
    var sql =
      "UPDATE category SET name =:name, description =:description, status =:status WHERE id =:id ";
    var param = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "UPDATED" : "SOMWTHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("Category.update");
  }
};

const remove = async (req, res) => {
  try {
    var sql = "DELETE FROM category WHERE id =:id";
    var param = {
      id: req.body.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "DELETED" : "NOT FOUND!",
      data: data,
    });
  } catch (err) {
    logError("Category.remove");
  }
};

module.exports = { getList, create, update, remove };
