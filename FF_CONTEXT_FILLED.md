# FibreFlow (FF) - Project Context (Auto-Populated)

## Basic Info
- **Project Name**: FibreFlow
- **Code Name**: FF
- **Location**: /home/louisdup/VF/Apps/FF_React
- **Type**: Web application (fiber network project management)
- **Client/Internal**: VelocityFibre (proprietary)
- **Status**: Active development - Angular → React/Next.js migration

## Tech Stack
- **Framework**: Next.js 14.2.18
- **Frontend**: React 18, TypeScript
- **UI**: Material-UI (MUI) + TailwindCSS
- **Database**: Neon PostgreSQL (@neondatabase/serverless)
- **Auth**: Clerk (@clerk/nextjs)
- **State Management**: Zustand
- **Real-time**: Socket.io
- **Testing**: Vitest (unit), Playwright (e2e)
- **Build**: Next.js with Turbo option
- **Deployment**: Vercel

## Purpose/Goal
Fiber network project management system for:
- Project tracking and management
- SOW (Statement of Work) data import
- Fiber stringing operations
- Contractor management
- Network segment tracking (poles, drops, fiber)

## Current Phase
✅ Migrated from Angular to React/Next.js
- Core functionality ported
- Database connected (Neon PostgreSQL)
- Auth integrated (Clerk)
- SOW import working (~260 segments/sec)

## Key Areas/Modules
1. **SOW Management** - Statement of Work data import/viewing
2. **Fiber Stringing** - Dashboard for fiber operations
3. **Project Management** - Project CRUD operations
4. **Contractor System** - Contractor tracking
5. **Database Layer** - Neon PostgreSQL with migrations
6. **Real-time Updates** - Socket.io integration
7. **Excel Import/Export** - Data handling with ExcelJS
8. **Authentication** - Clerk integration

## Known Issues
### Critical
- **Watchpack Bug**: `npm run dev` fails due to nested package.json files
  - **Workaround**: Always use production mode:
    ```
    npm run build
    PORT=3005 npm start
    ```

### Code Changes Workflow
1. Make changes
2. Stop server (Ctrl+C)
3. Rebuild: `npm run build`
4. Restart: `PORT=3005 npm start`

## Key Scripts
```bash
# Development (production mode)
npm run build && PORT=3005 npm start

# Database
npm run db:migrate
npm run db:seed
npm run db:validate

# SOW Import
node scripts/sow-import/import-fibre-louissep15.cjs
node scripts/sow-import/verify-fibre-louissep15.cjs

# Testing
npm test              # Vitest
npm run test:e2e      # Playwright
npm run type-check    # TypeScript
```

## Project Structure
```
src/
├── app/              # Next.js app router
├── components/       # Reusable React components
├── pages/            # Next.js pages
├── modules/          # Feature modules
├── services/         # API services
├── store/            # Zustand state
├── hooks/            # Custom React hooks
├── utils/            # Utilities
├── types/            # TypeScript types
└── lib/              # Libraries

scripts/              # Utility scripts
├── sow-import/       # SOW data import scripts
├── migrations/       # DB migrations
└── setupNeonDatabase.ts
```

## Key Decisions Made
1. **Migration to React**: Modernize from Angular
2. **Next.js**: SSR + API routes in one framework
3. **Neon PostgreSQL**: Serverless Postgres
4. **Clerk**: Modern auth solution
5. **MUI + Tailwind**: Component library + utility CSS
6. **Zustand**: Lightweight state management
7. **Production mode for dev**: Work around Watchpack bug

## Access Points
- **Local Dev**: http://localhost:3005
- **SOW Dashboard**: /sow
- **Fiber Stringing**: /fiber-stringing
- **API**: /api/sow/fibre?projectId={PROJECT_ID}

## Import Performance
- **SOW Data**: ~260 segments/second using batch processing
- **Libraries**: pg (PostgreSQL), ExcelJS, PapaParse

## Timeline
- **Migration Started**: ~Aug-Sep 2024
- **Current Status**: Core features working, ongoing development
- **Active Work**: Feature additions, bug fixes, optimization

## Documentation
- **CLAUDE.md**: Detailed AI context
- **README.md**: Quick start guide
- **docs/**: Additional documentation
- **SOW/docs/importlog.md**: Import history

---

**Agent configured with this context on**: Oct 23, 2025
**Next**: Use `fibreflowAgent` in playground to track FF work
