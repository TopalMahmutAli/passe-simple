import { Stack } from "expo-router";
import { colors } from "@/theme/colors";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    />
  );
}