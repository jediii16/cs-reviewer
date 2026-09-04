import { expect, test } from '@playwright/test';

test('student can study CIT.017 and answer a mixed-format question', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /cit\.017/i }).click();
  await page.getByRole('link', { name: /^study$/i }).click();

  await expect(page.getByRole('heading', { name: 'CIA Triad', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /reveal answer/i }).click();
  await expect(page.getByText('Confidentiality, Integrity, and Availability.')).toBeVisible();

  await page.getByRole('link', { name: /cit\.017/i }).click();
  await page.getByRole('link', { name: /^test$/i }).click();
  await page.getByRole('button', { name: /foundations & cia/i }).click();
  await expect(page.locator('.quiz-meta strong')).toHaveText(/multiple choice|identification|true or false/i);
  const typedAnswer = page.getByRole('textbox', { name: /your answer/i });
  if (await typedAnswer.count()) {
    await typedAnswer.fill('Confidentiality');
  } else {
    await page.getByRole('radio').first().check();
  }
  await page.getByRole('button', { name: /submit answer/i }).click();

  await expect(page.getByRole('status')).toBeVisible();
});

test('quiz stays inside a 300px-wide browser panel', async ({ page }) => {
  await page.setViewportSize({ width: 300, height: 720 });
  await page.goto('/subjects/cit017/test');
  await page.getByRole('button', { name: /foundations & cia/i }).click();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await page.goto('/subjects/cit017');
  await page.getByRole('button', { name: /open focus timer/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const breakSize = await page.getByRole('button', { name: /^break$/i }).boundingBox();
  expect(breakSize?.height).toBeGreaterThanOrEqual(44);

  const dialogOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(dialogOverflow).toBeLessThanOrEqual(0);
});

test('theme and focus setup persist across routes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: /open focus timer/i }).click();
  await page.getByRole('button', { name: /45 minutes/i }).click();
  await expect(page.locator('.focus-dialog-time')).toHaveText('45:00');
  await page.getByRole('button', { name: /close focus timer/i }).click();

  await page.getByRole('link', { name: /cit\.017/i }).click();
  await expect(page.getByRole('button', { name: /open focus timer.*45:00/i })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('mixed review reaches results, retry missed, recent score, and reset', async ({ page }) => {
  await page.goto('/subjects/cit017/test');
  await page.getByRole('button', { name: /mixed review/i }).click();
  const formats = new Set<string>();

  for (let index = 0; index < 10; index += 1) {
    formats.add((await page.locator('.quiz-meta strong').textContent()) ?? '');
    const typedAnswer = page.getByRole('textbox', { name: /your answer/i });
    if (await typedAnswer.count()) await typedAnswer.fill('definitely incorrect');
    else await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: /submit answer/i }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: index === 9 ? /see results/i : /next question/i }).click();
  }

  expect(formats).toEqual(new Set(['Multiple choice', 'Identification', 'True or false']));
  await expect(page.getByLabel('Total score')).toContainText('/ 10');
  await expect(page.locator('.topic-breakdown > div')).toHaveCount(4);
  await page.getByRole('button', { name: /retry missed/i }).click();
  await expect(page.getByText(/question 1 of/i)).toBeVisible();

  await page.getByRole('link', { name: /cit\.017/i }).click();
  await expect(page.getByText(/latest score/i)).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /reset progress/i }).click();
  await expect(page.getByText(/no test scores yet/i)).toBeVisible();
});
