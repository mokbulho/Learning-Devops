import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../fixtures/storefront.fixture";
import { Helper } from "../../utils/helper";

test.describe("OpenCart Accessibility @master @a11y", () => {
  test("login page has no serious or critical violations", async ({ loginPage, page }) => {
    await loginPage.goto();
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrWorse = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? "")
    );
    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });

  test("product listing page has no serious or critical violations", async ({
    productPage,
    page,
  }) => {
    const { productName } = Helper.getProductDetails();
    await productPage.goto();
    await productPage.searchFor(productName);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrWorse = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? "")
    );
    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });
});
