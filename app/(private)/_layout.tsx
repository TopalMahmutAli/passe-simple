import { Stack } from "expo-router";
import { colors } from "@/theme/colors";

export default function PrivateLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chapter/[id]" options={{ title: "Chapitre" }} />
      <Stack.Screen name="lesson/[id]" options={{ title: "Fiche" }} />
      <Stack.Screen
        name="quiz/[lessonId]"
        options={{ presentation: "modal", title: "Mini-quiz" }}
      />
    </Stack>
  );
}