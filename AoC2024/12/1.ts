import { input } from "./input.ts";

type Position = {
  x: number;
  y: number;
};

function isSamePosition(
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position
) {
  return x1 === x2 && y1 === y2;
}

function isInBounds(
  { x, y }: Position,
  map: string[][],
) {
  return y >= 0 && y < map.length && x >= 0 && x < map[y].length;
}

function getRegion(startPosition: Position, map: string[][]): Position[] {
  const currentRegion: Position[] = [];
  const regionsToCheck: Position[] = [startPosition];
  
  while (regionsToCheck.length > 0) {
    const regionToCheck = regionsToCheck.pop();
    if (!regionToCheck) break;

    const isSamePlantType =
      map[regionToCheck.y][regionToCheck.x] !==
      map[startPosition.y][startPosition.x];
    if (isSamePlantType) continue;

    currentRegion.push(regionToCheck);

    const north = { x: regionToCheck.x, y: regionToCheck.y - 1 };
    const northHasAlreadyBeenAdded =
      currentRegion.some((p) => isSamePosition(p, north)) ||
      regionsToCheck.some((p) => isSamePosition(p, north));
    if (!northHasAlreadyBeenAdded && isInBounds(north, map)) {
      regionsToCheck.push(north);
    }

    const south = { x: regionToCheck.x, y: regionToCheck.y + 1 };
    const southHasAlreadyBeenAdded =
      currentRegion.some((p) => isSamePosition(p, south)) ||
      regionsToCheck.some((p) => isSamePosition(p, south));
    if (!southHasAlreadyBeenAdded && isInBounds(south, map)) {
      regionsToCheck.push(south);
    }

    const east = { x: regionToCheck.x - 1, y: regionToCheck.y };
    const eastHasAlreadyBeenAdded =
      currentRegion.some((p) => isSamePosition(p, east)) ||
      regionsToCheck.some((p) => isSamePosition(p, east));
    if (!eastHasAlreadyBeenAdded && isInBounds(east, map)) {
      regionsToCheck.push(east);
    }

    const west = { x: regionToCheck.x + 1, y: regionToCheck.y };
    const westHasAlreadyBeenAdded =
      currentRegion.some((p) => isSamePosition(p, west)) ||
      regionsToCheck.some((p) => isSamePosition(p, west));
    if (!westHasAlreadyBeenAdded && isInBounds(west, map)) {
      regionsToCheck.push(west);
    }
  }

  for (const position of currentRegion) {
    map[position.y][position.x] = ".";
  }

  return currentRegion;
}

function getRegions(map: string[][]): Position[][] {
  const regionMap = new Map<string, Position[][]>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const plantType = map[y][x];
      if (plantType === ".") continue;

      const region = getRegion({ x, y }, map);

      if (!regionMap.has(plantType)) {
        regionMap.set(plantType, []);
      }
      regionMap.get(plantType)?.push(region);
    }
  }

  return [...regionMap.values().flatMap((c) => c)];
}

function getFencePrice(region: Position[]): number {
  const fences = region.reduce((sum, position) => {
    const hasNodeNorth = region.some(({ x, y }) => y === position.y - 1 && x === position.x);
    const hasNodeSouth = region.some(
      ({ x, y }) => y === position.y + 1 && x === position.x);
    const hasNodeEast = region.some(({ x, y }) => y === position.y && x === position.x - 1);
    const hasNodeWest = region.some(({ x, y }) => y === position.y && x === position.x + 1);
    return sum + (hasNodeNorth ? 0 : 1) + (hasNodeSouth ? 0 : 1) + (hasNodeEast ? 0 : 1) + (hasNodeWest ? 0 : 1);
  }, 0);
  
  return region.length * fences;
}

function getFencePrices(regions: Position[][]): number[] {
  return regions.map((region) => getFencePrice(region));
}

function doIt(rawInput: string[]): number {
  const map = rawInput.map((row) => row.split(""));
  const regions = getRegions(map);
  const fencePrices = getFencePrices(regions);
  return fencePrices.reduce((sum, price) => sum + price, 0);
}

console.log(doIt(input));
