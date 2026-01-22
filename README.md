# 📄 Contract Management Platform

A modern, feature-rich Contract Management Platform built with React and TypeScript that enables users to create reusable contract blueprints, generate contracts, and manage their complete lifecycle from creation to signing.

## 🌐 Live Demo

**[View Live Application](https://contract-management-tan-tau.vercel.app/)**

![Contract Management Platform](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Features

### 🎨 Blueprint Creation
- Create reusable contract templates with configurable fields
- Support for multiple field types: Text, Date, Signature, and Checkbox
- Drag-and-drop field placement on canvas
- Store comprehensive field metadata (type, label, position)

### 📝 Contract Generation
- Generate contracts from existing blueprints
- Inherit all blueprint fields automatically
- Fill and customize contract field values
- Clean, user-friendly form interface

### 🔄 Contract Lifecycle Management
Complete state management following the workflow:
```
Created → Approved → Sent → Signed → Locked
         ↓
      Revoked (from any state)
```

**Lifecycle Rules:**
- ✅ Controlled state transitions (no skipping steps)
- ✅ Clear status indicators and available actions
- ✅ Locked contracts are immutable
- ✅ Revoked contracts cannot proceed further

### 📊 Contract Dashboard
- Comprehensive table view grouped by status
- Display key information:
  - Contract name
  - Associated blueprint
  - Current status
  - Creation date
  - Quick action buttons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/ansarimohammad/contract-management
```

2. **Install dependencies**
```bash
   cd frontend
   npm install
```

3. **Run the application**
```bash
   npm run dev
```

4. **Open in browser**
```
   Navigate to http://localhost:5173
```

## 🛠️ Tech Stack

### Core Technologies
- **React 18.x** - UI library for building component-based interfaces
- **TypeScript 5.x** - Type-safe development and better code maintainability
- **Vite** - Fast build tool and development server

### State Management
- **React Hooks (useState, useEffect)** - Built-in state management for components
- **Local Storage** - Persistent data storage across sessions

### Deployment
- **Vercel** - Cloud platform for static sites and serverless functions

### Development Tools
- **ESLint** - Code linting and quality checks
- **TypeScript Strict Mode** - Enhanced type safety

### State Management Approach
- **Component-Level State**: Using React's useState and useEffect hooks
- **Local Storage Persistence**: Contracts and blueprints persist across sessions
- **Optimistic Updates**: Immediate UI feedback for better UX

## 📋 Assumptions & Limitations

### Assumptions
- No backend integration required (local storage used for persistence)
- Single user environment (no authentication/authorization needed)
- Contracts are managed client-side only
- Browser supports modern JavaScript features and local storage

### Limitations
- **Data Persistence**: Limited to browser local storage (cleared on cache clear)
- **Concurrent Editing**: No real-time collaboration features
- **File Storage**: Signature fields store data URLs (not production-ready for large scale)
- **Validation**: Client-side only (would require backend validation in production)
- **Browser Compatibility**: Optimized for modern browsers

### Future Enhancements
- 💾 Backend integration with database persistence
- 📧 Email notifications for contract status changes
- 📱 Enhanced mobile responsiveness
- 🌙 Dark mode support
- 🔍 Advanced search and sorting capabilities
- 📑 Export contracts to PDF

## 🎯 Key Features Implemented

- ✅ Blueprint CRUD operations
- ✅ Dynamic field type support (Text, Date, Signature, Checkbox)
- ✅ Drag-and-drop field placement
- ✅ Contract generation from blueprints
- ✅ Strict lifecycle state machine
- ✅ Status-based grouping
- ✅ Form validation and error handling
- ✅ Responsive design
- ✅ Local data persistence
- ✅ Clean, maintainable code structure
- ✅ Deployed to Vercel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

**Mohammad Ahmad Ansari**
- GitHub: [@Ansarimohammad](https://github.com/ansarimohammad)
- LinkedIn: [Ansari md](https://linkedin.com/in/ansarimd)

## 🙏 Acknowledgments

- Built as part of frontend development assessment
- Demonstrates modern React and TypeScript best practices

---

**Note**: This is a demonstration project built for educational purposes. Not intended for production use without proper backend integration and security measures.