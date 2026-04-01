import { beforeEach, describe, it, expect, vi } from "vitest";
import { useAuthStore } from "./auth";

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("should have initial state with null token", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should set auth correctly", () => {
    const { setAuth } = useAuthStore.getState();
    
    setAuth({
      access_token: "test-token",
      token_type: "Bearer",
      name: "Test User",
      email: "test@salitrex.com",
      role: "operator",
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe("test-token");
    expect(state.user?.name).toBe("Test User");
    expect(state.user?.email).toBe("test@salitrex.com");
    expect(state.user?.role).toBe("operator");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should clear auth correctly", () => {
    const { setAuth, clearAuth } = useAuthStore.getState();
    
    setAuth({
      access_token: "test-token",
      token_type: "Bearer",
      name: "Test User",
      email: "test@salitrex.com",
      role: "admin",
    });
    
    clearAuth();
    
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should handle admin role", () => {
    const { setAuth } = useAuthStore.getState();
    
    setAuth({
      access_token: "admin-token",
      token_type: "Bearer",
      name: "Admin User",
      email: "admin@salitrex.com",
      role: "admin",
    });

    const state = useAuthStore.getState();
    expect(state.user?.role).toBe("admin");
    expect(state.isAuthenticated).toBe(true);
  });
});