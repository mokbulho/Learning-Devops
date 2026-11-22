import { test, expect } from "../../fixtures/storefront.fixture";
import { Helper } from "../../utils/helper";

test.describe("OpenCart Cart @master @cart", () => {
  test("add configured product to cart with configured quantity", async ({
    productPage,
    cartPage,
  }) => {
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await productPage.goto();
    await productPage.searchFor(productName);
    await productPage.openResultByExactTitle(productName);
    await productPage.setQuantity(Number(productQuantity));
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.expectItemCount(productName, 1);
    await cartPage.expectLineTotal(productName, totalPrice);
  });

  test("updating quantity in the cart recalculates the line total", async ({
    productPage,
    cartPage,
  }) => {
    const { productName } = Helper.getProductDetails();

    await productPage.goto();
    await productPage.searchFor(productName);
    await productPage.openResultByExactTitle(productName);
    await productPage.addToCart();

    await cartPage.goto();
    const originalTotal = await cartPage
      .rowFor(productName)
      .locator("td.text-right")
      .last()
      .textContent();

    await cartPage.updateQuantity(productName, 2);
    await expect(cartPage.rowFor(productName).locator("td.text-right").last()).not.toHaveText(
      originalTotal ?? ""
    );
  });

  test("removing the product empties the cart", async ({ productPage, cartPage }) => {
    const { productName } = Helper.getProductDetails();

    await productPage.goto();
    await productPage.searchFor(productName);
    await productPage.openResultByExactTitle(productName);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.removeItem(productName);
    await cartPage.expectEmpty();
  });
});
