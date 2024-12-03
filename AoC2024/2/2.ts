import { input } from "./input.ts";

function buildDiffSequence(
  [current, next, ...rest]: number[],
  diffs: number[] = []
) {
  if (!next) {
    return diffs;
  }

  diffs.push(next - current);
  return buildDiffSequence([next, ...rest], diffs);
}

function isSequenceValid(diffs: number[]) {
  return (
    diffs.every((r) => Math.abs(r) <= 3 && r < 0) ||
    diffs.every((r) => Math.abs(r) <= 3 && r > 0)
  );
}

let tot = 0;
for (const row of input) {
  const permutations: number[][] = [];
  for (let i = 0; i < row.length; i++) {
    const copy = [...row];
    copy.splice(i, 1);
    permutations.push(copy);
  }
  tot += permutations.some((p) => isSequenceValid(buildDiffSequence(p)))
    ? 1
    : 0;
}
console.log("Result:", tot);
