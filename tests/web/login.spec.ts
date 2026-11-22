import path from "node:path";
import { test, expect } from "../../fixtures/storefront.fixture";
import { DataProvider } from "../../utils/DataReader";
import { Helper } from "../../utils/helper";

interface LoginCase {
  testName: string;
  email: string;
  password: string;
  expected: "success" | "failure";
}

const loginCases: LoginCase[] = DataProvider.readJson(
  path.join(__dirname, "../../testdata/opencart_logindata.json")
);

test.describe("OpenCart Login @master @login", () => {
  test("valid login succeeds and lands on the account dashboard", async ({ loginPage }) => {
    // Requires an account matching Helper.getLoginDetails() to already exist
    // on the target storefront — see fixtures/storefront.fixture.ts.
    const { email, password } = Helper.getLoginDetails();
    await loginPage.goto();
    await loginPage.login(email, password);
    await loginPage.expectLoggedIn();
  });

  const negativeCases = loginCases.filter((c) => c.expected === "failure");
  negativeCases.forEach((loginCase, index) => {
    test(`negative login #${index + 1}: ${loginCase.testName} (email="${loginCase.email}", password="${loginCase.password}")`, async ({
      loginPage,
    }) => {
      await loginPage.goto();
      await loginPage.login(loginCase.email, loginCase.password);
      await loginPage.expectLoginError();
      await expect(loginPage.page).toHaveURL(/route=account\/login/);
    });
  });
});
