import { test, expect } from '@playwright/test';

test.describe('Authentication Flow - Frontend E2E (Mocked)', () => {
    const mockUser = {
        id: '123-456-789',
        email: 'testuser@example.com',
        full_name: 'Test User',
        roles: ['customer']
    };

    const corsHeaders = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    test.beforeEach(async ({ page }) => {
        // Mock the Registration Endpoint
        await page.route('*/**/api/auth/register', async route => {
            if (route.request().method() === 'OPTIONS') {
                return route.fulfill({ status: 200, headers: corsHeaders });
            }
            const json = {
                message: 'User registered successfully.',
                user: { id: mockUser.id, email: mockUser.email }
            };
            await route.fulfill({ status: 201, json, headers: corsHeaders });
        });

        // Mock the Login Endpoint
        await page.route('*/**/api/auth/login', async route => {
            if (route.request().method() === 'OPTIONS') {
                return route.fulfill({ status: 200, headers: corsHeaders });
            }
            const json = {
                access_token: 'fake-jwt-token-for-testing',
                user: mockUser
            };
            await route.fulfill({ status: 200, json, headers: corsHeaders });
        });

        // Mock the User Profile Endpoint
        await page.route('*/**/api/auth/me', async route => {
            if (route.request().method() === 'OPTIONS') {
                return route.fulfill({ status: 200, headers: corsHeaders });
            }
            await route.fulfill({ status: 200, json: mockUser, headers: corsHeaders });
        });

        // Mock Logout Endpoint
        await page.route('*/**/api/auth/logout', async route => {
            if (route.request().method() === 'OPTIONS') {
                return route.fulfill({ status: 200, headers: corsHeaders });
            }
            await route.fulfill({ status: 204, headers: corsHeaders });
        });
    });

    test('UAT-001: New User Registration', async ({ page }) => {
        await page.goto('/register');

        // Check for Liquid Glass design elements
        await expect(page.locator('h1')).toHaveText('Create Account');

        await page.getByPlaceholder('John Doe').fill(mockUser.full_name);
        await page.getByPlaceholder('name@example.com').fill(mockUser.email);
        await page.getByPlaceholder('Min 8 characters').fill('Password123!');

        await page.getByRole('button', { name: /register/i }).click();

        // Verify redirected to login with query param
        await expect(page).toHaveURL(/.*login\?registered=true/);
    });

    test('UAT-002: Existing User Login', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('name@example.com').fill(mockUser.email);
        await page.getByPlaceholder('••••••••').fill('Password123!');

        await page.getByRole('button', { name: /sign in/i }).click();

        // Verify redirected to home
        await expect(page).toHaveURL('/');

        // Verify Navbar shows user name
        await expect(page.getByText(mockUser.full_name)).toBeVisible();

        // Verify LocalStorage contains access_token
        const token = await page.evaluate(() => localStorage.getItem('access_token'));
        expect(token).toBe('fake-jwt-token-for-testing');
    });

    test('UAT-003: Access Protected Profile Page', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByPlaceholder('name@example.com').fill(mockUser.email);
        await page.getByPlaceholder('••••••••').fill('Password123!');
        await page.getByRole('button', { name: /sign in/i }).click();

        // Wait for redirect to home
        await expect(page).toHaveURL('/');

        // Navigate to profile via UI click
        await page.getByText(mockUser.full_name).click();


        // Verify profile details
        await expect(page.getByText(mockUser.full_name)).toBeVisible();
        await expect(page.getByText(mockUser.email)).toBeVisible();
        await expect(page.getByText(/customer/i)).toBeVisible();

        // Log out (using the actual button with the word or icon)
        await page.getByText(/sign out/i).click();

        // Verify we're not on profile anymore (usually returns to login or home)
        await expect(page).not.toHaveURL('/profile');

        // Verify Navbar doesn't show user full name anymore
        await expect(page.getByRole('button', { name: /logout/i })).not.toBeVisible();
    });

    test('UAT-004: Failed Login', async ({ page }) => {
        // Override the login endpoint to simulate failure
        await page.route('*/**/api/auth/login', async route => {
            if (route.request().method() === 'OPTIONS') {
                return route.fulfill({ status: 200, headers: corsHeaders });
            }
            const json = {
                error: { message: 'Invalid email or password' }
            };
            await route.fulfill({ status: 401, json, headers: corsHeaders });
        });

        await page.goto('/login');

        await page.getByPlaceholder('name@example.com').fill('wrong@example.com');
        await page.getByPlaceholder('••••••••').fill('WrongPassword123!');

        await page.getByRole('button', { name: /sign in/i }).click();

        // Verify error message is shown
        await expect(page.getByText('Invalid email or password')).toBeVisible();

        // Verify the URL is still the login page
        await expect(page).toHaveURL(/.*\/login/);
    });

});
