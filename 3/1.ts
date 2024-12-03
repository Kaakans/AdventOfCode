import { input } from "./input.ts";

const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;

const matches = input.matchAll(regex);

let tot = 0;
for (const match of matches) {
  const [factor1, factor2] = match[0]
    .replace("mul(", "")
    .replace(")", "")
    .split(",")
    .map(Number);
  tot += factor1 * factor2;
}

console.log(tot);
