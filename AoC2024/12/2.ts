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

function isInBounds({ x, y }: Position, map: string[][]) {
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

type Fence = Position & {
  side: "north" | "south" | "east" | "west";
};

function getFencePrice(region: Position[]): number {
  const fences: Fence[] = [];

  for (const position of region) {
    const hasNodeNorth = region.some(
      ({ x, y }) => y === position.y - 1 && x === position.x
    );
    if (!hasNodeNorth) {
      fences.push({ ...position, side: "north" });
    }

    const hasNodeSouth = region.some(
      ({ x, y }) => y === position.y + 1 && x === position.x
    );
    if (!hasNodeSouth) {
      fences.push({ ...position, side: "south" });
    }

    const hasNodeEast = region.some(
      ({ x, y }) => y === position.y && x === position.x + 1
    );
    if (!hasNodeEast) {
      fences.push({ ...position, side: "east" });
    }

    const hasNodeWest = region.some(
      ({ x, y }) => y === position.y && x === position.x - 1
    );
    if (!hasNodeWest) {
      fences.push({ ...position, side: "west" });
    }
  }

  const groups = Object.groupBy(fences, (item) => item.side);

  const uniqueFences: Fence[][] = [];
  let currentFence: Fence[] = [];
  
  const northFacingFences = groups.north
    ? Object.groupBy(groups.north, (item) => item.y)
    : {};
  for (const group of Object.values(northFacingFences)) {
    if (!group) continue;

    for (const fence of group.sort((p1, p2) => p1.x - p2.x)) {
      const isPartOfOngoingFence = currentFence.some(
        (pos) =>
          pos.y === fence.y && (pos.x === fence.x - 1 || pos.x === fence.x + 1)
      );
      if (currentFence.length === 0 || isPartOfOngoingFence) {
        currentFence.push(fence);
      } else {
        uniqueFences.push(currentFence);
        currentFence = [fence];
      }
    }

    if (currentFence.length > 0) {
      uniqueFences.push(currentFence);
      currentFence = [];
    }
  }

  const southFacingFences = groups.south
    ? Object.groupBy(groups.south, (item) => item.y)
    : {};
  for (const group of Object.values(southFacingFences)) {
    if (!group) continue;

    for (const fence of group.sort((p1, p2) => p1.x - p2.x)) {
      const isPartOfOngoingFence = currentFence.some(
        (pos) =>
          pos.y === fence.y && (pos.x === fence.x - 1 || pos.x === fence.x + 1)
      );
      if (currentFence.length === 0 || isPartOfOngoingFence) {
        currentFence.push(fence);
      } else {
        uniqueFences.push(currentFence);
        currentFence = [fence];
      }
    }
    if (currentFence.length > 0) {
      uniqueFences.push(currentFence);
      currentFence = [];
    }
  }

  const eastFacingFences = groups.east
    ? Object.groupBy(groups.east, (item) => item.x)
    : {};
  for (const group of Object.values(eastFacingFences)) {
    if (!group) continue;

    for (const fence of group.sort((p1, p2) => p1.y - p2.y)) {
      const isPartOfOngoingFence = currentFence.some(
        (pos) =>
          pos.x === fence.x && (pos.y === fence.y - 1 || pos.y === fence.y + 1)
      );
      if (currentFence.length === 0 || isPartOfOngoingFence) {
        currentFence.push(fence);
      } else {
        uniqueFences.push(currentFence);
        currentFence = [fence];
      }
    }
    if (currentFence.length > 0) {
      uniqueFences.push(currentFence);
      currentFence = [];
    }
  }

  const westFacingFences = groups.west
    ? Object.groupBy(groups.west, (item) => item.x)
    : {};
  for (const group of Object.values(westFacingFences)) {
    if (!group) continue;

    for (const fence of group.sort((p1, p2) => p1.y - p2.y)) {
      const isPartOfOngoingFence = currentFence.some(
        (pos) =>
          pos.x === fence.x && (pos.y === fence.y - 1 || pos.y === fence.y + 1)
      );
      if (currentFence.length === 0 || isPartOfOngoingFence) {
        currentFence.push(fence);
      } else {
        uniqueFences.push(currentFence);
        currentFence = [fence];
      }
    }
    if (currentFence.length > 0) {
      uniqueFences.push(currentFence);
      currentFence = [];
    }
  }

  return region.length * uniqueFences.length;
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
