import { input } from "./input.ts";

type Position = { x: number; y: number; height: number };
type Trail = Position[];

function calculateTrail(map: number[][], trail: Trail): Trail[] {
  const [{ x, y, height }] = trail;
  if (height === 9) {
    return [trail];
  }

  const positionsToCheck = [];

  const north = map[y - 1]?.[x];
  if (north && north === height + 1) {
    positionsToCheck.push({
      x,
      y: y - 1,
      height: north,
    });
  }
  const south = map[y + 1]?.[x];
  if (south && south === height + 1) {
    positionsToCheck.push({
      x,
      y: y + 1,
      height: south,
    });
  }
  const west = map[y]?.[x - 1];
  if (west && west === height + 1) {
    positionsToCheck.push({
      x: x - 1,
      y,
      height: west,
    });
  }
  const east = map[y]?.[x + 1];
  if (east && east === height + 1) {
    positionsToCheck.push({
      x: x + 1,
      y,
      height: east,
    });
  }

  const possibleTrails: Trail[] = [];
  for (const position of positionsToCheck) {
    possibleTrails.push(...calculateTrail(map, [position, ...trail]));
  }
  return possibleTrails;
}

function calculateTrails(map: number[][]) {
  let trailHeadCount = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) {
        const trails = calculateTrail(map, [{ x, y, height: map[y][x] }]);
        trailHeadCount += trails.length;
      }
    }
  }
  return trailHeadCount;
}

const map = input.map((row) => row.split("").map((x) => parseInt(x)));
const trailHeadCount = calculateTrails(map);
console.log(trailHeadCount);
