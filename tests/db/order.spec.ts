import { test, expect } from "@playwright/test";
import { executeQuery } from "../../utils/dbClient";
import { Helper } from "../../utils/helper";

// Assumes OpenCart's default "oc_" table prefix — adjust if your install
// uses a different DB_PREFIX. Depends on a checkout having been completed
// for this email (e.g. via tests/web/checkout.spec.ts) earlier in the run.
test.describe("OpenCart Database — Order @master @db", () => {
  test("a non-cancelled order exists for the configured customer", async () => {
    const { email } = Helper.getLoginDetails();
    const orders = (await executeQuery(
      "SELECT order_id, email, order_status_id FROM oc_order WHERE email = ? AND order_status_id > 0 ORDER BY order_id DESC LIMIT 1",
      [email]
    )) as Array<{ order_id: number; email: string; order_status_id: number }>;
    expect(orders.length).toBe(1);
    expect(orders[0].order_status_id).toBeGreaterThan(0);
  });

  test("the order line matches the configured product and quantity", async () => {
    const { email } = Helper.getLoginDetails();
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    const orders = (await executeQuery(
      "SELECT order_id FROM oc_order WHERE email = ? AND order_status_id > 0 ORDER BY order_id DESC LIMIT 1",
      [email]
    )) as Array<{ order_id: number }>;
    expect(orders.length).toBe(1);

    const lines = (await executeQuery(
      "SELECT name, quantity, total FROM oc_order_product WHERE order_id = ? AND name = ?",
      [orders[0].order_id, productName]
    )) as Array<{ name: string; quantity: number; total: number }>;
    expect(lines.length).toBe(1);
    expect(lines[0].quantity).toBe(Number(productQuantity));
    expect(Number(lines[0].total)).toBeCloseTo(Helper.convertPriceToNumber(totalPrice), 2);
  });
});
