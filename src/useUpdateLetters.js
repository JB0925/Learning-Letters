import React, { useContext, createContext, useReducer } from "react";
import letterReducer from "./letterReducer";

const LetterContext = createContext();

const LetterGameProvider = ({ children }) => {
  const initialState = {
    numberOfLettersInDOM: 5,
    correctLetter: "",
    isStarted: false,
    letters: []
  };

  const [state, dispatch] = useReducer(letterReducer, initialState);
  const value = [state, dispatch];
  return <LetterContext.Provider value={value}>{children}</LetterContext.Provider>;
};

const useLetterGameContext = () => {
  const context = useContext(LetterContext);
  if (!context) throw new Error("useLetterContext must be used within a LetterGameProvider");
  
  return context;
};

export { LetterGameProvider, useLetterGameContext };