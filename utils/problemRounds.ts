/**
 * Problems that belong to one practice round, in order.
 *
 * A problem slide shows one problem on the projector, while each device shows
 * the whole round as tabs, so students keep working on earlier problems after
 * the presenter moves on. Ids match `server/problems/`; text lives in
 * `locales/` under `problems.<id>`.
 */
export const PROBLEM_ROUNDS: Record<string, string[]> = {
  loops: ['loops-fish'],
  functions: ['functions-area'],
}
