// IQ Test — 40 questions from Philip Carter, The Complete Book of Intelligence Tests (Wiley, 2005)

export type IQCategory = "verbal" | "numerical" | "spatial" | "logical";

export type IQQuestion = {
  id: number;
  category: IQCategory;
  prompt: string;
  note?: string;
  options: string[];
  correct: number;
};

export const IQ_QUESTIONS: IQQuestion[] = [
  {
    id: 1,
    category: "logical",
    prompt:
      "A white dot moves two places anti-clockwise at each stage. A black dot moves one place clockwise at each stage. The white dot starts at the bottom-left corner and the black dot starts at the top-right corner of a square. After how many stages will both dots be in the same corner?",
    options: ["2 stages", "4 stages", "6 stages", "8 stages"],
    correct: 1,
  },
  {
    id: 2,
    category: "numerical",
    prompt: "What replaces the question mark?\n72496 → 1315\n62134 → 97\n85316 → 167\n28439 → ?",
    note: "Find the rule linking the left number to the right number.",
    options: ["1412", "5823", "741", "2819", "1211"],
    correct: 0,
  },
  {
    id: 3,
    category: "verbal",
    prompt:
      "Which word comes LAST when these are placed in alphabetical order?\narthropod, artificer, arteriole, artichoke, arthritis, articular, artillery, arthritic",
    options: ["artillery", "articular", "artificer", "arthropod"],
    correct: 0,
  },
  {
    id: 4,
    category: "verbal",
    prompt:
      "Which two words are most OPPOSITE in meaning?\nimaginary, realistic, illegible, impracticable, radical, embellished",
    options: [
      "imaginary / radical",
      "realistic / impracticable",
      "illegible / embellished",
      "radical / embellished",
    ],
    correct: 1,
  },
  {
    id: 5,
    category: "numerical",
    prompt:
      "A number grid has a pattern in each row and column. The four missing values (top-right of each row) are:",
    note: "Grid rows: [2, 6, 3, 7, ?] [6, 3, 6, 3, ?] [3, 6, 3, 6, ?] [5, 2, 6, 3, ?] [6]. Each row's missing value follows the column pattern.",
    options: ["4, 6, 3, 7", "3, 5, 4, 8", "6, 3, 5, 7", "2, 4, 6, 8"],
    correct: 0,
  },
  {
    id: 6,
    category: "verbal",
    prompt: "Which group of letters is the odd one out?\nCEFH  HJKN  LNOQ  PRSV  UWXZ  DFGI",
    note: "Look for a pattern in the letter positions within each group.",
    options: ["CEFH", "HJKN", "PRSV", "DFGI"],
    correct: 1,
  },
  {
    id: 7,
    category: "verbal",
    prompt:
      "Identify one word from each bracket that forms a connection with the word in capitals:\nRESTRAIN (suppress / deny / conceal)\nWITHHOLD (curb / reserve / conceal)",
    options: ["deny / curb", "suppress / reserve", "conceal / conceal", "suppress / curb"],
    correct: 1,
  },
  {
    id: 8,
    category: "spatial",
    prompt:
      "A dot moves around a shape two places clockwise at each stage and alternates between black and white. Which option correctly shows the next figure in the sequence?",
    note: "Track both the dot's position (moving 2 places clockwise) and its colour (alternating black/white).",
    options: ["A", "B", "C", "D"],
    correct: 3,
  },
  {
    id: 9,
    category: "verbal",
    prompt:
      "Spell out a 12-letter word by moving from letter to adjacent letter (horizontally and vertically, not diagonally) in the grid:\nC A _ I _ C L O D N E E _ _ _\nWhat is the word?",
    options: ["ENCYCLOPEDIA", "COINCIDENTAL", "ACKNOWLEDGED", "ECONOMICALLY"],
    correct: 0,
  },
  {
    id: 10,
    category: "numerical",
    prompt: "What two numbers should replace the question marks?\n100, 95, ?, 79, 68, ?, 40, 23",
    note: "Find the rule governing the differences between consecutive terms.",
    options: ["88 and 55", "85 and 52", "86 and 54", "90 and 57"],
    correct: 0,
  },
  {
    id: 11,
    category: "verbal",
    prompt: "Associate is to colleague as accomplice is to:",
    options: ["consort", "friend", "accessory", "comrade", "follower"],
    correct: 2,
  },
  {
    id: 12,
    category: "verbal",
    prompt: "Which is the odd one out?\nfamous, illustrious, acclaimed, fabulous, noteworthy",
    options: ["famous", "illustrious", "fabulous", "noteworthy"],
    correct: 2,
  },
  {
    id: 13,
    category: "logical",
    prompt:
      "Two triangles of numbers follow a rule. Triangle 1: corners 7, 3, 5 / sides 9, 2, 6 / centre 4, 2, 1. Triangle 2: corners 13, 13, 6 / sides 19, ?, 5 / centre 11.\nWhat number replaces the question mark?",
    note: "Rule: (top + bottom) ÷ middle = constant.",
    options: ["4", "5", "6", "7"],
    correct: 2,
  },
  {
    id: 14,
    category: "spatial",
    prompt:
      "Five shapes (A–E) are shown. C is the same as E with large/small shapes swapped; B is the same as D. Which shape is the odd one out?",
    options: ["A", "B", "C", "D", "E"],
    correct: 0,
  },
  {
    id: 15,
    category: "verbal",
    prompt: "GAINED VOTE is an anagram of which two words that are similar in meaning?",
    options: ["DEVOTED / GAIN", "DONATE / GIVE", "AVID / TONE", "VOTED / AGAIN"],
    correct: 1,
  },
  {
    id: 16,
    category: "numerical",
    prompt: "What number replaces the question mark?\n49  615  62\n85  177  29\n53   ?   74",
    note: "Rule: The middle number is formed by combining digits from the outer two numbers.",
    options: ["910", "127", "821", "635"],
    correct: 0,
  },
  {
    id: 17,
    category: "verbal",
    prompt:
      "Which word in brackets is most OPPOSITE in meaning to MITIGATE?\n(augment, palliate, appreciate, trust, destroy)",
    options: ["augment", "palliate", "appreciate", "destroy"],
    correct: 0,
  },
  {
    id: 18,
    category: "spatial",
    prompt:
      "A shape is shown. Which of options A–E is exactly identical to it (allowing for rotation, but not reflection)?",
    note: "Carefully compare each option's orientation against the original shape.",
    options: ["A", "B", "C", "D", "E"],
    correct: 3,
  },
  {
    id: 19,
    category: "verbal",
    prompt:
      "Which two words are closest in meaning?\neducated, clear, literal, enervated, wordy, verbatim",
    options: ["educated / clear", "literal / verbatim", "wordy / educated", "clear / verbatim"],
    correct: 1,
  },
  {
    id: 20,
    category: "numerical",
    prompt: "What number should replace the question mark?\n19   9  17\n23  12  25\n13   ?  31",
    note: "Find the relationship between the three numbers in each row.",
    options: ["9", "11", "13", "15"],
    correct: 1,
  },
  {
    id: 21,
    category: "spatial",
    prompt:
      "Shape A is to Shape B as Shape C is to which option (A–F)?\n(Hint: a rectangle grows in size and rotates 90°; apply the same transformation to Shape C.)",
    options: ["A", "B", "C", "D", "E", "F"],
    correct: 1,
  },
  {
    id: 22,
    category: "logical",
    prompt:
      "Using the alphabet (A B C D E F G H I J …), what letter is:\nthree to the right of the letter immediately to the left of the letter which is four to the left of G?",
    options: ["C", "D", "E", "F"],
    correct: 2,
  },
  {
    id: 23,
    category: "verbal",
    prompt:
      "Which word in brackets is closest in meaning to HABITUATED?\n(constant, accustomed, colonized, commonplace, energetic)",
    options: ["constant", "accustomed", "colonized", "commonplace"],
    correct: 1,
  },
  {
    id: 24,
    category: "spatial",
    prompt:
      "A 3×3 grid of tiles has one missing. Looking across each row, a black dot is added. Looking down each column, a circle is added. Which tile completes the grid?",
    options: ["A", "B", "C", "D"],
    correct: 2,
  },
  {
    id: 25,
    category: "numerical",
    prompt: "A barrel holds 85 litres when full. How many litres remain after 40% has been used?",
    options: ["34 litres", "45 litres", "51 litres", "55 litres"],
    correct: 2,
  },
  {
    id: 26,
    category: "verbal",
    prompt: "DECISIVE LARK is an anagram of which two words that are OPPOSITE in meaning?",
    options: ["CRAVE / DISLIKE", "LACKED / REVISE", "DERIVED / LACKS", "CLEARS / DIVIDE"],
    correct: 0,
  },
  {
    id: 27,
    category: "spatial",
    prompt:
      "A shape series: the number of sides reduces by 1 at each stage; the number of dots increases by 1 and the dots turn from white to black. Which option correctly shows the next shape?",
    options: ["A", "B", "C", "D"],
    correct: 0,
  },
  {
    id: 28,
    category: "numerical",
    prompt: "What number replaces the question mark?\n0, 19, 38, 57, ?, 95",
    options: ["66", "72", "76", "80"],
    correct: 2,
  },
  {
    id: 29,
    category: "spatial",
    prompt:
      "A sequence of rotating arcs: the large arc rotates 90° clockwise each stage; the middle arc rotates 90° anti-clockwise; the inner arc rotates 90° anti-clockwise. Which option (A–F) comes next?",
    options: ["A", "B", "C", "D", "E", "F"],
    correct: 5,
  },
  {
    id: 30,
    category: "logical",
    prompt:
      "Numbers in the outer ring of a circle are the DIFFERENCE of the two inner numbers adjacent to them (anti-clockwise). Given: 9−4=5, 7−5=2, 8−1=7. What number replaces the question mark?",
    options: ["3", "4", "5", "6"],
    correct: 2,
  },
  {
    id: 31,
    category: "logical",
    prompt:
      "Switch A toggles lights 1 and 2. Switch B toggles lights 2 and 4. Switch C toggles lights 1 and 3. Switches A, C, B are thrown in order.\nStart: lights 1●, 2○, 3●, 4○\nResult: lights 1●, 2●, 3○, 4○\nWhich switch must be faulty?",
    options: ["Switch A", "Switch B", "Switch C", "No switch is faulty"],
    correct: 2,
  },
  {
    id: 32,
    category: "spatial",
    prompt:
      "Five shapes (A–E) are shown. Four of them are the same figure in different rotations. Which is the odd one out?",
    options: ["A", "B", "C", "D", "E"],
    correct: 1,
  },
  {
    id: 33,
    category: "numerical",
    prompt:
      "Three overlapping circles contain numbers. Left circle: 3.5, 5, 1.5, 4.5. Centre overlap: 7.5, 11, 3.5, ?. Right circle: 2, 8.5, 3.\nRule: each centre value = corresponding left value + corresponding right value.\nWhat replaces the question mark?",
    options: ["5.5", "6.5", "7.5", "8.0"],
    correct: 1,
  },
  {
    id: 34,
    category: "spatial",
    prompt:
      "A 3×3 grid is formed by a rule: only symbols that appear in the same cell position in both the first and second squares are carried forward; circles become squares and squares become circles. Which tile (A–E) completes the grid?",
    options: ["A", "B", "C", "D", "E"],
    correct: 4,
  },
  {
    id: 35,
    category: "verbal",
    prompt:
      "Start at one of the four corner letters and spiral clockwise around the perimeter, finishing at the centre letter, to spell a 9-letter word.\nLetters available: N A R N C O T _\nWhat is the word?",
    options: ["NOCTURNAL", "NARCOTICS", "CANONICAL", "NOTORIOUS"],
    correct: 0,
  },
  {
    id: 36,
    category: "numerical",
    prompt: "What number replaces the question mark?\n10, 21, 33, 46, 60, 75, ?",
    options: ["88", "90", "91", "93"],
    correct: 2,
  },
  {
    id: 37,
    category: "spatial",
    prompt:
      "A flat net (unfolded cube) is shown. Which of the options A–E can be produced when the net is folded into a cube?",
    options: ["A", "B", "C", "D", "E"],
    correct: 0,
  },
  {
    id: 38,
    category: "numerical",
    prompt:
      "Joe has one and a half times as many as Mo. Mo has one and a half times as many as Flo. Altogether they have 76. How many does Joe have?",
    options: ["24", "30", "36", "40"],
    correct: 2,
  },
  {
    id: 39,
    category: "verbal",
    prompt: "Which one of the following sentences is grammatically correct?",
    options: [
      "The Gardener's Association debated whether to hold it's bi-annual flower show at the beginning of April and September.",
      "The Gardeners' Association debated whether to hold its bi-annual flower show at the beginning of April and September, or at the end of April and September each year.",
      "The Gardeners' Association debated whether to hold it's bi-annual flower show at the beginning of April and September.",
      "The Gardeners' Association debated whether to hold its biennial flower show at the beginning of April and September.",
    ],
    correct: 1,
  },
  {
    id: 40,
    category: "numerical",
    prompt:
      "What number replaces the question mark in this grid?\n 1   3   7  13\n 4   6  10  16\n 9  11  15  21\n16  18  22   ?\n(Across: add 2, 4, 6. Down: add 3, 5, 7.)",
    options: ["24", "26", "28", "30"],
    correct: 2,
  },
];

export const IQ_BAND = (score: number): { label: string; color: string } => {
  if (score >= 36) return { label: "Exceptional", color: "#a855f7" };
  if (score >= 31) return { label: "Excellent", color: "#6366f1" };
  if (score >= 25) return { label: "Very Good", color: "#3b82f6" };
  if (score >= 19) return { label: "Good", color: "#22c55e" };
  if (score >= 15) return { label: "Average", color: "#eab308" };
  return { label: "Below Average", color: "#ef4444" };
};

export const CATEGORY_COLORS: Record<IQCategory, string> = {
  verbal: "#6366f1",
  numerical: "#22c55e",
  spatial: "#f59e0b",
  logical: "#a855f7",
};

export const CATEGORY_LABELS: Record<IQCategory, string> = {
  verbal: "Verbal",
  numerical: "Numerical",
  spatial: "Spatial",
  logical: "Logical",
};

export const IQ_TIME_LIMIT_SECONDS = 90 * 60;
