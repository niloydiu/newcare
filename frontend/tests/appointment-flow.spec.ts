import { test, expect } from '@playwright/test';

test.describe('NewCare Appointment Booking & Admin CRUD Flow', () => {
  const randomEmail = `patient-${Date.now()}@example.com`;
  const patientPassword = 'password123';
  const patientName = `Test Patient ${Date.now()}`;

  test('Should allow patient registration, booking online appointment, and admin CRUD modification', async ({ page, context }) => {
    // 1. Patient Registration
    console.log('Registering user...');
    await page.goto('http://localhost:3000/login');
    
    // Toggle to Register mode
    await page.click('text=Sign up');
    await page.fill('input[placeholder="John Doe"]', patientName);
    await page.fill('input[placeholder="you@example.com"]', randomEmail);
    await page.fill('input[placeholder="Min. 8 characters"]', patientPassword);
    await page.click('button:has-text("Create Account")');

    // Wait for redirect to home
    await page.waitForURL('http://localhost:3000/');
    console.log('Registered successfully!');

    // 2. Book an Online Appointment
    console.log('Booking online appointment...');
    await page.goto('http://localhost:3000/doctors');
    
    // Filter to available only
    await page.click('text=Available only');
    
    // Click the first doctor's card to go to details
    const doctorCard = page.locator('a[href^="/appointment/"]').first();
    await expect(doctorCard).toBeVisible();
    await doctorCard.click();

    // Select the first available time slot (excluding disabled ones)
    const slotButton = page.locator('button:not([disabled]):has-text("09:00"), button:not([disabled]):has-text("09:30"), button:not([disabled]):has-text("10:00"), button:not([disabled]):has-text("10:30"), button:not([disabled]):has-text("11:00"), button:not([disabled]):has-text("11:30"), button:not([disabled]):has-text("14:00"), button:not([disabled]):has-text("14:30"), button:not([disabled]):has-text("15:00"), button:not([disabled]):has-text("15:30"), button:not([disabled]):has-text("16:00")').first();
    await expect(slotButton).toBeVisible();
    await slotButton.click();

    // Select Online Consultation
    await page.click('text=Online Consultation');
    
    // Fill in meeting details
    await page.selectOption('select', 'Zoom');
    await page.fill('textarea[placeholder^="e.g. Fever"]', 'Need virtual review of test results');

    // Submit booking
    const bookBtn = page.locator('button:has-text("Book for")');
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();

    // Wait for redirect to My Appointments
    await page.waitForURL('**/my-appointments');
    
    // Verify booking details
    await expect(page.locator('text=Online (Zoom)')).toBeVisible();
    await expect(page.locator('text=Note: Need virtual review of test results')).toBeVisible();
    console.log('Appointment booked online successfully!');

    // 3. Admin Panel Login & CRUD operations
    console.log('Logging in to Admin Panel...');
    const adminPage = await context.newPage();
    await adminPage.goto('http://localhost:3001/login');
    
    await adminPage.fill('input[placeholder="admin@newcare.health"]', 'admin@newcare.com');
    await adminPage.fill('input[placeholder="Your admin password"]', 'admin123');
    await adminPage.click('button[type="submit"]');
    
    await adminPage.waitForURL('http://localhost:3001/');
    console.log('Logged in to Admin Panel!');

    // Click on Appointments Tab
    await adminPage.click('text=Appointments');
    
    // Wait for table to load
    await adminPage.waitForSelector('table');
    
    // Verify newly booked online appointment is in the admin table
    const row = adminPage.locator('tr').filter({ hasText: patientName }).first();
    await expect(row).toBeVisible();
    await expect(row.locator('span:has-text("Online")')).toBeVisible();
    console.log('Found booked appointment in Admin appointments table!');

    // Test Admin UPDATE CRUD (Edit Modal)
    console.log('Testing Admin Update CRUD...');
    const editBtn = row.locator('button:has-text("Edit")');
    await editBtn.click();
    
    // Edit Modal should open. Change type to Offline
    await adminPage.selectOption('select', 'offline');
    await adminPage.fill('input[placeholder="e.g. #01"]', '#99');
    await adminPage.fill('input[placeholder="e.g. Health Plaza"]', 'Specialist Clinic Room A');
    await adminPage.fill('input[placeholder="Address or Google Maps link"]', '123 Medical Way');
    await adminPage.fill('input[placeholder="Additional details..."]', 'Walk-in requested');
    
    const saveBtn = adminPage.locator('button:has-text("Save Changes")');
    await saveBtn.click();

    // Verify it updated to Offline and displays new serial / place
    await expect(row.locator('span:has-text("Offline")')).toBeVisible();
    await expect(row.locator('text=Serial: #99')).toBeVisible();
    await expect(row.locator('text=Place: Specialist Clinic Room A')).toBeVisible();
    console.log('Admin Update CRUD completed successfully!');

    // Test Admin DELETE CRUD
    console.log('Testing Admin Delete CRUD...');
    adminPage.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Delete this appointment permanently');
      await dialog.accept();
    });
    
    const deleteBtn = row.locator('button:has-text("Delete")');
    await deleteBtn.click();
    
    // Wait for element to disappear
    await expect(row).not.toBeVisible();
    console.log('Admin Delete CRUD completed successfully!');
  });
});
