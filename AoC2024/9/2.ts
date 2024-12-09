import { input } from "./input.ts";

function convertToIds(raw: string): number[][] {
  let converted = [];
  for (let id = 0; id < raw.length; id++) {
    const d = parseInt(raw[id]);
    let file = [];
    for (let val = 0; val < d; val++) {
      file.push(id % 2 === 0 ? id / 2 : -1);
    }
    converted.push(file);
  }
  return converted;
}

function compData(data: number[][]) {
  const mappedData = data.map((file) => ({ wasMoved: false, file }));

  for (let right = mappedData.length - 1; right >= 0; right--) {
    if (mappedData[right].wasMoved) continue;
    // Block is not empty
    if (mappedData[right].file.length === 0) continue;
    // Block does not contain a file
    if (mappedData[right].file.some((val) => val === -1)) continue;

    for (let left = 0; left <= right; left++) {
      if (mappedData[left].wasMoved) continue;
      // Block is not empty
      if (!mappedData[left].file.some((val) => val === -1)) continue;
      // Block is not large enough
      if (mappedData[right].file.length > mappedData[left].file.length)
        continue;

      const copy = { wasMoved: true, file: [...mappedData[right].file] };
      mappedData.splice(
        right,
        1,
        { wasMoved: true, file: mappedData[right].file.map(() => -1) }
      );

      if (mappedData[right].file.length < mappedData[left].file.length) {
        const isNextBlockEmpty = mappedData[left+1].file.some((val) => val === -1);
        const remaining = {
          wasMoved: false,
          file: Array.from(
            {
              length:
                mappedData[left].file.length -
                mappedData[right].file.length +
                (isNextBlockEmpty ? mappedData[left + 1].file.length : 0),
            },
            () => -1
          ),
        };
        mappedData.splice(left + 1, isNextBlockEmpty ? 1 : 0, remaining);
      }
      mappedData.splice(left, 1, copy);
      break;
    }
  }
  return mappedData.map((block) => block.file);
}

function calculateChecksum(compactedData: number[][]) {
  return compactedData
    .flatMap((v) => v)
    .reduce((sum, value, i) => (sum + (value !== -1 ? value * i : 0)), 0);
}

function doIt(raw: string) {
  const converted = convertToIds(raw);
  const compacted = compData(converted);
  const checksum = calculateChecksum(compacted);
  return checksum;
}

console.log(doIt(input));
