import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

export default function QuizScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Mini-quiz</Text>
      <Text style={styles.text}>Fiche sélectionnée : {lessonId}</Text>
      <Text style={styles.text}>
        Les trois questions seront ajoutées pendant l’étape du quiz.
      </Text>

      <Pressable onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonText}>Fermer</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 16,
    padding: 24,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
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