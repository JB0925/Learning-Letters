import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LetterGameProvider } from './useUpdateLetters';
import Letter from './Components/Letter';
import App from './App';
import GameContainer from "./Components/GameContainer";
import React from 'react';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(() => {});
})

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.clearAllMocks();
});


describe("Rendering the Letter Component", () => {
  it("should render the Letter component", () => {
    const updateParent = jest.fn(() => ({ letters:["A", "E", "I", "O", "U"], correctLetter: "A" }));
    render(
      <Letter letter="G" color="purple" updateParent={updateParent} />
    );
    
    const letter = screen.getByText("G")
    expect(letter).toHaveStyle("color: purple;");
    expect(letter).toBeInTheDocument();
  });
});

describe("Rendering the App Component", () => {
  it("should render the App component", () => {
    render(
      <LetterGameProvider>
        <App />
      </LetterGameProvider>
    );
  });

  it("should update the App component when the start button is clicked", async() => {
    render(
      <LetterGameProvider>
        <App />
      </LetterGameProvider>
    );

    const startButton = screen.getByText("Start");

    fireEvent.click(startButton)
    await waitFor(() => {
      expect(startButton).toBeDisabled();
    });
    
    const allLetters = screen.getAllByTestId("letter");
    expect(allLetters.length).toBe(5);
  });
});

describe("Rendering the GameContainer Component", () => {
  it("should render the GameContainer component", () => {
    render(
      <LetterGameProvider>
        <GameContainer />
      </LetterGameProvider>
    )
  });
});