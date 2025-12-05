import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { Column } from '../../models/task.model';

/**
 * AddTaskModalComponent provides a modal dialog for creating new tasks
 */
@Component({
    selector: 'app-add-task-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-task-modal.html',
    styleUrls: ['./add-task-modal.css']
})
export class AddTaskModalComponent {
    /**
     * Controls modal visibility
     */
    @Input() isOpen = false;

    /**
     * Pre-selected column ID
     */
    @Input() selectedColumnId = '';

    /**
     * Available columns for selection
     */
    @Input() columns: Column[] = [];

    /**
     * Event emitted when modal should close
     */
    @Output() close = new EventEmitter<void>();

    // Form fields
    taskTitle = '';
    taskId = '';
    taskDescription = '';
    targetColumnId = '';

    // Validation state
    showValidationErrors = false;

    constructor(private taskService: TaskService) { }

    /**
     * Initializes form when modal opens
     */
    ngOnChanges(): void {
        if (this.isOpen) {
            this.targetColumnId = this.selectedColumnId;
            this.resetForm();
        }
    }

    /**
     * Validates required fields
     */
    isFormValid(): boolean {
        return this.taskTitle.trim() !== '' &&
            this.taskDescription.trim() !== '' &&
            this.targetColumnId !== '';
    }

    /**
     * Handles form submission
     */
    onSubmit(): void {
        if (!this.isFormValid()) {
            this.showValidationErrors = true;
            return;
        }

        // Create task using TaskService
        this.taskService.addTask(
            {
                id: this.taskId.trim() || undefined,
                title: this.taskTitle.trim(),
                description: this.taskDescription.trim(),
                columnId: this.targetColumnId
            },
            this.targetColumnId
        );

        this.closeModal();
    }

    /**
     * Handles cancel action
     */
    onCancel(): void {
        this.closeModal();
    }

    /**
     * Closes modal and resets form
     */
    private closeModal(): void {
        this.resetForm();
        this.close.emit();
    }

    /**
     * Resets form fields and validation state
     */
    private resetForm(): void {
        this.taskTitle = '';
        this.taskId = '';
        this.taskDescription = '';
        this.showValidationErrors = false;
    }

    /**
     * Handles backdrop click to close modal
     */
    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.onCancel();
        }
    }
}
