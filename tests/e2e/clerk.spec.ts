import { test, expect } from "@playwright/test"
import { setupClerkTestingToken } from "@clerk/testing/playwright"

const randomString = () => Math.random().toString(36).substring(7)
const username = randomString()
const email = `${username}@test.com`
const password = `${randomString()}A1!`

test("Clerk sign-up, sign-in, and sign-out flow", async ({ page }) => {
  await setupClerkTestingToken({ page })
  await page.goto("/")

  // Sign up
  await page.click('a:has-text("Sign Up")')
  await page.waitForURL("**/sign-up**")
  await expect(page.locator("form")).toBeVisible()
  await page.fill('input[name="emailAddress"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForNavigation()

  // Verify signed in
  await expect(page.locator('button[aria-label="User button"]')).toBeVisible()

  // Sign out
  await page.click('button[aria-label="User button"]')
  await page.click('button:has-text("Sign out")')
  await expect(page.locator('a:has-text("Sign In")')).toBeVisible()

  // Sign in
  await page.click('a:has-text("Sign In")')
  await page.waitForURL("**/sign-in**")
  await expect(page.locator("form")).toBeVisible()
  await page.fill('input[name="emailAddress"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForNavigation()

  // Verify signed in
  await expect(page.locator('button[aria-label="User button"]')).toBeVisible()
})
