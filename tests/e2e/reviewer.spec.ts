import { expect, test } from '@playwright/test';

test('active recall reveals without resizing and lesson navigation returns to its anchor', async ({ page }) => {
  await page.goto('/subjects/cit017/study');
  const waitForLessonAnchor = () => expect.poll(async () => page.locator('.lesson-anchor').evaluate((element) => (
    Math.abs(Math.round(element.getBoundingClientRect().top) - 92)
  ))).toBeLessThanOrEqual(2);

  await expect(page.getByRole('heading', { name: 'CIA Triad', exact: true })).toBeVisible();
  const recall = page.locator('.recall-panel');
  const answer = page.locator('.recall-answer');
  await expect(page.getByText('Confidentiality, Integrity, and Availability.')).toBeAttached();
  const before = await recall.boundingBox();
  expect(before?.height).toBeLessThanOrEqual(180);
  await expect(answer).toHaveCSS('opacity', '0');
  await expect(page.getByText(/hover or tap to reveal/i)).toHaveCount(0);

  await recall.hover();
  await expect(answer).toHaveCSS('opacity', '1');
  const after = await recall.boundingBox();
  expect(after?.height).toBe(before?.height);

  const navigation = page.getByRole('navigation', { name: 'Lesson sections' });
  await navigation.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /^next$/i }).click();
  await expect(page.getByRole('heading', { name: 'Confidentiality', exact: true })).toBeVisible();
  await expect(page.getByText('2 of 9')).toBeVisible();
  await expect(recall).toHaveAttribute('data-revealed', 'false');

  await waitForLessonAnchor();
  const navigationAfterFirstMove = await navigation.boundingBox();

  await recall.hover();
  await expect(recall).toHaveAttribute('data-revealed', 'false');
  await page.mouse.move(1, 1);
  await recall.hover();
  await expect(recall).toHaveAttribute('data-revealed', 'true');

  await page.getByRole('button', { name: /^next$/i }).click();
  await waitForLessonAnchor();
  const navigationAfterSecondMove = await navigation.boundingBox();
  expect(Math.abs((navigationAfterSecondMove?.y ?? 0) - (navigationAfterFirstMove?.y ?? 0))).toBeLessThanOrEqual(2);
});

test('Security Principles study contains only the nine supplied principles', async ({ page }) => {
  await page.goto('/subjects/cit017/study');
  await page.getByRole('button', { name: /security principles/i }).click();

  await expect(page.getByText('1 of 9')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Least Privilege', exact: true })).toBeVisible();
  await expect(page.getByText('Municipality payroll audit')).toHaveCount(0);
  await expect(page.getByText('Government procurement control')).toHaveCount(0);
  await expect(page.getByText('University examination records')).toHaveCount(0);
});

test('practice page exposes complete focused multiple-choice sets', async ({ page }) => {
  await page.goto('/subjects/cit017/test');

  await expect(page.getByRole('button', { name: /cia scenario practice.*10 questions/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /foundations concepts.*24 questions/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /principle definitions.*9 questions/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /threat scenarios.*12 questions/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /technique definitions.*17 questions/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /technique examples.*17 questions/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /psychological tactics.*9 questions/i })).toBeVisible();

  await page.getByRole('button', { name: /technique definitions.*17 questions/i }).click();
  await expect(page.getByText('Question 1 of 17')).toBeVisible();
  await expect(page.getByText('Technique Definitions')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Identify the social-engineering technique described in each question.');
  await expect(page.getByRole('heading', { level: 2 })).not.toContainText('Which social-engineering technique');
  await expect(page.getByRole('textbox')).toHaveCount(0);

  await page.getByRole('button', { name: /back to practice sets/i }).click();
  await expect(page.getByRole('heading', { name: /choose a practice set/i })).toBeVisible();
  await expect(page).toHaveURL(/\/subjects\/cit017\/test$/);

  await page.getByRole('button', { name: /technique definitions.*17 questions/i }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: /submit answer/i }).click();
  await expect(page.locator('.answer-feedback')).toBeVisible();
});

test('flashcards provide ungraded identification practice', async ({ page }) => {
  await page.goto('/subjects/cit017');
  await page.getByRole('link', { name: /^flashcards$/i }).click();

  await expect(page.getByRole('button', { name: /threat categories.*12 cards/i })).toBeVisible();
  await page.getByRole('button', { name: /threat categories.*12 cards/i }).click();
  await expect(page.getByText('Card 1 of 12')).toBeVisible();

  const frontText = await page.locator('.flashcard-prompt').textContent();
  await page.getByRole('button', { name: /reveal answer/i }).click();
  await expect(page.locator('.flashcard-answer')).toBeVisible();
  await expect(page.getByText(/correct|score/i)).toHaveCount(0);

  await page.getByRole('button', { name: /next card/i }).click();
  await expect(page.getByText('Card 2 of 12')).toBeVisible();
  await expect(page.locator('.flashcard-prompt')).not.toHaveText(frontText ?? '');
  await page.getByRole('button', { name: /return to decks/i }).click();
  await expect(page.getByRole('heading', { name: /choose a flashcard deck/i })).toBeVisible();
});

test('review modes stay inside a 300px-wide browser panel', async ({ page }) => {
  await page.setViewportSize({ width: 300, height: 720 });
  await page.goto('/subjects/cit017/test');
  await page.getByRole('button', { name: /cia scenario practice.*10 questions/i }).click();

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  await page.goto('/subjects/cit017/flashcards');
  await page.getByRole('button', { name: /foundations.*17 cards/i }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.getByRole('button', { name: /reveal answer/i }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  await page.goto('/subjects/cit017');
  await page.getByRole('button', { name: /open focus timer/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const breakSize = await page.getByRole('button', { name: /^break$/i }).boundingBox();
  expect(breakSize?.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  await page.getByRole('button', { name: /close focus timer/i }).click();
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.getByRole('button', { name: /close blurting notes/i }).click();

  await page.getByRole('button', { name: 'Open music and ambience', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.getByRole('button', { name: /close music and ambience/i }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  const brandLabel = await page.locator('.brand > span:last-child').boundingBox();
  const headerActions = await page.locator('.header-actions').boundingBox();
  expect(brandLabel === null || headerActions === null || brandLabel.x + brandLabel.width <= headerActions.x).toBe(true);
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

test('a complete CIA set records its full result and can be reset', async ({ page }) => {
  await page.goto('/subjects/cit017/test');
  await page.getByRole('button', { name: /cia scenario practice.*10 questions/i }).click();

  for (let index = 0; index < 10; index += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: /submit answer/i }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: index === 9 ? /see results/i : /next question/i }).click();
  }

  await expect(page.getByLabel('Total score')).toContainText('/ 10');
  await page.getByRole('button', { name: /back to practice sets/i }).click();
  await page.getByRole('link', { name: /cit\.017/i }).click();
  await expect(page.getByText(/latest score/i)).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /reset progress/i }).click();
  await expect(page.getByText(/no test scores yet/i)).toBeVisible();
});

test('blurting notes persist separately across routes and reloads', async ({ page }) => {
  await page.goto('/subjects/cit017/study');
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  await page.getByRole('combobox', { name: /note topic/i }).selectOption('foundations');
  await page.getByRole('textbox', { name: /blurting note/i }).fill('CIA protects confidentiality, integrity, and availability.');
  await expect(page.getByText(/saved locally/i)).toBeVisible();
  await page.getByRole('button', { name: /close blurting notes/i }).click();

  await page.goto('/subjects/cit017/test');
  await page.reload();
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  await expect(page.getByRole('combobox', { name: /note topic/i })).toHaveValue('foundations');
  await expect(page.getByRole('textbox', { name: /blurting note/i })).toHaveValue(/CIA protects/);
});

test('audio player and focus timer stay independent', async ({ page }) => {
  await page.goto('/subjects/cit017/study');
  await page.getByRole('button', { name: 'Open music and ambience', exact: true }).click();
  const audioDialog = page.getByRole('dialog', { name: /music and ambience/i });
  await expect(audioDialog).toBeVisible();
  await expect(audioDialog.getByRole('combobox', { name: /music track/i })).toBeVisible();
  await expect(audioDialog.getByRole('combobox', { name: /background noise/i })).toBeVisible();

  await audioDialog.getByRole('button', { name: /play music/i }).click();
  await expect(audioDialog.getByRole('button', { name: /pause music/i })).toBeVisible();
  await audioDialog.getByRole('button', { name: /play background noise/i }).click();
  await expect(audioDialog.getByRole('button', { name: /pause background noise/i })).toBeVisible();

  await audioDialog.getByRole('button', { name: /close music and ambience/i }).click();
  const dock = page.getByRole('region', { name: /music player/i });
  await dock.hover({ force: true });
  await expect(dock.getByRole('button', { name: /pause music/i })).toBeVisible();
  await expect(dock.getByRole('button', { name: /previous track/i })).toBeVisible();
  await expect(dock.getByRole('button', { name: /restart current track/i })).toBeVisible();
  await expect(dock.getByRole('button', { name: /next track/i })).toBeVisible();
  await expect(dock.getByRole('button', { name: /repeat playlist/i })).toBeVisible();
  await expect(dock.getByRole('slider', { name: /seek through current track/i })).toBeEnabled();

  await page.getByRole('button', { name: /open focus timer/i }).click();
  const focusDialog = page.getByRole('dialog', { name: 'Focus', exact: true });
  await expect(focusDialog).toBeVisible();
  await expect(focusDialog.getByRole('heading', { name: /^music$/i })).toHaveCount(0);
  await focusDialog.getByRole('button', { name: /^start$/i }).click();
  await focusDialog.getByRole('button', { name: /close focus timer/i }).click();

  await expect(page.getByRole('button', { name: /open focus timer, running focus/i })).toBeVisible();
  await expect(dock.getByRole('button', { name: /pause music/i })).toBeAttached();
});

test('home presents both subjects as distinct review choices', async ({ page }) => {
  await page.goto('/');

  const cit016 = page.getByRole('link', { name: /cit\.016/i });
  const cit017 = page.getByRole('link', { name: /cit\.017/i });
  await expect(cit016).toBeVisible();
  await expect(cit017).toBeVisible();

  const first = await cit016.boundingBox();
  const second = await cit017.boundingBox();
  expect((second?.y ?? 0) - ((first?.y ?? 0) + (first?.height ?? 0))).toBeGreaterThanOrEqual(12);
});

test('CIT.016 supports study, practice, and flashcard interactions', async ({ page }) => {
  await page.goto('/subjects/cit016/study');
  await expect(page.getByRole('heading', { name: 'Representing Information' })).toBeVisible();
  await page.getByRole('button', { name: /error detection and correction/i }).click();
  await expect(page.getByRole('heading', { name: 'Transmission Errors' })).toBeVisible();

  await page.goto('/subjects/cit016/test');
  await page.getByRole('button', { name: /tcp\/ip stack.*6 questions/i }).click();
  await expect(page.getByText('Question 1 of 6')).toBeVisible();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: /submit answer/i }).click();
  await expect(page.getByRole('status')).toBeVisible();

  await page.goto('/subjects/cit016/flashcards');
  await page.getByRole('button', { name: /multiplexing.*7 cards/i }).click();
  await expect(page.getByText('Card 1 of 7')).toBeVisible();
  await page.getByRole('button', { name: /reveal answer/i }).click();
  await expect(page.locator('.flashcard-answer')).toBeVisible();
});
