import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import QuizScreen from "@/app/(private)/quiz/[lessonId]";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ lessonId: "lesson-1" }),
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const upsertProgress = jest.fn().mockResolvedValue({ error: null });

function mockSupabaseFrom() {
  (supabase.from as jest.Mock).mockImplementation((table: string) => {
    if (table === "questions") {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: "question-1",
                  question: "Quelle est la capitale de la France ?",
                  choice_a: "Lyon",
                  choice_b: "Paris",
                  choice_c: "Marseille",
                  correct_choice: "b",
                  position: 1,
                },
              ],
              error: null,
            }),
          }),
        }),
      };
    }

    if (table === "progress") {
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
        upsert: upsertProgress,
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
      <QuizScreen />
    </QueryClientProvider>
  );
}

describe("<QuizScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "user-1" },
      isLoading: false,
      signOut: jest.fn(),
    });
    mockSupabaseFrom();
  });

  it("enregistre la progression une fois le quiz terminé", async () => {
    const { getByText } = await render(renderScreen());

    await waitFor(() => {
      expect(getByText("Paris")).toBeVisible();
    });

    await fireEvent.press(getByText("Paris"));
    await fireEvent.press(getByText("Voir mon résultat"));

    await waitFor(() => {
      expect(upsertProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-1",
          lesson_id: "lesson-1",
          best_score: 1,
        }),
        { onConflict: "user_id,lesson_id" }
      );
    });
  });
});
