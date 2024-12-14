import { speeds, map } from "./input.ts";

type Position = {
  x: number;
  y: number;
};

type Robot = {
  id: number;
  position: Position;
  speed: Position;
};

function simulateRobot(
  robot: Robot,
  iterations: number,
  width: number,
  height: number
): Robot {
  const newPosition = {
    x:
      (((robot.position.x + robot.speed.x * iterations) % width) + width) %
      width,
    y:
      (((robot.position.y + robot.speed.y * iterations) % height) + height) %
      height,
  };
  return {
    ...robot,
    position: newPosition,
  };
}

function parseInput(input: string[]): Robot[] {
  const robots: Robot[] = [];
  const instructionRegex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

  for (let i = 0; i < input.length; i++) {
    const [_, x, y, vx, vy] =
      input[i].match(instructionRegex)!.map(Number) ?? [];
    robots.push({
      id: i,
      position: { x, y },
      speed: { x: vx, y: vy },
    });
  }
  return robots;
}

function multipleRobotsInSameLine(robots: Robot[]): boolean {
  const robotLineMap = new Map<number, number>();
  const robotColumnMap = new Map<number, number>();

  for (const robot of robots) {
    if (!robotLineMap.has(robot.position.y)) {
      robotLineMap.set(robot.position.y, 1);
    } else {
      robotLineMap.set(robot.position.y, robotLineMap.get(robot.position.y)! + 1);
    }
    if (!robotColumnMap.has(robot.position.x)) {
      robotColumnMap.set(robot.position.x, 1);
    } else {
      robotColumnMap.set(
        robot.position.x,
        robotColumnMap.get(robot.position.x)! + 1
      );
    }
  }

  const ROBOT_REQUIREMENT = 20;
  const ROBOT_COUNT_REQUIREMENT = 3;
  const line =
    Array.from(robotLineMap.values()).filter((v) => v > ROBOT_REQUIREMENT)
      .length > ROBOT_COUNT_REQUIREMENT;
  const column =
    Array.from(robotColumnMap.values()).filter((v) => v > ROBOT_REQUIREMENT)
      .length > ROBOT_COUNT_REQUIREMENT;
  return line && column;
}

function runSimulation(
  input: string[],
  width: number,
  height: number,
  iterations: number
) {
  const robots: Robot[] = parseInput(input);
  const finalRobots = robots.map((robot) =>
    simulateRobot(robot, iterations, width, height)
  );

  if (multipleRobotsInSameLine(finalRobots)) {
    console.log('Iteration:', iterations);
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const robotsInSpace = finalRobots.filter(
          (r) => r.position.x === j && r.position.y === i
        );
        row.push(robotsInSpace.length > 0 ? robotsInSpace.length : ".");
      }
      console.log(row.join(""));
    }
    return true;
  }
  return false;
}

function findEasterEgg(input: string[], width: number, height: number) {
  let result = false;
  let iterations = 0;
  while (!result) {
    iterations++;
    result = runSimulation(input, width, height, iterations);
  }
}

findEasterEgg(speeds, map.width, map.height);