export type Choice = "a" | "b" | "c";

export type QuizQuestion = {
  id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  correct_choice: Choice;
  position: number;
};

export function getChoiceLabel(
  question: QuizQuestion,
  choice: Choice
): string {
  if (choice === "a") {
    return question.choice_a;
  }

  if (choice === "b") {
    return question.choice_b;
  }

  return question.choice_c;
}

export function isCorrectChoice(
  choice: Choice,
  correctChoice: Choice
): boolean {
  return choice === correctChoice;
}

export function getQuizResultMessage(
  score: number,
  total: number
): string {
  if (score === total) {
    return "Excellent !";
  }

  if (score >= total / 2) {
    return "Bien joué !";
  }

  return "Relisez la fiche puis réessayez.";
}
