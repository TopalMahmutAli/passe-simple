import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Passé Simple</Text>
        <Text style={styles.subtitle}>L’Histoire devient plus simple.</Text>
        <Text style={styles.status}>Phase de conception terminée</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F1E5",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  title: {
    color: "#6D1F2F",
    fontSize: 34,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#172033",
    fontSize: 18,
    textAlign: "center",
  },
  status: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 12,
  },
});