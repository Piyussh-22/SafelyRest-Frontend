import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ErrorPage from "../src/pages/ErrorPage.jsx";

const renderErrorPage = (path = "/some/bad/route") => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ErrorPage />
    </MemoryRouter>,
  );
};

describe("ErrorPage", () => {
  it("should render 404 text", () => {
    renderErrorPage();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("should render page not found message", () => {
    renderErrorPage();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("should render go home link", () => {
    renderErrorPage();
    expect(screen.getByText("Go home")).toBeInTheDocument();
  });

  it("should display the current pathname", () => {
    renderErrorPage("/some/bad/route");
    expect(screen.getByText("/some/bad/route")).toBeInTheDocument();
  });
});
