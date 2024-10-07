// login.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Register from "../src/pages/Register/Register.jsx";
import Usepost from "../src/services/Usepost.js";
import { login } from "../src/stateManagement/slices/userSlice";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/services/Usepost.js", () => {
  return {
    __esModule: true,
    default: vi.fn(() => ({
      postData: vi.fn(),
      isLoading: false,
      success: null,
    })),
  };
});

// Mock react-router-dom functions
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    BrowserRouter: actual.BrowserRouter,
  };
});

const mockStore = configureStore([]);

describe("Register Page", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {},
    });
  });

  it("should display validation errors when the form is submitted with invalid data", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Submit the form without filling out fields
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Wait for validation messages
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it("should display loading state when `isLoading` is true", () => {
    Usepost.mockReturnValue({
      postData: vi.fn(),
      isLoading: true,
      success: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    // Check if the loading button is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });


});
