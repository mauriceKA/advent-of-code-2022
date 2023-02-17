import { day8 } from "./inputs.ts";

const treeMatrix: Array<Array<number>> = day8.split("\n").map( line => line.split("").map( heightStr => parseInt(heightStr) ) );
const width = treeMatrix[0].length;
const height = treeMatrix.length;
//console.log(`width: ${width}, height: ${height}`);

const transposedTreeMatrix: Array<Array<number>> = new Array<Array<number>>(99);
treeMatrix.forEach( (line, y) => {
  line.forEach( (treeHeight, x) => {
    if (!transposedTreeMatrix[x]) transposedTreeMatrix[x] = new Array<number>();
    transposedTreeMatrix[x][y] = treeHeight;
  });
})
//console.log(transposedTreeMatrix);

// ===== Part 1 ==============================================================================================

const numberOfVisibleTrees = treeMatrix.map( (line, y) => {
  return line.map( (treeHeight, x) => {
    // only consider interior trees
    if ( x === 0 || x === width - 1 || y === 0 || y === height -1) return 1;
    
    // compare left and right trees
    const tallestTreeLeft = Math.max(...line.slice(0, x));
    const tallestTreeRight = Math.max(...line.slice(x + 1));
    
    // compare top and bottom trees
    const column = transposedTreeMatrix[x];
    const tallestTreeTop = Math.max(...column.slice(0, y));
    const tallestTreeBottom = Math.max(...column.slice(y + 1));
    
    const treeIsVisible = treeHeight > Math.min(tallestTreeLeft, tallestTreeRight, tallestTreeTop, tallestTreeBottom);
    //console.log(`x:${x}, y:${y}, treeHeight:${treeHeight}, left:${tallestTreeLeft}, right:${tallestTreeRight}, top:${tallestTreeTop}, bottom:${tallestTreeBottom}, visible:${treeIsVisible}`);
    return treeIsVisible ? 1 : 0;
  }).reduce( (sum: number, val: number) => sum + val, 0);
  //console.log(l.join(""));
}).reduce( (sum: number, val: number) => sum + val, 0);

console.log(`number of visible trees: ${numberOfVisibleTrees}`);

// ===== Part 2 ==============================================================================================

const hightestScenicValuesInLine = treeMatrix.map( (line, y) => {
  const scenicValuesInLine = line.map( (treeHeight, x) => {
    // only consider interior trees, outer trees will have one viewing distance zero, 
    // so there product will be zero, too and does not need to be considered
    if ( x === 0 || x === width - 1 || y === 0 || y === height -1) return 0;

    let idxBlockingTree: number;
    let treesInDirection: Array<number>;
    const numVisibleTrees: { left:number, right:number, top:number, bottom:number  } = { left:-1, right:-1, top:-1, bottom: -1 };
    
    // compare left and right trees
    treesInDirection = line.slice(0, x); 
    idxBlockingTree = treesInDirection.findLastIndex( height => height >= treeHeight);
    numVisibleTrees.left = idxBlockingTree === -1 ? treesInDirection.length : x - idxBlockingTree;

    treesInDirection = line.slice(x + 1); 
    idxBlockingTree = treesInDirection.findIndex( height => height >= treeHeight);
    numVisibleTrees.right = idxBlockingTree === -1 ? treesInDirection.length : idxBlockingTree + 1;
    
    // compare top and bottom trees
    const column = transposedTreeMatrix[x];
    treesInDirection = column.slice(0, y); 
    idxBlockingTree = treesInDirection.findLastIndex( height => height >= treeHeight);
    numVisibleTrees.top = idxBlockingTree === -1 ? treesInDirection.length : x - idxBlockingTree;

    treesInDirection = column.slice(y + 1); 
    idxBlockingTree = treesInDirection.findIndex( height => height >= treeHeight);
    numVisibleTrees.bottom = idxBlockingTree === -1 ? treesInDirection.length : idxBlockingTree + 1;

    // multiply to get the scenic score of the tree
    return Object.values(numVisibleTrees).reduce( (acc, val) => acc * val, 1)
  });
  return Math.max(...scenicValuesInLine);
});

const hightestScenicValue = Math.max(...hightestScenicValuesInLine);
console.log(`Heightest scenic value in forest: ${hightestScenicValue}`);