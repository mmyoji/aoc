import { subtract, sort } from "./strings.ts";

type StrMap = Record<string, string>;

/**
 *   0:      1:      2:      3:      4:
 *  aaaa    ....    aaaa    aaaa    ....
 * b    c  .    c  .    c  .    c  b    c
 * b    c  .    c  .    c  .    c  b    c
 *  ....    ....    dddd    dddd    dddd
 * e    f  .    f  e    .  .    f  .    f
 * e    f  .    f  e    .  .    f  .    f
 *  gggg    ....    gggg    gggg    ....
 *
 *   5:      6:      7:      8:      9:
 *  aaaa    aaaa    aaaa    aaaa    aaaa
 * b    .  b    .  .    c  b    c  b    c
 * b    .  b    .  .    c  b    c  b    c
 *  dddd    dddd    ....    dddd    dddd
 * .    f  e    f  .    f  e    f  .    f
 * .    f  e    f  .    f  e    f  .    f
 *  gggg    gggg    ....    gggg    gggg
 *
 * | Number | Length | Unique |
 * ----------------------------
 * |  "0"   |   6    |        |
 * |  "1"   |   2    |    x   |
 * |  "2"   |   5    |        |
 * |  "3"   |   5    |        |
 * |  "4"   |   4    |    x   |
 * |  "5"   |   5    |        |
 * |  "6"   |   6    |        |
 * |  "7"   |   3    |    x   |
 * |  "8"   |   7    |        |
 * |  "9"   |   6    |    x   |
 *
 * [Part 2 Solution]
 * 1. Find "1", "4", "7" and "8" with its length.
 * 2. Get "a" by comparing "1" and "7"
 * 3. Among 6 length numbers,
 *   a. "6" doesn't contain "1"
 *   b. and get "c" and "f"
 * 4. Among 5 length numbers,
 *   a. "3" has both "c" and "f"
 *   b. "2" has only "c"
 *   c. "5" has only "f"
 * 5. Get "e" by comparing "2" and "3"
 * 6. Among the rest of 6 length numbers,
 *   a. "9" lefts "e" by comparing "8"
 *   b. and the other is "0"
 */

/* [length]: [number] */
const uniqByLength: StrMap = {
  "2": "1",
  "3": "7",
  "4": "4",
  "7": "8",
};

function findSix(sixes: string[], one: string): string {
  for (const str of sixes) {
    // Both "0" and "9" gets 4 length, "6" gets 5.
    if (subtract(str, one).length !== 4) {
      return str;
    }
  }

  throw new Error("6 is not found.");
}

function findFives(fives: string[], c: string, f: string) {
  const ret: StrMap = {};

  for (const str of fives) {
    const arr = Array.from(str);
    if (arr.includes(c) && arr.includes(f)) {
      ret["3"] = str;
      continue;
    }

    if (arr.includes(c)) {
      ret["2"] = str;
      continue;
    }

    if (arr.includes(f)) {
      ret["5"] = str;
      continue;
    }
  }

  return ret;
}

export class Line {
  patterns: string[];
  outputs: string[];

  constructor(line: string) {
    const [patterns, outputs] = line.split(" | ");

    this.patterns = this.#buildItems(patterns, 10);
    this.outputs = this.#buildItems(outputs, 4);
  }

  analyze(): number {
    const mapping = this.#analyzePatterns();

    const result: string[] = [];
    for (const output of this.outputs) {
      const sorted = sort(output);
      if (sorted in mapping) {
        result.push(mapping[sorted]);
        continue;
      }
    }

    if (result.length !== this.outputs.length) {
      throw new Error("You have invalid mapping.");
    }

    return parseInt(result.join(""), 10);
  }

  #analyzePatterns(): StrMap {
    const { numbers, fives, sixes } = this.#getNumbersByLength();

    const alphabet: StrMap = {};
    alphabet["a"] = subtract(numbers["7"], numbers["1"]);

    numbers["6"] = findSix(sixes, numbers["1"]);

    alphabet["c"] = subtract(numbers["1"], numbers["6"]);
    alphabet["f"] = subtract(numbers["1"], alphabet["c"]);

    const fivesMap = findFives(fives, alphabet["c"], alphabet["f"]);
    numbers["2"] = fivesMap["2"];
    numbers["3"] = fivesMap["3"];
    numbers["5"] = fivesMap["5"];

    alphabet["e"] = subtract(numbers["2"], numbers["3"]);

    const zeroOrNine = sixes.filter((s) => s != numbers["6"]);
    for (const s of zeroOrNine) {
      const c = subtract(numbers["8"], s);
      if (c === alphabet["e"]) {
        numbers["9"] = s;
      } else {
        numbers["0"] = s;
      }
    }

    const ret: StrMap = {};
    for (const key in numbers) {
      ret[sort(numbers[key])] = key;
    }

    return ret;
  }

  #getNumbersByLength() {
    const numbers: StrMap = {};
    const fives: string[] = [];
    const sixes: string[] = [];

    for (const p of this.patterns) {
      const len = p.length;
      const lenStr = String(len);
      if (lenStr in uniqByLength) {
        numbers[uniqByLength[lenStr]] = p;
        continue;
      }

      if (len === 5) {
        fives.push(p);
        continue;
      }

      if (len === 6) {
        sixes.push(p);
        continue;
      }
    }

    return {
      numbers,
      fives,
      sixes,
    };
  }

  #buildItems(str: string, size: number): string[] {
    const items = str.split(" ");

    if (items.length !== size) {
      throw new Error(`It must have ${size} itesm but ${items.length}`);
    }

    return items;
  }
}
