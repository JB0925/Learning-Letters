const letterReducer = (state, { type, payload }) => {
  switch(type) {
    case "get started":
        return {
            ...state,
            correctLetter: payload.correctLetter,
            isStarted: true,
            letters: payload.letters
        };

    case "plus 1":
        return {
          ...state,
          numberOfLettersInDOM: state.numberOfLettersInDOM + 1,
          correctLetter: payload.correctLetter,
          letters: payload.letters
        };
    
    case "plusMaxAmount":
        return {
            ...state,
            numberOfLettersInDOM: state.numberOfLettersInDOM === 10 ? 10 : state.numberOfLettersInDOM + 1,
            correctLetter: payload.correctLetter,
            letters: payload.letters
        };
    
    case "minus 1":
        return {
            ...state,
            numberOfLettersInDOM: state.numberOfLettersInDOM - 1,
            correctLetter: payload.correctLetter,
            letters: payload.letters
        }
    
    default:
        throw new Error(`Unhandled action type: ${type}`);
  };
};

export default letterReducer;

