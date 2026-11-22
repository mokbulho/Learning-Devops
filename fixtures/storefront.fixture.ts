import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { Helper } from "../utils/helper";

type StorefrontFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
};

/**
 * `authenticatedPage` assumes an account matching APP_EMAIL/APP_PASSWORD
 * already exists on the target storefront. This framework does not
 * provision that account automatically — create it once manually (or point
 * .env at an instance where it already exists) before running tests that
 * depend on this fixture.
 */
export const test = base.extend<StorefrontFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  authenticatedPage: async ({ page }, use) => {
    const { email, password } = Helper.getLoginDetails();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await use(page);
  },
});

export { expect } from "@playwright/test";
