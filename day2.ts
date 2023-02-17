import { day2 } from "./inputs.ts";

enum move { ROCK, PAPER, SCISSORS }

class Round {
  
  static opponentStringToMove = new Map<string, move>([
    [ "A", move.ROCK ],
    [ "B", move.PAPER ],
    [ "C", move.SCISSORS]
  ])

  static myStringToMove = new Map<string, move>([
    [ "X", move.ROCK ],
    [ "Y", move.PAPER ],
    [ "Z", move.SCISSORS]
  ])

  static myMoveToScore = new Map<move, number>([
    [ move.ROCK, 1 ],
    [ move.PAPER, 2 ],
    [ move.SCISSORS, 3 ]
  ])

  static winningCombinations = [
    [ move.ROCK, move.PAPER ], 
    [ move.PAPER, move.SCISSORS ], 
    [ move.SCISSORS, move.ROCK] 
  ];

  private opponentsMove: move;
  private myMove: move;

  public constructor(opponentsMove: string, myMove: string);
  public constructor(opponentsMove: move, myMove: move);

  constructor(opponentsMove: string | move, myMove: string | move) {
    if (typeof opponentsMove === "string" && typeof myMove === "string") {
      const oppMoveVal = Round.opponentStringToMove.get(opponentsMove);
      const myMoveVal = Round.myStringToMove.get(myMove);
      if (oppMoveVal === undefined || myMoveVal === undefined) {
        throw Error("incorrect move string");
      }
      this.opponentsMove = oppMoveVal;
      this.myMove = myMoveVal;
    } else if (opponentsMove in move && myMove in move) { 
      this.opponentsMove = opponentsMove as move;
      this.myMove = myMove as move;
    } else {
      throw Error("Both arguments need to be strings or moves");
    }
  }

  getScore() : number {
    return (this.iWinThisRound() ? 6 : 0) +
      (this.roundIsADraw() ? 3 : 0) +
      (Round.myMoveToScore.get(this.myMove) || 0); 
  }

  iWinThisRound() : boolean {
    return Round.winningCombinations.some( (x) => x[0] === this.opponentsMove && x[1] === this.myMove );
  }

  roundIsADraw(): boolean { return this.opponentsMove === this.myMove }

  getInfo(): string {
    return `Opponents move: ${this.opponentsMove}, My move: ${this.myMove}, score: ${this.getScore()}, draw? ${this.roundIsADraw()}, I won? ${this.iWinThisRound()},`;
  }
}

const rounds: Array<Round> = day2.split("\n").map( line => {
  const moves = line.split(" ");
  return new Round(moves[0], moves[1]);
});

console.log( "Complete run score (first half): ", rounds.reduce( (sum: number, round: Round) => sum + round.getScore(), 0 ) );

// ===================================================================================================

enum outcome { LOSE, DRAW, WIN }

class RoundV2 extends Round {

  private static outcomeStringToOutcome = new Map<string, outcome>([
    [ "X", outcome.LOSE ],
    [ "Y", outcome.DRAW ],
    [ "Z", outcome.WIN ]
  ])

  private static inputsToMyMoveMap = [
    { opp: move.ROCK,     out: outcome.LOSE, mine: move.SCISSORS },
    { opp: move.ROCK,     out: outcome.DRAW, mine: move.ROCK },
    { opp: move.ROCK,     out: outcome.WIN,  mine: move.PAPER },
    { opp: move.PAPER,    out: outcome.LOSE, mine: move.ROCK },
    { opp: move.PAPER,    out: outcome.DRAW, mine: move.PAPER },
    { opp: move.PAPER,    out: outcome.WIN,  mine: move.SCISSORS },
    { opp: move.SCISSORS, out: outcome.LOSE, mine: move.PAPER },
    { opp: move.SCISSORS, out: outcome.DRAW, mine: move.SCISSORS },
    { opp: move.SCISSORS, out: outcome.WIN,  mine: move.ROCK }
  ]

  private static getOwnMove(opponentsMove: move, outcome: outcome): move {
    const myMove = RoundV2.inputsToMyMoveMap
      .find( combination => combination.opp === opponentsMove && combination.out === outcome )?.mine;
    
    if (myMove === undefined) throw Error(`Cannot determine own move: opponent ${opponentsMove}, outcome: ${outcome}`);
    return myMove;
  }

  constructor(opponentsMoveStr: string, outcomeStr: string) {

    const opponentsMove = Round.opponentStringToMove.get(opponentsMoveStr); 
    const outcome = RoundV2.outcomeStringToOutcome.get(outcomeStr); 

    if (opponentsMove === undefined) throw Error("Unknown opponentsMove identifier.");
    if (outcome === undefined) throw Error("Unknown outcome identifier.");

    const myMove = RoundV2.getOwnMove(opponentsMove, outcome);

    if (myMove === undefined) throw Error(`Cannot determine own move: opponent ${opponentsMove}, outcome: ${outcome}`);

    super(opponentsMove, myMove);
  }

}

const rounds2: Array<RoundV2> = day2.split("\n").map( line => {
  const moves = line.split(" ");
  return new RoundV2(moves[0], moves[1]);
});

console.log( "Complete run score (second half): ", rounds2.reduce( (sum: number, round: Round) => sum + round.getScore(), 0 ) );
