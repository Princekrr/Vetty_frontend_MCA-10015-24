import { Injectable, signal } from '@angular/core';
import { Task, Column } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Fixed columns for the Jira board
    private readonly INITIAL_COLUMNS: Column[] = [
        { id: 'todo', title: 'To Do', tasks: [] },
        { id: 'inprogress', title: 'In Progress', tasks: [] },
        { id: 'review', title: 'Need Review', tasks: [] },
        { id: 'completed', title: 'Completed', tasks: [] }
    ];

    // Using Angular signal for reactive state management
    private columns = signal<Column[]>(this.deepCopyColumns(this.INITIAL_COLUMNS));

    constructor() {
        this.loadFromLocalStorage();
    }

    /**
     * Gets all columns with their tasks
     * @returns Array of columns
     */
    getColumns(): Column[] {
        return this.columns();
    }

    /**
     * Adds a new task to the specified column
     * @param task - Task to add (id will be generated if not provided)
     * @param columnId - Target column ID
     */
    addTask(task: Omit<Task, 'id'> & { id?: string }, columnId: string): void {
        const newTask: Task = {
            ...task,
            id: task.id || this.generateTaskId(),
            columnId
        };

        const updatedColumns = this.columns().map(column => {
            if (column.id === columnId) {
                return {
                    ...column,
                    tasks: [...column.tasks, newTask]
                };
            }
            return column;
        });

        this.columns.set(updatedColumns);
        this.saveToLocalStorage();
    }

    /**
     * Moves a task from one column to another or reorders within the same column
     * @param taskId - ID of the task to move
     * @param targetColumnId - Target column ID
     * @param targetIndex - Target position within the column (optional)
     */
    moveTask(taskId: string, targetColumnId: string, targetIndex?: number): void {
        let taskToMove: Task | null = null;
        let sourceColumnId: string | null = null;

        // Find and remove the task from its current column
        const columnsWithoutTask = this.columns().map(column => {
            const taskIndex = column.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                taskToMove = { ...column.tasks[taskIndex], columnId: targetColumnId };
                sourceColumnId = column.id;
                return {
                    ...column,
                    tasks: column.tasks.filter(t => t.id !== taskId)
                };
            }
            return column;
        });

        if (!taskToMove) {
            return; // Task not found
        }

        // Add the task to the target column
        const updatedColumns = columnsWithoutTask.map(column => {
            if (column.id === targetColumnId) {
                const newTasks = [...column.tasks];
                if (targetIndex !== undefined && targetIndex >= 0) {
                    newTasks.splice(targetIndex, 0, taskToMove!);
                } else {
                    newTasks.push(taskToMove!);
                }
                return {
                    ...column,
                    tasks: newTasks
                };
            }
            return column;
        });

        this.columns.set(updatedColumns);
        this.saveToLocalStorage();
    }

    /**
     * Generates a unique task ID
     * @returns Unique task ID string
     */
    generateTaskId(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `task-${timestamp}-${random}`;
    }

    /**
     * Saves current columns state to LocalStorage
     */
    private saveToLocalStorage(): void {
        try {
            const data = JSON.stringify(this.columns());
            localStorage.setItem('jira-board-columns', data);
        } catch (error) {
            console.error('Failed to save to LocalStorage:', error);
        }
    }

    /**
     * Loads columns state from LocalStorage
     */
    private loadFromLocalStorage(): void {
        try {
            const data = localStorage.getItem('jira-board-columns');
            if (data) {
                const loadedColumns = JSON.parse(data) as Column[];
                this.columns.set(loadedColumns);
            }
        } catch (error) {
            console.error('Failed to load from LocalStorage:', error);
        }
    }

    /**
     * Creates a deep copy of columns array
     * @param columns - Columns to copy
     * @returns Deep copy of columns
     */
    private deepCopyColumns(columns: Column[]): Column[] {
        return columns.map(column => ({
            ...column,
            tasks: [...column.tasks]
        }));
    }
}
