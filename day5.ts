import { day5 } from "./inputs.ts";

const [ initialConfiguration, moves] = day5.split("\n\n");

const stackStrings = initialConfiguration.split("\n");
const stackNumbers = stackStrings.pop();

const numStacks = stackNumbers!.trim().split(/\D*/).length;
console.log(`Number of stacks: ${numStacks}`);

const instructions = moves.split("\n").map( move => {
  const [, num, from, to] = move.match(/move (\d+) from (\d+) to (\d+)/)!.map( str => parseInt(str, 10));
  return { num: num, from: from - 1, to: to - 1 } // subtracting one as arrays are 0-indexed
});
console.log(instructions);

function getTopCrates(stacks: Array<Array<string>>) {
  return stacks.map( stack => stack.at(-1) ).reduce( (acc, topElement) => { 
    if (topElement === undefined) throw Error("Encountered an empty stack in the end.");
    return acc + topElement; 
  }, "");
}

// ===== Part 1 ==============================================================================================

const stacks: Array<Array<string>> = [];
for (let i = 0; i < numStacks; i++) stacks.push([]);

stackStrings.forEach( (stackLine) => {
  for (let i = 0; i < numStacks; i++) {
    const char = stackLine.charAt( i * 4 + 1);
    if ( char !== " " ) {
      stacks[i].unshift(char);
    }
  }
})
console.log(stacks);

instructions.forEach( inst => {
  for (let i = 0; i < inst.num; i++) {
    const popped  = stacks[inst.from].pop();
    if (popped === undefined) throw Error("Crane tries to take from an empty stack.");
    stacks[inst.to].push(popped);
  }
});

console.log(stacks);
console.log(`Top items at the end of the manipulation: ${getTopCrates(stacks)}`);

// ===== Part 2 ==============================================================================================

const stacks2: Array<Array<string>> = [];
for (let i = 0; i < numStacks; i++) stacks2.push([]);

stackStrings.forEach( (stackLine) => {
  for (let i = 0; i < numStacks; i++) {
    const char = stackLine.charAt( i * 4 + 1);
    if ( char !== " " ) {
      stacks2[i].unshift(char);
    }
  }
})
console.log(stacks2);

instructions.forEach( inst => {
  // get the last num items from the source array and delete them from it
  const tmp = stacks2[inst.from].splice(-inst.num, inst.num);
  // append the tmp array to the destination array
  stacks2[inst.to].push(...tmp);
});

console.log(stacks2);
console.log(`Top items at the end of the manipulation: ${getTopCrates(stacks2)}`);