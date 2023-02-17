import { day1 } from "./inputs.ts";

const bags : Array<string> = day1.split("\n\n");

const sortedBagSums : Array<number> = bags.map( (bag: string) => {
  return bag.split("\n").reduce( (acc: number, val: string) => acc as number + parseInt(val, 10), 0);
}).sort( (a: number, b: number) => a-b );

console.log("Top elf's calories: ", sortedBagSums.at(-1));
console.log("Top 3 elf's calories: ", sortedBagSums.slice(-3).reduce((acc: number, val: number) => acc + val));