import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

export default function AccountScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Mon compte</Text>
      <Text style={styles.text}>
        Le profil et le rappel quotidien seront ajoutés plus tard.
      </Text>

      <Link href="/auth" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Voir la connexion</Text>
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