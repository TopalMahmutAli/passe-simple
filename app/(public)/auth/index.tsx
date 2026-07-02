import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function formIsValid() {
    if (!email || !password) {
      Alert.alert("Champs manquants", "Remplis ton e-mail et ton mot de passe.");
      return false;
    }

    return true;
  }

  async function signIn() {
    if (!formIsValid()) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      Alert.alert("Connexion impossible", error.message);
      return;
    }

    Alert.alert("Connexion réussie", "Bienvenue dans Passé Simple.");
  }

  async function signUp() {
    if (!formIsValid()) {
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      Alert.alert("Inscription impossible", error.message);
      return;
    }

    if (data.session) {
      Alert.alert("Compte créé", "Ton compte est prêt.");
    } else {
      Alert.alert("Compte créé", "Vérifie ton e-mail avant de te connecter.");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Passé Simple</Text>
        <Text style={styles.subtitle}>
          Connecte-toi pour enregistrer tes favoris et ta progression.
        </Text>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="E-mail"
          placeholderTextColor={colors.accent}
          style={styles.input}
          value={email}
        />

        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder="Mot de passe"
          placeholderTextColor={colors.accent}
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <Pressable
          disabled={isLoading}
          onPress={signIn}
          style={[styles.primaryButton, isLoading && styles.disabledButton]}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? "Chargement..." : "Se connecter"}
          </Text>
        </Pressable>

        <Pressable
          disabled={isLoading}
          onPress={signUp}
          style={[styles.secondaryButton, isLoading && styles.disabledButton]}
        >
          <Text style={styles.secondaryButtonText}>Créer un compte</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    padding: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});