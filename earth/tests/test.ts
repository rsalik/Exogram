import { expect, test } from "@playwright/test";

test("header title displays correctly", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".header .logo")).toHaveText("Exogram");
});
