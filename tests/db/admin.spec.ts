import { test, expect } from "@playwright/test";
import { executeQuery } from "../../utils/dbClient";

// Assumes OpenCart's default "oc_" table prefix — adjust if your install
// uses a different DB_PREFIX.
test.describe("OpenCart Database — Admin @master @db", () => {
  test("configured admin account exists and is active", async () => {
    const rows = (await executeQuery(
      "SELECT user_id, username, status FROM oc_user WHERE username = ?",
      [process.env.ADMIN_USERNAME]
    )) as Array<{ user_id: number; username: string; status: number }>;

    expect(rows.length).toBe(1);
    expect(rows[0].status).toBe(1);
  });
});
