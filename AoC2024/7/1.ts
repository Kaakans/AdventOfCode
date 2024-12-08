import {input}from './testInput.ts';

function branch([first, ...rest]: number[], sum: number, target: number): boolean {
    if (!first) {
      return sum === target;
    }

    const branch1 = branch(rest, sum + first, target);
    if (branch1) {
      return true;
    }

    const branch2 = branch(rest, sum * first, target);
    if (branch2) {
      return true;
    }

    return false;
}

function processInput(data: Record<number, number[]>) {
  const rows = Object.entries(data);
  
  let tot = 0;
  for (const row of rows) {
    const result = Number(row[0]);
    const numbers = row[1];
    if (branch(numbers, 0, result)) {
      tot += result;
    }
  }
  return tot;
}

console.log(processInput(input));
