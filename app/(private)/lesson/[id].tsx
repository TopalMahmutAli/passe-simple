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
import { borderRadius, spacing } from "@/theme/layout";

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

async function getIsFavorite(userId: string | undefined, lessonId: string) {
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
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

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: lesson,
    isPending,
    isError,
    refetch: refetchLesson,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: () => getLesson(id),
  });

  const {
    data: isFavorite = false,
    isPending: isFavoritePending,
    isError: isFavoriteError,
    refetch: refetchFavorite,
  } = useQuery({
    queryKey: ["favorite", user?.id, id],
    queryFn: () => getIsFavorite(user?.id, id),
    enabled: Boolean(user?.id) && Boolean(id),
  });

  const favoriteMutation = useMutation({
    mutationFn: (userId: string) => toggleFavorite(userId, id, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite", user?.id, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["favorites", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["favorite-lesson-ids", user?.id],
      });
    },
    onError: () => {
      Alert.alert(
        "Favori impossible",
        "Une erreur est survenue pendant la mise à jour du favori."
      );
    },
  });

  function handleToggleFavorite() {
    if (!user?.id) {
      Alert.alert(
        "Connexion nécessaire",
        "Vous devez être connecté pour gérer vos favoris."
      );
      return;
    }

    favoriteMutation.mutate(user.id);
  }

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

        <Pressable onPress={() => refetchLesson()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
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

      {isFavoriteError ? (
        <View style={styles.favoriteErrorContainer}>
          <Text style={styles.message}>Impossible de charger le favori.</Text>
          <Pressable
            onPress={() => refetchFavorite()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          disabled={isFavoritePending || favoriteMutation.isPending}
          onPress={handleToggleFavorite}
          style={[
            styles.favoriteButton,
            (isFavoritePending || favoriteMutation.isPending) &&
              styles.favoriteButtonDisabled,
          ]}
        >
          {!isFavoritePending && (
            <Ionicons
              name={isFavorite ? "bookmark" : "bookmark-outline"}
              size={18}
              color={colors.text}
            />
          )}
          <Text style={styles.favoriteButtonText}>
            {isFavoritePending
              ? "Chargement du favori..."
              : favoriteMutation.isPending
                ? "Mise à jour..."
                : isFavorite
                  ? "Retirer des favoris"
                  : "Ajouter aux favoris"}
          </Text>
        </Pressable>
      )}

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
    gap: spacing.large,
    padding: spacing.xxlarge,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: spacing.medium,
    padding: spacing.xxlarge,
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
    borderRadius: borderRadius.medium,
    padding: 14,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: borderRadius.medium,
    flexDirection: "row",
    gap: spacing.small,
    justifyContent: "center",
    padding: 14,
  },
  favoriteButtonDisabled: {
    opacity: 0.6,
  },
  favoriteButtonText: {
    color: colors.text,
    fontWeight: "bold",
  },
  favoriteErrorContainer: {
    alignItems: "center",
    gap: 10,
  },
  retryButton: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.medium,
    padding: 10,
    paddingHorizontal: spacing.xlarge,
  },
  retryButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
});
