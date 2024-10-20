// import db
const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/helper");

const getList = async (req, res) => {
  try {
    var { txt_search, status } = req.query;

    var param = {};

    var sql = "SELECT * FROM role WHERE 1=1";

    if (!isEmptyOrNull(txt_search)) {
      sql += " AND name LIKE :txt_search OR code LIKE :txt_search";
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
    logError("user.getlist", err, res);
  }
};

const create = async (req, res) => {
  try {
    var sql = "INSERT INTO role (name, code, status) VALUES (:name, :code, :status)";
    var param = {
      name: req.body.name,
      code: req.body.code,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "INSERT 1 ROW" : "SOMETHING WRONG",
      data: data,
    });
  } catch (err) {
    logError("user.creeate", err, res);
  }
};

const update = async (req, res) => {
  try {
    var sql =
      "UPDATE role SET name =:name, code =:code, status =:status WHERE id =:id";
    var param = {
      id: req.body.id,
      name: req.body.name,
      code: req.body.code,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "UPDATED" : "SOMETHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("user.update", err, res);
  }
};

const remove = async (req, res) => {
  try {
    var sql = "DELETE FROM role WHERE id = :id";
    var param = {
      id: req.body.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "DELETED" : "SOMETHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("user.remove", err, res);
  }
};

module.exports = { getList, create, update, remove };
