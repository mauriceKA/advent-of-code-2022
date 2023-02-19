import { day12, day2 } from "./inputs.ts";
//import { goHome } from "https://denopkg.com/iamnathanj/cursor@v2.2.0/mod.ts";

class MapSquare {
  distance;
  isStartPoint: boolean;
  isEndPoint: boolean;
  elevation: number;
  visited = false;

  constructor(elevation: string, public x: number, public y: number) {
    this.isStartPoint = elevation === "S";
    this.isEndPoint = elevation === "E"; 
    this.elevation = this.isStartPoint ? 1 : (this.isEndPoint ? 26 : elevation.charCodeAt(0)-96);
    this.distance = (this.isStartPoint) ? 0 : Number.MAX_SAFE_INTEGER;
  }
}

async function drawMapDistance(map: MapSquare[]) {
  return new Promise<void>( resolve => {
    goHome().then( () => {
      const m: MapSquare[][] = [];
      let start = 0;
      while (start < map.length) {
        m.push(map.slice(start,start + 83)); // first do a slice to clone, then a splice to remove
        start += 83;
      }
      console.log( m.map( arr => arr.map( sq => sq.distance === Number.MAX_SAFE_INTEGER ? "..." : (sq.distance+"").padStart(3," ") ).join("|") ).join("\n")  );
      setTimeout( () => { 
        resolve() 
      }, 4);
    }); 
  });
}

// ===== Part 1 ==============================================================================================

let map = day12.split("\n").map( (row, y) => row.split("").map( (char, x) => new MapSquare(char, x, y) ) );
let flatMap = ([] as MapSquare[]).concat(...map);

// implement Dijkstra 
let reachedEndPoint: MapSquare | undefined;
do {
  let minPoint: MapSquare | undefined, minDist = Number.MAX_SAFE_INTEGER;
  // find square with lowest summed distance
  for (const mapSquare of flatMap) {
    if (mapSquare.distance < minDist && !mapSquare.visited) {
      minPoint = mapSquare;
      minDist = mapSquare.distance;
    }
  }
  if (minPoint === undefined) throw new Error();
  minPoint.visited = true;
  //console.log(minPoint);
  // calculate the distances in the reachable directions
  let adjacent: MapSquare | undefined;
  // coordinate offsets for left, right, top, bottom
  const offsets = [{x: -1, y:0}, {x: 1, y:0}, {x: 0, y:-1}, {x: 0, y:1}]; 
  for (const o of offsets) {
    // find the square in the correct position and is reachable
    adjacent = flatMap.find( adj => 
      adj.x === minPoint.x + o.x && adj.y === minPoint.y + o.y && 
      adj.elevation <= minPoint.elevation + 1 &&
      adj.visited === false
    );
    if (adjacent) {
      adjacent.distance = minDist + 1;
      if (adjacent.isEndPoint) {
        reachedEndPoint = adjacent;
      }
    }
  }
} while (!reachedEndPoint);

console.log("end point with summed up distance:", reachedEndPoint);

// ===== Part 2 ==============================================================================================

// reverse Dijkstra: calculate the distance from the end point to all points
// and choose the one at elevation a with the lowest angle

// manipulate map: turn the start point into a normal "a" height and use the end point
// as the new start point:
const day12Part2 = day12.replace("S", "a").replace("E", "S");

// re-parse map:
map = day12Part2.split("\n").map( (row, y) => row.split("").map( (char, x) => new MapSquare(char, x, y) ) );
flatMap = ([] as MapSquare[]).concat(...map);
// set start point elevation to "z"
const startNode = flatMap.find( s => s.isStartPoint );
if (startNode) startNode.elevation = "z".charCodeAt(0)-96;

// implement Dijkstra 
let allNodesAreVisited = false;
do {
  let minPoint: MapSquare | undefined, minDist = Number.MAX_SAFE_INTEGER;
  // find square with lowest summed distance
  for (const mapSquare of flatMap) {
    if (mapSquare.distance < minDist && !mapSquare.visited) {
      minPoint = mapSquare;
      minDist = mapSquare.distance;
    }
  }
  if (minPoint === undefined) {
    allNodesAreVisited = true;
  } else {
    minPoint.visited = true;
    //console.log(minPoint);
    // calculate the distances in the reachable directions
    let adjacent: MapSquare | undefined;
    // coordinate offsets for left, right, top, bottom
    const offsets = [{x: -1, y:0}, {x: 1, y:0}, {x: 0, y:-1}, {x: 0, y:1}]; 
    for (const o of offsets) {
      // find the square in the correct position and is reachable
      adjacent = flatMap.find( adj => 
        adj.x === minPoint.x + o.x && adj.y === minPoint.y + o.y && 
        adj.elevation >= minPoint.elevation - 1 &&
        adj.visited === false
      );
      if (adjacent) {
        adjacent.distance = minDist + 1;
      }
    }
  }
  //await drawMapDistance(flatMap);
} while (!allNodesAreVisited);

// now we search the point of elevation a that has the smallest distance
const reachableALevelSquares = flatMap.filter( s => s.elevation === 1 && s.distance < Number.MAX_SAFE_INTEGER );
reachableALevelSquares.sort( (sa, sb) => sa.distance - sb.distance );
console.log("end point of elevation a with smallest summed up distance:", reachableALevelSquares[0]);
