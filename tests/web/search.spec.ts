import { test } from "../../fixtures/storefront.fixture";
import { Helper } from "../../utils/helper";

test.describe("OpenCart Product Search @master @search", () => {
  test("searching for the configured product returns it in results", async ({ productPage }) => {
    const { productName } = Helper.getProductDetails();
    await productPage.goto();
    await productPage.searchFor(productName);
    await productPage.expectResultTitled(productName);
  });

  test("opening the product from search results shows correct title and price", async ({
    productPage,
  }) => {
    const { productName, totalPrice } = Helper.getProductDetails();
    await productPage.goto();
    await productPage.searchFor(productName);
    await productPage.openResultByExactTitle(productName);
    await productPage.expectTitle(productName);
    await productPage.expectPrice(totalPrice);
  });
});
