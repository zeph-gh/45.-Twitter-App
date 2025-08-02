# Twitter App

This is a minimal Twitter-like built with React and Vite. It features authentication using Firebase, protected routes, and basic posting functionality.

## Features

- **Authentication**: Users can log in and out using Firebase Auth.
- **Protected Routes**: The `/profile` route is protected and only accessible to authenticated users.
- **Post Creation**: Users can create new posts and upload files.
- **Logout**: Users can log out from the sidebar, which signs them out and redirects to the login page.

## Tech Stack

- React
- Vite
- Firebase
- Redux
- React Bootstrap

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/` - Main source code
- `src/components/` - Reusable components (AuthProvider, RequireAuth, ProfileSidebar, etc.)
- `src/pages/` - Page components (AuthPage, ProfilePage)
- `src/features/` - Redux slices

## Notes

- The app uses a custom `RequireAuth` component to protect routes.
- Authentication state is managed via `AuthProvider`.
- Logout is handled in the sidebar using Firebase Auth and React Router navigation.

---

This project was bootstrapped with Vite and uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) for Fast Refresh.
