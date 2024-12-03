import { left, right } from "./input.ts";

let tot = 0;
const similarities: Record<number, boolean> = {};
for (let i = 0; i < left.length; i++) {
  if (similarities[left[i]]) {
    continue;
  }

  const rightCount = right.filter((x) => x === left[i]).length;
  tot += left[i] * rightCount;

  if (rightCount) {
    console.log("left", left[i]);
    console.log("rightCount", rightCount);
    console.log("tot", tot);
    console.log();
  }

  similarities[left[i]] = true;
}

console.log(tot);
