import { input } from './input.ts'

function handleStone(stone: number): number[] {
  if (stone === 0) {
    return [1];
  } 

  const stoneString = `${stone}`;
  if (stoneString.length % 2 === 0) {
    const part1 = parseInt(stoneString.substring(0, stoneString.length / 2));
    const part2 = parseInt(stoneString.substring(stoneString.length / 2));
    return [part1, part2];
  }

  return [stone * 2024];
}

function blink(stones: number[], times: number): number[] {
  let currentStones: number[] = [...stones];
  for (let i = 0; i < times; i++) {
    currentStones = currentStones.flatMap((stone) => handleStone(stone));
  }
  return currentStones;
}

console.log(blink(input, 25).length);