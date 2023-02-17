import { day6 } from "./inputs.ts";
const input = day6;

function findNDifferentCharacters( input: string, n: number): number {
  let testStartIndex = -1;
  let found = false;
  const array0ToN = [...Array(n).keys()];
  do {
    testStartIndex++;
    const set = new Set<string>();
    array0ToN.forEach( i => set.add( input[ testStartIndex + i] ) );
    found = set.size === n;
  } while (testStartIndex < input.length - n && !found);
  return testStartIndex + n;  
}

// ===== Part 1 ==============================================================================================

console.log(`First sequence of 4 different characters after character #${findNDifferentCharacters(input, 4)}`);

// ===== Part 2 ==============================================================================================

console.log(`First sequence of 14 different characters after character #${findNDifferentCharacters(input, 14)}`);
