# Buyer Lead Intake App

A comprehensive buyer lead management system built with Next.js, TypeScript, and SQLite.

## Features

- **Lead Management**: Create, view, edit, and delete buyer leads
- **Advanced Filtering**: Filter by city, property type, status, and timeline
- **Search**: Real-time search by name, phone, or email
- **CSV Import/Export**: Bulk import leads and export filtered results
- **History Tracking**: Track all changes to leads with audit trail
- **Ownership Control**: Users can only edit their own leads
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Client and server-side validation with Zod

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Validation**: Zod schemas
- **Authentication**: Simple session-based auth (demo)
- **Testing**: Jest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The app uses SQLite with Drizzle ORM. The database file will be created automatically at `./local.db`.

#### Available Database Commands:

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Data Model

### Buyers Table
- `id` (UUID) - Primary key
- `fullName` (string, 2-80 chars) - Required
- `email` (string, optional) - Valid email format
- `phone` (string, 10-15 digits) - Required
- `city` (enum) - Chandigarh, Mohali, Zirakpur, Panchkula, Other
- `propertyType` (enum) - Apartment, Villa, Plot, Office, Retail
- `bhk` (enum) - 1, 2, 3, 4, Studio (required for Apartment/Villa)
- `purpose` (enum) - Buy, Rent
- `budgetMin` (integer, optional) - Minimum budget in INR
- `budgetMax` (integer, optional) - Maximum budget in INR
- `timeline` (enum) - 0-3m, 3-6m, >6m, Exploring
- `source` (enum) - Website, Referral, Walk-in, Call, Other
- `status` (enum) - New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped
- `notes` (text, optional, max 1000 chars)
- `tags` (JSON array, optional)
- `ownerId` (string) - User who created the lead
- `updatedAt` (timestamp)

### Buyer History Table
- `id` (UUID) - Primary key
- `buyerId` (UUID) - Foreign key to buyers
- `changedBy` (string) - User who made the change
- `changedAt` (timestamp)
- `diff` (JSON) - Details of what changed

## Pages & Features

### 1. Login (`/login`)
- Simple demo authentication
- Enter any email and name to login

### 2. Buyers List (`/buyers`)
- Paginated list of all buyer leads
- Real-time search with debouncing
- Advanced filtering by multiple criteria
- Sortable columns
- CSV export functionality
- CSV import with validation

### 3. Create Lead (`/buyers/new`)
- Comprehensive form with validation
- Conditional fields (BHK for residential properties)
- Budget validation (max >= min)
- Tag support

### 4. View/Edit Lead (`/buyers/[id]`)
- Detailed view of lead information
- Edit functionality with concurrency control
- Change history display
- Ownership-based access control

## Validation & Safety

### Client-Side Validation
- Real-time form validation using Zod schemas
- Conditional field requirements
- Budget constraint validation
- Phone number format validation

### Server-Side Validation
- All form submissions validated with Zod
- Database constraints enforced
- Ownership checks for edit/delete operations
- Concurrency control with optimistic locking

### Security Features
- Session-based authentication
- Ownership-based access control
- Input sanitization and validation
- SQL injection protection via ORM

## CSV Import/Export

### Import
- Supports CSV files with headers
- Validates each row individually
- Shows detailed error messages for invalid rows
- Transactional import (all or nothing)
- Maximum 200 rows per import

### Export
- Exports current filtered results
- Includes all lead data
- Timestamped filename
- Respects current search and filter state

## Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage
- Validation schema tests
- Form validation logic
- Budget constraint validation
- CSV import validation

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```bash
DATABASE_URL="libsql://your-production-database-url"
```

## Design Decisions

### Database Choice
- **SQLite**: Chosen for simplicity and local development
- **Drizzle ORM**: Type-safe database operations with excellent TypeScript support
- **Migrations**: Proper schema versioning and deployment

### Authentication
- **Simple Session Auth**: Demo implementation for assignment requirements
- **Production Ready**: Easy to replace with NextAuth.js or similar

### Validation Strategy
- **Zod Schemas**: Shared validation between client and server
- **Form Libraries**: React Hook Form for better UX
- **Error Handling**: Comprehensive error messages and validation

### State Management
- **Server Components**: Leveraging Next.js App Router for SSR
- **URL State**: Filters and search synced with URL for bookmarking
- **Optimistic Updates**: Immediate UI feedback with rollback on errors

## What's Implemented vs. Requirements

### ✅ Fully Implemented
- Complete CRUD operations for buyer leads
- Advanced filtering and search with URL sync
- Real pagination with server-side rendering
- CSV import/export with validation
- Ownership-based access control
- Change history tracking
- Form validation (client + server)
- Responsive design
- Unit tests for validation
- Error boundaries and empty states
- Accessibility basics

### 🔄 Nice-to-Haves Implemented
- Tag chips with comma-separated input
- Status quick-actions in table
- Basic full-text search
- Optimistic edit with rollback
- File upload capability (ready for attachmentUrl)

### 📋 Additional Features
- Comprehensive error handling
- Loading states and feedback
- Mobile-responsive design
- Database migrations
- Development tooling (Drizzle Studio)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.