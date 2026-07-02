import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export default function DiscoverScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Passé Simple</Text>
      <Text style={styles.subtitle}>L’Histoire devient plus simple.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>La Révolution française</Text>
        <Text style={styles.cardText}>
          Découvrez les trois chapitres du premier programme.
        </Text>

        <Link
          href={{
            pathname: "/chapter/[id]",
            params: { id: "revolution-francaise" },
          }}
          asChild
        >
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Voir le chapitre</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    gap: 12,
    padding: 20,
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
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    padding: 18,
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
    borderRadius: 10,
    padding: 12,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
  },
});