import { test, expect } from "@playwright/test";
import { executeQuery } from "../../utils/dbClient";
import { Helper } from "../../utils/helper";

// Assumes OpenCart's default "oc_" table prefix — adjust if your install
// uses a different DB_PREFIX.
test.describe("OpenCart Database — Customer @master @db", () => {
  test("registered customer exists and is enabled", async () => {
    const { email } = Helper.getLoginDetails();
    const rows = (await executeQuery(
      "SELECT customer_id, email, status FROM oc_customer WHERE email = ?",
      [email]
    )) as Array<{ customer_id: number; email: string; status: number }>;
    expect(rows.length).toBe(1);
    expect(rows[0].email.trim()).toBe(email);
    expect(rows[0].status).toBe(1);
  });
});
