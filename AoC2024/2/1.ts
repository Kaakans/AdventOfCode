import { input } from "./input.ts";

function parseRow(row: number[]) {
  if (row[0] === row[1]) return false;

  const isIncreasing = row[1] - row[0] > 0 ? true : false;
  for (let i = 1; i < row.length; i++) {
    const diff = row[i] - row[i - 1];

    if (diff === 0) return false;
    if (Math.abs(diff) > 3) return false;
    if (isIncreasing && diff < 0) return false;
    if (!isIncreasing && diff > 0) return false;
  }

  return true;
}

let tot = 0;
for (const row of input) {
  tot += parseRow(row) ? 1 : 0;
}

console.log(tot);
