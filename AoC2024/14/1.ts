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

  // for (let i = 0; i < height; i++) {
  //   const row = [];
  //   for (let j = 0; j < width; j++) {
  //     const robotsInSpace = finalRobots.filter((r) => r.position.x === j && r.position.y === i);
  //     row.push(robotsInSpace.length > 0 ? robotsInSpace.length : ".");
  //   }
  //   console.log(row.join(""));
  // }
  const midX = (width - 1) / 2;
  const midY = (height - 1) / 2;
  const { q1, q2, q3, q4 } = finalRobots.reduce<{
    q1: Robot[];
    q2: Robot[];
    q3: Robot[];
    q4: Robot[];
  }>(
    (acc, robot) => {
      if (robot.position.x < midX && robot.position.y < midY) {
        acc.q1.push(robot);
      } else if (robot.position.x > midX && robot.position.y < midY) {
        acc.q2.push(robot);
      } else if (robot.position.x < midX && robot.position.y > midY) {
        acc.q3.push(robot);
      } else if (robot.position.x > midX && robot.position.y > midY) {
        acc.q4.push(robot);
      }
      return acc;
    },
    { q1: [], q2: [], q3: [], q4: [] }
  );
  return q1.length * q2.length * q3.length * q4.length;
}

console.log(runSimulation(speeds, map.width, map.height, 100));
