const { CronJob } = require("cron");
const fs = require("fs");

const { getProducts } = require("./promodescuentos");
const {
  PRODUCTS_URL,
  FILENAME,
  PHONE,
  PRODUCTS_HEALTH_URL,
  WA_API,
} = require("./config");
const { sendMessage } = require("./wa-service");

const getPromoDescuentosCron = () => {
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

          //const adminPhoneNumber = `521${PHONE.ADMIN}@c.us`;
          //const userPhoneNumber = `521${PHONE.USER}@c.us`;
          const adminPhoneNumber = PHONE.ADMIN;
          const userPhoneNumber = PHONE.USER;

          const message = `Se encontró un nuevo producto:\n\n${product.title}\n\n${product.link}`;

          await sendMessage(WA_API, adminPhoneNumber, message);

          console.log(
            "Product: " + product.title + " sent to " + adminPhoneNumber
          );

          if (process.env.NODE_ENV == "production") {
            await sendMessage(WA_API, userPhoneNumber, message);

            console.log(
              "Product: " + product.title + " sent to " + userPhoneNumber
            );
          }

          await new Promise((r) => setTimeout(r, 3000));
        } else {
          console.log(product.id + " already in " + FILENAME);
        }
      }
    });
  });

  return job;
};

const getPromoDescuentosHealth = () => {
  const job = new CronJob(
    "* 22 * * *",
    async () => {
      console.log("Tarea ejecutada a las 10:00 pm: ", new Date());

      const products = await getProducts(PRODUCTS_HEALTH_URL);
      const productsFiltered = products.filter((product) =>
        product.human_date.includes("hace")
      );

      console.log(productsFiltered.length + " products health");

      if (productsFiltered.length) {
        const product = productsFiltered[0];

        //const adminPhoneNumber = `521${PHONE.ADMIN}@c.us`;
        const adminPhoneNumber = PHONE.ADMIN;

        const message = `Producto estatus de servicio:\n\n${
          product.title
        }\n\nFecha: ${new Date()}`;

        await sendMessage(WA_API, adminPhoneNumber, message);
      }
    },
    null,
    true,
    "America/Mexico_City"
  );

  return job;
};

const getStatusHealth = () => {
  const job = new CronJob(
    "0 * * * *",
    async () => {
      console.log("Estatus WA health: ", new Date());

      const adminPhoneNumber = PHONE.ADMIN;
      const message = `Estatus WA: OK\n\nFecha: ${new Date()}`;

      await sendMessage(WA_API, adminPhoneNumber, message);
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
  getStatusHealth,
};
