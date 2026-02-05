<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1X9gpFSaKTHyCIhJEK3PF3m-XfJMs7bBu

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Testing

The project uses [Vitest](https://vitest.dev/) for unit and component testing, along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

### Run Tests

To run the unit/component tests (Vitest) once:
```bash
npm test
```

To run End-to-End tests (Playwright) against the live server:
```bash
npm run test:e2e
```

To open Playwright's UI for interactive E2E testing:
```bash
npx playwright test --ui
```

### Writing Tests
// ...existing code...
- **Component Tests:** Place them alongside the component with a `.test.tsx` extension (e.g., `components/Navbar.test.tsx`).
- **End-to-End Tests:** Place them in the `e2e/` folder with a `.spec.ts` extension.

We use `jsdom` for unit tests and actual browsers via Playwright for E2E tests.
