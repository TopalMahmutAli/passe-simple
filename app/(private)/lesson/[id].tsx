import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Les causes de la Révolution</Text>
      <Text style={styles.text}>
        Le contenu historique complet sera ajouté avec les données Supabase.
      </Text>

      <Link
        href={{ pathname: "/quiz/[lessonId]", params: { lessonId: id } }}
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
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  text: {
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
