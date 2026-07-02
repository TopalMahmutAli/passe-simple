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

type Chapter = {
  id: string;
  title: string;
  description: string;
};

type Lesson = {
  id: string;
  title: string;
  summary: string;
  position: number;
};

async function getChapter(id: string): Promise<{
  chapter: Chapter;
  lessons: Lesson[];
}> {
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id, title, description")
    .eq("id", id)
    .single();

  if (chapterError) {
    throw chapterError;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, title, summary, position")
    .eq("chapter_id", id)
    .order("position");

  if (lessonsError) {
    throw lessonsError;
  }

  return {
    chapter,
    lessons,
  };
}

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = useQuery({
    queryKey: ["chapter", id],
    queryFn: () => getChapter(id),
  });

  if (isPending) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.message}>Chargement du chapitre...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Impossible de charger ce chapitre.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{data.chapter.title}</Text>
      <Text style={styles.description}>{data.chapter.description}</Text>

      {data.lessons.length === 0 ? (
        <Text style={styles.message}>
          Aucune leçon disponible dans ce chapitre.
        </Text>
      ) : (
        data.lessons.map((lesson) => (
          <View key={lesson.id} style={styles.card}>
            <Text style={styles.cardTitle}>{lesson.title}</Text>
            <Text style={styles.text}>{lesson.summary}</Text>

            <Link
              href={{
                pathname: "/lesson/[id]",
                params: { id: lesson.id },
              }}
              asChild
            >
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Lire la fiche</Text>
              </Pressable>
            </Link>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    gap: 14,
    padding: 20,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
    padding: 20,
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
  description: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  cardTitle: {
    color: colors.secondary,
    fontSize: 19,
    fontWeight: "bold",
  },
  text: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 12,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
  },
});
