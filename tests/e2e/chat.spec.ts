import { test, expect } from '@playwright/test';

test('Chat page should load and display messages', async ({ page }) => {
  await page.goto('/chat');

  // Check if the Navbar with the title "Messages" is visible
  await expect(page.getByTestId('chat-navbar')).toBeVisible();

  // Check if there are any messages in the chat
  const messages = await page.locator('.k-message').count();
  expect(messages).toBeGreaterThan(0);
});
