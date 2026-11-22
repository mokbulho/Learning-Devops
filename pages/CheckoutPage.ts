import { Page, Locator, expect } from "@playwright/test";
import "dotenv/config";

/**
 * Covers the default OpenCart (v3 theme) multi-step checkout.
 * NOTE: as of this writing, the public tutorialsninja.com/demo instance
 * redirects checkout/checkout back to the cart with a stock-availability
 * warning for every product (store-level "stock checkout" setting), so the
 * steps past `isBlockedByStockWarning()` could not be verified against the
 * live site. They follow OpenCart's standard default-theme structure and
 * should work once/if the site (or your own OpenCart instance) allows
 * checkout to proceed — re-verify selectors against your target instance
 * before relying on them in CI.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly stockWarning: Locator;
  readonly guestCheckoutRadio: Locator;
  readonly checkoutOptionsContinueButton: Locator;
  readonly termsAgreeCheckbox: Locator;
  readonly confirmOrderButton: Locator;
  readonly orderSuccessHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stockWarning = page.getByText(
      "Products marked with *** are not available in the desired quantity or not in stock!"
    );
    this.guestCheckoutRadio = page.locator('input[name="account"][value="guest"]');
    this.checkoutOptionsContinueButton = page.locator("#button-account");
    this.termsAgreeCheckbox = page.locator('input[name="agree"]');
    this.confirmOrderButton = page.locator("#button-confirm");
    this.orderSuccessHeading = page.getByRole("heading", { name: "Your order has been placed!" });
  }

  async goto() {
    await this.page.goto(`${process.env.WEB_APP_URL}index.php?route=checkout/checkout`);
  }

  async isBlockedByStockWarning(): Promise<boolean> {
    return this.stockWarning.isVisible();
  }

  async chooseGuestCheckout() {
    await this.guestCheckoutRadio.check();
    await this.checkoutOptionsContinueButton.click();
  }

  async acceptTermsAndConfirm() {
    await this.termsAgreeCheckbox.check();
    await this.confirmOrderButton.click();
  }

  async expectOrderConfirmed() {
    await expect(this.orderSuccessHeading).toBeVisible();
  }
}
