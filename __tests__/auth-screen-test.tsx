import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AuthScreen from "@/app/(public)/auth/index";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

describe("<AuthScreen />", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  it("affiche une alerte et n'appelle pas Supabase quand le formulaire est vide", async () => {
    const { getByText } = await render(<AuthScreen />);

    await fireEvent.press(getByText("Se connecter"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Champs manquants",
      "Remplis ton e-mail et ton mot de passe."
    );
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("appelle Supabase avec l'e-mail et le mot de passe puis affiche le succès", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { getByPlaceholderText, getByText } = await render(<AuthScreen />);

    await fireEvent.changeText(
      getByPlaceholderText("E-mail"),
      "eleve@example.com"
    );
    await fireEvent.changeText(
      getByPlaceholderText("Mot de passe"),
      "secret123"
    );
    await fireEvent.press(getByText("Se connecter"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "eleve@example.com",
        password: "secret123",
      });
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Connexion réussie",
        "Bienvenue dans Passé Simple."
      );
    });
  });

  it("affiche une alerte quand la connexion échoue", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: new Error("Identifiants invalides"),
    });

    const { getByPlaceholderText, getByText } = await render(<AuthScreen />);

    await fireEvent.changeText(
      getByPlaceholderText("E-mail"),
      "eleve@example.com"
    );
    await fireEvent.changeText(
      getByPlaceholderText("Mot de passe"),
      "secret123"
    );
    await fireEvent.press(getByText("Se connecter"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Connexion impossible",
        "Identifiants invalides"
      );
    });
  });
});
