# Toast Notifications Implementation Guide

This guide explains how toast notifications have been implemented in the Fildex project using the Sonner library.

## Overview

Sonner is a toast notification library that provides a simple and elegant way to display notifications in your React application. It has been integrated throughout the Fildex project to provide user feedback for various actions.

## Installation

Sonner has already been installed in the project:
```bash
npm install sonner
```

## Setup

The [Toaster](file:///c:/Work/Fildex/frontend/node_modules/sonner/dist/index.d.ts#L47-L53) component has been added to the root of the application in [App.jsx](file:///c:/Work/Fildex/frontend/src/App.jsx):

```jsx
import { Toaster } from 'sonner';

// In the component tree
<Toaster position="top-right" richColors />
```

Configuration options:
- `position="top-right"` - Toasts appear at the top right of the screen
- `richColors` - Uses rich colors for different toast types

## Usage in Components

### Basic Import

To use toast notifications in any component, import the toast function:

```javascript
import { toast } from 'sonner';
```

### Toast Types

1. **Success Toast**
```javascript
toast.success('Operation completed successfully!');
```

2. **Error Toast**
```javascript
toast.error('An error occurred. Please try again.');
```

3. **Info Toast**
```javascript
toast.info('Here is some information.');
```

4. **Warning Toast**
```javascript
toast.warning('This is a warning message.');
```

### Advanced Usage

1. **Promise Toast** (for async operations)
```javascript
const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

toast.promise(promise, {
  loading: 'Loading...',
  success: (data) => {
    return `${data.name} toast has been added`;
  },
  error: 'Error',
});
```

2. **Action Toast** (with custom actions)
```javascript
toast('Custom action toast', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked'),
  },
});
```

## Implementation in Fildex

Toast notifications have been implemented in the following areas:

### Authentication
- **Login**: Success/error messages in [Login.jsx](file:///c:/Work/Fildex/frontend/src/Client/pages/Login.jsx)
- **Signup**: Success/error messages in [Signup.jsx](file:///c:/Work/Fildex/frontend/src/Client/pages/Signup.jsx)
- **Auth Slices**: Success/error messages in [authSlice.js](file:///c:/Work/Fildex/frontend/src/features/auth/authSlice.js) and [adminSlice.js](file:///c:/Work/Fildex/frontend/src/features/admin/adminSlice.js)

### Admin Panel
- **CV Management**: Success/error messages in [AdminCvManagement.jsx](file:///c:/Work/Fildex/frontend/src/Admin/pages/AdminCvManagement.jsx)

### Redux Integration
Toast notifications are also integrated directly in Redux slices to provide immediate feedback for async operations.

## Best Practices

1. **Use appropriate toast types**:
   - Success: For completed actions
   - Error: For failed operations
   - Info: For neutral information
   - Warning: For cautionary messages

2. **Keep messages clear and concise**:
   - Use action-oriented language
   - Provide specific information about what happened

3. **Use promise toasts for async operations**:
   - Provide immediate feedback during loading
   - Show success or error based on operation result

4. **Position consistently**:
   - All toasts appear in the top-right corner
   - This provides a consistent user experience

## Customization

You can customize the [Toaster](file:///c:/Work/Fildex/frontend/node_modules/sonner/dist/index.d.ts#L47-L53) component with additional props:

```jsx
<Toaster 
  position="top-right"
  richColors
  duration={5000}
  closeButton
/>
```

Available props:
- `duration`: How long the toast stays visible (default: 4000ms)
- `closeButton`: Show close button on toasts
- `theme`: Light or dark theme
- `expand`: Expand toasts when multiple are displayed

## Adding Toasts to New Components

To add toast notifications to a new component:

1. Import the toast function:
```javascript
import { toast } from 'sonner';
```

2. Use the appropriate toast type in your event handlers:
```javascript
const handleClick = () => {
  toast.success('Button clicked!');
};
```

3. For async operations, use promise toasts:
```javascript
const handleAsyncOperation = async () => {
  const promise = asyncOperation();
  
  toast.promise(promise, {
    loading: 'Processing...',
    success: 'Operation completed!',
    error: 'Operation failed!',
  });
};
```

## Troubleshooting

If toasts are not appearing:

1. **Check the Toaster component**: Ensure it's included in [App.jsx](file:///c:/Work/Fildex/frontend/src/App.jsx)
2. **Verify imports**: Make sure you're importing `toast` from 'sonner'
3. **Check console**: Look for any JavaScript errors that might prevent execution

## Additional Resources

- [Sonner Documentation](https://sonner.emilkowal.dev/)
- [GitHub Repository](https://github.com/emilkowalski/sonner)