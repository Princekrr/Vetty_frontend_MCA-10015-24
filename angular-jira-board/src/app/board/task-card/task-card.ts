import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';

/**
 * TaskCardComponent displays a single task card with drag-and-drop functionality
 */
@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    templateUrl: './task-card.html',
    styleUrls: ['./task-card.css']
})
export class TaskCardComponent {
    /**
     * Task data to display
     */
    @Input() task!: Task;
}
