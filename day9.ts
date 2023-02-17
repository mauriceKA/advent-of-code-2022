import { day9 } from "./inputs.ts";
import { goHome } from "https://denopkg.com/iamnathanj/cursor@v2.2.0/mod.ts";

type Move = { dir: "R" | "L" | "U" | "D", steps: number };
const moves: Array<Move>= day9.split("\n").map( line => {
  const parts = line.split(" ");
  const dir = parts[0];
  if (dir !== "R" && dir !== "L" && dir !== "U" && dir !== "D") throw new Error("Unknown move type");
  return { dir: dir, steps: parseInt(parts[1]) };
});

const xOffsets = { "R": 1, "L": -1, "U": 0, "D":  0};
const yOffsets = { "R": 0, "L":  0, "U": 1, "D": -1};

// ===== Part 1 ==============================================================================================

type Pos = {x:number, y:number};
const hPos: Pos = {x:0, y:0};
const tPos: Pos = {x:0, y:0};
let visitedPositions: Set<string> = new Set<string>();

// determine min and max head positions for drawing routine in part 2
let minX = 1000, maxX = 0, minY = 1000, maxY = 0;
function rememberMaxPositions(hPos: Pos) {
  minX = Math.min( minX, hPos.x );
  minY = Math.min( minY, hPos.y );
  maxX = Math.max( maxX, hPos.x );
  maxY = Math.max( maxY, hPos.y );
}

visitedPositions.add(`${tPos.x},${tPos.y}`);
for (const move of moves) {
  for (let i = 0; i < move.steps; i++) {
    // update head
    hPos.x += xOffsets[ move.dir ];
    hPos.y += yOffsets[ move.dir ];
    rememberMaxPositions(hPos);
    // drag along tail
    if (hPos.x - tPos.x >  1) { tPos.x++; tPos.y = hPos.y; } 
    if (hPos.x - tPos.x < -1) { tPos.x--; tPos.y = hPos.y; } 
    if (hPos.y - tPos.y >  1) { tPos.y++; tPos.x = hPos.x; } 
    if (hPos.y - tPos.y < -1) { tPos.y--; tPos.x = hPos.x; }
    // update visited positions 
    visitedPositions.add(`${tPos.x},${tPos.y}`);
  }
}

console.log(`Number of visited positions by the tail: ${visitedPositions.size}`);

// ===== Part 2 ==============================================================================================

const snake: Array<Pos> = new Array<Pos>(10);
for (let i = 0; i < snake.length; i++) snake[i] = {x:0, y:0};

visitedPositions = new Set<string>();

let lastOutput = "";
const { columns, rows } = Deno.consoleSize();
function drawSnake(snake: Pos[]) {
  return new Promise<void>( resolve => {
    const offsetX = -minX;
    const offsetY = -minY;
    const field: Array<Array<string>> = new Array<Array<string>>();
    for (let y = minY; y <= maxY; y++) {
      field[y + offsetY] = new Array<string>();
      for (let x = minX; x <= maxX; x++) {
        field[y + offsetY].push(".");
      }
    }
    field[offsetY][offsetX] = "s"; // mark origin
    // mark segments of snake
    snake.toReversed().forEach( (pos, index) => field[pos.y + offsetY][pos.x + offsetX] = (snake.length - index - 1).toString() );
    const output = field.slice(0, rows - 1).map( lineChars => lineChars.slice(0, columns - 1).join("") ).join("\n");
    if (output != lastOutput) {
      lastOutput = output;
      console.log( output, "\n");
      setTimeout( async () => { 
        await goHome(); 
        resolve() 
      }, 5);
    } else {
      resolve();
    }
  });
}
  

visitedPositions.add(`${snake[9].x},${snake[9].y}`);
for (const move of moves) {
  for (let i = 0; i < move.steps; i++) {
    // update head
    snake[0].x += xOffsets[ move.dir ];
    snake[0].y += yOffsets[ move.dir ];
    await drawSnake(snake);
    // drag along rest of snake
    for (let j = 1; j < snake.length; j++) {
      if (snake[j-1].x - snake[j].x ===  2) { 
        snake[j].x++; 
        snake[j].y += Math.sign(snake[j-1].y - snake[j].y); // move diagonally if necessary
      } else if (snake[j-1].x - snake[j].x === -2) { 
        snake[j].x--; 
        snake[j].y += Math.sign(snake[j-1].y - snake[j].y); // move diagonally if necessary
      } else if (snake[j-1].y - snake[j].y ===  2) { 
        snake[j].y++; 
        snake[j].x += Math.sign(snake[j-1].x - snake[j].x); // move diagonally if necessary
      } else if (snake[j-1].y - snake[j].y === -2) { 
        snake[j].y--; 
        snake[j].x += Math.sign(snake[j-1].x - snake[j].x); // move diagonally if necessary
      }      
      await drawSnake(snake);
    }
    // update visited positions of tail
    visitedPositions.add(`${snake[9].x},${snake[9].y}`);
  }

}

console.log(`Number of visited positions by the snake's tail: ${visitedPositions.size}`);