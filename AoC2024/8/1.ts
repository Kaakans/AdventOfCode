import { input } from "./input.ts";

type Position = {
  row: number;
  col: number;
};

function findCoordinates(rows: string[]): Record<string, Position[]> {
  const antennaMap: Record<string, Position[]> = {};

  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[row].length; col++) {
      const current = rows[row][col];
      const isAntenna = current.match(/[a-z0-9]/i);

      if (!isAntenna) continue;

      if (!antennaMap[current]) {
        antennaMap[current] = [];
      }

      antennaMap[current].push({ row, col });
    }
  }

  return antennaMap;
}

function isPositionInBounds(position: Position, rows: string[]): boolean {
  return (
    position.row >= 0 &&
    position.row < rows.length &&
    position.col >= 0 &&
    position.col < rows[position.row].length
  );
}

function findAntiNodesForPair(
  position1: Position,
  position2: Position
): Position[] {
  const rowDiff = Math.abs(position1.row - position2.row);
  const colDiff = Math.abs(position1.col - position2.col);

  const position1AntiNode = {
    row:
      position1.row < position2.row
        ? position1.row - rowDiff
        : position1.row + rowDiff,
    col:
      position1.col < position2.col
        ? position1.col - colDiff
        : position1.col + colDiff,
  };

  const position2AntiNode = {
    row:
      position2.row < position1.row
        ? position2.row - rowDiff
        : position2.row + rowDiff,
    col:
      position2.col < position1.col
        ? position2.col - colDiff
        : position2.col + colDiff,
  };

  return [position1AntiNode, position2AntiNode];
}

function findAntiNodes(antennaMap: Record<string, Position[]>): Position[] {
  const antennas = Object.entries(antennaMap);
  return antennas.flatMap(([antenna, positions]) => {
    const antiNodes: Position[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        antiNodes.push(...findAntiNodesForPair(positions[i], positions[j]));
      }
    }
    return antiNodes;
  });
}

function doIt(rows: string[]) {
  const antennaMap = findCoordinates(rows);
  const antiNodePairs = findAntiNodes(antennaMap);
  const antiNodesInBounds = antiNodePairs.filter((antiNode, index) =>
    {
      for (let i = index + 1; i < antiNodePairs.length; i++) {
        const compareNode = antiNodePairs[i];
        if (compareNode.row === antiNode.row && compareNode.col === antiNode.col) {
          return false;
        }
      }
      return isPositionInBounds(antiNode, rows);
    }
  );
  
  for (let y = 0; y < rows.length; y++) {
    let newRow = '';
    for (let x = 0; x < rows[y].length; x++) {
      if (antiNodesInBounds.some((a) => a.row === y && a.col === x)) {
        newRow += '#';
        continue;
      }
      if (rows[y][x].match(/[a-z0-9]/i)) {
        newRow += rows[y][x];
        continue;
      }
      newRow += '.';
    }
    console.log(newRow);
  }

  return antiNodesInBounds.length;
}

console.log(doIt(input));
