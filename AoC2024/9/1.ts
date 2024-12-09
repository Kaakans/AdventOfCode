import { input } from "./input.ts";

function convertToIds(raw: string): number[] {
  let converted = [];
  for (let id = 0; id < raw.length; id++) {
    const d = parseInt(raw[id]);
    for (let val = 0; val < d; val++) {
      converted.push(id % 2 === 0 ? id / 2 : -1);
    }
  }
  return converted;
}

function compactData(data: number[]) {
  let right = data.length - 1;
  for (let left = 0; left < data.length; left++) {
    if (left >= right) break;

    if (data[left] === -1) {
      while (data[right] === -1) {
        right--;
      }
      data[left] = data[right];
      data[right] = -1;
    }
  }
  return data;
}

function calculateChecksum(compactedData: number[]) {
  let tot = 0;
  const dataWithoutFreeSpace = compactedData.filter((val) => val > -1);
  for (let i = 0; i < dataWithoutFreeSpace.length; i++) {
    tot += dataWithoutFreeSpace[i] * i;
  }
  return tot;
}

const converted = convertToIds(input);
const compacted = compactData(converted);
const checksum = calculateChecksum(compacted);
console.log(checksum);
