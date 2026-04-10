import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Signup from "../src/pages/auth/Signup.jsx";
import authReducer from "../src/store/authSlice.js";

const renderSignup = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Signup page", () => {
  it("should render all form fields", () => {
    renderSignup();
    expect(screen.getByPlaceholderText("Piyush")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Min. 6 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Repeat your password"),
    ).toBeInTheDocument();
  });

  it("should render create account button", () => {
    renderSignup();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("should show error when passwords do not match", () => {
    renderSignup();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.change(screen.getByPlaceholderText("Min. 6 characters"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat your password"), {
      target: { value: "654321" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /create account/i }).closest("form"),
    );
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("should show error when password is too short", () => {
    renderSignup();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.change(screen.getByPlaceholderText("Min. 6 characters"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat your password"), {
      target: { value: "123" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /create account/i }).closest("form"),
    );
    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it("should render sign in link", () => {
    renderSignup();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
