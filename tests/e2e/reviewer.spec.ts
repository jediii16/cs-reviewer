import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { cit015TestSets } from '../../src/content/cit015/questions';
const bank = cit015TestSets.slice(0, 4).flatMap((set) => set.questions);
async function currentQuestion(page: Page) {
  const text = await page.locator('#question-heading').textContent();
  const question = bank.find((q) => q.prompt === text);
  if (!question) throw new Error(`Unknown prompt: ${text}`);
  return question;
}
async function choose(page: Page, correct = true) {
  const question = await currentQuestion(page);
  const option = question.options.find((o) => (o.id === question.correctOptionId) === correct)!;
  await page.getByRole('radio', { name: option.label, exact: true }).check();
  return question;
}
async function startCustom(page: Page, mode = 'learn', length = '5', time = '0') {
  await page.goto('/subjects/cit015/test');
  await page.getByRole('radio', { name: mode === 'exam' ? /mock exam/i : /^learn/i }).check();
  await page.getByRole('combobox', { name: 'Session length', exact: true }).selectOption(length);
  await page.getByRole('combobox', { name: 'Time limit', exact: true }).selectOption(time);
  await page.getByRole('button', { name: /^start (new )?session$/i }).click();
}
async function openTools(page: Page) {
  const trigger = page.getByRole('button', { name: 'Study tools', exact: true });
  if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
}

test('the new desk renders cleanly on desktop and mobile', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /a little progress, every day/i })).toBeVisible();
  await expect(page.getByText('Concepts practiced', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await page.screenshot({ path: `tmp/remake-desk-${info.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('study remembers the exact section and separates reviewed sections from accuracy', async ({ page }) => {
  await page.goto('/subjects/cit015/study');
  await page.getByRole('button', { name: /^next$/i }).click();
  await page.getByRole('button', { name: /^next$/i }).click();
  await expect(page.getByRole('heading', { name: 'Mutual exclusion', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark section reviewed', exact: true }).click();
  await page.getByRole('link', { name: 'Bappi home' }).click();
  await page.getByRole('link', { name: 'Continue studying', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mutual exclusion', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Mutual exclusion', exact: true })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals']);
  expect(saved.reviewedSections).toHaveLength(1); expect(Object.keys(saved.history)).toHaveLength(0);
});

test('search jumps to the matching source section', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: 'Search lesson terms' }).fill('indexed allocation');
  await page.locator('.search-results a').filter({ hasText: 'Indexed allocation' }).first().click();
  await expect(page).toHaveURL(/section=indexed-allocation/);
  await expect(page.getByRole('heading', { name: 'Indexed allocation', exact: true })).toBeVisible();
});

test('learning resumes the same order, selected answer, and submitted feedback', async ({ page }, info) => {
  await startCustom(page);
  const prompt = await page.locator('#question-heading').textContent();
  const choices = await page.locator('.answer-list label').allTextContents();
  await choose(page, false);
  await page.reload();
  await expect(page.locator('#question-heading')).toHaveText(prompt!);
  expect(await page.locator('.answer-list label').allTextContents()).toEqual(choices);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('.answer-feedback')).toBeVisible();
  await page.reload();
  await expect(page.locator('.answer-feedback')).toBeVisible();
  await page.getByRole('link', { name: 'Bappi home' }).click();
  await page.getByRole('link', { name: 'Continue session', exact: true }).click();
  await expect(page.locator('#question-heading')).toHaveText(prompt!);
  await page.screenshot({ path: `tmp/remake-question-${info.project.name}.png`, fullPage: true });
});

test('a complete true-or-false session scores correctly and saves once', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/subjects/cit015/test');
  await page.getByRole('button', { name: /concurrent processing true or false 16 questions/i }).click();
  for (let i = 0; i < 16; i += 1) {
    await choose(page);
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(page.locator('.answer-feedback')).toContainText('Correct.');
    await page.getByRole('button', { name: i === 15 ? 'See results' : 'Next question', exact: true }).click();
  }
  await expect(page.getByLabel('Total score')).toHaveText('16 / 16');
  await page.reload();
  await expect(page.getByLabel('Total score')).toHaveText('16 / 16');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals'].results.length)).toBe(1);
});

test('mock exams hide feedback, allow revisiting answers, then grade on submission', async ({ page }) => {
  await startCustom(page, 'exam');
  for (let i = 0; i < 5; i += 1) {
    await choose(page);
    await expect(page.locator('.answer-feedback')).toHaveCount(0);
    await page.getByRole('button', { name: i === 4 ? 'Review & submit' : 'Next question', exact: true }).click();
  }
  await expect(page.getByText('5 of 5 answered.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Question 1, answered', exact: true }).click();
  await choose(page, false);
  await page.getByRole('button', { name: 'Review all 5 questions', exact: true }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await expect(page.getByLabel('Total score')).toHaveText('4 / 5');
});

test('expired exams submit saved answers automatically after leaving and reloading', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-26T08:00:00+08:00') });
  await startCustom(page, 'exam', '5', '5');
  await choose(page);
  const url = page.url();
  await page.goto('/');
  await page.clock.fastForward(300001);
  await page.goto(url);
  await expect(page.getByText('Time is up. Your saved answers were submitted automatically.')).toBeVisible();
  await expect(page.getByLabel('Total score')).toHaveText('1 / 5');
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals'].results.length)).toBe(1);
});

test('mistakes persist, become due tomorrow, and successful reviews move three days ahead', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-26T08:00:00+08:00') });
  await startCustom(page);
  const q = await choose(page, false);
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.goto('/review');
  await expect(page.getByRole('heading', { name: 'You’re caught up for now.' })).toBeVisible();
  await page.clock.fastForward(86400001);
  await page.reload();
  await expect(page.getByRole('heading', { name: '1 ready for today.' })).toBeVisible();
  await page.getByRole('button', { name: /review 1 due questions/i }).click();
  await choose(page);
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.getByRole('button', { name: 'See results', exact: true }).click();
  const item = await page.evaluate((id) => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals'].mistakes[id], q.id);
  expect(item.streak).toBe(1); expect(item.dueAt - item.lastAttemptAt).toBe(3 * 86400000);
});

test('bookmarks keep personal notes across routes and reloads', async ({ page }) => {
  await startCustom(page);
  const q = await currentQuestion(page);
  await page.getByRole('button', { name: 'Bookmark question', exact: true }).click();
  await page.getByText('Personal note', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Note for this question' }).fill('Remember the distinction in the source.');
  await page.goto('/review?tab=saved');
  await expect(page.getByRole('textbox', { name: `Note for ${q.concept}`, exact: true })).toHaveValue('Remember the distinction in the source.');
  await page.reload();
  await expect(page.getByRole('textbox', { name: `Note for ${q.concept}`, exact: true })).toHaveValue('Remember the distinction in the source.');
});

test('the five-minute review has a clear count and a persisted deadline', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start 5-minute review', exact: true }).click();
  await expect(page.getByText('Question 1 of 5', { exact: true })).toBeVisible();
  await expect(page.getByRole('timer', { name: 'Time remaining' })).toContainText('05:');
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals'].sessions.cit015);
  expect(session.deadlineAt - session.startedAt).toBe(300000);
});

test('periods isolate notes and progress, and archive/restore keeps data', async ({ page }) => {
  await page.goto('/subjects/cit015/study');
  await page.getByRole('button', { name: 'Mark section reviewed', exact: true }).click();
  await page.getByRole('combobox', { name: 'Exam period' }).selectOption('2026-midterms');
  await expect(page.getByRole('heading', { name: 'A fresh page for midterms.' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Exam period' }).selectOption('2026-finals');
  await page.goto('/settings');
  const finals = page.locator('.period-list > div').filter({ has: page.getByText('Finals', { exact: true }) });
  await finals.getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Exam period' })).not.toContainText('Finals');
  await page.locator('.period-list > div').filter({ has: page.getByText('Finals', { exact: true }) }).getByRole('button', { name: 'Restore', exact: true }).click();
  await page.getByRole('combobox', { name: 'Exam period' }).selectOption('2026-finals');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals'].reviewedSections.length)).toBe(1);
});

test('export/import round-trips a separate syllabus and rejects invalid files', async ({ page }) => {
  await page.goto('/settings');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: /export finals & progress/i }).click();
  const download = await downloadEvent;
  const raw = await readFile((await download.path())!, 'utf8');
  await page.getByLabel('Import Bappi syllabus').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(raw) });
  await expect(page.getByText('1 subjects · 2 lessons · 90 questions')).toBeVisible();
  await page.getByRole('button', { name: 'Import as a new period', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Exam period' })).toContainText('Finals (imported)');
  await page.getByRole('combobox', { name: 'Exam period' }).selectOption('2026-finals');
  await page.getByLabel('Import Bappi syllabus').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await expect(page.getByRole('alert')).toContainText('not valid JSON');
});

test('calm mode, compact audio, and focus tools remain usable', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('checkbox', { name: 'Calm mascot mode' }).check();
  await page.getByRole('link', { name: 'Bappi home' }).click();
  await expect(page.getByRole('button', { name: 'Play with Bappi' })).toHaveAttribute('data-calm', 'true');
  await expect(page.getByRole('region', { name: 'Music player' })).toHaveAttribute('data-expanded', 'false');
  await page.getByRole('button', { name: 'Show music player' }).click();
  await page.getByRole('button', { name: 'Collapse music player' }).click();
  await expect(page.getByRole('region', { name: 'Music player' })).toHaveAttribute('data-expanded', 'false');
  await openTools(page);
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /open focus timer/i }).click();
  await page.getByRole('button', { name: /45 minutes/i }).click();
  await page.getByRole('button', { name: /close focus timer/i }).click();
  await openTools(page);
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  await page.getByRole('textbox', { name: /blurting note/i }).fill('Today I learned about locks.');
  await page.getByRole('button', { name: /close blurting notes/i }).click();
  await page.reload();
  await openTools(page);
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  await expect(page.getByRole('textbox', { name: /blurting note/i })).toHaveValue('Today I learned about locks.');
});

test('all main flows fit a 300px screen', async ({ page }) => {
  await page.setViewportSize({ width: 300, height: 720 });
  for (const route of ['/', '/subjects/cit015', '/subjects/cit015/study', '/subjects/cit015/test', '/review', '/search', '/settings', '/subjects/cit015/crossword']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), route).toBeLessThanOrEqual(0);
  }
  await startCustom(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('new OS crossword banks build and resume the same saved arrangement', async ({ page }) => {
  await page.goto('/subjects/cit015/crossword');
  await page.locator('.crossword-bank-list article').first().getByRole('button', { name: 'New puzzle', exact: true }).click();
  const input = page.getByRole('textbox', { name: /crossword cell/i }).first();
  await input.fill('Z');
  const label = await input.getAttribute('aria-label');
  await page.reload();
  await page.locator('.crossword-bank-list article').first().getByRole('button', { name: 'Resume saved puzzle', exact: true }).click();
  await expect(page.getByRole('textbox', { name: label!, exact: true })).toHaveValue('Z');
});

test('the weakest concept opens focused practice and the last active session remains resumable', async ({ page }) => {
  await startCustom(page);
  const q = await choose(page, false);
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.goto('/');
  await page.getByRole('link', { name: 'Practice this concept', exact: true }).click();
  await expect(page.getByText('Focus concept:', { exact: false })).toContainText(q.concept);
  await page.getByRole('button', { name: 'Start new session', exact: true }).click();
  const focused = await page.evaluate(() => JSON.parse(localStorage.getItem('bappi-learning-v1')!).data['2026-finals'].sessions.cit015);
  expect(focused.questions.every((question: { concept: string }) => question.concept === q.concept)).toBe(true);
  await page.goto('/subjects/cit015/study');
  await page.goto(`/subjects/cit015/test?session=${focused.id}`);
  await choose(page);
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Continue session', exact: true })).toBeVisible();
});

test('key screens remain readable in dark mode with fixed controls inside the viewport', async ({ page }, info) => {
  await page.setViewportSize(info.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  await page.goto('/');
  await openTools(page);
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await page.getByRole('button', { name: 'Close study tools', exact: true }).click();
  await page.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' }); (document.activeElement as HTMLElement)?.blur(); });
  const handle = await page.getByRole('button', { name: 'Show music player' }).boundingBox();
  const viewport = page.viewportSize()!;
  expect(handle!.x).toBeGreaterThanOrEqual(0); expect(handle!.x + handle!.width).toBeLessThanOrEqual(viewport.width);
  await page.screenshot({ path: `tmp/remake-dark-${info.project.name}.png` });
  await page.goto('/subjects/cit015/study?topic=finals-file-disk-management&section=indexed-allocation');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `tmp/remake-study-${info.project.name}.png` });
  await expect(page.getByRole('heading', { name: 'Indexed allocation', exact: true })).toBeVisible();
});

test('saved VFS questions refresh to the exact slide wording while keeping notes', async ({ page }) => {
  const vfs = bank.find((q) => q.id === 'finals-file-disk-management-mc-13')!;
  await page.goto('/');
  await page.evaluate((question) => {
    const now = Date.now();
    const oldQuestion = { ...question, prompt: 'Which layer lets different file systems work under a single interface?', explanation: 'VFS bridges different file systems through a common interface.' };
    delete oldQuestion.sourceText;
    const state = {
      version: 1, activePeriodId: '2026-finals', calmMascot: false,
      periods: [{ id: '2026-finals', label: 'Finals', archived: false }],
      data: { '2026-finals': {
        positions: {}, reviewedSections: [], history: {}, mistakes: {}, results: [],
        bookmarks: { [question.id]: { questionId: question.id, subjectId: 'cit015', note: 'My VFS reminder', createdAt: now } },
        sessions: { cit015: { id: 'old-vfs-session', subjectId: 'cit015', title: 'Saved VFS practice', mode: 'learn', questions: [oldQuestion], answers: { [question.id]: question.correctOptionId }, index: 0, gradedIds: [], startedAt: now } },
      } },
    };
    localStorage.setItem('bappi-learning-v1', JSON.stringify(state));
  }, vfs);
  await page.goto('/subjects/cit015/test?session=old-vfs-session');
  await expect(page.locator('#question-heading')).toHaveText(vfs.prompt);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.getByText(/questions in this session have been updated/i)).toBeVisible();
  await page.getByRole('radio', { name: 'Virtual File System (VFS)', exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('.answer-feedback')).toContainText('Acts as a bridge, allowing different file systems to work under a single interface.');
  await page.getByText('Personal note', { exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Note for this question' })).toHaveValue('My VFS reminder');
});

test('allocation questions name their technique without instructional lead-ins', async ({ page }) => {
  await page.goto('/subjects/cit015/test?topic=finals-file-disk-management&concept=External%20fragmentation');
  await page.getByRole('combobox', { name: 'Question type', exact: true }).selectOption('multiple-choice');
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await expect(page.locator('#question-heading')).toHaveText('____ is a major issue with contiguous allocation.');
  await expect(page.locator('#question-heading')).not.toContainText('Complete the slide text');
  await page.getByRole('radio', { name: 'External fragmentation', exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('.answer-feedback')).toContainText('External fragmentation is a major issue with this type of allocation technique.');
});
