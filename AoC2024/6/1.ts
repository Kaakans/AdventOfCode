import { map } from "./input.ts";

const up = "^";
const right = ">";
const down = "v";
const left = "<";
const guardPositions = [up, right, down, left] as const;
type GuardPosition = (typeof guardPositions)[number];

const turnMap: Map<GuardPosition, GuardPosition> = new Map([
  [up, right],
  [right, down],
  [down, left],
  [left, up],
]);

const obstructions = "#";

type Position = {
  row: number;
  col: number;
  direction: GuardPosition;
};

function isGuardPosition(c: string): c is GuardPosition {
  return c === up || c === right || c === down || c === left;
}

function locateGuard(map: string[]): Position {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const current = map[row][col];
      if (isGuardPosition(current)) {
        return { row, col, direction: current };
      }
    }
  }

  throw new Error("Guard not found");
}

function guardLeftMap(guardPosition: Position, map: string[]): boolean {
  const { row, col } = guardPosition;
  return row >= map.length || col >= map[0].length;
}

function countXs(map: string[]): number {
  return map.reduce(
    (sum, row) => row.split("").filter((c) => c === "X").length + sum,
    0
  );
}

function logMap(map: string[]): void {
  console.log();
  for (const row of map) {
    console.log(row);
  }
}

function calculateSteps(map: string[]): number {
  logMap(map);
  let guardPosition = locateGuard(map);
  console.log("Guard starting position", guardPosition);

  while (guardPosition) {
    const { row, col, direction } = guardPosition;
    console.log("guard is on the move", guardPosition);

    const updatedRow = map[row].split("").toSpliced(col, 1, "X").join("");
    console.log("updatedRow", updatedRow);
    map.splice(row, 1, updatedRow);

    const nextPositionInCurrentDirection = {
      row: direction === up ? row - 1 : direction === down ? row + 1 : row,
      col: direction === left ? col - 1 : direction === right ? col + 1 : col,
      direction,
    };

    if (guardLeftMap(nextPositionInCurrentDirection, map)) {
      console.log("guardLeftMap", guardPosition);
      logMap(map);
      break;
    }

    const nextSpaceIsObstructed =
      map[nextPositionInCurrentDirection.row][
        nextPositionInCurrentDirection.col
      ] === obstructions;
    const nextDirection = nextSpaceIsObstructed
      ? turnMap.get(direction)!
      : direction;
    console.log("nextSpaceIsObstructed", nextSpaceIsObstructed);
    console.log("nextDirection", nextDirection);

    guardPosition = {
      row:
        nextDirection === up ? row - 1 : nextDirection === down ? row + 1 : row,
      col:
        nextDirection === left
          ? col - 1
          : nextDirection === right
          ? col + 1
          : col,
      direction: nextDirection,
    };
  }

  return countXs(map);
}

console.log(calculateSteps(map));
