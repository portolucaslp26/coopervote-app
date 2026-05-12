import { test, expect } from '@playwright/test';

test.describe('Votação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página inicial', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard de Agendas');
  });

  test('deve navegar para lista de pautas', async ({ page }) => {
    await page.click('text=Lista de Pautas');
    await expect(page.locator('h1')).toContainText('Lista de Pautas');
  });

  test('deve carregar página de criação de pauta', async ({ page }) => {
    await page.goto('/pautas/nova');
    await expect(page.locator('h1')).toContainText('Nova Pauta');
  });

  test('deve navegar para resultados', async ({ page }) => {
    await page.click('text=Resultados');
    await expect(page.locator('h1')).toContainText('Resultados');
  });
});