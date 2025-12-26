# Design Document: UI/UX Enhancement

## Overview

This design document outlines the technical approach for enhancing the NSU Class Scheduler's visual identity and user experience. The enhancement focuses on creating a polished, professional interface through systematic improvements to iconography, typography, color systems, motion design, and component styling—all while preserving existing application logic.

The design follows a component-first approach, establishing design tokens and utility classes that cascade through the application for consistent styling.

## Architecture

### Design Token Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CSS Custom Properties                     │
│  (Design Tokens: colors, spacing, typography, shadows)       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tailwind Utilities                        │
│  (Extended config with custom values from tokens)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Styles                          │
│  (App.css with component-specific enhancements)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  (JSX with Tailwind classes + Lucide icons)                  │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── App.css                    # Enhanced global styles + design tokens
├── components/
│   ├── LandingPage.jsx        # Hero section enhancements
│   ├── LoginPage.jsx          # Form styling improvements
│   ├── Sidebar.jsx            # Navigation polish
│   ├── Header.jsx             # Header refinements
│   ├── Dashboard.jsx          # Card and stat styling
│   ├── ScheduleView.jsx       # Table and badge enhancements
│   ├── CalendarView.jsx       # Calendar grid styling
│   ├── AddClassModal.jsx      # Modal and form polish
│   ├── ReviewsModal.jsx       # Review card styling
│   └── [other modals]         # Consistent modal styling
```

## Components and Interfaces

### 1. Design Token System (App.css)

```css
/* Design Tokens - Root Variables */
:root {
  /* Typography Scale (1.25 ratio) */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.25rem;      /* 20px */
  --font-size-xl: 1.5rem;       /* 24px */
  --font-size-2xl: 2rem;        /* 32px */
  --font-size-3xl: 2.5rem;      /* 40px */
  
  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### 2. Icon Component Standards

All icons follow these specifications:
- **Size**: 16px (small), 20px (default), 24px (large)
- **Stroke Width**: 1.75 (consistent across all icons)
- **Alignment**: Vertically centered with text using `items-center`
- **Spacing**: 8-12px gap between icon and text

```jsx
// Standard icon usage pattern
<Button>
  <IconName className="w-5 h-5" strokeWidth={1.75} />
  <span>Button Text</span>
</Button>
```

### 3. Button Component Variants

```jsx
// Primary Button
className="inline-flex items-center gap-2 px-4 py-2.5 
  bg-slate-900 text-white rounded-lg font-medium text-sm
  hover:bg-slate-800 active:scale-[0.98]
  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
  transition-all duration-200"

// Secondary Button
className="inline-flex items-center gap-2 px-4 py-2.5
  bg-slate-100 text-slate-700 rounded-lg font-medium text-sm
  hover:bg-slate-200 active:scale-[0.98]
  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
  transition-all duration-200"

// Ghost Button
className="inline-flex items-center gap-2 px-4 py-2.5
  text-slate-600 rounded-lg font-medium text-sm
  hover:bg-slate-100 active:bg-slate-200
  focus:outline-none focus:ring-2 focus:ring-slate-400
  transition-all duration-200"
```

### 4. Form Input Standards

```jsx
// Text Input
className="w-full px-4 py-2.5 
  border border-slate-200 rounded-lg text-sm
  placeholder:text-slate-400
  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
  transition-all duration-200"

// Select Dropdown
className="w-full px-4 py-2.5 pr-10
  border border-slate-200 rounded-lg text-sm
  bg-white appearance-none
  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
  transition-all duration-200"

// Error State
className="... border-red-300 focus:ring-red-500
  bg-red-50/50"
```

### 5. Card Component Standards

```jsx
// Base Card
className="rounded-xl border border-slate-200 bg-white
  shadow-sm hover:shadow-md
  transition-shadow duration-200"

// Interactive Card
className="rounded-xl border border-slate-200 bg-white
  shadow-sm hover:shadow-lg hover:border-slate-300
  cursor-pointer
  transition-all duration-200"

// Stat Card
className="rounded-xl border border-slate-200 bg-white p-6
  shadow-sm hover:shadow-md
  transition-all duration-200"
```

### 6. Modal Component Standards

```jsx
// Backdrop
className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm
  transition-opacity duration-300"

// Modal Container
className="fixed inset-0 z-50 flex items-center justify-center p-4"

// Modal Content
className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl
  transform transition-all duration-300
  animate-modal-enter"

// Modal Header
className="px-6 py-4 border-b border-slate-100
  flex items-center justify-between"

// Modal Body
className="px-6 py-5 max-h-[60vh] overflow-y-auto"

// Modal Footer
className="px-6 py-4 border-t border-slate-100
  flex items-center justify-end gap-3"
```

### 7. Status Badge Standards

```jsx
// Available (Green)
className="inline-flex items-center gap-1.5 px-2.5 py-1
  bg-emerald-50 text-emerald-700 border border-emerald-200
  rounded-full text-xs font-semibold"

// Limited (Amber)
className="inline-flex items-center gap-1.5 px-2.5 py-1
  bg-amber-50 text-amber-700 border border-amber-200
  rounded-full text-xs font-semibold"

// Full (Red)
className="inline-flex items-center gap-1.5 px-2.5 py-1
  bg-red-50 text-red-700 border border-red-200
  rounded-full text-xs font-semibold"
```

### 8. Navigation Item Standards

```jsx
// Default State
className="flex items-center gap-3 px-4 py-3
  text-slate-500 rounded-lg
  hover:bg-slate-50 hover:text-slate-900
  transition-colors duration-200"

// Active State
className="flex items-center gap-3 px-4 py-3
  bg-slate-100 text-slate-900 rounded-lg font-medium
  border-l-2 border-slate-900"
```

## Data Models

No data model changes required. This enhancement is purely visual and does not modify any data structures, API contracts, or state management logic.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Icon Consistency

*For any* component using icons, all Lucide React icons SHALL have consistent sizing (w-4, w-5, or w-6 classes) and no emoji characters shall appear in the rendered output.

**Validates: Requirements 1.1, 1.3, 1.5**

### Property 2: Color Contrast Compliance

*For any* text element displayed on a background, the contrast ratio between text color and background color SHALL meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 2.5, 3.3**

### Property 3: Focus State Visibility

*For any* interactive element (button, input, link, select), when the element receives keyboard focus, a visible focus indicator SHALL be displayed with minimum 2px outline or ring.

**Validates: Requirements 4.1, 5.1, 10.2**

### Property 4: Theme Transition Smoothness

*For any* theme or dark mode toggle action, all color transitions SHALL complete within 200-300ms using CSS transitions, with no visual flickering or jarring changes.

**Validates: Requirements 3.4, 4.2**

### Property 5: Modal Animation Consistency

*For any* modal component, opening SHALL trigger a fade-in and scale animation, and closing SHALL trigger the reverse animation, both completing within 300ms.

**Validates: Requirements 4.3, 8.1**

### Property 6: Status Badge Semantic Colors

*For any* status badge indicating availability, the color SHALL match the semantic meaning: green variants for "available", amber variants for "limited/almost full", red variants for "full/unavailable".

**Validates: Requirements 9.2, 10.4**

### Property 7: Touch Target Size

*For any* interactive element on mobile viewports (width < 768px), the minimum touch target size SHALL be 44x44 pixels.

**Validates: Requirements 10.3**

## Error Handling

Since this enhancement is purely visual, error handling focuses on graceful degradation:

1. **Missing Icons**: If a Lucide icon fails to load, the component should render without the icon rather than breaking
2. **CSS Variable Fallbacks**: All CSS custom properties should have fallback values
3. **Animation Failures**: If animations are disabled (prefers-reduced-motion), static states should still be visually clear
4. **Theme Persistence**: If localStorage is unavailable, default to light theme without errors

```css
/* Example fallback pattern */
.button {
  background-color: var(--color-primary, #3b82f6);
  transition: var(--transition-base, 200ms ease-out);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Strategy

### Visual Regression Testing

Since UI/UX changes are primarily visual, testing focuses on:

1. **Manual Visual Inspection**: Review each component in light/dark modes across all themes
2. **Cross-browser Testing**: Verify consistency in Chrome, Firefox, Safari, Edge
3. **Responsive Testing**: Check layouts at 320px, 768px, 1024px, 1440px, 1920px viewports
4. **Accessibility Audit**: Use browser DevTools accessibility panel and axe-core

### Unit Tests (Optional)

Property-based tests can verify:
- Icon components render without emojis
- Color contrast calculations meet WCAG standards
- Focus states are applied to interactive elements

### Integration Tests

- Theme switching persists correctly
- Dark mode toggle works across all components
- Modal open/close animations complete without errors

### Accessibility Testing

- Keyboard navigation works for all interactive elements
- Screen reader announces content correctly
- Focus order is logical
- Color is not the only means of conveying information
