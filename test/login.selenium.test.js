import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const FRONTEND_URL = "http://localhost:3000";

const TEST_EMAIL = "washworldtest2026@gmail.com";
const TEST_PASSWORD = "Password";

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

async function testLoginRedirectsToDashboard() {
  console.log("Starting login Selenium test");

  const options = new chrome.Options();

  options.setChromeBinaryPath(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  );

  options.addArguments("--start-maximized");
  options.addArguments("--disable-gpu");

  let driver;

  try {
    console.log("Creating Chrome driver");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    console.log("Chrome driver created");

    console.log("Opening login page");
    await driver.get(`${FRONTEND_URL}/login`);

    console.log("Login page opened");

    console.log("Finding email input");
    const emailInput = await findFirstExisting(driver, [
      "input[name='email']",
      "input[name='user_email']",
      "input[type='email']",
      "input[placeholder='Email']",
      "input[placeholder='E-mail']",
    ]);

    console.log("Finding password input");
    const passwordInput = await findFirstExisting(driver, [
      "input[name='password']",
      "input[name='user_password']",
      "input[type='password']",
      "input[placeholder='Kodeord']",
      "input[placeholder='Password']",
    ]);

    console.log("Finding login button");
    const loginButton = await findFirstExisting(driver, [
      "button[type='submit']",
      "button",
    ]);

    await driver.wait(until.elementIsVisible(emailInput), 5000);
    await driver.wait(until.elementIsVisible(passwordInput), 5000);
    await driver.wait(until.elementIsVisible(loginButton), 5000);

    console.log("Typing email");
    await emailInput.clear();
    await emailInput.sendKeys(TEST_EMAIL);

    console.log("Typing password");
    await passwordInput.clear();
    await passwordInput.sendKeys(TEST_PASSWORD);

    console.log("Clicking login button");
    await loginButton.click();

    console.log("Waiting after login click");
    await driver.sleep(3000);

    console.log("Current URL:");
    console.log(await driver.getCurrentUrl());

    console.log("Current page text:");
    const bodyText = await driver.findElement(By.css("body")).getText();
    console.log(bodyText);

    console.log("Waiting for dashboard redirect");
    await driver.wait(until.urlContains("/dashboard"), 15000);

    console.log("Login test passed");
    console.log("User reached dashboard");
  } catch (error) {
    console.error("Login Selenium test failed");
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (driver) {
      console.log("Closing browser");
      await driver.quit();
    }
  }
}

await testLoginRedirectsToDashboard();