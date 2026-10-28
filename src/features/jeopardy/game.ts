import { jeopardyClues } from '../../content/cognate3/jeopardy';

export type Outcome = 'correct' | 'wrong' | 'skip';
export interface ClueResult { outcome: Outcome; team: number; reviewed: boolean; }
export interface ActiveClue { id: string; revealed: boolean; draft: string; team: number; deadline: number | null; review: boolean; }
export interface FinalRound { wagers: number[]; correct: boolean[]; locked: boolean; draft: string; revealed: boolean; deadline: number | null; }
export interface JeopardyGame {
  version: 1; mode: 'solo' | 'teams'; round: number; timer: number;
  teams: string[]; turn: number; results: Record<string, ClueResult>;
  active: ActiveClue | null; final: FinalRound | null;
}
const cluesById = new Map(jeopardyClues.map(clue => [clue.id, clue]));
export const jeopardyStorageKey = (periodId: string) => `bappi-cognate3-jeopardy-v1:${periodId}`;
export const newJeopardyGame = (mode: JeopardyGame['mode'] = 'solo', timer = 0, teams = ['Team 1', 'Team 2']): JeopardyGame => ({ version: 1, mode, round: 0, timer, teams, turn: 0, results: {}, active: null, final: null });
export function playerScore(game: JeopardyGame, team: number) {
  const base = Object.entries(game.results).reduce((sum, [id, result]) => sum + (result.team === team ? (cluesById.get(id)?.value ?? 0) * (result.outcome === 'correct' ? 1 : result.outcome === 'wrong' ? -1 : 0) : 0), 0);
  return base + (game.final?.locked ? (game.final.correct[team] ? 1 : -1) * (game.final.wagers[team] ?? 0) : 0);
}
export function missedClues(game: JeopardyGame) { return Object.keys(game.results).filter(id => game.results[id].outcome !== 'correct' && !game.results[id].reviewed); }
export function recordClue(game: JeopardyGame, outcome: Outcome): JeopardyGame {
  const active = game.active;
  if (!active || !cluesById.has(active.id)) return game;
  const previous = game.results[active.id];
  if (active.review || previous) {
    return { ...game, active: null, results: previous && outcome !== 'skip' ? { ...game.results, [active.id]: { ...previous, reviewed: outcome === 'correct' } } : game.results };
  }
  return { ...game, active: null, turn: game.mode === 'teams' ? (active.team + 1) % game.teams.length : 0,
    results: { ...game.results, [active.id]: { outcome, team: active.team, reviewed: false } } };
}
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export function loadJeopardyGame(serialized: string | null): JeopardyGame {
  try {
    const game: unknown = JSON.parse(serialized ?? 'null');
    if (!object(game) || game.version !== 1 || !['solo', 'teams'].includes(String(game.mode)) || !(game.round === 0 || game.round === 1) || !(game.timer === 0 || game.timer === 30 || game.timer === 60) || !Array.isArray(game.teams) || game.teams.length < 2 || game.teams.length > 4 || !game.teams.every(name => typeof name === 'string' && name.length <= 24) || !Number.isInteger(game.turn) || Number(game.turn) < 0 || Number(game.turn) >= game.teams.length || !object(game.results)) return newJeopardyGame();
    for (const [id, result] of Object.entries(game.results)) if (!cluesById.has(id) || !object(result) || !['correct', 'wrong', 'skip'].includes(String(result.outcome)) || typeof result.reviewed !== 'boolean' || !Number.isInteger(result.team) || Number(result.team) < 0 || Number(result.team) >= game.teams.length) return newJeopardyGame();
    if (game.final !== null) {
      const final = game.final, players = game.mode === 'solo' ? 1 : game.teams.length;
      if (!object(final) || !Array.isArray(final.wagers) || final.wagers.length !== players || !final.wagers.every(wager => Number.isSafeInteger(wager) && wager >= 0) || !Array.isArray(final.correct) || final.correct.length !== players || !final.correct.every(value => typeof value === 'boolean') || typeof final.locked !== 'boolean' || typeof final.draft !== 'string' || typeof final.revealed !== 'boolean' || !(final.deadline === null || typeof final.deadline === 'number' && Number.isFinite(final.deadline))) return newJeopardyGame();
    }
    if (game.active !== null) {
      const active = game.active;
      if (!object(active) || !(cluesById.has(String(active.id)) || active.id === 'final' && game.final !== null) || typeof active.revealed !== 'boolean' || typeof active.draft !== 'string' || typeof active.review !== 'boolean' || !Number.isInteger(active.team) || Number(active.team) < 0 || Number(active.team) >= game.teams.length || !(active.deadline === null || typeof active.deadline === 'number' && Number.isFinite(active.deadline))) return newJeopardyGame();
    }
    return game as unknown as JeopardyGame;
  } catch { return newJeopardyGame(); }
}
