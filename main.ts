// Pump.fun Replay Sprint — entrypoint. The grader runs this file as
// `node /bot/main.ts` (Node 22.23.4, erasable TypeScript, no build).
// It only wires the protocol shim to the strategy: the shim owns the
// hello/batch/orders/slot wire, the strategy decides the orders.
//
// Strategy: Judged Momentum + Ownership Gates (see strategy.ts).
// Locked tuning: judgement 45+60, >=18 buyers, flow >=3 SOL,
// top-1 veto 15% + Gini veto 0.70, adds 0.25 to 0.65, stop -15%.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

const strategy = createStrategy(DEFAULT_PARAMS);

await runBot({
  onBatch: (state, batch) => strategy.onBatch(state, batch),
});
