import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react-native";
import DiscoverScreen from "@/app/(private)/(tabs)/index";
import { supabase } from "@/lib/supabase";

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
      <DiscoverScreen />
    </QueryClientProvider>
  );
}

describe("<DiscoverScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche la liste des chapitres", async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        {
          id: "1",
          title: "La fin de l'Ancien Régime",
          description: "La société d'ordres et la crise de la monarchie.",
          position: 1,
        },
        {
          id: "2",
          title: "L'année 1789",
          description: "Des États généraux à la prise de la Bastille.",
          position: 2,
        },
      ],
      error: null,
    });
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({ order }),
    });

    const { getByText } = await render(renderScreen());

    await waitFor(() => {
      expect(getByText("La fin de l'Ancien Régime")).toBeVisible();
    });
    expect(getByText("L'année 1789")).toBeVisible();
  });

  it("affiche un message quand aucun chapitre n'est disponible", async () => {
    const order = jest.fn().mockResolvedValue({ data: [], error: null });
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({ order }),
    });

    const { getByText } = await render(renderScreen());

    await waitFor(() => {
      expect(getByText("Aucun chapitre disponible.")).toBeVisible();
    });
  });
});
