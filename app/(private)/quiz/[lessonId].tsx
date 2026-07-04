import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";

type Choice = "a" | "b" | "c";

type Question = {
  id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  correct_choice: Choice;
  position: number;
};

async function getQuestions(lessonId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, question, choice_a, choice_b, choice_c, correct_choice, position"
    )
    .eq("lesson_id", lessonId)
    .order("position");

  if (error) {
    throw error;
  }

  return data;
}

function getChoiceLabel(question: Question, choice: Choice) {
  if (choice === "a") {
    return question.choice_a;
  }

  if (choice === "b") {
    return question.choice_b;
  }

  return question.choice_c;
}

type SaveProgressInput = {
  userId: string;
  lessonId: string;
  score: number;
};

async function saveProgress(userId: string, lessonId: string, score: number) {
  const { data, error } = await supabase
    .from("progress")
    .select("best_score")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const bestScore = Math.max(data?.best_score ?? 0, score);

  const { error: upsertError } = await supabase.from("progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      best_score: bestScore,
      completed_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,lesson_id",
    }
  );

  if (upsertError) {
    throw upsertError;
  }
}

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: questions,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["questions", lessonId],
    queryFn: () => getQuestions(lessonId),
    enabled: Boolean(lessonId),
  });

  const progressMutation = useMutation({
    mutationFn: (input: SaveProgressInput) =>
      saveProgress(input.userId, input.lessonId, input.score),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["progress", variables.userId],
      });
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  function handleSaveProgress(finalScore: number) {
    if (!user?.id || !lessonId) {
      return;
    }

    progressMutation.mutate({
      userId: user.id,
      lessonId,
      score: finalScore,
    });
  }

  if (!lessonId) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Quiz indisponible</Text>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Fermer</Text>
        </Pressable>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.message}>Chargement du quiz...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Impossible de charger le quiz.</Text>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Fermer</Text>
        </Pressable>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Aucune question disponible pour cette fiche.
        </Text>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Fermer</Text>
        </Pressable>
      </View>
    );
  }

  if (isFinished) {
    let feedbackMessage = "Relisez la fiche puis réessayez.";

    if (score === questions.length) {
      feedbackMessage = "Excellent !";
    } else if (score >= questions.length / 2) {
      feedbackMessage = "Bien joué !";
    }

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>Quiz terminé</Text>
        <Text style={styles.score}>
          Votre score : {score} / {questions.length}
        </Text>
        <Text style={styles.message}>{feedbackMessage}</Text>

        {!user?.id ? (
          <Text style={styles.message}>
            Connectez-vous pour enregistrer votre progression.
          </Text>
        ) : progressMutation.isPending ? (
          <Text style={styles.message}>
            Enregistrement de la progression...
          </Text>
        ) : progressMutation.isSuccess ? (
          <Text style={styles.message}>Progression enregistrée.</Text>
        ) : progressMutation.isError ? (
          <View style={styles.progressErrorContainer}>
            <Text style={styles.message}>
              Impossible d’enregistrer la progression.
            </Text>
            <Pressable
              disabled={progressMutation.isPending}
              onPress={() => handleSaveProgress(score)}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Fermer</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Aucune question disponible pour cette fiche.
        </Text>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Fermer</Text>
        </Pressable>
      </View>
    );
  }

  const choices = [
    { key: "a" as Choice, label: currentQuestion.choice_a },
    { key: "b" as Choice, label: currentQuestion.choice_b },
    { key: "c" as Choice, label: currentQuestion.choice_c },
  ];

  const isLastQuestion = currentIndex === questions.length - 1;
  const isCorrect = selectedChoice === currentQuestion.correct_choice;

  function handleSelectChoice(choice: Choice) {
    if (isAnswered) {
      return;
    }

    setSelectedChoice(choice);
    setIsAnswered(true);

    if (choice === currentQuestion.correct_choice) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      setIsFinished(true);
      handleSaveProgress(score);
      return;
    }

    setCurrentIndex((currentIndexValue) => currentIndexValue + 1);
    setSelectedChoice(null);
    setIsAnswered(false);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.progress}>
        Question {currentIndex + 1} sur {questions.length}
      </Text>
      <Text style={styles.title}>{currentQuestion.question}</Text>

      {choices.map((choice) => {
        const isSelected = selectedChoice === choice.key;
        const isSelectedCorrect =
          isSelected && choice.key === currentQuestion.correct_choice;
        const isSelectedIncorrect =
          isSelected && choice.key !== currentQuestion.correct_choice;

        return (
          <Pressable
            disabled={isAnswered}
            key={choice.key}
            onPress={() => handleSelectChoice(choice.key)}
            style={[
              styles.choiceButton,
              isSelectedCorrect && styles.choiceButtonCorrect,
              isSelectedIncorrect && styles.choiceButtonIncorrect,
            ]}
          >
            <Text style={styles.choiceText}>{choice.label}</Text>
          </Pressable>
        );
      })}

      {isAnswered && (
        <View style={styles.feedbackContainer}>
          <Text
            style={
              isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
            }
          >
            {isCorrect ? "Bonne réponse !" : "Mauvaise réponse."}
          </Text>

          {!isCorrect && (
            <Text style={styles.message}>
              La bonne réponse était :{" "}
              {getChoiceLabel(currentQuestion, currentQuestion.correct_choice)}
            </Text>
          )}

          <Pressable onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>
              {isLastQuestion ? "Voir mon résultat" : "Question suivante"}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    gap: 16,
    padding: 24,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
    padding: 24,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  progress: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  score: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  choiceButton: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  choiceButtonCorrect: {
    backgroundColor: "#DCEFDC",
    borderColor: "#2E7D32",
  },
  choiceButtonIncorrect: {
    backgroundColor: "#F4DCDC",
    borderColor: colors.secondary,
  },
  choiceText: {
    color: colors.text,
    fontSize: 16,
  },
  feedbackContainer: {
    gap: 10,
  },
  progressErrorContainer: {
    gap: 10,
  },
  feedbackCorrect: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  feedbackIncorrect: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
  },
  retryButton: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
});
