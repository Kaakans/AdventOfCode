import { input } from "./input.ts";

type Instruction = {
  type: "input" | "target";
  instruction: string;
  x: number;
  y: number;
};

type InstructionSet = [Instruction, Instruction, Instruction];

function parseInstruction(instruction: string): Instruction {
  const [, i, x, y] =
    instruction.match(/(Button [AB]|Prize): X[\+|=](\d+), Y[\+|=](\d+)/) ?? [];
  return {
    instruction: i === undefined ? "target" : i,
    type: i === "Prize" ? "target" : "input",
    x: parseInt(x),
    y: parseInt(y),
  };
}

function parseInstructions(instructions: string[]) {
  const sets: InstructionSet[] = [];
  
  for (let i = 0; i < instructions.length; i += 3) {
    sets.push([
      parseInstruction(instructions[i]),
      parseInstruction(instructions[i+1]),
      parseInstruction(instructions[i+2]),
    ]);
  }

  return sets;
}

type Result = {
  instructions: InstructionSet;
  tokensRequired: number;
}

function getPossiblePermutations(
  instructionSet: InstructionSet,
  limit: number
): Result {
  const tokenCostA = 3;
  const tokenCostB = 1;
  const result: Result = {
    instructions: instructionSet,
    tokensRequired: 0,
  };

  const [inputA, inputB, { x, y }] = instructionSet;

  const inputAValueMap = new Map<number, [number, number]>();
  for (let i = 0; i < limit; i++) {
    inputAValueMap.set(i, [inputA.x * i, inputA.y * i]);
  }

  for (let a = 0; a < limit; a++) {
    for (let b = 0; b < limit; b++) {
      const [x1, y1] = inputAValueMap.get(a)!;
      const currentTargetX = x1 + inputB.x * b;
      const currentTargetY = y1 + inputB.y * b;
      const hitsTarget = currentTargetX === x && currentTargetY === y;

      if (!hitsTarget) continue;

      if (result.tokensRequired) {
        result.tokensRequired = Math.min(
          result.tokensRequired,
          a * tokenCostA + b * tokenCostB
        );
      } else {
        result.tokensRequired = a * tokenCostA + b * tokenCostB;
      }
    }
  }

  return result;
}

function getAllPossiblePermutations(
  instructionSets: InstructionSet[],
  limit: number
) {
  let tot = 0;
  for (const instructionSet of instructionSets) {
    tot += getPossiblePermutations(instructionSet, limit).tokensRequired;
  }
  return tot;
};

const instructions = parseInstructions(input);
const possiblePermutations = getAllPossiblePermutations(instructions, 100);
console.log(possiblePermutations);
