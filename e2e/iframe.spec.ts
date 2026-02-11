import { test, expect } from '@playwright/test';

test('should render iframe for project type lessons', async ({ page }) => {
  // 1. Navigate to the app
  await page.goto('/');

  // 2. Log in
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("ENTRAR AGORA")');

  // 3. Wait for dashboard and click on the course
  // The login has a 1.5s delay, so we wait for the course title to appear
  await page.waitForSelector('text=Mestria em Extrusão de Alimentos');
  await page.click('text=Mestria em Extrusão de Alimentos');

  // 4. Verify the iframe is visible and has the correct src
  // The first lesson "Introdução ao Processo de Extrusão" is selected by default
  // and it is of type 'project' with externalUrl: '/courses/formar-opencode/index.html'
  const iframe = page.locator('iframe[title="Introdução ao Processo de Extrusão"]');
  await expect(iframe).toBeVisible();
  
  const src = await iframe.getAttribute('src');
  expect(src).toBe('/courses/formar-opencode/index.html');
});
