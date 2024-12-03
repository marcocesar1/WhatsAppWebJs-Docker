const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

const { getPromoDescuentosCron, getPromoDescuentosHealth } = require("./cron");

async function init() {
  console.log("Bot is running!");

  console.log({
    env: process.env.NODE_ENV,
  });

  const client = new Client({
    puppeteer: {
      headless: true,
      //args: ["--no-sandbox"],
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--single-process",
        "--disable-web-security",
      ],
      // executablePath: "/usr/bin/chromium",
    },
    authStrategy: new LocalAuth(),
  });

  /* const cron = getPromoDescuentosCron(client);
  const healthCron = getPromoDescuentosHealth(client); */

  client.on("ready", async () => {
    console.log("Client is ready!");

    // cron.start();
    // healthCron.start();
  });

  client.on("message", (msg) => {
    console.log({ message: msg.body });
    if (msg.body == "!ping") {
      msg.reply("pong");
    }
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.initialize();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
