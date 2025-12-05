import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../task.service';
import { Column } from '../../models/task.model';
import { ColumnComponent } from '../column/column';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';

/**
 * BoardComponent displays the Jira board with drag-and-drop functionality
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, ColumnComponent, AddTaskModalComponent],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit {
  columns: Column[] = [];
  isModalOpen = false;
  selectedColumnId = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadColumns();
  }

  /**
   * Loads columns from TaskService
   */
  loadColumns(): void {
    this.columns = this.taskService.getColumns();
  }

  /**
   * Handles drop event for drag-and-drop
   * @param event - CDK drag-drop event
   */
  onDrop(event: CdkDragDrop<Column>): void {
    const taskId = event.item.data;
    const sourceColumn = event.previousContainer.data;
    const targetColumn = event.container.data;

    if (event.previousContainer === event.container) {
      // Reordering within the same column
      this.taskService.moveTask(taskId, targetColumn.id, event.currentIndex);
    } else {
      // Moving to a different column
      this.taskService.moveTask(taskId, targetColumn.id, event.currentIndex);
    }

    // Reload columns to reflect changes
    this.loadColumns();
  }

  /**
   * Opens the add task modal for a specific column
   * @param columnId - ID of the column to add task to
   */
  openAddTaskModal(columnId: string): void {
    this.selectedColumnId = columnId;
    this.isModalOpen = true;
  }

  /**
   * Closes the add task modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedColumnId = '';
    // Reload columns to show newly added task
    this.loadColumns();
  }
}
