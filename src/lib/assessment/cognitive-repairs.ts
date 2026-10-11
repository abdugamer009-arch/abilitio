import type { CognitiveQ } from "./career-assessment";

// Version changed items so already-issued signed attempts retain their original key.
export const COGNITIVE_REPAIRS: Record<string, CognitiveQ> = {
  iq1: {
    id: "iq1_v2",
    section: "cognitive",
    prompt:
      "A white dot starts at the bottom-left corner of a square and moves two corners anti-clockwise at each stage. A black dot starts at the top-right corner and moves one corner clockwise. After how many stages will both dots first be in the same corner?",
    options: ["2 stages", "4 stages", "6 stages", "8 stages"],
    correct: 0,
  },
  iq118: {
    id: "iq118_v2",
    section: "cognitive",
    prompt: "If today is Wednesday, what day was it 100 days ago?",
    options: ["Monday", "Tuesday", "Wednesday", "Saturday"],
    correct: 0,
  },
  iq123: {
    id: "iq123_v2",
    section: "cognitive",
    prompt:
      "Jack is twice as old as Jill. In 10 years Jack will be 1.5 times Jill's age. How old is Jill now?",
    options: ["10", "15", "20", "25"],
    correct: 0,
  },
  iq140: {
    id: "iq140_v2",
    section: "cognitive",
    prompt: "A rectangle has area 48 m² and length 8 m. What is its perimeter?",
    options: ["24 m", "28 m", "32 m", "40 m"],
    correct: 1,
  },
  iq162: {
    id: "iq162_v2",
    section: "cognitive",
    prompt:
      "A shape is reflected across the vertical axis, then rotated 90° clockwise. Which description lists both operations?",
    options: [
      "Only a 90° anticlockwise rotation",
      "Only a reflection across the horizontal axis",
      "A rotation plus a reflection",
      "Neither a rotation nor a reflection",
    ],
    correct: 2,
  },
  iq19: {
    id: "iq19_v2",
    section: "cognitive",
    prompt:
      "Choose the word that correctly completes this English sentence: The association held ___ annual show.",
    options: ["it's", "its", "it", "it is"],
    correct: 1,
  },
  iq21: {
    id: "iq21_v2",
    section: "cognitive",
    prompt:
      "Switch A toggles lights 1 and 2. B toggles 2 and 4. C toggles 1 and 3. A faulty switch changes nothing. A, C, then B are pressed. Initially only lights 1 and 3 are on. Finally only lights 1 and 2 are on. Which switch is faulty?",
    options: ["Switch A", "Switch B", "Switch C", "None"],
    correct: 1,
  },
  iq22: {
    id: "iq22_v2",
    section: "cognitive",
    prompt:
      "Each middle number is the sum of the left and right numbers. Rows: (3.5, 7.5, 4), (5, 11, 6), (1.5, 3.5, 2), (4.5, ?, 2). What replaces the question mark?",
    options: ["5.5", "6.5", "7.5", "8.0"],
    correct: 1,
  },
  iq27: {
    id: "iq27_v2",
    section: "cognitive",
    prompt:
      "Start at A in this letter grid and move one square horizontally or vertically at a time. Grid rows: ABC / FED / GHI. Which sequence can you trace without revisiting a square?",
    options: ["ACBDEFGHI", "ABCDEFGHI", "ABCFEDGHI", "ABDECFGHI"],
    correct: 1,
  },
  iq28: {
    id: "iq28_v2",
    section: "cognitive",
    prompt:
      "Read the perimeter clockwise from the top-left corner of this 3×3 letter grid. Rows: NOC / LX T / ANU (ignore spaces). Which sequence do you get?",
    options: ["NOCTUNAL", "NOCNALUT", "NOLANUTC", "NOCLTUNA"],
    correct: 0,
  },
  iq29: {
    id: "iq29_v2",
    section: "cognitive",
    prompt: "Apply the same subtraction rule: (9, 4) → 5; (7, 5) → 2; (8, 1) → 7; (11, 6) → ?",
    options: ["3", "4", "5", "6"],
    correct: 2,
  },
  iq30: {
    id: "iq30_v2",
    section: "cognitive",
    prompt:
      "Add the first two digits and the last three digits, then concatenate the two sums. Thus 72496 → 915 and 62134 → 88. What code does 28439 produce?",
    options: ["1016", "1412", "1214", "1610"],
    correct: 0,
  },
  iq32: {
    id: "iq32_v2",
    section: "cognitive",
    prompt:
      "A is taller than B. C is shorter than A. D is taller than C. Which pair contains all the people who could be tallest?",
    options: ["A and D", "A and B", "B and C", "C and D"],
    correct: 0,
  },
  iq84: {
    id: "iq84_v2",
    section: "cognitive",
    prompt: "Marathon is to running as a sailing regatta is to:",
    options: ["Swimming", "Cycling", "Sailing", "Climbing"],
    correct: 2,
  },
  iq143: {
    id: "iq143_v2",
    section: "cognitive",
    prompt:
      "Move each letter one place forward in the English alphabet: FRIEND → GSJFOE. How is HOUSE encoded?",
    options: ["IPVTF", "GNRRD", "HTXRD", "IOVRD"],
    correct: 0,
  },
  iq149: {
    id: "iq149_v2",
    section: "cognitive",
    prompt:
      "In the English alphabet A = 1, B = 2, … Z = 26. What is the sum of the letter values in BLACK?",
    options: ["27", "29", "31", "33"],
    correct: 1,
  },
  iq160: {
    id: "iq160_v2",
    section: "cognitive",
    prompt:
      "A rectangular floor is 10 m long and 8 m wide. What is the shortest distance along the floor between opposite corners?",
    options: ["10 m", "12 m", "√164 m", "18 m"],
    correct: 2,
  },
  iq161: {
    id: "iq161_v2",
    section: "cognitive",
    prompt: "Which solid has exactly five flat faces?",
    options: ["Cube", "Pentagonal prism", "Square pyramid", "Tetrahedron"],
    correct: 2,
  },
  iq176: {
    id: "iq176_v2",
    section: "cognitive",
    prompt:
      "A bag has 4 red and 6 blue balls. Two are drawn without replacement. What is the probability both are red?",
    options: ["2/15", "4/15", "1/5", "2/9"],
    correct: 0,
  },
  iq212: {
    id: "iq212_v2",
    section: "cognitive",
    prompt: "No A are B, and some C are B. Which statement must be true?",
    options: ["Some C are not A", "No C is A", "Some B are A", "No A is C"],
    correct: 0,
  },
};
