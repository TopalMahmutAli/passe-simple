import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import LessonScreen from "@/app/(private)/lesson/[id]";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ id: "lesson-1" }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const insertFavorite = jest.fn().mockResolvedValue({ error: null });

function mockSupabaseFrom() {
  (supabase.from as jest.Mock).mockImplementation((table: string) => {
    if (table === "lessons") {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: "lesson-1",
                title: "La société d'ordres",
                summary: "Résumé",
                content: "Contenu de la fiche.",
              },
              error: null,
            }),
          }),
        }),
      };
    }

    if (table === "favorites") {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest
                .fn()
                .mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
        insert: insertFavorite,
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });
}

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LessonScreen />
    </QueryClientProvider>
  );
}

describe("<LessonScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "user-1" },
      isLoading: false,
      signOut: jest.fn(),
    });
    mockSupabaseFrom();
  });

  it("ajoute la fiche aux favoris avec l'utilisateur et la fiche courants", async () => {
    const { getByText } = await render(renderScreen());

    await waitFor(() => {
      expect(getByText("Ajouter aux favoris")).toBeVisible();
    });

    await fireEvent.press(getByText("Ajouter aux favoris"));

    await waitFor(() => {
      expect(insertFavorite).toHaveBeenCalledWith({
        user_id: "user-1",
        lesson_id: "lesson-1",
      });
    });
  });
});
