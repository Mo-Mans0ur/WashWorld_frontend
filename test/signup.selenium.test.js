import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const FRONTEND_URL = "http://localhost:3000";

function createRandomEmail() {
  const randomNumber = Date.now();
  return `seleniumtest${randomNumber}@test.dk`;
}

async function testSignupShowsVerificationMessage() {
  console.log("Starting signup Selenium test");

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

    const testEmail = createRandomEmail();

    console.log("Opening signup page");
    await driver.get(`${FRONTEND_URL}/signup`);

    console.log("Signup page opened");

    console.log("Finding first name input");
    const firstNameInput = await driver.wait(
      until.elementLocated(By.css("input[name='firstName']")),
      10000
    );

    console.log("Finding last name input");
    const lastNameInput = await driver.wait(
      until.elementLocated(By.css("input[name='lastName']")),
      10000
    );

    console.log("Finding email input");
    const emailInput = await driver.wait(
      until.elementLocated(By.css("input[name='email']")),
      10000
    );

    console.log("Finding password input");
    const passwordInput = await driver.wait(
      until.elementLocated(By.css("input[name='password']")),
      10000
    );

    console.log("Finding confirm password input");
    const confirmPasswordInput = await driver.wait(
      until.elementLocated(By.css("input[name='confirmPassword']")),
      10000
    );

    console.log("Finding signup button");
    const signupButton = await driver.wait(
      until.elementLocated(By.css("button[type='submit']")),
      10000
    );

    console.log("Typing first name");
    await firstNameInput.clear();
    await firstNameInput.sendKeys("Selenium");

    console.log("Typing last name");
    await lastNameInput.clear();
    await lastNameInput.sendKeys("Tester");

    console.log("Typing email");
    await emailInput.clear();
    await emailInput.sendKeys(testEmail);

    console.log("Typing password");
    await passwordInput.clear();
    await passwordInput.sendKeys("Password123");

    console.log("Typing confirm password");
    await confirmPasswordInput.clear();
    await confirmPasswordInput.sendKeys("Password123");

    console.log("Finding terms checkbox");
    const termsCheckbox = await driver.wait(
      until.elementLocated(By.css("input[type='checkbox']")),
      10000
    );

    console.log("Accepting terms");
    await driver.executeScript(
      "arguments[0].scrollIntoView({ block: 'center' });",
      termsCheckbox
    );

    await driver.sleep(500);

    const isChecked = await termsCheckbox.isSelected();

    if (!isChecked) {
      await driver.executeScript("arguments[0].click();", termsCheckbox);
    }

    await driver.sleep(500);

    console.log("Clicking signup button");
    await signupButton.click();

    console.log("Waiting 3 seconds after click");
    await driver.sleep(3000);

    console.log("Current URL:");
    console.log(await driver.getCurrentUrl());

    console.log("Current page text:");
    const bodyText = await driver.findElement(By.css("body")).getText();
    console.log(bodyText);

    console.log("Waiting for verification message");

    const verificationMessage = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//*[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), 'email') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), 'verify') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), 'verificer') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), 'bekræft') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), 'tjek')]"
        )
      ),
      15000
    );

    await driver.wait(until.elementIsVisible(verificationMessage), 5000);

    console.log("Signup test passed");
    console.log(`Created test user: ${testEmail}`);
  } catch (error) {
    console.error("Signup Selenium test failed");
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (driver) {
      console.log("Closing browser");
      await driver.quit();
    }
  }
}

await testSignupShowsVerificationMessage();