import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
})
export class SidebarComponent {
    menuItems = [
        { label: 'Overview', icon: '📊', active: false },
        { label: 'Board', icon: '📋', active: true },
        { label: 'Add item', icon: '➕', active: false },
        { label: 'Project settings', icon: '⚙️', active: false }
    ];

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onMenuItemClick(item: any): void {
        // Update active state
        this.menuItems.forEach(menuItem => menuItem.active = false);
        item.active = true;
    }

    onLogout(): void {
        this.authService.logout();
    }
}
