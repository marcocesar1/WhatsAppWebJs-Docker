const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
    executablePath: "/usr/bin/chromium",
  },
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  console.log({ message: msg.body });
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.initialize();

console.log("Bot is running!");
