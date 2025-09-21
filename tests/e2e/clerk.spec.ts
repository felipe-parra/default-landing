import { test, expect } from "@playwright/test"

const randomString = () => Math.random().toString(36).substring(7)
const username = randomString()
const email = `${username}@test.com`
const password = `${randomString()}A1!`

test("Clerk sign-up, sign-in, and sign-out flow", async ({ page }) => {
  console.log("Starting test...")
  await page.goto("/")
  console.log("Navigated to homepage.")

  // Sign up
  console.log('Clicking on "Sign Up" link...')
  await page.click('a:has-text("Sign Up")')
  console.log("Waiting for sign-up page...")
  await page.waitForURL("**/sign-up**")
  console.log("Sign-up page loaded.")
  await expect(page.locator("form")).toBeVisible()
  console.log("Filling in sign-up form...")
  await page.fill('input[name="emailAddress"]', email)
  await page.fill('input[name="password"]', password)
  console.log("Submitting sign-up form...")
  await page.click('button[type="submit"]')
  console.log("Waiting for navigation after sign-up...")
  await page.waitForNavigation()
  console.log("Navigation after sign-up complete.")

  // Verify signed in
  console.log("Verifying user is signed in...")
  await expect(page.locator('button[aria-label="User button"]')).toBeVisible()
  console.log("User is signed in.")

  // Sign out
  console.log("Clicking on user button...")
  await page.click('button[aria-label="User button"]')
  console.log('Clicking on "Sign out" button...')
  await page.click('button:has-text("Sign out")')
  console.log("Verifying user is signed out...")
  await expect(page.locator('a:has-text("Sign In")')).toBeVisible()
  console.log("User is signed out.")

  // Sign in
  console.log('Clicking on "Sign In" link...')
  await page.click('a:has-text("Sign In")')
  console.log("Waiting for sign-in page...")
  await page.waitForURL("**/sign-in**")
  console.log("Sign-in page loaded.")
  await expect(page.locator("form")).toBeVisible()
  console.log("Filling in sign-in form...")
  await page.fill('input[name="emailAddress"]', email)
  await page.fill('input[name="password"]', password)
  console.log("Submitting sign-in form...")
  await page.click('button[type="submit"]')
  console.log("Waiting for navigation after sign-in...")
  await page.waitForNavigation()
  console.log("Navigation after sign-in complete.")

  // Verify signed in
  console.log("Verifying user is signed in again...")
  await expect(page.locator('button[aria-label="User button"]')).toBeVisible()
  console.log("User is signed in again.")
  console.log("Test finished.")
})
