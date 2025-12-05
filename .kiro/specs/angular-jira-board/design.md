# Design Document

## Overview

This Angular 10+ application is a lightweight Jira-style task board built as a single-page application (SPA). It contains:

- **Login Page**: Dummy authentication
- **Jira Board Page**: Four workflow columns (To Do, In Progress, Need Review, Completed)

Users can:
- Log in using dummy credentials
- Add tasks using a modal
- Drag and drop tasks between columns
- Optionally persist tasks using LocalStorage

All functionality is client-side only, as required.

## Architecture

### High-Level Structure

```
AppModule
│
├── Auth Module
│   └── LoginComponent
│   └── AuthService
│
└── Board Module
    └── BoardComponent
    └── ColumnComponent
    └── TaskCardComponent
    └── AddTaskModalComponent
    └── TaskService
```

### Modules

**Auth Module**
- Handles login with dummy credentials
- Email: admin@test.com
- Password: admin123
- Redirects to board on success

**Board Module**
- Displays four fixed columns
- Allows adding tasks via modal
- Supports drag-and-drop using Angular CDK
- Optionally saves tasks to LocalStorage

### Routing

```
/login  → LoginComponent
/board  → BoardComponent
**      → Redirect to /login
```

## Components

### 1. LoginComponent

**Responsibilities**:
- Display login form
- Validate email/password fields
- Use AuthService for dummy login
- Redirect to board on success

**Template Elements**:
- Email input
- Password input
- Login button
- Error message display

### 2. BoardComponent

**Responsibilities**:
- Display four fixed columns
- Coordinate drag-and-drop events
- Pass tasks to ColumnComponent
- Open AddTaskModalComponent

### 3. ColumnComponent

**Responsibilities**:
- Render column title
- Show tasks inside the column
- Provide "+" button to add task
- Contain drag-and-drop list (cdkDropList)

### 4. TaskCardComponent

**Responsibilities**:
- Display task title, ID, description
- Be draggable via cdkDrag

### 5. AddTaskModalComponent

**Responsibilities**:
- Form with Title, Task ID, Description, Column selector
- Create new task on submit
- Close modal on cancel

## Data Models

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
}
```

### Column

```typescript
interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
```

### Fixed Columns

```typescript
const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'inprogress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Need Review', tasks: [] },
  { id: 'completed', title: 'Completed', tasks: [] }
];
```

## Services

### AuthService

**Responsibilities**:
- Validates dummy credentials (admin@test.com / admin123)
- Maintains simple boolean authentication state
- No backend required

### TaskService

**Responsibilities**:
- Stores columns and tasks in memory
- Adds new tasks
- Moves tasks between columns
- Optionally saves data to LocalStorage


## Drag & Drop

Implemented using **Angular CDK DragDropModule**

**Capabilities**:
- Moving tasks between columns
- Reordering tasks inside a column

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Invalid credentials are rejected

*For any* email and password combination that does not match the valid credentials (admin@test.com / admin123), the authentication service should return false and not set the authenticated state to true.

**Validates: Requirements 1.3**

### Property 2: All tasks render with complete information

*For any* set of tasks loaded into the board, each rendered task card should display its title, ID, and description fields.

**Validates: Requirements 2.2, 2.3**

### Property 3: Valid task submissions create tasks

*For any* task data with all required fields (title, description, columnId), submitting through the Add Task Modal should result in a new task appearing in the specified column.

**Validates: Requirements 3.3**

### Property 4: Generated task IDs are unique

*For any* sequence of task creations without user-provided IDs, all generated task IDs should be unique across the entire board.

**Validates: Requirements 3.6**

### Property 5: Cross-column moves update task location

*For any* task moved from one column to a different column, the task's columnId property should be updated to match the target column's ID.

**Validates: Requirements 4.3**

### Property 6: Task creation round-trip

*For any* valid task, creating the task and then loading the board from LocalStorage should result in the task appearing with the same title, description, and columnId.

**Validates: Requirements 5.1, 5.3**

## Error Handling

**Invalid Login**:
- Show error message
- Prevent navigation

**Add Task Modal**:
- Require title, id, description
- Show validation errors

**Drag-and-Drop**:
- Revert task to original position if operation fails

## Testing Strategy

The application will employ a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage and correctness.

### Unit Testing

**Framework**: Jasmine + Karma (Angular default)

**Unit Test Coverage**:
- LoginComponent: Form validation, navigation on success
- BoardComponent: Column initialization
- TaskService: Task addition, task movement
- AuthService: Credential validation

### Property-Based Testing

**Framework**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**: Each property-based test will run a minimum of 100 iterations.

Each correctness property must be implemented as a property-based test with a comment tag:

```typescript
// Feature: angular-jira-board, Property {number}: {property_text}
```

**Property Tests to Implement**:

1. **Property 1: Invalid credentials are rejected**
   - Generate random email/password combinations (excluding valid credentials)
   - Verify all return false from login method
   - Tag: `// Feature: angular-jira-board, Property 1: Invalid credentials are rejected`

2. **Property 2: All tasks render with complete information**
   - Generate random sets of tasks
   - Verify rendered output contains title, ID, and description
   - Tag: `// Feature: angular-jira-board, Property 2: All tasks render with complete information`

3. **Property 3: Valid task submissions create tasks**
   - Generate random valid task data
   - Verify task exists in specified column
   - Tag: `// Feature: angular-jira-board, Property 3: Valid task submissions create tasks`

4. **Property 4: Generated task IDs are unique**
   - Create multiple tasks without IDs
   - Verify no duplicate IDs exist
   - Tag: `// Feature: angular-jira-board, Property 4: Generated task IDs are unique`

5. **Property 5: Cross-column moves update task location**
   - Generate random task and target column
   - Move task
   - Verify columnId updated
   - Tag: `// Feature: angular-jira-board, Property 5: Cross-column moves update task location`

6. **Property 6: Task creation round-trip**
   - Generate random valid task
   - Create task and save to LocalStorage
   - Load from LocalStorage
   - Verify task data matches
   - Tag: `// Feature: angular-jira-board, Property 6: Task creation round-trip`


