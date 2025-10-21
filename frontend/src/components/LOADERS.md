# Loader Components Usage Guide

This project uses a simple spinner component for loading states:

## Simple Spinner (`Spinner.jsx`)

**Purpose**: Used for all loading states in the application
**Location**: `src/components/Spinner.jsx`
**Usage**: Shows a simple, lightweight spinner for loading operations

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

## Component Usage Examples

Components that use the `Spinner` component:

- `AdminCvManagement.jsx`
- `AdminJobPostings.jsx`
- `AdminRoleManagement.jsx`
- `AdminJobTitles.jsx`

This provides a consistent loading experience throughout the application with a lightweight spinner for all loading operations.