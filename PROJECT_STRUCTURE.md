# BlogSpace Project Structure

## Overview
This document provides a detailed breakdown of the project structure and explains the purpose of each file and directory.

## Directory Structure

```
blogspace/
│
├── app/                          # Next.js 13 App Router
│   ├── api/                      # API Routes (Backend)
│   │   └── blogs/
│   │       ├── route.ts          # GET all blogs, POST new blog
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE single blog
│   │
│   ├── auth/                     # Authentication Pages
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   │
│   ├── blog/                     # Blog Detail Pages
│   │   └── [id]/
│   │       └── page.tsx          # View single blog post
│   │
│   ├── create/                   # Create Blog Page
│   │   └── page.tsx              # Create new blog form
│   │
│   ├── edit/                     # Edit Blog Pages
│   │   └── [id]/
│   │       └── page.tsx          # Edit existing blog
│   │
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Homepage (blog list)
│   └── globals.css               # Global styles & Tailwind
│
├── components/                   # Reusable React Components
│   ├── ui/                       # ShadCN UI Components
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── ... (other UI components)
│   │
│   ├── BlogCard.tsx              # Blog preview card component
│   ├── BlogForm.tsx              # Blog create/edit form
│   ├── Editor.tsx                # WYSIWYG editor wrapper
│   └── Navbar.tsx                # Navigation bar
│
├── lib/                          # Utility Functions & Config
│   ├── supabase.ts               # Supabase client & types
│   ├── auth.ts                   # Authentication helpers
│   └── utils.ts                  # General utilities
│
├── hooks/                        # Custom React Hooks
│   └── use-toast.ts              # Toast notification hook
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example environment file
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Main documentation
├── SETUP.md                      # Setup instructions
└── PROJECT_STRUCTURE.md          # This file
```

## File Descriptions

### App Directory (`app/`)

#### API Routes (`app/api/blogs/`)
- **route.ts**: Handles GET (fetch all blogs) and POST (create blog) requests
- **[id]/route.ts**: Handles GET (fetch single blog), PUT (update blog), and DELETE (delete blog)

#### Pages
- **page.tsx**: Homepage displaying all blog posts in a grid
- **auth/login/page.tsx**: User login form
- **auth/signup/page.tsx**: User registration form
- **blog/[id]/page.tsx**: Individual blog post view with edit/delete buttons
- **create/page.tsx**: Protected page for creating new blog posts
- **edit/[id]/page.tsx**: Protected page for editing existing blog posts

#### Layout & Styles
- **layout.tsx**: Root layout with Inter font and metadata
- **globals.css**: Global styles, Tailwind directives, and custom CSS

### Components (`components/`)

#### UI Components (`components/ui/`)
Pre-built accessible components from ShadCN UI:
- Form elements (Button, Input, Label)
- Layout components (Card, Dialog, Sheet)
- Feedback components (Alert, Toast)
- Navigation (Dropdown Menu, Navigation Menu)

#### Custom Components
- **BlogCard.tsx**: Displays blog preview with title, excerpt, author, and date
- **BlogForm.tsx**: Unified form for creating and editing blogs
- **Editor.tsx**: React Quill WYSIWYG editor with custom toolbar
- **Navbar.tsx**: Top navigation with auth state management

### Library (`lib/`)

- **supabase.ts**:
  - Supabase client initialization
  - TypeScript types for Blog entity

- **auth.ts**:
  - signUp(): Create new user account
  - signIn(): Authenticate existing user
  - signOut(): Log out current user
  - getCurrentUser(): Get current authenticated user
  - getSession(): Get current session

- **utils.ts**:
  - cn(): Tailwind class name merger

### Configuration Files

- **next.config.js**: Next.js settings (ESLint, images)
- **tailwind.config.ts**: Tailwind theme customization
- **tsconfig.json**: TypeScript compiler options
- **components.json**: ShadCN UI configuration
- **postcss.config.js**: PostCSS plugins

## Key Features by File

### Authentication Flow
1. User visits `/auth/signup` → creates account via Supabase Auth
2. User visits `/auth/login` → signs in with credentials
3. `Navbar.tsx` manages auth state and displays user info
4. Protected routes check authentication before rendering

### Blog CRUD Operations
1. **Create**: `/create` → `BlogForm` → API POST `/api/blogs`
2. **Read**: `/` → fetches all blogs → displays with `BlogCard`
3. **Update**: `/edit/[id]` → `BlogForm` → API PUT `/api/blogs/[id]`
4. **Delete**: `/blog/[id]` → API DELETE `/api/blogs/[id]`

### Data Flow
```
User Action → Component → API Route → Supabase → Database
         ↑                                            ↓
         ←────────────────────────────────────────────
```

## Technologies Used

| Technology | Purpose |
|-----------|---------|
| Next.js 13 | Full-stack React framework |
| TypeScript | Type-safe code |
| Tailwind CSS | Utility-first styling |
| ShadCN UI | Accessible component library |
| React Quill | Rich text editor |
| Supabase | Backend & Database |
| date-fns | Date formatting |
| Lucide React | Icon library |

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Check TypeScript types
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

See migration in SETUP.md or Supabase dashboard:
- Table: `blogs`
- RLS Policies: Read (public), Write (authenticated)
- Indexes: author_id, created_at

## Security Features

1. **Row-Level Security (RLS)**: Database-level access control
2. **Authentication Guards**: Client-side route protection
3. **API Validation**: Server-side request validation
4. **Type Safety**: TypeScript prevents runtime errors

## Best Practices Implemented

- ✅ Component modularity and reusability
- ✅ TypeScript for type safety
- ✅ Responsive design patterns
- ✅ Accessibility with ShadCN UI
- ✅ SEO optimization with metadata
- ✅ Loading states and error handling
- ✅ Clean code organization
- ✅ Comprehensive documentation

## Future Enhancements

Areas for extension:
- Add server-side rendering (SSR) for blog posts
- Implement image upload to Supabase Storage
- Add search and filtering
- Include categories and tags
- Add user profiles
- Implement comments system
- Add social sharing
- Include analytics

---

For setup instructions, see SETUP.md
For feature details, see README.md
