import { day10 } from "./inputs.ts";

const instructions = day10.split("\n").map( instruction => {
  const matches = instruction.match(/^(noop|addx) ?(\-?\d*)/);
  return { inst: matches && matches[1] || "noop", op: parseInt(matches && matches[2] || "0") };
});

const cycleTimes: Map<string, number> = new Map([["noop", 1], ["addx", 2]]);

// ===== Part 1 ==============================================================================================

let X = 1;

const probingCycles = [20, 60, 100, 140, 180, 220];
let nextCycle = probingCycles.shift();
let cycleAfterNextInstruction = 1;
let sumOfSignalStrengths = 0;
for (const instruction of instructions) {
  //console.log(`The current inst ${instruction.inst} starts at cycle ${cycleAfterNextInstruction}.`);
  cycleAfterNextInstruction += cycleTimes.get(instruction.inst) || 0;
  if (nextCycle && cycleAfterNextInstruction > nextCycle) {
    console.log(`The current inst will be finished after cycle ${cycleAfterNextInstruction}, currently X is ${X}, signal strength is ${ nextCycle * X }`);
    sumOfSignalStrengths += nextCycle * X;
    nextCycle = probingCycles.shift();
  }
  X += instruction.op;
}

console.log(`Sum of signal strengths: ${sumOfSignalStrengths}`);

// ===== Part 2 ==============================================================================================

let spritePosition = 1;
let currentCycle = 1;
const pixels: Array<boolean> = [];

cycleAfterNextInstruction = 1;
for (const instruction of instructions) {
  console.log(`The next inst ${instruction.inst} starts at cycle ${cycleAfterNextInstruction} ...`);
  cycleAfterNextInstruction += cycleTimes.get(instruction.inst) || 0;
  console.log(`... and will be finished before cycle ${cycleAfterNextInstruction}`);
  while (currentCycle < cycleAfterNextInstruction) {
    const currentPixelX = (currentCycle - 1) % 40;
    pixels.push( Math.abs(currentPixelX - spritePosition) < 2 );
    console.log(`  Executing cycle ${currentCycle}, current spritePosition is ${spritePosition}, current pixel x is ${currentPixelX}`);
    currentCycle++;
  }
  spritePosition += instruction.op;
  console.log(`  The current inst ${instruction.inst} has finished executing, new spritePosition is ${spritePosition}`);
}

let nextRow = pixels.splice(0,40);
while ( nextRow.length > 0 ) {
  console.log( nextRow.map( pixel => pixel ? "#": " " ).join("") );
  nextRow = pixels.splice(0,40);
}
