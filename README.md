# Fransico

Fransico is a modern, responsive restaurant website and ordering experience built with **Vite + React**. It features a premium 3D-inspired interface, menu browsing, food deals, dark mode, shopping cart functionality, and WhatsApp-based ordering.

## Features

- Responsive design across mobile, tablet, and desktop
- Premium 3D-inspired UI with modern visual effects
- Light and dark themes
- Restaurant menu with cuisine categories
- Separate food deals and pizza deals
- Menu search
- Shopping cart with quantity controls
- Address-based checkout
- WhatsApp ordering integration
- Accessible and touch-friendly interactions

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- ESLint

## Requirements

- Node.js 18 or newer
- npm

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/maviatahir/fransico.git
```

2. Navigate to the project:

```bash
cd fransico
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local development URL shown in the terminal.

## Smoke Checks

Run the project's smoke validation to catch common SSR and build regressions:

```bash
npm run smoke
```

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server                       |
| `npm run build`   | Create the production build                             |
| `npm run preview` | Preview the production build locally                    |
| `npm run lint`    | Run ESLint                                              |
| `npm run smoke`   | Run the project's smoke checks and catalogue validation |

## Environment Variables

The project currently does not require runtime environment variables for local development or production builds.

If environment variables are introduced in the future, keep local secrets in `.env` / `.env.*` files and never commit sensitive credentials to the repository.

## Project Status

The project is currently a frontend restaurant ordering experience built with React and Vite.

---

Built with React + Vite.
