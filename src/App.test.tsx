import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { getFruits } from "./services/api";
import Swal from "sweetalert2";

// Mock the API
jest.mock("./services/api", () => ({
  getFruits: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

const mockFruits = [
  {
    name: "Apple",
    family: "Rosaceae",
    order: "Rosales",
    genus: "Malus",
    nutritions: {
      calories: 52,
      carbohydrates: 14,
      fat: 0.2,
      protein: 0.3,
      sugar: 10,
    },
  },
];

beforeEach(() => {
  (getFruits as jest.Mock).mockResolvedValue(mockFruits);
});

test("should add Apple to the jar", async () => {
  render(<App />);

  // "Add" button for Apple to appear in the fruit list
  const appleAddButton = await screen.findByTestId("add-Apple");

  fireEvent.click(appleAddButton);

  const jarSection = screen.getByText("Jar").closest("div");
  const appleInJar = await within(jarSection!).findByText("Apple", {
    selector: "td",
  });
  expect(appleInJar).toBeInTheDocument();
});

test('should empty the jar when the "Empty Jar" button is clicked', async () => {
  render(<App />);

  const appleAddButton = await screen.findByTestId("add-Apple");

  fireEvent.click(appleAddButton);

  // Verify that Apple was added to the jar
  const jarSection = screen.getByText("Jar").closest("div");
  let appleInJar: HTMLElement | null = await within(jarSection!).findByText(
    "Apple",
    { selector: "td" }
  );
  expect(appleInJar).toBeInTheDocument();

  // Now click the Empty jar button
  const emptyJarButton = screen.getByTestId("empty-jar");
  fireEvent.click(emptyJarButton);

  // Verify that the jar is empty now or not
  await waitFor(() => {
    const noFruitsMessage = within(jarSection!).queryByText(
      "No fruits added to the jar yet."
    );
    expect(noFruitsMessage).toBeInTheDocument();
  });

  // Check that Apple is no longer in the jar
  appleInJar = within(jarSection!).queryByText("Apple", { selector: "td" });
  expect(appleInJar).toBeNull();
});
