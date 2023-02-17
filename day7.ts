import { day7 } from "./inputs.ts";

const currentDir = new Array<string>();
const dirs = new Map<string,number>();

// ===== Part 1 ==============================================================================================

day7.split("\n").forEach( line => {
  let matches: RegExpMatchArray | null;
  // deno-lint-ignore no-cond-assign
  if (matches = line.match(/^\$ cd (\w+|\/)/)) {
    const nextDir = matches[1];
    currentDir.push(nextDir);
  // deno-lint-ignore no-cond-assign
  } else if (matches = line.match(/^\$ cd \.\./)) {
    currentDir.pop();
  } else if (line.match(/^dir/) || line.match(/^\$ ls/)) {
    // directory entries can be ignored, there will be a cd into them later
    // ls commands can be ignored, they are issued after each cd
    return;
  } else {
    // add the size to current directory and all parent directories
    for (let i = 0; i < currentDir.length; i++) {
      const partialPath = currentDir.slice(0, i + 1);
      const dirString = partialPath.join("/");
      const sizeOfFile = line.split(" ")[0];
      let dirSum = dirs.get(dirString) || 0;
      dirSum += parseInt(sizeOfFile, 10);
      dirs.set(dirString, dirSum);
    }
  }
});

let sizeOfSmallDirs = 0;
dirs.forEach( (value /*, key*/) => {
  //console.log(`dir ${key}, size: ${value}`);
  if (value <= 100000) {
    sizeOfSmallDirs += value;
  }
});

console.log(`Sum of the total sizes of directories <100000: ${sizeOfSmallDirs}`);

// ===== Part 2 ==============================================================================================

const freeSpace = 70000000 - (dirs.get("/") || 0);
const neededSpace = 30000000 - freeSpace;
let smallestDirToDelete = 30000000;

dirs.forEach( (value /*, key*/) => {
  if (value >= neededSpace && value < smallestDirToDelete) {
    smallestDirToDelete = value;
    //console.log(`dir ${key}, size: ${value}`);
  }
});

console.log(`Free space is ${freeSpace}, so needed space is ${neededSpace}. Smallest dir that is larger than the needed space is ${smallestDirToDelete}.`);
