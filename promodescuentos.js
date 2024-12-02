const puppeteer = require("puppeteer");

async function getProducts(url) {
  const products = [];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
    headless: true,
    executablePath: "/usr/bin/chromium",
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  );

  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1024 });

  /*  await page.screenshot({
    path: "screenshot.jpg",
  });

  console.log("screen1"); */

  const selector = "#turnstile-wrapper";
  const elementExists = (await page.$(selector)) !== null;
  if (elementExists) {
    console.log("Esta activado el cloudflare");

    return [];
  }

  const productsSelector = ".js-threadList article";
  const elements = await page.$$(productsSelector);
  if (!elements.length) {
    console.log("No se encontraron elementos que coincidan con el selector.");
    return [];
  }

  console.log(`[PromodescuentosImp] ${elements.length} products webscraping`);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    const titleElement = await element.$("strong.thread-title a");
    if (!titleElement) continue;

    const productTitle = await page.evaluate(
      (el) => el.textContent,
      titleElement
    );
    const productLink = await page.evaluate(
      (el) => el.getAttribute("href"),
      titleElement
    );
    const productId = await page.evaluate(
      (el) => el.getAttribute("id"),
      element
    );
    if (!productTitle) continue;

    const publicationDateElement = await element.$("span.metaRibbon>span");
    if (!publicationDateElement) continue;

    const publicationDate = await page.evaluate(
      (el) => el.textContent,
      publicationDateElement
    );
    if (!publicationDate) continue;

    products.push({
      id: productId,
      link: productLink,
      title: productTitle,
      human_date: publicationDate,
    });
  }

  await browser.close();

  return products;
}

module.exports = {
  getProducts,
};
