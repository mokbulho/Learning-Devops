import { test, expect } from "@playwright/test";
import { executeQuery } from "../../utils/dbClient";
import { Helper } from "../../utils/helper";

// Assumes OpenCart's default "oc_" table prefix — adjust if your install
// uses a different DB_PREFIX.
test.describe("OpenCart Database — Product Catalog @master @db", () => {
  test("configured product exists with a valid stored price and stock quantity", async () => {
    const { productName } = Helper.getProductDetails();

    const rows = (await executeQuery(
      `SELECT p.product_id, p.price, p.quantity
       FROM oc_product p
       JOIN oc_product_description pd ON pd.product_id = p.product_id
       WHERE pd.name = ?`,
      [productName]
    )) as Array<{ product_id: number; price: number; quantity: number }>;

    expect(rows.length).toBe(1);
    // oc_product.price is stored ex-tax, while TOTAL_PRICE in .env is the
    // tax-inclusive storefront price, so they aren't directly comparable
    // without the store's tax rules — just assert the stored price is sane.
    expect(Number(rows[0].price)).toBeGreaterThan(0);
    expect(rows[0].quantity).toBeGreaterThanOrEqual(0);
  });
});
