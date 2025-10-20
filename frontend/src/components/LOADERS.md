# Loader Components Usage Guide

This project uses two different loader components for different purposes:

## 1. Animated Loader (`Loader.jsx`)

**Purpose**: Used only for initial page loads
**Location**: `src/components/Loader.jsx`
**Usage**: Shows the full animated branded loading experience with progress steps
**Minimum Display Time**: 3 seconds

```jsx
import Loader from './components/Loader';

// In App.jsx - AuthInitializer component
if (!isInitialized) {
  return <Loader isLoading={true} />;
}
```

The loader will display for a minimum of 3 seconds to ensure a consistent user experience, even if the authentication process completes faster.

## 2. Simple Spinner (`Spinner.jsx`)

**Purpose**: Used for CRUD operations and other short loading states
**Location**: `src/components/Spinner.jsx`
**Usage**: Shows a simple, lightweight spinner for quick operations

```jsx
import Spinner from './components/Spinner';

// In data fetching components
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <Spinner />
    <p className="text-slate-600 dark:text-slate-400">Loading data...</p>
  </div>
) : (
  // Render actual content
)}
```

## Component Replacement Examples

Components that previously used `Loader2` from `lucide-react` have been updated to use the new `Spinner` component:

- `AdminCvManagement.jsx`
- `AdminJobPostings.jsx`
- `AdminRoleManagement.jsx`

This provides a consistent loading experience throughout the application while maintaining performance by using lightweight spinners for quick operations and the full animated loader only during initial page loads.

## Implementation Details

The minimum 3-second display time is implemented in two places:
1. In the `AuthInitializer` component in `App.jsx`, which ensures the loader is displayed for at least 3 seconds
2. In the `Loader.jsx` component itself, which has additional logic to ensure the minimum display time

This dual approach ensures that the loader is always visible for at least 3 seconds, providing a consistent and professional user experience.