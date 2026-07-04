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
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/layout";

type Chapter = {
  id: string;
  title: string;
  description: string;
  position: number;
};

async function getChapters(): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("id, title, description, position")
    .order("position");

  if (error) {
    throw error;
  }

  return data;
}

export default function DiscoverScreen() {
  const {
    data: chapters,
    isPending,
    isError,
    refetch: refetchChapters,
  } = useQuery({
    queryKey: ["chapters"],
    queryFn: getChapters,
  });

  if (isPending) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.message}>Chargement des chapitres...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Impossible de charger les chapitres.
        </Text>

        <Pressable onPress={() => refetchChapters()} style={styles.button}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={chapters}
      keyExtractor={(chapter) => chapter.id}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Passé Simple</Text>
          <Text style={styles.subtitle}>L’Histoire devient plus simple.</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.message}>Aucun chapitre disponible.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.description}</Text>

          <Link
            href={{
              pathname: "/chapter/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Voir le chapitre</Text>
            </Pressable>
          </Link>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    gap: spacing.medium,
    padding: spacing.xlarge,
  },
  header: {
    gap: spacing.xsmall,
    marginBottom: spacing.xsmall,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: spacing.medium,
    padding: spacing.xlarge,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.text,
    fontSize: 17,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    gap: spacing.medium,
    padding: spacing.large,
  },
  cardTitle: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
  },
  cardText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    padding: 12,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
  },
});