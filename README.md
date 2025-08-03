# TaskFlow Frontend

A modern, responsive task management application built with React, TypeScript, Tailwind CSS and Framer Motion.

## 🚀 Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Framer Motion** - Production-ready motion library for React
- **ESLint & Prettier** - Code linting and formatting

## 📋 Features

- ✅ Create, edit, and delete tasks
- 🏷️ Organize tasks with categories and priorities
- 🎨 Smooth animations and transitions
- 🔍 Search and filter functionality
- 📊 Task progress tracking
- 🌙 Members management
- 📱 Admin template management

## 🛠️ Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 19.1 or higher)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nokfur/task-flow-fe.git
cd taskflow-fe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables in `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=TaskFlow
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## 🔧 Configuration

### Vite Configuration
The `vite.config.ts` file includes:
- TypeScript support
- Path aliases (`@/` for src directory)
- Development server proxy
- Build optimization

### TypeScript Configuration
Strict TypeScript setup with:
- Path mapping
- Strict type checking
- Modern ES features
- React JSX support

## 🌐 API Integration

The frontend communicates with the .NET 8 backend API:

### Base Configuration
```typescript
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
```

### Authentication
- JWT tokens stored in local storage
- Protected route handling

### Error Handling
- Global error boundary
- API error interceptors
- User-friendly error messages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🆘 Troubleshooting

### Common Issues

**Development server won't start:**
- Check if port 5173 is available
- Clear node_modules and reinstall
- Check Node.js version compatibility

**Build fails:**
- Run `npm run type-check` to identify TypeScript errors
- Check for missing dependencies
- Clear Vite cache: `rm -rf node_modules/.vite`

**Styling issues:**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS
