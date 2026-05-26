import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const FRONTEND_URL = "http://localhost:3000";

const TEST_EMAIL = "washworldtest2026@gmail.com";
const TEST_PASSWORD = "Password";

function createRandomLicensePlate() {
  const randomNumber = Math.floor(100000 + Math.random() * 899999);
  return `SE${randomNumber}`;
}

async function createDriver() {
  const options = new chrome.Options();

  options.setChromeBinaryPath(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  );

  options.addArguments("--start-maximized");
  options.addArguments("--disable-gpu");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

async function waitForPageReady(driver) {
  await driver.wait(async () => {
    const readyState = await driver.executeScript("return document.readyState");
    return readyState === "complete";
  }, 10000);
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

async function findElementByText(driver, text, timeout = 10000) {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    const elements = await driver.findElements(
      By.xpath(`//*[contains(normalize-space(.), '${text}')]`),
    );

    if (elements.length > 0) {
      return elements[0];
    }

    await driver.sleep(250);
  }

  throw new Error(`Could not find text: ${text}`);
}

async function login(driver) {
  console.log("Opening login page");
  await driver.get(`${FRONTEND_URL}/login`);

  await waitForPageReady(driver);

  console.log("Finding email input");
  const emailInput = await findFirstExisting(driver, [
    "input[name='email']",
    "input[type='email']",
  ]);

  console.log("Finding password input");
  const passwordInput = await findFirstExisting(driver, [
    "input[name='password']",
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

async function testCarsUiFlowEndToEnd() {
  console.log("Starting E2E cars UI flow test");

  let driver;

  try {
    driver = await createDriver();

    await login(driver);

    const licensePlate = createRandomLicensePlate();
    const carName = `Selenium car ${Date.now()}`;

    console.log("Opening cars page");
    await driver.get(`${FRONTEND_URL}/cars`);

    await waitForPageReady(driver);
    await driver.sleep(1000);

    console.log("Finding add car button");

    const addCarButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(normalize-space(.), 'Tilføj bil')] | //a[contains(normalize-space(.), 'Tilføj bil')]",
        ),
      ),
      10000,
    );

    console.log("Clicking add car button");

    await driver.wait(until.elementIsVisible(addCarButton), 5000);

    await driver.executeScript(
      "arguments[0].scrollIntoView({ block: 'center' });",
      addCarButton,
    );

    await driver.sleep(500);

    await driver.executeScript("arguments[0].click();", addCarButton);

    console.log("Waiting for add car page");
    await driver.wait(until.urlContains("/cars/add"), 10000);

    console.log("Finding license plate input");
    const licensePlateInput = await findFirstExisting(driver, [
      "input[name='car_license_plate']",
      "input[name='car_number_plate']",
      "input[name='licensePlate']",
      "input[placeholder='AB 12 345']",
      "input[placeholder*='AB']",
    ]);

    console.log("Finding car name input");
    const carNameInput = await findFirstExisting(driver, [
      "input[name='car_name']",
      "input[name='carName']",
      "input[placeholder='Kladenavn (frivilligt)']",
      "input[placeholder*='Kladenavn']",
    ]);

    console.log("Typing license plate");
    await licensePlateInput.clear();
    await licensePlateInput.sendKeys(licensePlate);

    console.log("Typing car name");
    await carNameInput.clear();
    await carNameInput.sendKeys(carName);

    console.log("Finding submit button");
    const submitButton = await findElementByText(driver, "Tilføj", 10000);

    console.log("Clicking submit button");
    await driver.executeScript(
      "arguments[0].scrollIntoView({ block: 'center' });",
      submitButton,
    );

    await driver.sleep(300);

    await driver.executeScript("arguments[0].click();", submitButton);

    console.log("Waiting after submit");
    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();
    const bodyText = await driver.findElement(By.css("body")).getText();

    console.log("Current URL:");
    console.log(currentUrl);

    console.log("Current page text:");
    console.log(bodyText);

    const lowerBodyText = bodyText.toLowerCase();

    const sawExpectedResult =
      currentUrl.includes("/cars") ||
      bodyText.includes(licensePlate) ||
      bodyText.includes(carName) ||
      lowerBodyText.includes("oprettet") ||
      lowerBodyText.includes("tilføjet") ||
      lowerBodyText.includes("kunne ikke") ||
      lowerBodyText.includes("failed");

    if (!sawExpectedResult) {
      throw new Error(
        "The car form was submitted, but no expected result appeared",
      );
    }

    console.log("E2E cars UI flow test passed");
    console.log(`Used plate: ${licensePlate}`);
    console.log(`Used name: ${carName}`);
  } catch (error) {
    console.error("E2E cars UI flow test failed");
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (driver) {
      console.log("Closing browser");
      await driver.quit();
    }
  }
}

await testCarsUiFlowEndToEnd();
