/**
 * Represents a task in the Jira board
 */
export interface Task {
    id: string;
    title: string;
    description: string;
    columnId: string;
}

/**
 * Represents a column in the Jira board
 */
export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}
