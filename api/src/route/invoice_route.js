const { getList, getInvoiceDetails } = require("../controller/invoice_controller");


const invoice = (app) => {
    app.get("/api/invoice/getlist", getList);
    app.get("/api/invoice/details/:id", getInvoiceDetails);
}

module.exports = invoice;