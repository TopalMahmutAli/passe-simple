import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react-native";
import FavoritesScreen from "@/app/(private)/(tabs)/favorites";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesScreen />
    </QueryClientProvider>
  );
}

describe("<FavoritesScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("demande la connexion quand aucun utilisateur n'est connecté", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      signOut: jest.fn(),
    });

    const { getByText } = await render(renderScreen());

    expect(
      getByText("Vous devez être connecté pour consulter vos favoris.")
    ).toBeVisible();
  });

  it("affiche l'état vide quand l'utilisateur n'a aucun favori", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "user-1" },
      isLoading: false,
      signOut: jest.fn(),
    });
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });

    const { getByText } = await render(renderScreen());

    await waitFor(() => {
      expect(getByText("Aucun favori")).toBeVisible();
    });
  });
});
