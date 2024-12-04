// const express = require("express");
require("dotenv").config();

// const app = express();
// const port = 3000;

const {
  getPromoDescuentosCron,
  getPromoDescuentosHealth,
  getStatusHealth,
} = require("./cron");

async function init() {
  console.log("Bot is running!");

  const cron = getPromoDescuentosCron();
  const healthCron = getPromoDescuentosHealth();
  const healthWa = getStatusHealth();

  cron.start();
  healthCron.start();
  healthWa.start();

  /* app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }); */
}

init();
