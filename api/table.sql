

CREATE TABLE `category` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(120) NOT NULL UNIQUE,
  `description` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `role` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(120) NOT NULL UNIQUE,
  `code` varchar(120) NOT NULL UNIQUE,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `customer` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `firstname` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `gender` tinyint(1) DEFAULT 1,
  `dob` datetime DEFAULT NULL,
  `tel` varchar(120) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);

CREATE TABLE `employee` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `roleId` int(11),
  `firstname` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `gender` tinyint(1) DEFAULT 1,
  `dob` datetime DEFAULT NULL,
  `tel` varchar(120) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `salary` DECIMAL(6,2) DEFAULT 0,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);


CREATE TABLE `supplier` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `tel` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `address` text NOT NULL,
  `websiteUrl` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `employeeId` int(11),
  `supplierId` int(11),
  `purchaeStatus` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL,
  `purchaseAt` datetime NOT NULL
);


CREATE TABLE `purchase_product` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `purchaseId` int(11),
  `productId` int(11),
  `qty` int(11) DEFAULT 1,
  `price` DECIMAL(7,2) DEFAULT 0,
  `productStatus` text DEFAULT NULL
);

CREATE TABLE `product` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `categoryId` int(11),
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `qty` int(6) DEFAULT 0,
  `price` DECIMAL(7,2) DEFAULT 0,
  `discount` DECIMAL(7,2) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);

CREATE TABLE `product_image` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `productId` int(11),
  `image` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT 1
);

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `customerId` int(11),
  `employeeId` int(11),
  `orderStatusId` int(11),
  `orderPaymentMethodId` int(11),
  `totalQty` DECIMAL(7,2) DEFAULT 0,
  `totalAmount` DECIMAL(7,2) DEFAULT 0,
  `totalPaid` DECIMAL(7,2) DEFAULT 0,
  `note` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);

CREATE TABLE `invoice_details` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `invoiceId` int(11),
  `productId` int(11),
  `qty` int(11) DEFAULT 1,
  `price`  DECIMAL(7,2) DEFAULT 0,
  `discount` DECIMAL(3,2) DEFAULT 0
);


CREATE TABLE `order_payment_method` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(120) NOT NULL UNIQUE,
  `code` varchar(120) NOT NULL UNIQUE,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);


CREATE TABLE `order_status` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(120) NOT NULL UNIQUE,
  `code` varchar(120) NOT NULL UNIQUE,
  `status` tinyint(1) DEFAULT 1,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createBy` int(11) DEFAULT NULL,
  `updateAt` datetime,
  `updateBy` int(11) DEFAULT NULL
);

ALTER TABLE product ADD FOREIGN KEY (categoryId) REFERENCES category(id);
ALTER TABLE employee ADD FOREIGN KEY (roleId) REFERENCES role(id);

ALTER TABLE invoice 
ADD FOREIGN KEY (customerId) REFERENCES customer(id),
ADD FOREIGN KEY (orderStatusId) REFERENCES order_status(id);
ADD FOREIGN KEY (orderPaymentMethodId) REFERENCES order_payment_method(id),
ADD FOREIGN KEY (employeeId) REFERENCES employee(id);