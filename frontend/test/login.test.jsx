// login.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Login from "../src/pages/Login/Login";
import Usepost from "../src/services/Usepost.js";
import { login } from "../src/stateManagement/slices/userSlice";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock('../src/services/Usepost.js', () => {
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

describe("Login Page", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {},
    });
  });

  it("should render the login form with email and password fields", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should show validation error messages if fields are empty", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it("should call `postData` when the form is submitted with valid data", async () => {
    const postDataMock = vi.fn();
    Usepost.mockReturnValue({
      postData: postDataMock,
      isLoading: false,
      success: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(postDataMock).toHaveBeenCalledWith(
        { email: "test@example.com", password: "password" },
        false
      );
    });
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
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
