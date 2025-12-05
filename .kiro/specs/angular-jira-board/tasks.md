# Implementation Plan

- [x] 1. Set up Angular project
  - Create a new Angular 10+ project using Angular CLI
  - Install Angular CDK (for Drag & Drop)
  - Set up routing for /login and /board
  - Ensure project is fully client-side (no backend)
  - _Requirements: 6.1, 6.2, 8.1_

- [x] 2. Create Data Models and Interfaces





  - Define Task interface: id, title, description, columnId
  - Define Column interface: id, title, tasks[]
  - Create models file in shared location
  - _Requirements: 2.1, 3.3_


- [x] 3. Implement AuthService



- [x] 3.1 Create AuthService with authentication logic















  - Implement login method that validates dummy credentials (admin@test.com / admin123)
  - Maintain authentication state using signal or BehaviorSubject
  - Provide isAuthenticated() method
  - _Requirements: 1.2, 1.3, 1.5_



- [x] 3.2 Write property test for invalid credentials




  - **Property 1: Invalid credentials are rejected**
  - **Validates: Requirements 1.3**
  - Generate random email/password combinations (excluding valid credentials)

  - Verify all return false from login method
  - Configure to run minimum 100 iterations






- [x] 4. Implement Login Page





- [x] 4.1 Build LoginComponent with form and validation



  - Import ReactiveFormsModule or FormsModule
  - Add form fields: Email and Password with validation
  - Inject AuthService and Router
  - On valid credentials → navigate to /board
  - On invalid credentials → display error message
  - Handle empty field validation
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4.2 Style LoginComponent


  - Center login form on page
  - Apply clean, professional styling
  - Add visual feedback for validation errors
  - _Requirements: 7.1, 7.4_

- [ ]* 4.3 Write unit tests for LoginComponent
  - Test form validation
  - Test successful login navigation
  - Test error message display
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 5. Implement TaskService
- [ ] 5.1 Create TaskService with core task management
  - Initialize 4 fixed columns: To Do, In Progress, Need Review, Completed
  - Implement getColumns() method
  - Implement addTask() method to add new task to selected column
  - Implement moveTask() method to move tasks between columns
  - Implement generateTaskId() method for unique ID generation
  - Use signals or BehaviorSubject for reactive state
  - _Requirements: 2.1, 3.3, 3.6, 4.3_

- [ ] 5.2 Add LocalStorage persistence to TaskService
  - Implement saveToLocalStorage() method
  - Implement loadFromLocalStorage() method
  - Call save after addTask() and moveTask()
  - Load data on service initialization
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 5.3 Write property test for valid task submissions
  - **Property 3: Valid task submissions create tasks**
  - **Validates: Requirements 3.3**
  - Generate random valid task data
  - Verify task exists in specified column after creation
  - Configure to run minimum 100 iterations

- [ ]* 5.4 Write property test for unique task IDs
  - **Property 4: Generated task IDs are unique**
  - **Validates: Requirements 3.6**
  - Create multiple tasks without user-provided IDs
  - Verify no duplicate IDs exist across all columns
  - Configure to run minimum 100 iterations

- [ ]* 5.5 Write property test for cross-column moves
  - **Property 5: Cross-column moves update task location**
  - **Validates: Requirements 4.3**
  - Generate random task and target column
  - Move task between columns
  - Verify task's columnId is updated correctly
  - Configure to run minimum 100 iterations

- [ ]* 5.6 Write property test for LocalStorage round-trip
  - **Property 6: Task creation round-trip**
  - **Validates: Requirements 5.1, 5.3**
  - Generate random valid task
  - Create task and save to LocalStorage
  - Load from LocalStorage
  - Verify task data matches original
  - Configure to run minimum 100 iterations

- [ ]* 5.7 Write unit tests for TaskService
  - Test addTask() functionality
  - Test moveTask() functionality
  - Test LocalStorage save/load
  - _Requirements: 2.1, 3.3, 4.3, 5.1, 5.2_

- [ ] 6. Create TaskCardComponent
- [ ] 6.1 Implement TaskCardComponent
  - Accept task as @Input
  - Display Task ID, Title, and Description
  - Add cdkDrag directive to make card draggable
  - Import DragDropModule
  - _Requirements: 2.3, 4.1_

- [ ] 6.2 Style TaskCardComponent
  - Create card-style UI with borders and padding
  - Add hover effects
  - Style for readability
  - _Requirements: 7.3, 7.4_

- [ ]* 6.3 Write property test for task rendering
  - **Property 2: All tasks render with complete information**
  - **Validates: Requirements 2.2, 2.3**
  - Generate random sets of tasks
  - Render tasks and verify output contains title, ID, and description
  - Configure to run minimum 100 iterations

- [ ] 7. Create ColumnComponent
- [ ] 7.1 Implement ColumnComponent
  - Accept column as @Input
  - Display column title
  - Add cdkDropList directive for drop zone
  - Render TaskCardComponent for each task
  - Add "+" button to trigger task creation
  - Emit event when "+" is clicked
  - _Requirements: 2.1, 2.4, 3.1_

- [ ] 7.2 Style ColumnComponent
  - Create vertical column layout
  - Add visual separation between columns
  - Style "+" button
  - Add empty state indicator
  - _Requirements: 7.2, 7.4_

- [ ] 8. Create AddTaskModalComponent
- [ ] 8.1 Implement AddTaskModalComponent
  - Create modal dialog structure
  - Add form inputs: Task Title, Task ID (optional), Description, Column selector
  - Implement form validation for required fields
  - Emit task data on submit
  - Close modal on cancel
  - Inject TaskService to create task
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 8.2 Style AddTaskModalComponent
  - Create modal overlay and dialog
  - Style form inputs
  - Add submit and cancel buttons
  - Display validation errors
  - _Requirements: 7.4_

- [ ]* 8.3 Write unit tests for AddTaskModalComponent
  - Test form validation
  - Test task creation on submit
  - Test modal close on cancel
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Implement BoardComponent with Drag-and-Drop
- [ ] 9.1 Build BoardComponent layout and functionality
  - Inject TaskService
  - Load columns from TaskService
  - Display ColumnComponent for each column
  - Add cdkDropListGroup to coordinate drag-and-drop
  - Implement drop event handler to call TaskService.moveTask()
  - Handle opening AddTaskModalComponent
  - Pass selected column to modal
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 9.2 Style BoardComponent
  - Create horizontal layout for columns
  - Make layout responsive
  - Add drag-over visual feedback
  - Ensure proper spacing
  - _Requirements: 7.2, 7.3, 7.5_

- [ ]* 9.3 Write unit tests for BoardComponent
  - Test column initialization
  - Test drag-and-drop event handling
  - Test modal opening
  - _Requirements: 2.1, 2.2, 4.3_

- [ ] 10. Add Route Guards and Navigation
- [ ] 10.1 Create AuthGuard
  - Implement canActivate guard
  - Check authentication state from AuthService
  - Redirect to /login if not authenticated
  - Apply guard to /board route
  - _Requirements: 8.2_

- [ ] 10.2 Implement logout functionality
  - Add logout method to AuthService
  - Clear authentication state
  - Navigate to /login
  - _Requirements: 8.4_

- [ ]* 10.3 Write unit tests for AuthGuard
  - Test authenticated access
  - Test unauthenticated redirect
  - _Requirements: 8.2_

- [ ] 11. Final Integration and Testing
- [ ] 11.1 Verify end-to-end functionality
  - Test login flow with valid/invalid credentials
  - Test task creation from modal
  - Test tasks appear in correct columns
  - Test drag-and-drop across columns
  - Test drag-and-drop within same column
  - Test LocalStorage persistence across page refresh
  - Test responsive layout
  - _Requirements: All_

- [ ] 11.2 Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Fix any failing tests
  - Verify test coverage
