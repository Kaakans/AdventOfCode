import { map } from "./input.ts";

const up = "^";
const right = ">";
const down = "v";
const left = "<";

const guardPositions = [up, right, down, left] as const;
type GuardPosition = (typeof guardPositions)[number];
function isGuardPosition(c: string): c is GuardPosition {
  return c === up || c === right || c === down || c === left;
}

const turnMap: Record<GuardPosition, GuardPosition> = {
  [up]: right,
  [right]: down,
  [down]: left,
  [left]: up,
};

const obstruction = "#";
const newObstruction = "O";

const obstructions = [obstruction, newObstruction] as const;
type Obstruction = (typeof obstructions)[number];
function isObstructed(c: string): c is Obstruction {
  return obstructions.includes(c as Obstruction);
}

type Position = {
  row: number;
  col: number;
  direction: GuardPosition;
};
type GuardMapKey = `${Position["row"]},${Position["col"]}`;

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

function getNextSpace(map: string[], { row, col, direction }: Position): string | undefined {
  if (direction === up) return map[row-1]?.[col];
  if (direction === down) return map[row+1]?.[col];
  if (direction === left) return map[row]?.[col-1];
  return map[row]?.[col+1];
}

function calculateSteps(map: string[]): boolean {
  const guardMap = new Map<GuardMapKey, GuardPosition[]>([]);

  let currentGuardPosition = locateGuard(map);
  while (currentGuardPosition) {
    const { row, col, direction } = currentGuardPosition;

    // if obstructed, turn
    // Check next space
    let nextSpaceInCurrentDirection = getNextSpace(map, currentGuardPosition);

    // Exit if next space is out of bounds of the map
    if (!nextSpaceInCurrentDirection) {
      return false;
    }

    let newDirection = direction;
    while (isObstructed(nextSpaceInCurrentDirection)) {
      newDirection = turnMap[newDirection];

      nextSpaceInCurrentDirection = getNextSpace(map, {
        ...currentGuardPosition,
        direction: newDirection,
      });
      if (!nextSpaceInCurrentDirection) {
        return false;
      }
    }

    // Exit if guard is stuck in a loop
    const previousDirections = guardMap.get(`${row},${col}`) || [];
    if (previousDirections.includes(newDirection)) {
      return true;
    }

    // - add current position and direction to guardMap
    guardMap.set(`${row},${col}`, [...previousDirections, newDirection]);

    // move to next space
    const nextRow =
      newDirection === up ? row - 1 : newDirection === down ? row + 1 : row;
    const nextCol =
      newDirection === left ? col - 1 : newDirection === right ? col + 1 : col;
    currentGuardPosition = {
      row: nextRow,
      col: nextCol,
      direction: newDirection,
    };
  }

  return false;
}

function tryObstruction(map: string[], row: number, col: number) {
  if (map[row][col] === obstruction || map[row][col] === up) {
    return false;
  }

  const mapCopy = map.map((r) => r);
  const updatedRow = mapCopy[row].split("").toSpliced(col, 1, newObstruction).join("");
  mapCopy.splice(row, 1, updatedRow);

  return calculateSteps(mapCopy);
}

function tryObstructions(map: string[]) {
  let tot = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const resultedInLoop = tryObstruction(map, row, col);
      tot += resultedInLoop ? 1 : 0;
    }
  }
  return tot;
}

console.log(tryObstructions(map));
