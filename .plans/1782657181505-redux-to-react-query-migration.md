# Redux to React Query Migration Plan

## Goal
Replace Redux + RTK Query with React Query (TanStack Query) for server state management.

## Current State
- **RTK Query**: API interactions with tag-based caching
- **Redux Slices**: auth, projects, services, etc.
- **Dependencies**: @reduxjs/toolkit, react-redux, redux-logger

## Migration Strategy

### Phase 1: Setup
1. Install: `npm install @tanstack/react-query`
2. Create `queryClient` with auth header injection
3. Create `QueryProvider` component
4. Update `main.jsx`

### Phase 2: Auth Migration
1. Create `useAuth()`, `useLogin()`, `useLogout()` hooks
2. Handle token persistence in localStorage
3. Remove `authSlice` and `authApi`

### Phase 3: API Migration
Migrate each API module:
- `projectsApi.js` → `react-query/projectsQuery.js`
- `servicesApi.js` → `react-query/servicesQuery.js`
- etc.

### Phase 4: Component Updates
1. Replace `useSelector` with hook calls
2. Replace `useDispatch` with mutation calls
3. Update `useXhrUpload`

### Phase 5: Cleanup
1. Remove Redux dependencies
2. Remove `redux/` directory

## Validation
1. Build succeeds
2. All pages load data
3. Auth works
4. CRUD operations work
5. No console errors
