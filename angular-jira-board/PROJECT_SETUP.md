# Angular Jira Board - Project Setup

## Project Information
- **Angular Version**: 21.0.0
- **Angular CDK**: 21.0.2 (for Drag & Drop functionality)
- **Architecture**: Client-side only (no SSR)

## Routing Configuration
The application has the following routes configured:
- `/login` - Login page (default route)
- `/board` - Jira board page
- All other routes redirect to `/login`

## Project Structure
```
src/app/
├── auth/
│   └── login/          # Login component
├── board/
│   └── board/          # Board component
├── app.ts              # Root component
├── app.routes.ts       # Route configuration
└── app.config.ts       # Application configuration
```

## Available Commands
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Next Steps
The project is ready for implementation of:
1. Login functionality with dummy authentication
2. Board components (columns, task cards)
3. Drag & drop functionality using Angular CDK
4. Task management features
