import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly VALID_EMAIL = 'admin@test.com';
    private readonly VALID_PASSWORD = 'admin123';

    // Using Angular signal for reactive state management
    private authenticated = signal<boolean>(false);

    constructor() { }

    /**
     * Validates user credentials against dummy authentication
     * @param email - User email
     * @param password - User password
     * @returns true if credentials are valid, false otherwise
     */
    login(email: string, password: string): boolean {
        const isValid = email === this.VALID_EMAIL && password === this.VALID_PASSWORD;

        if (isValid) {
            this.authenticated.set(true);
        }

        return isValid;
    }

    /**
     * Checks if user is currently authenticated
     * @returns true if authenticated, false otherwise
     */
    isAuthenticated(): boolean {
        return this.authenticated();
    }

    /**
     * Logs out the user by clearing authentication state
     */
    logout(): void {
        this.authenticated.set(false);
    }
}
