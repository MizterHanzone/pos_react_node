const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/helper");

const initInfo = async (req, res) => {
  try {
    const [payment_method] = await db.query(
      "SELECT * FROM order_payment_method"
    );
    const [customer] = await db.query(
      "SELECT id, CONCAT(firstname,' ',lastname,' ',tel) AS name FROM customer"
    );
    res.json({
      payment_method: payment_method,
      customer: customer,
    });
  } catch (err) {
    logError("pos.initInfo", err, res);
  }
};

const searchProduct = async (req, res) => {
  try {
    var { txt_search } = req.query;

    if (isEmptyOrNull(txt_search)) {
      res.json({
        list: [],
      });
      return false;
    }

    var sql = "SELECT * FROM product WHERE status = 1 ";
    var sqlWhere = "";
    var param = {};

    if (!isEmptyOrNull(txt_search)) {
      sqlWhere += " AND id = :txt_search";
      param["txt_search"] = txt_search;
    }

    sql = sql + sqlWhere;
    const [list] = await db.query(sql, param);
    res.json({
      list: list,
    });
  } catch (err) {
    logError("pos.searchProduct", err, res);
  }
};

const checkout = async (req, res) => {
  var con = await db.getConnection();
  try {
    con.beginTransaction();
    var { customerId, orderPaymentMethodId, product, totalPaid } = req.body;
    var message = {};

    if (isEmptyOrNull(customerId)) {
      message.customerId = "Customer Required";
    }

    if (isEmptyOrNull(orderPaymentMethodId)) {
      message.orderPaymentMethodId = "Order Payment Method Required";
    }

    if (!Array.isArray(product) || product.length === 0) {
      message.product = "Product Required";
    }

    if (Object.keys(message).length > 0) {
      res.json({
        error: true,
        message: message,
      });
      return;
    }

    var totalQty = 0;
    var idProduct = [];
    product.forEach((item) => {
      idProduct.push(item.id);
      totalQty += item.QtyOrder;
    });

    var idProductString = idProduct.join(",");
    var sqlFindProductOrder = `SELECT * FROM product WHERE id IN (${idProductString})`;
    const [data] = await db.query(sqlFindProductOrder);

    var totalAmount = 0;
    data.forEach((item) => {
      var qtyOrderTmp = 0;
      product.forEach((item1) => {
        if (item.id === item1.id) {
          qtyOrderTmp = Number(item1.QtyOrder);
          item1.price = item.price;
          item1.discount = item.discount;
        }
      });
      var DisPrice = (qtyOrderTmp * item.price * item.discount) / 100;
      totalAmount += qtyOrderTmp * item.price - DisPrice;
    });
    
    var sqlInvoice = `
  INSERT INTO invoice 
  (customerId, employeeId, orderStatusId, orderPaymentMethodId, totalQty, totalAmount, totalPaid) 
  VALUES 
  (:customerId, :employeeId, :orderStatusId, :orderPaymentMethodId, :totalQty, :totalAmount, :totalPaid)
`;

    var sqlInvoiceParam = {
      customerId: customerId,
      employeeId: 2,
      orderStatusId: orderStatusId,
      orderPaymentMethodId: orderPaymentMethodId,
      totalQty: totalQty,
      totalAmount: totalAmount,
      totalPaid: totalPaid,
    };

    var [dataInvoice] = await db.query(sqlInvoice, sqlInvoiceParam); // create invoice

    // insert data to invoice details and update product stock
    for (const item of product) {
      var sqlInvoiceDetails = `
        INSERT INTO invoice_details 
        (invoiceId, productId, qty, price, discount) 
        VALUES 
        (:invoiceId, :productId, :qty, :price, :discount)
      `;
      var sqlInvoiceDetailsParam = {
        invoiceId: dataInvoice.insertId,
        productId: item.id,
        qty: item.QtyOrder,
        price: item.price,
        discount: item.discount,
      };

      await db.query(sqlInvoiceDetails, sqlInvoiceDetailsParam);

      var sqlProductRestock = `
        UPDATE product SET qty = qty - :QtyOrder WHERE id = :id
      `;
      var sqlProductRestockParam = {
        QtyOrder: item.QtyOrder,
        id: item.id,
      };
      
      await db.query(sqlProductRestock, sqlProductRestockParam);
    }
    await con.commit();
    res.json({
      message: "ORDER SUCCESS",
      totalAmount,
      totalQty,
    });
  } catch (err) {
    await con.rollback();
    logError("pos.checkout", err, res);
  }
};

module.exports = { initInfo, searchProduct, checkout };
