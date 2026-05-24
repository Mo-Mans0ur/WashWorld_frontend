import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const FRONTEND_URL = "http://localhost:3000";

const TEST_EMAIL = "washworldtest2026@gmail.com";
const TEST_PASSWORD = "Password";

const PAGES_TO_TEST = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Abonnement",
    path: "/abonnement",
  },
  {
    name: "Active wash",
    path: "/activewash",
  },
  {
    name: "Betaling",
    path: "/betaling",
  },
  {
    name: "Cars",
    path: "/cars",
  },
  {
    name: "Details",
    path: "/details",
  },
  {
    name: "Kundeservice",
    path: "/kundeservice",
  },
  {
    name: "Locations list",
    path: "/locations/list",
  },
  {
    name: "Locations map",
    path: "/locations/map",
  },
  {
    name: "Notifikationer",
    path: "/notifikationer",
  },
  {
    name: "Profile",
    path: "/profile",
  },
  {
    name: "Selfwash",
    path: "/selfwash",
  },
  {
    name: "Singlewash",
    path: "/singlewash",
  },
  {
    name: "Vaskehistorik",
    path: "/vaskehistorik",
  },
];

async function createDriver() {
  const options = new chrome.Options();

  options.setChromeBinaryPath(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  );

  options.addArguments("--start-maximized");
  options.addArguments("--disable-gpu");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

async function findFirstExisting(driver, selectors, timeout = 10000) {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    for (const selector of selectors) {
      const elements = await driver.findElements(By.css(selector));

      if (elements.length > 0) {
        return elements[0];
      }
    }

    await driver.sleep(250);
  }

  throw new Error(`Could not find any selector: ${selectors.join(", ")}`);
}

async function login(driver) {
  console.log("Opening login page");
  await driver.get(`${FRONTEND_URL}/login`);

  console.log("Finding email input");
  const emailInput = await findFirstExisting(driver, [
    "input[name='email']",
    "input[name='user_email']",
    "input[type='email']",
  ]);

  console.log("Finding password input");
  const passwordInput = await findFirstExisting(driver, [
    "input[name='password']",
    "input[name='user_password']",
    "input[type='password']",
  ]);

  console.log("Finding login button");
  const loginButton = await findFirstExisting(driver, [
    "button[type='submit']",
    "button",
  ]);

  console.log("Typing login email");
  await emailInput.clear();
  await emailInput.sendKeys(TEST_EMAIL);

  console.log("Typing login password");
  await passwordInput.clear();
  await passwordInput.sendKeys(TEST_PASSWORD);

  console.log("Clicking login button");
  await loginButton.click();

  console.log("Waiting for dashboard");
  await driver.wait(until.urlContains("/dashboard"), 15000);

  console.log("Login passed");
}

async function testPageLoads(driver, page) {
  console.log(`Testing page: ${page.name}`);

  await driver.get(`${FRONTEND_URL}${page.path}`);

  await driver.wait(async () => {
    const readyState = await driver.executeScript("return document.readyState");
    return readyState === "complete";
  }, 10000);

  await driver.sleep(1000);

  const currentUrl = await driver.getCurrentUrl();
  const bodyText = await driver.findElement(By.css("body")).getText();
  const lowerBodyText = bodyText.toLowerCase();

  if (!currentUrl.includes(page.path)) {
    console.log("Page body text:");
    console.log(bodyText);

    throw new Error(
      `${page.name} failed. Expected URL to contain ${page.path}, but got ${currentUrl}`
    );
  }

  if (
    lowerBodyText.includes("404") ||
    lowerBodyText.includes("not found") ||
    lowerBodyText.includes("application error")
  ) {
    console.log("Page body text:");
    console.log(bodyText);

    throw new Error(`${page.name} loaded with a serious error message`);
  }

  if (bodyText.trim().length < 5) {
    console.log("Page body text:");
    console.log(bodyText);

    throw new Error(`${page.name} page looks empty`);
  }

  console.log(`${page.name} passed`);
}
async function testWholeApp() {
  console.log("Starting whole app Selenium test");

  let driver;

  try {
    console.log("Creating Chrome driver");
    driver = await createDriver();

    console.log("Chrome driver created");

    await login(driver);

    for (const page of PAGES_TO_TEST) {
      await testPageLoads(driver, page);
    }

    console.log("Whole app Selenium test passed");
  } catch (error) {
    console.error("Whole app Selenium test failed");
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (driver) {
      console.log("Closing browser");
      await driver.quit();
    }
  }
}

await testWholeApp();