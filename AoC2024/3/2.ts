import { input } from "./input.ts";

const doSubstring = /(^|do\(\)).+?(?=don't\(\))/g;
const multiplySubstring = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;

let tot = 0;

for (const outerMatch of input.matchAll(doSubstring)) {
  for (const match of outerMatch[0].matchAll(multiplySubstring)) {
    const [factor1, factor2] = match[0]
      .replace("mul(", "")
      .replace(")", "")
      .split(",")
      .map(Number);
    tot += factor1 * factor2;
  }
}

console.log(tot);
