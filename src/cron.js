const { CronJob } = require("cron");
const fs = require("fs");

const { getProducts } = require("./promodescuentos");
const {
  PRODUCTS_URL,
  FILENAME,
  PHONE,
  PRODUCTS_HEALTH_URL,
} = require("./config");

const getPromoDescuentosCron = (client) => {
  const job = new CronJob("*/30 * * * *", async () => {
    console.log("Tarea ejecutada cada 30 minutos:", new Date());

    const products = await getProducts(PRODUCTS_URL);
    const productsFiltered = products.filter((product) =>
      product.human_date.includes("hace")
    );

    console.log(
      productsFiltered.length + " products webscraping on url" + PRODUCTS_URL
    );

    fs.readFile(FILENAME, "utf8", async function (err, data) {
      if (err) throw err;

      const lines = data.split(/\r?\n/);

      for (let i = 0; i < productsFiltered.length; i++) {
        const product = productsFiltered[i];

        const existInFile = lines.find((id) => id == product.id);

        if (!existInFile) {
          fs.appendFile(FILENAME, product.id + "\n", function (err) {
            if (err) throw err;
            console.log(product.title + " added to " + FILENAME);
          });

          const adminPhoneNumber = `521${PHONE.ADMIN}@c.us`;
          const userPhoneNumber = `521${PHONE.USER}@c.us`;

          const message = `Se encontró un nuevo producto:\n\n${product.title}\n\n${product.link}`;

          client.sendMessage(adminPhoneNumber, message);

          if (process.env.NODE_ENV == "production") {
            client.sendMessage(userPhoneNumber, message);
          }

          console.log(
            "Product:" + product.title + " sent to " + adminPhoneNumber
          );

          await new Promise((r) => setTimeout(r, 3000));
        } else {
          console.log(product.id + " already in " + FILENAME);
        }
      }
    });
  });

  return job;
};

const getPromoDescuentosHealth = (client) => {
  const job = new CronJob(
    "0 18 * * *",
    async () => {
      console.log("Tarea ejecutada a las 06:00 pm: ", new Date());

      const products = await getProducts(PRODUCTS_HEALTH_URL);
      const productsFiltered = products.filter((product) =>
        product.human_date.includes("hace")
      );

      console.log(productsFiltered.length + " products health");

      if (productsFiltered.length) {
        const product = productsFiltered[0];
        const adminPhoneNumber = `521${PHONE.ADMIN}@c.us`;

        const message = `Producto estatus de servicio:\n\n${
          product.title
        }\n\nFecha: ${new Date()}`;

        client.sendMessage(adminPhoneNumber, message);
      }
    },
    null,
    true,
    "America/Mexico_City"
  );

  return job;
};

module.exports = {
  getPromoDescuentosCron,
  getPromoDescuentosHealth,
};
