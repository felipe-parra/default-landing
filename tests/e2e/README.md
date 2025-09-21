# E2E Tests

This directory contains the end-to-end tests for the application, written using [Playwright](https://playwright.dev/).

## Prerequisites

Before running the tests, you need to have the following installed:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

You also need to set up the environment variables for Clerk. Copy the `.env.local.example` file to `.env.local` and fill in the values for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.

## Running the tests

To run the tests, use the following command:

```bash
pnpm test:e2e
```

This will start the development server and run the Playwright tests.

## Tests

### `clerk.spec.ts`

This test file covers the user authentication flow, including:

- Sign up
- Sign in
- Sign out
