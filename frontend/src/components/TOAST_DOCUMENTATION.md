# Sonner Toast Implementation Guide

This document explains how Sonner toast notifications have been implemented in the Fildex project.

## Installation

Sonner has already been installed in the project:
```bash
npm install sonner
```

## Setup

The [Toaster](file:///c:/Work/Fildex/frontend/node_modules/sonner/dist/index.d.ts#L47-L53) component has been added to [App.jsx](file:///c:/Work/Fildex/frontend/src/App.jsx):
```jsx
import { Toaster } from 'sonner';

// In your component tree
<Toaster position="top-right" richColors />
```

## Usage

### Basic Toast Types

1. **Success Toast**
```javascript
import { toast } from 'sonner';

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

### Promise Toast

For async operations:
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

## Implementation in Components

Toast notifications have been implemented in the following components:

1. **Login Component** - Shows success/error messages for authentication
2. **Signup Component** - Shows success/error messages for registration
3. **Admin CV Management** - Shows success/error messages for CV operations
4. **Auth Slice** - Shows toast notifications for Redux async operations
5. **Admin Slice** - Shows toast notifications for admin Redux operations

## Customization

The [Toaster](file:///c:/Work/Fildex/frontend/node_modules/sonner/dist/index.d.ts#L47-L53) component in [App.jsx](file:///c:/Work/Fildex/frontend/src/App.jsx) is configured with:
- `position="top-right"` - Toasts appear at the top right of the screen
- `richColors` - Uses rich colors for different toast types

You can customize further by adding props like:
- `duration` - How long the toast stays visible
- `closeButton` - Show close button on toasts
- `theme` - Light or dark theme

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

## Best Practices

1. Use success toasts for completed actions
2. Use error toasts for failed operations
3. Use info toasts for neutral information
4. Use warning toasts for cautionary messages
5. Keep toast messages clear and concise
6. Use promise toasts for async operations