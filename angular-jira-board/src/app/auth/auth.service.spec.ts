import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Feature: angular-jira-board, Property 1: Invalid credentials are rejected
    // Validates: Requirements 1.3
    it('should reject all invalid credential combinations', () => {
        const VALID_EMAIL = 'admin@test.com';
        const VALID_PASSWORD = 'admin123';

        fc.assert(
            fc.property(
                fc.emailAddress(),
                fc.string({ minLength: 1, maxLength: 50 }),
                (email, password) => {
                    // Exclude the valid credentials from the test
                    fc.pre(email !== VALID_EMAIL || password !== VALID_PASSWORD);

                    // Create a fresh service instance for each test
                    const testService = new AuthService();

                    // Attempt login with invalid credentials
                    const result = testService.login(email, password);

                    // Verify login returns false
                    expect(result).toBe(false);

                    // Verify authenticated state is not set to true
                    expect(testService.isAuthenticated()).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });
});
