import { input } from "./input.ts";
// import { input } from "./testInput.ts";

const XMAS = /XMAS/g;
const SAMX = /SAMX/g;

function getDiagonalWords2(data: string[]) {
  const words: string[] = [];

  // Down right
  for (let row = 0; row < data.length - 3; row++) {
    let word = "";

    let r = row;
    let c = 0;

    while (data[r]?.[c]) {
      word += data[r][c];
      r++;
      c++;
    }
    words.push(word);
  }

  for (let col = 1; col < data[0].length - 3; col++) {
    let word = "";

    let r = 0;
    let c = col;

    while (data[r]?.[c]) {
      word += data[r][c];
      r++;
      c++;
    }

    words.push(word);
  }

  // Down left
  for (let row = 0; row < data.length - 3; row++) {
    let word = "";

    let r = row;
    let c = data[row].length - 1;

    while (data[r]?.[c]) {
      word += data[r][c];
      r++;
      c--;
    }

    words.push(word);
  }

  for (let col = 3; col < data[0].length - 1; col++) {
    let word = "";

    let r = 0;
    let c = col;

    while (data[r]?.[c]) {
      word += data[r][c];
      r++;
      c--;
    }

    words.push(word);
  }

  return words;
}

function buildPermutations(data: string[]) {
  // Left right

  let tot = 0;

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    const matches1 = row.matchAll(XMAS);
    const matches2 = row.matchAll(SAMX);
    const m = [];
    for (const match of [...matches1, ...matches2]) {
      tot += 1;
      m.push(match[0]);
    }
    console.log(`Row ${r}:`, row,' - ', m);
  }

  // top down
  let topDown: string[] = [];
  for (let col = 0; col < data.length; col++) {
    const word = data.map((row) => row[col]).join("");
    topDown.push(word);
  }

  for (let c = 0; c < topDown.length; c++) {
    const column = topDown[c];
    const matches1 = column.matchAll(XMAS);
    const matches2 = column.matchAll(SAMX);
    const m = [];
    for (const match of [...matches1, ...matches2]) {
      tot += 1;
      m.push(match[0]);
    }
    console.log(`Column ${c}:`, column, ' - ', m);
  }
  
  // Diagonal
  const words = getDiagonalWords2(data);
  for (const word of words) {
    const matches1 = word.matchAll(XMAS);
    const matches2 = word.matchAll(SAMX);
    const m = [];
    for (const match of [...matches1, ...matches2]) {
      tot += 1;
      m.push(match[0]);
    }
    console.log(`Diagonal:`, word, " - ", m);
  }
  return tot;
}

const tots = buildPermutations(input);
console.log(tots);
