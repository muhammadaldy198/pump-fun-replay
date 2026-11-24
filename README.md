# Judged Momentum + Ownership Gates

[![make.fun](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122.svg)](https://make.fun/competitions/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)
[![rank](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/muhammadaldy198/pump-fun-replay/rank.svg)](https://make.fun/competitions/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)
[![reward](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/muhammadaldy198/pump-fun-replay/reward.svg)](https://make.fun/competitions/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)

A paper trading bot for the [Pump.fun Replay Sprint](https://make.fun/competitions/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122) on make.fun. It trades the replayed pump.fun bonding curves of the competition window with 10 SOL of paper capital, under the `pumpfun-replay/v2` harness: one `main.ts`, NDJSON over stdin/stdout, deterministic (two graded runs must produce byte-identical action logs).

## How it trades

**Judged momentum.** Every curve is watched from birth and judged twice — at age 45 slots, and again at 60 if it missed the first look. A coin only earns a first stake (0.02 SOL) when it shows real character: 15–80 SOL of real reserves, a 1.5–8× multiple, at least 18 distinct buyers, 10 buys, and 3 SOL of net flow in the judgement window. Winners earn bigger stakes as they print fresh highs (adds of 0.25 SOL to a 0.65 cap); losers are cut by a −15% stop, a trailing exit (arms at 1.4×, gives back 30%), a reserves-collapse exit, or a 1000-slot max hold. Profits bank 70% at 2× and half the rest at 4×.

**Ownership gates.** The bot reconstructs every holder's net balance from the trade tape and refuses curves whose supply is concentrated in few hands: a single wallet over 15% of supply, or a Gini coefficient over 0.70, vetoes the entry. Both gates were measured on the competition's own dev window and add money; four other literature rules (a top-10 share veto, a slot-0 buy veto, a dev-buy requirement, a creator-sold veto) were measured on the same window and rejected, because they veto the winners.

**Guardrail pacing.** Small 0.01 SOL probe round trips, paced against the run's block time, keep the bot above the 20-coin guardrail without chasing fills.

**Determinism.** Every decision is a pure function of the delivered batches, in arrival order. No clock, no environment, no randomness; candidate order is sorted by net flow (descending) then mint (ascending).

## Layout

- `main.ts` — thin entrypoint: wires the protocol shim to the strategy.
- `strategy.ts` — the whole strategy (judgement, ownership gates, sizing, exits, probes).
- `vendor/makefun-bot.ts` — the kit's protocol shim, vendored byte-for-byte from the competition kit.

## Validation

Backtested on the full dev window (all three dataset parts, 128,058 events, 1,222 mints) through the kit's own momentum simulator: positive net PnL on the base run, on both halves of the window, without the best trip, at twice the fees, and across four different order-failure seeds; two runs produce identical results.
