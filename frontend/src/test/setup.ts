import "@testing-library/jest-dom";

class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

(globalThis as any).ResizeObserver = MockResizeObserver;
