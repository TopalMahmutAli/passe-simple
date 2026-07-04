import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/contexts/auth-context";
import { colors } from "@/theme/colors";

const REMINDER_ENABLED_KEY = "@passe-simple/reminder-enabled";
const REMINDER_ID_KEY = "@passe-simple/reminder-id";
const REMINDER_CHANNEL_ID = "daily-reminder";

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: "Rappel quotidien",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function scheduleDailyReminder() {
  const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY);

  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId);
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Passé Simple",
      body: "C'est l'heure de votre révision quotidienne !",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
      channelId: REMINDER_CHANNEL_ID,
    },
  });

  await AsyncStorage.setItem(REMINDER_ID_KEY, id);
}

async function cancelDailyReminder() {
  const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY);

  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId);
  }

  await AsyncStorage.removeItem(REMINDER_ID_KEY);
}

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [isReminderLoading, setIsReminderLoading] = useState(true);
  const [isReminderUpdating, setIsReminderUpdating] = useState(false);

  useEffect(() => {
    async function restoreReminderState() {
      try {
        const value = await AsyncStorage.getItem(REMINDER_ENABLED_KEY);
        setIsReminderEnabled(value === "true");
      } catch {
        setIsReminderEnabled(false);
      } finally {
        setIsReminderLoading(false);
      }
    }

    restoreReminderState();
  }, []);

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

  async function handleToggleReminder(value: boolean) {
    setIsReminderUpdating(true);

    try {
      if (value) {
        await ensureAndroidChannel();

        const { granted } = await Notifications.getPermissionsAsync();
        let isGranted = granted;

        if (!isGranted) {
          const { granted: requestedGranted } =
            await Notifications.requestPermissionsAsync();
          isGranted = requestedGranted;
        }

        if (!isGranted) {
          Alert.alert(
            "Autorisation refusée",
            "Vous devez autoriser les notifications pour activer le rappel quotidien."
          );
          return;
        }

        await scheduleDailyReminder();
        await AsyncStorage.setItem(REMINDER_ENABLED_KEY, "true");
        setIsReminderEnabled(true);
        Alert.alert(
          "Rappel activé",
          "Vous recevrez un rappel chaque jour à 18 h."
        );
      } else {
        await cancelDailyReminder();
        await AsyncStorage.setItem(REMINDER_ENABLED_KEY, "false");
        setIsReminderEnabled(false);
      }
    } catch {
      Alert.alert(
        "Rappel impossible",
        "Une erreur est survenue pendant la mise à jour du rappel."
      );
    } finally {
      setIsReminderUpdating(false);
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

      <View style={styles.reminderSection}>
        <Text style={styles.label}>Rappel quotidien</Text>
        <View style={styles.reminderRow}>
          <Text style={styles.reminderText}>
            Recevoir un rappel de révision chaque jour à 18h00
          </Text>

          {isReminderLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Switch
              disabled={isReminderUpdating}
              onValueChange={handleToggleReminder}
              value={isReminderEnabled}
            />
          )}
        </View>
      </View>

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
  reminderSection: {
    gap: 8,
    marginTop: 12,
  },
  reminderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  reminderText: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
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
