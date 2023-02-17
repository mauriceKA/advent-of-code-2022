import { day3 } from "./inputs.ts";

class Rucksack {
  
  private priorityOfCommonItem: number;

  static getPriorityForItem( val: number ) : number {
    return val >= 97 ? val - 96 : val - 64 + 26
  }
  
  constructor(content : string) {
    this.priorityOfCommonItem = 0;
    loop: for (let i = 0; i < content.length / 2; i++) {
      for (let j = content.length / 2; j < content.length; j++) {
        if (content.charAt(i) === content.charAt(j)) {
          this.priorityOfCommonItem = Rucksack.getPriorityForItem( content.charCodeAt(i) );
          //console.log(`Common item: ${content.charAt(i)}, val: ${val}, prio: ${this.priorityOfCommonItem}`);
          break loop;
        }
      }
    }
    if (this.priorityOfCommonItem === 0) throw Error(`No common item could be determined: ${content}`);
  }

  getPriorityOfCommonItem() {
    return this.priorityOfCommonItem;
  }
}

const rucksackStrings = day3.split("\n");

const sum = rucksackStrings.map( contents => new Rucksack(contents) )
  .reduce( (sum: number, rucksack: Rucksack) => { return sum + rucksack.getPriorityOfCommonItem()}, 0);

console.log(`The sum of priorities is: ${sum}`);

// ===================================================================================================

function findCommonItems( s1: string, s2: string, s3: string ): string {
  for (let i = 0; i < s1.length; i++) {
    const char: string = s1.charAt(i);
    if (s2.includes(char) && s3.includes(char)) return char;
  }
  throw Error(`No common item could be determined.`);
}

let sum2 = 0;
for ( let i = 0; i < rucksackStrings.length; i += 3) {
  const commonItem: string = findCommonItems( rucksackStrings[i], rucksackStrings[i+1], rucksackStrings[i+2]);
  sum2 += Rucksack.getPriorityForItem(commonItem.charCodeAt(0));
}

console.log(`The sum of priorities of item types is: ${sum2}`);
