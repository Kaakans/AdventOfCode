import { input } from "./input.ts";

function isMas(letters: string[]) {
  return letters.includes('M') && letters.includes('S');
}

function doIt(data: string[]) {
  let tot = 0;
  // Skip first and last row
  for (let r = 1; r < data.length - 1; r++) {
    // Skip first and last column
    for (let c = 1; c < data[r].length - 1; c++) {
      if (data[r][c] !== 'A') continue;

      const diagonal1 = [data[r-1][c-1], data[r+1][c+1]];
      const diagonal2 = [data[r-1][c+1], data[r+1][c-1]];
      if (isMas(diagonal1) && isMas(diagonal2)) {
        console.log('X-MAS found at', r, c);
        tot++;
      }
    }
  }
  return tot;
}

console.log(doIt(input));