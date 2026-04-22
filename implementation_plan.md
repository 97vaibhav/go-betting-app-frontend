# Sports Betting Frontend Implementation Plan

## Goal Description
Build a modern, high-performance, and visually appealing React application for the new Sports Betting backend. The interface will feature a premium, dark-themed, glassmorphic aesthetic inspired by Bet365. The tech stack will utilize Vite + React + TypeScript, Vanilla CSS Modules, and Zustand for state management.

## User Review Required
> [!IMPORTANT]
> Please review the chosen dependencies and the proposed module structure below. If everything looks good, please approve this plan so we can move to the `EXECUTION` phase.

## Proposed Changes

### Tech Stack Setup
- **Framework**: React 18 with Vite and TypeScript.
- **Styling**: Vanilla CSS / CSS Modules (Dark theme: dark grays, high-contrast whites, and vibrant green accents for interactive elements).
- **State Management**: Zustand (lightweight and optimal for updating live odds and slip status).
- **Routing**: React Router DOM (v6).
- **Icons**: `lucide-react`.

### Project Structure Strategy
The application will be initialized in `/Users/vaibhavgupta/go-betting-app-frontend`. We will create the following core directories:
- `src/api`: Centralized API client connected securely to the `.env` backend URL (`http://localhost:8080/v1`).
- `src/stores`: Zustand state stores (`useAuthStore`, `useWalletStore`, `useBetSlipStore`).
- `src/components`: Reusable UI elements (`Button`, `Card`, `MatchRow`, `MarketPanel`).
- `src/pages`: Distinct page views (`Home`, `Login`, `Register`, `MatchDetails`, `Wallet`).
- `src/hooks`: Global custom React hooks (like `usePolling`).
- `src/styles`: Application-wide CSS variables for themes, layouts, animations, and transitions.

### Key Workflows
1. **Authentication**: JWT flow. Tokens will be stored in `localStorage` or memory, and injected into API requests.
2. **Browsing Matches**: The Home page will fetch `/v1/odds/events`. We will poll this endpoint on an interval for live updates.
3. **Betting Slip**: When a user clicks an odds block, the Selection object is mapped into the `useBetSlipStore`. The slip calculates the potential payout dynamically. 
4. **Placement**: Form submits to `/v1/betting/place` with an auto-generated UUID as `idempotency_key`. 

## Verification Plan

### Automated Checks
- Static configuration and dependency checks (running Vite build script).
- ESLint and Prettier format verification.
- `tsc --noEmit` command to verify type safety.

### Manual Verification
1. Open the Vite dev server locally.
2. Complete end-to-end user flows in the browser: 
   - Register a new user and login.
   - Deposit simulated funds using the wallet UI.
   - Navigate to a match, add an outcome to the bet slip.
   - Validate bet placement works with the local `http://localhost:8080` backend.
   - Check the wallet balance to confirm the wager was deducted successfully.
3. Ensure UI dynamically adjusts (responsiveness) and maintains the promised futuristic, premium dark-themed aesthetic.
