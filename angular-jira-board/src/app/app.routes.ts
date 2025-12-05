import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Board } from './board/board/board';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'board', component: Board, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
