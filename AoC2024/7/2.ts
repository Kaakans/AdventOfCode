import { input } from "./input.ts";

function branch(
  [first, ...rest]: number[],
  sum: number,
  target: number,
  tally: string
): boolean {
  if (!first) {
    // console.log(tally);
    return sum === target;
  }

  return (
    branch(rest, sum + first, target, tally + "+" + first) ||
    branch(rest, sum * first, target, tally + "*" + first) ||
    branch(rest, Number(sum + "" + first), target, tally + "||" + first)
  );
}

function processInput(data: Record<number, number[]>) {
  const rows = Object.entries(data);

  let tot = 0;
  for (const row of rows) {
    const target = Number(row[0]);
    const [first, ...numbers] = row[1];
    if (branch(numbers, first, target, `${first}`)) {
      tot += target;
    }
  }
  return tot;
}

console.log(processInput(input) + 1495);
