import {
  getChoiceLabel,
  getQuizResultMessage,
  isCorrectChoice,
} from "@/lib/quiz";
import type { QuizQuestion } from "@/lib/quiz";

const question: QuizQuestion = {
  id: "question-1",
  question: "Quelle est la capitale de la France ?",
  choice_a: "Lyon",
  choice_b: "Paris",
  choice_c: "Marseille",
  correct_choice: "b",
  position: 1,
};

describe("getChoiceLabel", () => {
  it("retourne choice_a pour le choix a", () => {
    expect(getChoiceLabel(question, "a")).toBe("Lyon");
  });

  it("retourne choice_b pour le choix b", () => {
    expect(getChoiceLabel(question, "b")).toBe("Paris");
  });

  it("retourne choice_c pour le choix c", () => {
    expect(getChoiceLabel(question, "c")).toBe("Marseille");
  });
});

describe("isCorrectChoice", () => {
  it("retourne true pour la bonne réponse", () => {
    expect(isCorrectChoice("b", "b")).toBe(true);
  });

  it("retourne false pour une mauvaise réponse", () => {
    expect(isCorrectChoice("a", "b")).toBe(false);
  });
});

describe("getQuizResultMessage", () => {
  const total = 3;

  it("retourne Excellent ! pour un score de 3", () => {
    expect(getQuizResultMessage(3, total)).toBe("Excellent !");
  });

  it("retourne Bien joué ! pour un score de 2", () => {
    expect(getQuizResultMessage(2, total)).toBe("Bien joué !");
  });

  it("retourne le message de relecture pour un score de 1", () => {
    expect(getQuizResultMessage(1, total)).toBe(
      "Relisez la fiche puis réessayez."
    );
  });

  it("retourne le message de relecture pour un score de 0", () => {
    expect(getQuizResultMessage(0, total)).toBe(
      "Relisez la fiche puis réessayez."
    );
  });
});
