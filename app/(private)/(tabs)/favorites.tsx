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
import { borderRadius, spacing } from "@/theme/layout";

type FavoriteLesson = {
  id: string;
  title: string;
  summary: string;
};

type Favorite = {
  lesson_id: string;
  lessons: FavoriteLesson[] | FavoriteLesson | null;
};

function getFavoriteLesson(favorite: Favorite): FavoriteLesson | null {
  const { lessons } = favorite;

  if (Array.isArray(lessons)) {
    return lessons[0] ?? null;
  }

  return lessons;
}

async function getFavorites(userId: string | undefined): Promise<Favorite[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      lesson_id,
      lessons (
        id,
        title,
        summary
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export default function FavoritesScreen() {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    data: favorites,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => getFavorites(userId),
    enabled: Boolean(userId),
  });

  if (!userId) {
    return (
      <View style={styles.messageContainer}>
        <Ionicons name="lock-closed-outline" size={36} color={colors.accent} />
        <Text style={styles.emptyTitle}>Connexion nécessaire</Text>
        <Text style={styles.message}>
          Vous devez être connecté pour consulter vos favoris.
        </Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.message}>Chargement des favoris...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Ionicons name="cloud-offline-outline" size={36} color={colors.accent} />
        <Text style={styles.message}>Impossible de charger les favoris.</Text>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  const favoriteCount = favorites.length;

  return (
    <FlatList
      data={favorites}
      keyExtractor={(favorite) => favorite.lesson_id}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Mes favoris</Text>
          {favoriteCount > 0 && (
            <Text style={styles.subtitle}>
              {favoriteCount} fiche{favoriteCount > 1 ? "s" : ""} enregistrée
              {favoriteCount > 1 ? "s" : ""}
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={40}
            color={colors.accent}
          />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.message}>
            Ajoutez une fiche aux favoris pour la retrouver ici.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const lesson = getFavoriteLesson(item);

        if (!lesson) {
          return null;
        }

        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="bookmark" size={16} color={colors.accent} />
              <Text style={styles.cardTitle}>{lesson.title}</Text>
            </View>

            <Text style={styles.text}>{lesson.summary}</Text>

            <Link
              href={{
                pathname: "/lesson/[id]",
                params: { id: lesson.id },
              }}
              asChild
            >
              <Pressable style={styles.readLink}>
                <Text style={styles.readLinkText}>Lire la fiche</Text>
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
    padding: spacing.xlarge,
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
  header: {
    gap: 2,
    marginBottom: spacing.xsmall,
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
    gap: spacing.small,
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
    borderRadius: borderRadius.large,
    borderWidth: 1,
    gap: 10,
    padding: spacing.large,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
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
  readLink: {
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xsmall,
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
    borderRadius: borderRadius.medium,
    padding: 10,
    paddingHorizontal: spacing.xlarge,
  },
  retryButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
});
