import { ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

export default function FavoritesScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Aucun favori</Text>
      <Text style={styles.text}>
        Les fiches ajoutées aux favoris apparaîtront ici.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 10,
    padding: 24,
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
});