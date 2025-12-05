import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Board } from './board/board/board';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'board', component: Board },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
