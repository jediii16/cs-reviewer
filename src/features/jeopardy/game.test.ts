import { describe, expect, it } from 'vitest';
import { jeopardyCategories, jeopardyClues, jeopardySources, finalJeopardyClue } from '../../content/cognate3/jeopardy';
import { loadJeopardyGame, missedClues, newJeopardyGame, playerScore, recordClue } from './game';

describe('Cognate 3 Jeopardy state', () => {
  it('has two complete boards with unique clues and lesson references', () => {
    expect(jeopardyCategories).toHaveLength(6);
    expect(jeopardyClues).toHaveLength(60);
    expect(new Set(jeopardyClues.map(clue => clue.id)).size).toBe(60);
    for (const category of jeopardyCategories) {
      expect(category.rounds).toHaveLength(2);
      for (const round of category.rounds) expect(round.map(clue => clue.value)).toEqual([100, 200, 300, 400, 500]);
    }
    for (const clue of jeopardyClues) { expect(jeopardySources[clue.source]).toBeDefined(); expect(clue.pages).toMatch(/\d/); }
  });
  it('uses definition-to-term recall throughout both boards and the final', () => {
    for (const clue of [...jeopardyClues, finalJeopardyClue]) {
      expect(clue.prompt).not.toMatch(/\b(calculate|evaluate|compute|solve|operator|operators|symbol|symbols)\b|[\d=+*^&|~<>]/i);
      expect(clue.answer).not.toMatch(/[\d=+*^&|~<>]/);
    }
  });
  it('scores one attempt, prevents repeat awards, and reviews without changing scores', () => {
    let game = newJeopardyGame();
    game.active = { id: 'r0-c0-v0', revealed: true, draft: '', team: 0, deadline: null, review: false };
    game = recordClue(game, 'wrong');
    expect(playerScore(game, 0)).toBe(-100);
    expect(missedClues(game)).toEqual(['r0-c0-v0']);
    game.active = { id: 'r0-c0-v0', revealed: true, draft: '', team: 0, deadline: null, review: false };
    game = recordClue(game, 'correct');
    expect(playerScore(game, 0)).toBe(-100);
    expect(missedClues(game)).toEqual([]);
    expect(game.results['r0-c0-v0'].outcome).toBe('wrong');
  });
  it('awards only the selected team and applies final wagers once', () => {
    let game = newJeopardyGame('teams');
    game.active = { id: 'r0-c1-v1', revealed: true, draft: '', team: 1, deadline: null, review: false };
    game = recordClue(game, 'correct');
    expect(playerScore(game, 0)).toBe(0); expect(playerScore(game, 1)).toBe(200); expect(game.turn).toBe(0);
    game.final = { wagers: [0, 150], correct: [false, true], locked: true, draft: '', revealed: true, deadline: null };
    expect(playerScore(game, 1)).toBe(350); expect(playerScore(game, 1)).toBe(350);
  });
  it('restores notes and deadlines, but discards malformed saved games', () => {
    const game = newJeopardyGame();
    game.active = { id: 'r1-c2-v4', revealed: false, draft: 'Grayscale', team: 0, deadline: 12345, review: false };
    expect(loadJeopardyGame(JSON.stringify(game))).toEqual(game);
    expect(loadJeopardyGame('{broken')).toEqual(newJeopardyGame());
    expect(loadJeopardyGame(JSON.stringify({ ...game, active: { ...game.active, id: 'unknown' } }))).toEqual(newJeopardyGame());
    expect(loadJeopardyGame(JSON.stringify({ ...game, final: { wagers: [-100] } }))).toEqual(newJeopardyGame());
  });
});
