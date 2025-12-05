import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { TaskService } from './board/task.service';
import { Task } from './models/task.model';

describe('End-to-End Integration Tests', () => {
    let authService: AuthService;
    let taskService: TaskService;
    let router: Router;

    beforeEach(() => {
        // Clear LocalStorage before each test
        localStorage.clear();

        const routerMock = {
            navigate: (commands: any[]) => Promise.resolve(true)
        };

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                TaskService,
                { provide: Router, useValue: routerMock }
            ]
        });

        authService = TestBed.inject(AuthService);
        taskService = TestBed.inject(TaskService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        localStorage.clear();
        TestBed.resetTestingModule();
    });

    describe('Login Flow', () => {
        it('should authenticate with valid credentials', () => {
            // Test valid login
            const result = authService.login('admin@test.com', 'admin123');

            expect(result).toBe(true);
            expect(authService.isAuthenticated()).toBe(true);
        });

        it('should reject invalid credentials', () => {
            // Test invalid email
            let result = authService.login('wrong@test.com', 'admin123');
            expect(result).toBe(false);
            expect(authService.isAuthenticated()).toBe(false);

            // Test invalid password
            result = authService.login('admin@test.com', 'wrongpassword');
            expect(result).toBe(false);
            expect(authService.isAuthenticated()).toBe(false);

            // Test both invalid
            result = authService.login('wrong@test.com', 'wrongpassword');
            expect(result).toBe(false);
            expect(authService.isAuthenticated()).toBe(false);
        });

        it('should reject empty credentials', () => {
            // Test empty email
            let result = authService.login('', 'admin123');
            expect(result).toBe(false);

            // Test empty password
            result = authService.login('admin@test.com', '');
            expect(result).toBe(false);

            // Test both empty
            result = authService.login('', '');
            expect(result).toBe(false);
        });
    });

    describe('Task Creation', () => {
        it('should create task in correct column', () => {
            const task = {
                title: 'Test Task',
                description: 'Test Description',
                columnId: 'todo'
            };

            taskService.addTask(task, 'todo');
            const columns = taskService.getColumns();
            const todoColumn = columns.find(c => c.id === 'todo');

            expect(todoColumn).toBeDefined();
            expect(todoColumn!.tasks.length).toBe(1);
            expect(todoColumn!.tasks[0].title).toBe('Test Task');
            expect(todoColumn!.tasks[0].description).toBe('Test Description');
            expect(todoColumn!.tasks[0].columnId).toBe('todo');
        });

        it('should generate unique task IDs', () => {
            const task1 = { title: 'Task 1', description: 'Desc 1', columnId: 'todo' };
            const task2 = { title: 'Task 2', description: 'Desc 2', columnId: 'todo' };
            const task3 = { title: 'Task 3', description: 'Desc 3', columnId: 'inprogress' };

            taskService.addTask(task1, 'todo');
            taskService.addTask(task2, 'todo');
            taskService.addTask(task3, 'inprogress');

            const columns = taskService.getColumns();
            const allTasks: Task[] = [];
            columns.forEach(column => allTasks.push(...column.tasks));

            const taskIds = allTasks.map(t => t.id);
            const uniqueIds = new Set(taskIds);

            expect(taskIds.length).toBe(3);
            expect(uniqueIds.size).toBe(3);
        });

        it('should accept custom task IDs', () => {
            const task = {
                id: 'CUSTOM-123',
                title: 'Custom Task',
                description: 'Custom Description',
                columnId: 'todo'
            };

            taskService.addTask(task, 'todo');
            const columns = taskService.getColumns();
            const todoColumn = columns.find(c => c.id === 'todo');

            expect(todoColumn!.tasks[0].id).toBe('CUSTOM-123');
        });
    });

    describe('Drag-and-Drop Across Columns', () => {
        it('should move task to different column', () => {
            // Create a task in 'todo'
            const task = {
                title: 'Move Me',
                description: 'Test Move',
                columnId: 'todo'
            };

            taskService.addTask(task, 'todo');

            // Get the task ID
            let columns = taskService.getColumns();
            const todoColumn = columns.find(c => c.id === 'todo');
            const taskId = todoColumn!.tasks[0].id;

            // Move to 'inprogress'
            taskService.moveTask(taskId, 'inprogress');

            // Verify task moved
            columns = taskService.getColumns();
            const todoAfter = columns.find(c => c.id === 'todo');
            const inProgressAfter = columns.find(c => c.id === 'inprogress');

            expect(todoAfter!.tasks.length).toBe(0);
            expect(inProgressAfter!.tasks.length).toBe(1);
            expect(inProgressAfter!.tasks[0].id).toBe(taskId);
            expect(inProgressAfter!.tasks[0].columnId).toBe('inprogress');
        });

        it('should update task columnId when moved', () => {
            const task = {
                title: 'Test Task',
                description: 'Test',
                columnId: 'todo'
            };

            taskService.addTask(task, 'todo');

            let columns = taskService.getColumns();
            const taskId = columns.find(c => c.id === 'todo')!.tasks[0].id;

            // Move through multiple columns
            taskService.moveTask(taskId, 'inprogress');
            columns = taskService.getColumns();
            expect(columns.find(c => c.id === 'inprogress')!.tasks[0].columnId).toBe('inprogress');

            taskService.moveTask(taskId, 'review');
            columns = taskService.getColumns();
            expect(columns.find(c => c.id === 'review')!.tasks[0].columnId).toBe('review');

            taskService.moveTask(taskId, 'completed');
            columns = taskService.getColumns();
            expect(columns.find(c => c.id === 'completed')!.tasks[0].columnId).toBe('completed');
        });
    });

    describe('Drag-and-Drop Within Same Column', () => {
        it('should reorder tasks within same column', () => {
            // Add multiple tasks to same column
            taskService.addTask({ title: 'Task 1', description: 'Desc 1', columnId: 'todo' }, 'todo');
            taskService.addTask({ title: 'Task 2', description: 'Desc 2', columnId: 'todo' }, 'todo');
            taskService.addTask({ title: 'Task 3', description: 'Desc 3', columnId: 'todo' }, 'todo');

            let columns = taskService.getColumns();
            const todoColumn = columns.find(c => c.id === 'todo')!;
            const task1Id = todoColumn.tasks[0].id;
            const task2Id = todoColumn.tasks[1].id;
            const task3Id = todoColumn.tasks[2].id;

            // Move task 3 to position 0
            taskService.moveTask(task3Id, 'todo', 0);

            columns = taskService.getColumns();
            const reorderedColumn = columns.find(c => c.id === 'todo')!;

            expect(reorderedColumn.tasks.length).toBe(3);
            expect(reorderedColumn.tasks[0].id).toBe(task3Id);
            expect(reorderedColumn.tasks[1].id).toBe(task1Id);
            expect(reorderedColumn.tasks[2].id).toBe(task2Id);
        });

        it('should maintain column when reordering', () => {
            taskService.addTask({ title: 'Task 1', description: 'Desc 1', columnId: 'inprogress' }, 'inprogress');
            taskService.addTask({ title: 'Task 2', description: 'Desc 2', columnId: 'inprogress' }, 'inprogress');

            let columns = taskService.getColumns();
            const taskId = columns.find(c => c.id === 'inprogress')!.tasks[1].id;

            // Reorder within same column
            taskService.moveTask(taskId, 'inprogress', 0);

            columns = taskService.getColumns();
            const inProgressColumn = columns.find(c => c.id === 'inprogress')!;

            expect(inProgressColumn.tasks.length).toBe(2);
            expect(inProgressColumn.tasks[0].columnId).toBe('inprogress');
            expect(inProgressColumn.tasks[1].columnId).toBe('inprogress');
        });
    });

    describe('LocalStorage Persistence', () => {
        it('should persist tasks across page refresh', () => {
            // Create tasks
            taskService.addTask({ title: 'Persistent Task 1', description: 'Desc 1', columnId: 'todo' }, 'todo');
            taskService.addTask({ title: 'Persistent Task 2', description: 'Desc 2', columnId: 'inprogress' }, 'inprogress');

            const columnsBeforeRefresh = taskService.getColumns();
            const todoTasksBefore = columnsBeforeRefresh.find(c => c.id === 'todo')!.tasks;
            const inProgressTasksBefore = columnsBeforeRefresh.find(c => c.id === 'inprogress')!.tasks;

            // Simulate page refresh by creating new service instance
            const newTaskService = new TaskService();
            const columnsAfterRefresh = newTaskService.getColumns();

            const todoTasksAfter = columnsAfterRefresh.find(c => c.id === 'todo')!.tasks;
            const inProgressTasksAfter = columnsAfterRefresh.find(c => c.id === 'inprogress')!.tasks;

            expect(todoTasksAfter.length).toBe(1);
            expect(todoTasksAfter[0].title).toBe('Persistent Task 1');
            expect(inProgressTasksAfter.length).toBe(1);
            expect(inProgressTasksAfter[0].title).toBe('Persistent Task 2');
        });

        it('should persist task moves to LocalStorage', () => {
            // Create and move a task
            taskService.addTask({ title: 'Move Task', description: 'Test', columnId: 'todo' }, 'todo');

            let columns = taskService.getColumns();
            const taskId = columns.find(c => c.id === 'todo')!.tasks[0].id;

            taskService.moveTask(taskId, 'completed');

            // Simulate page refresh
            const newTaskService = new TaskService();
            columns = newTaskService.getColumns();

            const todoColumn = columns.find(c => c.id === 'todo')!;
            const completedColumn = columns.find(c => c.id === 'completed')!;

            expect(todoColumn.tasks.length).toBe(0);
            expect(completedColumn.tasks.length).toBe(1);
            expect(completedColumn.tasks[0].id).toBe(taskId);
        });

        it('should load empty board when no data in LocalStorage', () => {
            // Ensure LocalStorage is clear
            localStorage.clear();

            const newTaskService = new TaskService();
            const columns = newTaskService.getColumns();

            expect(columns.length).toBe(4);
            expect(columns[0].id).toBe('todo');
            expect(columns[1].id).toBe('inprogress');
            expect(columns[2].id).toBe('review');
            expect(columns[3].id).toBe('completed');

            columns.forEach(column => {
                expect(column.tasks.length).toBe(0);
            });
        });
    });

    describe('Board Structure', () => {
        it('should have four fixed columns in correct order', () => {
            const columns = taskService.getColumns();

            expect(columns.length).toBe(4);
            expect(columns[0].id).toBe('todo');
            expect(columns[0].title).toBe('To Do');
            expect(columns[1].id).toBe('inprogress');
            expect(columns[1].title).toBe('In Progress');
            expect(columns[2].id).toBe('review');
            expect(columns[2].title).toBe('Need Review');
            expect(columns[3].id).toBe('completed');
            expect(columns[3].title).toBe('Completed');
        });

        it('should maintain all task properties', () => {
            const task = {
                id: 'TEST-123',
                title: 'Complete Task',
                description: 'Full description here',
                columnId: 'todo'
            };

            taskService.addTask(task, 'todo');
            const columns = taskService.getColumns();
            const savedTask = columns.find(c => c.id === 'todo')!.tasks[0];

            expect(savedTask.id).toBe('TEST-123');
            expect(savedTask.title).toBe('Complete Task');
            expect(savedTask.description).toBe('Full description here');
            expect(savedTask.columnId).toBe('todo');
        });
    });
});
