import { day11 } from "./inputs.ts";

const monkeyStrings = day11.split("\n\n");
type Operation = "*" | "+" | "^";

function getNumberAtEndOfString(s: string | undefined): number {
  return parseInt(  ((s || "0").match(/(\d+)$/) || ["0"])[1]  );
}

class Monkey {

  inspectCount = 0;

  constructor(
    protected items: number[], 
    protected operation: Operation, 
    protected operand: number | undefined,
    protected testDivisor: number,
    protected followUpMonkeyTrue: number,
    protected followUpMonkeyFalse: number) {}

  public getTestDivisor() { return this.testDivisor; }

  protected static parseAttributesFromString(input: string): { items: number[]; operation: Operation; operand: number | undefined; testDivisor: number; followUpMonkeyTrue: number; followUpMonkeyFalse: number; } {
    const inputs = input.split("\n") || [];
    inputs.shift(); // remove start text
    const items = inputs.shift()?.substring(16).split(", ").map( numberStr => parseInt(numberStr) || 0 ) || [];
    
    const opLine = inputs.shift() || "";
    let operation: Operation;
    if (opLine.includes("+")) 
      operation = "+";
    else if (opLine.match(/\* \d+/)) 
      operation = "*";
    else  
      operation = "^";
    let operand;
    if (operation !== "^") 
      operand = getNumberAtEndOfString(opLine);
    
    const testDivisor = getNumberAtEndOfString(inputs.shift());
    const followUpMonkeyTrue = getNumberAtEndOfString(inputs.shift());
    const followUpMonkeyFalse = getNumberAtEndOfString(inputs.shift());
    
    return {
      items: items, 
      operation: operation, 
      operand: operand, 
      testDivisor: testDivisor, 
      followUpMonkeyTrue: followUpMonkeyTrue,
      followUpMonkeyFalse: followUpMonkeyFalse
    }
  }

  static fromString(input: string): Monkey {
    const att = Monkey.parseAttributesFromString(input);
    return new Monkey(
      att.items, att.operation, att.operand, att.testDivisor, 
      att.followUpMonkeyTrue, att.followUpMonkeyFalse
    );
  }

  inspectAll(monkeys: Monkey[], lcm: number, divideBy3: boolean) {
    while (this.items.length > 0) {
      this.inspectCount++;
      let item = this.items.shift() || 0;
      if (this.operation === "*") {
        item *= this.operand || 1;
      } else if (this.operation === "+") {
        item += this.operand || 0;
      } else {
        item **= 2;
      }
      if (divideBy3) item = Math.floor(item / 3);
      // as we are only interested in the rest
      const isDivisible = item % this.testDivisor === 0;
      const targetMonkey = isDivisible ? this.followUpMonkeyTrue : this.followUpMonkeyFalse;
      monkeys[targetMonkey].catchItem(item % lcm);
    }
  }

  catchItem(item: number) {
    this.items.push(item);
  }
}

// ===== Part 1 ==============================================================================================

let monkeys = monkeyStrings.map( monkeyString => Monkey.fromString(monkeyString) );
// collect all modulo values
const restClasses = new Set<number>();
for (const monkey of monkeys) {
  restClasses.add(monkey.getTestDivisor());
}
// multiply all modulo values. as we calculate in rings of integer modulos,
// we can use that value to keep the worry level representations manageable.
// if we get the modulo of the level w.r.t. this number, it still represents
// the a member of the same integer modulo ring of all of the rings.
const lcm = Array.from(restClasses).reduce( (acc, val) => acc * val, 1);
console.log(`Least common multiplier of rest class ring: ${lcm}`);

for (let i = 0; i < 20; i++) {
  for (const monkey of monkeys) {
    monkey.inspectAll(monkeys, lcm, true);
  }
}

const monkeyBusiness = monkeys.map( monkey => monkey.inspectCount ).sort( (a,b) => a - b ).slice(-2).reduce( (val,acc) => val*acc, 1);
console.log(`Monkey business after 10000 rounds: ${monkeyBusiness}`);

// ===== Part 2 ==============================================================================================

monkeys = monkeyStrings.map( monkeyString => Monkey.fromString(monkeyString) );

for (let i = 0; i < 10000; i++) {
  for (const monkey of monkeys) {
    monkey.inspectAll(monkeys, lcm, false);
  }
}

const monkeyBusiness2 = monkeys.map( monkey => monkey.inspectCount ).sort( (a,b) => a - b ).slice(-2).reduce( (val,acc) => val*acc, 1);
console.log(`Monkey business after 10000 rounds: ${monkeyBusiness2}`);
