import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";

type ProgressLesson = {
  id: string;
  title: string;
  summary: string;
};

type ProgressItem = {
  lesson_id: string;
  best_score: number;
  completed_at: string;
  lessons: ProgressLesson | ProgressLesson[] | null;
};

function getProgressLesson(item: ProgressItem): ProgressLesson | null {
  if (Array.isArray(item.lessons)) {
    return item.lessons[0] ?? null;
  }

  return item.lessons;
}

async function getProgress(
  userId: string | undefined
): Promise<ProgressItem[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("progress")
    .select(
      `
      lesson_id,
      best_score,
      completed_at,
      lessons (
        id,
        title,
        summary
      )
    `
    )
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export default function ProgressScreen() {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    data: progress,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["progress", userId],
    queryFn: () => getProgress(userId),
    enabled: Boolean(userId),
  });

  if (!userId) {
    return (
      <View style={styles.messageContainer}>
        <Ionicons name="lock-closed-outline" size={36} color={colors.accent} />
        <Text style={styles.emptyTitle}>Connexion nécessaire</Text>
        <Text style={styles.message}>
          Vous devez être connecté pour consulter votre progression.
        </Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.message}>Chargement de la progression...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Ionicons name="cloud-offline-outline" size={36} color={colors.accent} />
        <Text style={styles.message}>
          Impossible de charger la progression.
        </Text>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  const progressCount = progress.length;

  return (
    <FlatList
      data={progress}
      keyExtractor={(item) => item.lesson_id}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Ma progression</Text>
          {progressCount > 0 && (
            <Text style={styles.subtitle}>
              {progressCount} fiche{progressCount > 1 ? "s" : ""} suivie
              {progressCount > 1 ? "s" : ""}
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons
            name="stats-chart-outline"
            size={40}
            color={colors.accent}
          />
          <Text style={styles.emptyTitle}>Aucune progression</Text>
          <Text style={styles.message}>
            Terminez un quiz pour afficher votre progression.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const lesson = getProgressLesson(item);

        if (!lesson) {
          return null;
        }

        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{lesson.title}</Text>
            <Text style={styles.text}>{lesson.summary}</Text>

            <View style={styles.scoreRow}>
              <Ionicons name="trophy-outline" size={16} color={colors.accent} />
              <Text style={styles.score}>
                Meilleur score : {item.best_score} / 3
              </Text>
            </View>

            <Link
              href={{
                pathname: "/lesson/[id]",
                params: { id: lesson.id },
              }}
              asChild
            >
              <Pressable style={styles.readLink}>
                <Text style={styles.readLinkText}>Relire la fiche</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.primary}
                />
              </Pressable>
            </Link>
          </View>
        );
      }}
    />
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
    padding: 24,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    gap: 2,
    marginBottom: 4,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 40,
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    padding: 18,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
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
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  score: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  readLink: {
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 2,
  },
  readLinkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
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
