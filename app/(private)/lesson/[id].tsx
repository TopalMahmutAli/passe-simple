import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  content: string;
};

async function getLesson(id: string): Promise<Lesson> {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, summary, content")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: lesson, isPending, isError } = useQuery({
    queryKey: ["lesson", id],
    queryFn: () => getLesson(id),
  });

  if (isPending) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.message}>Chargement de la fiche...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Impossible de charger cette fiche.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.summary}>{lesson.summary}</Text>
      <Text style={styles.content}>{lesson.content}</Text>

      <Link
        href={{
          pathname: "/quiz/[lessonId]",
          params: { lessonId: lesson.id },
        }}
        asChild
      >
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Commencer le mini-quiz</Text>
        </Pressable>
      </Link>
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
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  summary: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
  },
  content: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 25,
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
});
