import { rules, input } from "./input.ts";

function buildRuleMap(raw: [number, number][]): Map<number, Set<number>> {
  const ruleMap = new Map<number, Set<number>>();
  for (const [p1, p2] of raw) {
    const r = ruleMap.get(p1);
    if (r) {
      r.add(p2);
    } else {
      ruleMap.set(p1, new Set([p2]));
    }
  }
  return ruleMap;
}

function doesFollowRules(pages: number[], ruleMap: Map<number, Set<number>>) {
  for (let i = 0; i < pages.length - 1; i++) {
    const page = pages[i];
    const ruleSet = ruleMap.get(page);
    if (!ruleSet) {
      return false;
    }

    for (let j = i + 1; j < pages.length; j++) {
      if (!ruleSet.has(pages[j])) {
        return false;
      }
    }
  }
  return true;
}

function getApproved(
  data: typeof input,
  ruleMap: ReturnType<typeof buildRuleMap>
) {
  const approved = [];
  for (const pages of input) {
    if (doesFollowRules(pages, ruleMap)) {
      approved.push(pages);
    }
  }
  return approved;
}

function getMiddlePageSum(approved: number[][]) {
  let sum = 0;
  for (const pages of approved) {
    const middleIndex = Math.floor(pages.length / 2);
    sum += pages[middleIndex];
  }
  return sum;
}

const ruleMap = buildRuleMap(rules);
const approved = getApproved(input, ruleMap);
const sum = getMiddlePageSum(approved);

console.log(sum);