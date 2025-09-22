# Default Landing

A modern, full-stack landing page application built with Next.js 15, featuring secure authentication, beautiful UI components, and comprehensive testing.

## ✨ Features

- **⚡ Fast Development** - Built with Next.js 15 and Turbopack for optimal performance
- **🔒 Secure Authentication** - Clerk integration for complete user management
- **🎨 Beautiful Design** - iOS-themed components with Konsta UI and Tailwind CSS
- **📝 Type Safe** - Full TypeScript support with strict configuration
- **🧪 Well Tested** - Unit tests with Vitest and E2E tests with Playwright
- **🌙 Dark Mode** - Built-in theme switching with persistent storage
- **📱 Mobile Ready** - Responsive design with mobile-first approach

## 🚀 Tech Stack

### Core
- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Strict type checking and modern JavaScript features

### Authentication & Security
- **Clerk** - Complete authentication solution with social logins
- **Protected Routes** - Middleware-based route protection

### UI & Styling
- **Konsta UI** - iOS-themed React components
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Comprehensive icon library
- **Zustand** - Lightweight state management for themes

### Testing
- **Vitest** - Fast unit testing framework
- **Playwright** - Reliable E2E testing
- **Testing Library** - Simple and complete testing utilities

### Code Quality
- **ESLint** - Linting with Next.js configuration
- **Prettier** - Code formatting (no semicolons)
- **TypeScript** - Static type checking

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd default-landing
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Clerk keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

4. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build production app with Turbopack |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint (use `--fix` to auto-fix) |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting without changes |
| `pnpm test:unit` | Run unit tests with Vitest |
| `pnpm test:unit:watch` | Run unit tests in watch mode |
| `pnpm test:unit:ui` | Run unit tests with UI |
| `pnpm test:e2e` | Run Playwright E2E tests |

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Auth routes (sign-in, sign-up)
│   ├── dashboard/      # Protected dashboard
│   ├── profile/        # User profile
│   └── useeffect-demo/ # Demo page with examples
├── components/         # Reusable UI components
│   ├── buttons/        # Button components
│   ├── layouts/        # Layout providers
│   └── navbars/        # Navigation components
├── modules/            # Feature-specific components
│   ├── home/          # Homepage components
│   └── profile/       # Profile page components
├── lib/               # Utilities and stores
│   ├── store/         # Zustand stores
│   └── metadata.ts    # Site metadata utilities
├── hooks/             # Custom React hooks
└── config/            # Configuration files
    └── site-metadata.json # Centralized content management
```

## 🔐 Authentication

The application uses Clerk for authentication with the following features:

- **Social Logins** - Google, GitHub, and more
- **Email/Password** - Traditional authentication
- **Protected Routes** - Automatic middleware protection
- **User Management** - Complete user profile management

### Protected Routes
- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/settings` - Application settings
- `/admin` - Administrative features
- `/api/protected` - Protected API routes

## 🎨 Theming

The application supports light and dark themes with:

- **Zustand Store** - Theme state management (`src/lib/store/themeStore.ts`)
- **Local Storage** - Persistent theme preferences
- **Konsta UI Integration** - Automatic theme switching
- **Custom Hook** - `useTheme` for theme utilities

## 🧪 Testing

### Unit Tests
- **Framework**: Vitest with jsdom
- **Location**: `tests/api/`
- **Coverage**: API schema validation and business logic

### E2E Tests
- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Coverage**: Full authentication flow and user interactions

### Running Tests
```bash
# Unit tests
pnpm test:unit

# E2E tests (starts dev server automatically)
pnpm test:e2e

# Watch mode
pnpm test:unit:watch

# UI mode
pnpm test:unit:ui
```

## 📝 Content Management

All site content is centralized in `src/config/site-metadata.json`:

- **Site Information** - Name, description, keywords
- **Navigation** - Header and footer links
- **Page Content** - Homepage, dashboard, auth pages
- **Components** - Button text, form labels, error messages
- **Type Safety** - TypeScript types for all content

Access content using the metadata utilities:
```typescript
import { getSiteMetadata } from '@/lib/metadata'

const siteData = getSiteMetadata()
```

## 🔧 Code Style

- **No Semicolons** - ESLint rule enforced
- **Prettier Formatting** - Consistent code style
- **TypeScript Strict** - Maximum type safety
- **Path Aliases** - `@/*` maps to `./src/*`

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

For other platforms, build the application:
```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the code style
4. Run tests: `pnpm test:unit && pnpm test:e2e`
5. Run linting: `pnpm lint --fix && pnpm format`
6. Commit your changes: `git commit -m 'feat: add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Open a Pull Request

## 📄 License

This project is private and proprietary to Xilo Labs.

## 📞 Support

For support and questions:
- **Email**: contact@defaultlanding.com
- **Website**: https://defaultlanding.com
- **Company**: Xilo Labs

---

Built with ❤️ by [Xilo Labs](https://github.com/xilolabs)