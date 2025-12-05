import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as fc from 'fast-check';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let router: Router;

    beforeEach(() => {
        const routerMock = {
            navigate: () => Promise.resolve(true)
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerMock }
            ]
        });
        service = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
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

                    // Attempt login with invalid credentials
                    const result = service.login(email, password);

                    // Verify login returns false
                    expect(result).toBe(false);

                    // Verify authenticated state is not set to true
                    expect(service.isAuthenticated()).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });
});
