import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useAuth } from "@/contexts/auth-context";
import { colors } from "@/theme/colors";

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);

    try {
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      Alert.alert("Déconnexion impossible", message);
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>Mon compte</Text>
      <Text style={styles.label}>E-mail</Text>
      <Text selectable style={styles.email}>
        {user?.email}
      </Text>

      <Pressable
        disabled={isLoading}
        onPress={handleSignOut}
        style={[styles.button, isLoading && styles.disabledButton]}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Déconnexion..." : "Se déconnecter"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    gap: 12,
    padding: 24,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: "bold",
  },
  email: {
    color: colors.text,
    fontSize: 17,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});