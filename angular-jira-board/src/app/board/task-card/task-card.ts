import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

/**
 * TaskCardComponent displays a single task card
 */
@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './task-card.html',
    styleUrls: ['./task-card.css']
})
export class TaskCardComponent {
    /**
     * Task data to display
     */
    @Input() task!: Task;
}
