const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/helper");
const bcrypt = require("bcrypt");

const getList = async (req, res) => {
  try {
    var { txt_search, status, role_id } = req.query;

    var sql = "SELECT e.*, r.name as roleName FROM employee e INNER JOIN role r ON e.roleId = r.id WHERE 1=1";

    // const [total] = await db.query("SELECT COUNT(id) as TotalRecord FROM employee");
    const [role] = await db.query("SELECT * FROM role");
    var param = {};

    if (!isEmptyOrNull(txt_search)) {
      sql += " AND (e.firstname LIKE :txt_search OR e.lastname LIKE :txt_search)";
      param["txt_search"] = "%" + txt_search + "%";
    }

    if (!isEmptyOrNull(status)) {
      sql += " AND e.status =:status";
      param["status"] = status;
    }

    if (!isEmptyOrNull(role_id)) {
      sql += " AND e.roleId =:role_id";
      param["role_id"] = role_id;
    }

    const [list] = await db.query(sql, param);

    res.json({
      list: list,
      // total: total,
      role: role,
    });
  } catch (err) {
    logError("employee.getList", err, res);
  }
};

const create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO employee (roleId, firstname, lastname, gender, dob, tel, email, address, status, image, salary) VALUES (:roleId, :firstname, :lastname, :gender, :dob, :tel, :email, :address, :status, :image, :salary)";
    var param = {
      roleId: req.body.roleId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      dob: req.body.dob,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address,
      status: req.body.status,
      image: req.body.image,
      salary: req.body.salary,
    };

    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "INSERT 1 ROW" : "SOMETHING WRONG",
      data: data,
    });
  } catch (err) {
    logError("employee.create", err, res);
  }
};

const update = async (req, res) => {
  try {
    var sql =
      "UPDATE employee SET roleId =:roleId, firstname =:firstname, lastname =:lastname, gender =:gender, dob =:dob, tel =:tel, email =:email, address =:address, status =:status, salary =:salary WHERE id =:id";
    var param = {
      id: req.body.id,
      roleId: req.body.roleId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      dob: req.body.dob,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address,
      status: req.body.status,
      salary: req.body.salary,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "UPDATED" : "SOMETHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("employee.update", err, res);
  }
};

const remove = async (req, res) => {
  try {
    var sql = "DELETE FROM employee  WHERE id =:id";
    var param = {
      id: req.body.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      message: data.affectedRows != 0 ? "DELETED" : "SOMETHING WRONG!",
      data: data,
    });
  } catch (err) {
    logError("employee.remove", err, res);
  }
};

const setPassword = async (req, res) => {
  try {
    var { email, password, confirmPassword } = req.body;

    const [user] = await db.query("SELECT * FROM employee WHERE email=:email", {
      email: email,
    });
    if (user.length == 0) {
      res.json({
        errro: true,
        message: "USER DON'T EXIST!",
      });

      return false;
    } else if (password != confirmPassword) {
      res.json({
        errro: true,
        message: "PASSWORD NOT MATCH!",
      });

      return false;
    }

    const passHash = await bcrypt.hashSync(password, 10);
    const [data] = await db.query(
      "UPDATE employee SET password =:password WHERE email =:email",
      { password: passHash, email: email }
    );
    res.json({
      data: data,
      message: data.affectedRows ? "PASSWORD SETED" : "SOMETHING WRONG!",
    });
  } catch (err) {
    logError("employee.setpassword", err, res);
  }
};

const login = async (req, res) => {
  try {
    var { email, password } = req.body;
    const [user] = await db.query("SELECT * FROM employee WHERE email=:email", {
      email: email,
    });
    if (user.length == 0) {
      res.json({
        error: true,
        message: "USER DON'T EXIST!",
      });
      return false;
    }
    var passwordFromDb = user[0].password;
    var isCorrectPassword = await bcrypt.compareSync(password, passwordFromDb);
    if (isCorrectPassword) {
      delete user[0].password,
        res.json({
          message: "LOGIN SUCCESS",
          user: user[0],
        });
    } else {
      res.json({
        message: "INCORRECT PASSWORD!",
        user: user[0],
      });
    }
  } catch (err) {
    logError("employee.login", err, res);
  }
};

module.exports = { getList, create, update, remove, setPassword, login };
