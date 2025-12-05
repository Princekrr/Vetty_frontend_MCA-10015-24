import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Column } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card';

/**
 * ColumnComponent displays a column with tasks and drag-and-drop functionality
 */
@Component({
    selector: 'app-column',
    standalone: true,
    imports: [CommonModule, DragDropModule, TaskCardComponent],
    templateUrl: './column.html',
    styleUrls: ['./column.css']
})
export class ColumnComponent {
    /**
     * Column data to display
     */
    @Input() column!: Column;

    /**
     * Event emitted when the add task button is clicked
     */
    @Output() addTaskClick = new EventEmitter<string>();

    /**
     * Event emitted when a task is dropped
     */
    @Output() taskDropped = new EventEmitter<CdkDragDrop<Column>>();

    /**
     * Handles the add task button click
     */
    onAddTaskClick(): void {
        this.addTaskClick.emit(this.column.id);
    }

    /**
     * Handles the drop event
     */
    onDrop(event: CdkDragDrop<Column>): void {
        this.taskDropped.emit(event);
    }
}
