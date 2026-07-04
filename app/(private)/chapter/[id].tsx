import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/contexts/auth-context";
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

async function getFavoriteLessonIds(
  userId: string | undefined
): Promise<string[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("lesson_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data.map((favorite) => favorite.lesson_id);
}

async function toggleFavorite(
  userId: string,
  lessonId: string,
  isFavorite: boolean
) {
  if (isFavorite) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    lesson_id: lessonId,
  });

  if (error) {
    throw error;
  }
}

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const {
    data,
    isPending,
    isError,
    refetch: refetchChapter,
  } = useQuery({
    queryKey: ["chapter", id],
    queryFn: () => getChapter(id),
  });

  const { data: favoriteLessonIds = [] } = useQuery({
    queryKey: ["favorite-lesson-ids", userId],
    queryFn: () => getFavoriteLessonIds(userId),
    enabled: Boolean(userId),
  });

  const favoriteMutation = useMutation({
    mutationFn: (variables: {
      userId: string;
      lessonId: string;
      isFavorite: boolean;
    }) =>
      toggleFavorite(variables.userId, variables.lessonId, variables.isFavorite),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-lesson-ids", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["favorite", variables.userId, variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ["favorites", variables.userId],
      });
    },
    onError: () => {
      Alert.alert(
        "Favori impossible",
        "Une erreur est survenue pendant la mise à jour du favori."
      );
    },
  });

  function handleToggleFavorite(lessonId: string, isFavorite: boolean) {
    if (!userId) {
      Alert.alert(
        "Connexion nécessaire",
        "Vous devez être connecté pour gérer vos favoris."
      );
      return;
    }

    favoriteMutation.mutate({ userId, lessonId, isFavorite });
  }

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

        <Pressable onPress={() => refetchChapter()} style={styles.button}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </Pressable>
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
        data.lessons.map((lesson) => {
          const isFavorite = favoriteLessonIds.includes(lesson.id);
          const isThisLessonPending =
            favoriteMutation.isPending &&
            favoriteMutation.variables?.lessonId === lesson.id;

          return (
            <View key={lesson.id} style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>{lesson.title}</Text>

                <Pressable
                  disabled={isThisLessonPending}
                  hitSlop={8}
                  onPress={() => handleToggleFavorite(lesson.id, isFavorite)}
                  style={isThisLessonPending && styles.favoriteIconDisabled}
                >
                  <Ionicons
                    name={isFavorite ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={colors.accent}
                  />
                </Pressable>
              </View>

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
          );
        })
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
  cardHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  cardTitle: {
    color: colors.secondary,
    flex: 1,
    fontSize: 19,
    fontWeight: "bold",
  },
  favoriteIconDisabled: {
    opacity: 0.4,
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
