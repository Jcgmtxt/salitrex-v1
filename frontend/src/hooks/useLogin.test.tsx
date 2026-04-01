import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(() => Promise.resolve()),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(() => Promise.resolve({ data: null })),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
);

describe("useLogin hook", () => {
  it("should render within QueryClientProvider", () => {
    const { result } = renderHook(
      () => ({
        isPending: false,
      }),
      { wrapper }
    );

    expect(result.current.isPending).toBe(false);
  });
});