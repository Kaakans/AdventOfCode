import { left, right } from "./input.ts";

const sortedLeft = left.sort();
const sortedRight = right.sort();

let tot = 0;
for (let i = 0; i < sortedLeft.length; i++) {
  tot += Math.abs(sortedLeft[i] - sortedRight[i]);
}

console.log(tot);
