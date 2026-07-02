import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>La Révolution française</Text>
      <Text style={styles.identifier}>Identifiant : {id}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Les causes de la Révolution</Text>
        <Text style={styles.text}>Première fiche de démonstration.</Text>

        <Link
          href={{ pathname: "/lesson/[id]", params: { id: "causes" } }}
          asChild
        >
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Lire la fiche</Text>
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
    gap: 14,
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  identifier: {
    color: colors.text,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
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