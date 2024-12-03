const path = require("path");

// const PRODUCTS_URL = "https://www.promodescuentos.com/search?q=game%20pass";
const PRODUCTS_HEALTH_URL = "https://www.promodescuentos.com";
const PRODUCTS_URL = "https://www.promodescuentos.com/search?q=game%20pass";
const FILENAME = path.join(__dirname, "productos.txt");

const PHONE = {
  ADMIN: process.env.ADMIN_PHONE,
  USER: process.env.USER_PHONE,
};

module.exports = {
  PRODUCTS_HEALTH_URL,
  PRODUCTS_URL,
  FILENAME,
  PHONE,
};
