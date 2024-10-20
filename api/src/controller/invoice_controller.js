const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/helper");

const getList = async (req, res) => {
  try {
    var sql = "",
      param;
    sql =
      "SELECT" +
      " i.*," +
      " CONCAT(c.firstname,'-',c.lastname) CustomerName," +
      " CONCAT(e.firstname,'-',e.lastname) EmployeeName," +
      " pm.name PaymentMethod," +
      " os.name OrderStatus" +
      " FROM invoice i" +
      " INNER JOIN customer c ON (i.customerId = c.id)" +
      " INNER JOIN employee e ON (i.employeeId = e.id)" +
      " INNER JOIN order_payment_method pm ON (i.orderPaymentMethodId = pm.id)" +
      " INNER JOIN order_status os ON (i.orderStatusId = os.id)";
    const [list] = await db.query(sql, param);

    res.json({
      list: list,
    });
  } catch (err) {
    logError("invoice.getlis", err, res);
  }
};

const getInvoiceDetails = async (req, res) => {
  try {
    // Get the invoice ID from the request parameters
    var id = req.params.id; // Corrected to req.params.id

    // SQL query to select the invoice details and join with the product table
    var sql =
      "SELECT " +
      " ivd.id," +
      " ivd.invoiceId," +
      " ivd.qty," +
      " ivd.price," +
      " ivd.discount," +
      " ivd.productId," +
      " p.name," +
      " p.image" +
      " FROM invoice_details ivd" +
      " INNER JOIN product p ON (ivd.productId = p.id)" +
      " WHERE ivd.invoiceId = :id";

    // Execute the SQL query
    const [listDetails] = await db.query(sql, {id:id});

    // Send the results as a JSON response
    res.json({
        listDetails: listDetails,
    });
  } catch (err) {
    logError("invoiceDetails.getlist", err, res);
  }
};

module.exports = { getList, getInvoiceDetails };
