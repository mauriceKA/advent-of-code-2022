import { day4 } from "./inputs.ts";

const assignmentPairs = day4.split("\n");

// ===================================================================================================

const pairsWithFullyContainedAssignments = assignmentPairs.reduce( (sum: number, pair: string) => {
  const [firstAssignment, secondAssignment] = pair.split(",");
  const [firstStart,  firstEnd]  = firstAssignment.split("-").map( val => parseInt(val,10) );
  const [secondStart, secondEnd] = secondAssignment.split("-").map( val => parseInt(val,10) );
  const fullyContained: boolean = 
    (firstStart  >= secondStart && firstEnd  <= secondEnd) ||
    (secondStart >= firstStart  && secondEnd <= firstEnd );
  //console.log(`Pair: ${pair}, fullyContained: ${fullyContained}`);
  return sum + (fullyContained ? 1 : 0);
}, 0);

console.log(`Pairs with fully overlapping assignments: ${pairsWithFullyContainedAssignments}`);

// ===================================================================================================

const pairsWithOverlappingAssignments = assignmentPairs.reduce( (sum: number, pair: string) => {
  const [firstAssignment, secondAssignment] = pair.split(",");
  const [firstStart,  firstEnd]  = firstAssignment.split("-").map( val => parseInt(val,10) );
  const [secondStart, secondEnd] = secondAssignment.split("-").map( val => parseInt(val,10) );
  const doesNotOverlap = firstEnd < secondStart || secondEnd < firstStart;
  //console.log(`Pair: ${pair}, overlaps: ${!doesNotOverlap}`);
  return sum + (!doesNotOverlap ? 1 : 0);
}, 0);

console.log(`Pairs with overlapping assignments: ${pairsWithOverlappingAssignments}`);
