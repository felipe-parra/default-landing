# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production app with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (use `--fix` to auto-fix issues)
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check formatting without making changes
- `pnpm test:unit` - Run unit tests with Vitest
- `pnpm test:unit:watch` - Run unit tests in watch mode
- `pnpm test:unit:ui` - Run unit tests with UI
- `pnpm test:e2e` - Run Playwright end-to-end tests

## Code Style & Formatting

- **No semicolons**: ESLint rule `semi: ["error", "never"]` is enforced
- **Prettier**: Used for formatting with `semi: false` configuration
- **Format on save**: VS Code configured to use Prettier as default formatter
- ESLint and Prettier work together via `eslint-config-prettier`

## Architecture Overview

### Next.js App Router Structure
- Uses Next.js 15 with App Router and Turbopack
- TypeScript with strict mode enabled
- Path alias `@/*` maps to `./src/*`

### Authentication (Clerk)
- **ClerkProvider**: Wraps entire app in `src/app/layout.tsx`
- **Middleware**: `src/middleware.ts` protects routes: `/dashboard`, `/profile`, `/settings`, `/admin`, `/api/protected`
- **Auth Layout**: Separate layout for auth pages in `src/app/(auth)/layout.tsx`
- Auth routes use Clerk's built-in components

### UI Framework (Konsta UI)
- iOS-themed components built on Tailwind CSS
- **LayoutProvider**: Global layout wrapper in `src/components/layouts/LayoutProvider.tsx`
- **App Component**: Konsta's main wrapper with iOS theme and dark mode support
- **Navigation**: Navbar with sidebar panel for mobile-like experience

### State Management
- **Zustand**: Used for theme management (`src/lib/store/themeStore.ts`)
- **Persistence**: Theme state persisted to localStorage
- **Theme Hook**: `src/hooks/useTheme.ts` provides theme utilities

### Content Management
- **Centralized Config**: All site content in `src/config/site-metadata.json`
- **Metadata Functions**: `src/lib/metadata.ts` provides typed access to content
- **Type Safety**: TypeScript types generated from config structure

### Component Organization
```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Auth routes (sign-in, sign-up)
│   ├── dashboard/      # Protected dashboard
│   └── profile/        # User profile
├── components/         # Reusable UI components
│   ├── buttons/        # Button components
│   ├── layouts/        # Layout providers
│   └── navbars/        # Navigation components
├── modules/            # Feature-specific components
│   ├── home/          # Homepage components
│   └── profile/       # Profile page components
├── lib/               # Utilities and stores
├── hooks/             # Custom React hooks
└── config/            # Configuration files
```

### Testing Setup
- **Vitest**: Unit testing framework with TypeScript support
- **Playwright**: E2E testing configured for Chromium
- **Unit Tests**: `tests/api/` for API schema validation and business logic testing
- **E2E Tests**: `tests/e2e/` for end-to-end testing
- **Test Environment**: jsdom for React component testing
- **Working Tests**: Schema validation tests pass and validate all API examples
- **Dev Server**: Automatically starts for Playwright tests on `localhost:3000`
- **Clerk Integration**: Full auth flow testing with sign-up/sign-in/sign-out

### Key Patterns

1. **Module-based Components**: Feature components in `src/modules/` with sub-components in dedicated folders
2. **Centralized Content**: All text content, navigation, and metadata in JSON config
3. **Theme Integration**: Konsta UI automatically responds to Zustand theme store
4. **Protected Routes**: Middleware handles authentication for specific route patterns
5. **Type Safety**: Full TypeScript coverage with strict configuration

### Environment Variables
Ensure Clerk environment variables are configured:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Important Notes

- Uses Turbopack for both development and build for improved performance
- No semicolons allowed - automatic formatting will remove them
- Dark theme is default (`theme: "dark"` in theme store)
- All route protection handled in middleware, not individual pages
- Site metadata should be updated in `src/config/site-metadata.json` rather than hardcoded