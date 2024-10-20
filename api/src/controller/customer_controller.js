const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/helper");

const getList = async (req, res) => {
  try {
    var { txt_search, status } = req.query;
    var sql = "SELECT * FROM customer WHERE 1=1";

    var param = {};

    if (!isEmptyOrNull(txt_search)) {
      sql += " AND (firstname LIKE :txt_search OR lastname LIKE :txt_search)";
      param["txt_search"] = "%" + txt_search + "%";
    }

    if (!isEmptyOrNull(status)) {
      sql += " AND status =:status";
      param["status"] = status;
    }

    const [list] = await db.query(sql, param);
    res.json({
      message: "You have request customer",
      list: list
    });
  } catch (err) {
    logError("customer.getList", err, res);
  }
};

const create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO customer (firstname, lastname, gender, dob, tel, email, address, status) VALUES (:firstname, :lastname, :gender, :dob, :tel, :email, :address, :status)";
    var param = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      dob: req.body.dob,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address,
      status: req.body.status,
    };

    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "INSERT 1 ROW" : "SOMETHING WRONG",
      data: data,
    });
  } catch (err) {
    logError("customer.create", err, res);
  }
};

const update = async (req, res) => {
  try {
    var sql =
      "UPDATE customer SET firstname =:firstname, lastname =:lastname, gender =:gender, dob =:dob, tel =:tel, email =:email, address =:address, status =:status WHERE id =:id";
    var param = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      dob: req.body.dob,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "UPDATED" : "SOMETHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("customer.update", err, res);
  }
};

const remove = async (req, res) => {
  try {
    var sql = "DELETE FROM customer  WHERE id =:id";
    var param = {
      id: req.body.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "DELETED" : "SOMETHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("customer.remove", err, res);
  }
};

module.exports = { getList, create, update, remove };
