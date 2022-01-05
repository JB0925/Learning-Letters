const letterReducer = (state, { type, payload }) => {
  switch(type) {
    case "plus one":
        return {
          ...state,
          correctInARow: state.correctInARow + 1,
          numberOfLettersInDOM: state.numberOfLettersInDOM + 1,
          userSelectionMessage: payload
        }
    
    case "plus two":
        return {
          ...state,
          correctInARow: state.correctInARow + 1,
          numberOfLettersInDOM: state.numberOfLettersInDOM + 1,
          userSelectionMessage: payload
        };
    
    case "plus three":
        return {
            ...state,
            correctInARow: state.correctInARow + 1,
            numberOfLettersInDOM: state.numberOfLettersInDOM + 1,
            userSelectionMessage: payload
        };
    
    case "plus four":
        return {
            ...state,
            correctInARow: state.correctInARow + 1,
            numberOfLettersInDOM: state.numberOfLettersInDOM + 2,
            userSelectionMessage: payload
        };
    
    case "minus one":
        return {
            ...state,
            correctInARow: state.correctInARow - 1,
            numberOfLettersInDOM: state.numberOfLettersInDOM - 1,
            userSelectionMessage: payload
        }
    
    case "minus two":
        return {
            ...state,
            correctInARow: state.correctInARow - 1,
            numberOfLettersInDOM: state.numberOfLettersInDOM - 1,
            userSelectionMessage: payload
        };
    
    case "minus three":
        return {
            ...state,
            correctInARow: state.correctInARow - 1,
            numberOfLettersInDOM: state.numberOfLettersInDOM - 1,
            userSelectionMessage: payload
        };
    
    case "minus four":
        return {
            ...state,
            correctInARow: state.correctInARow - 1,
            numberOfLettersInDOM: state.numberOfLettersInDOM - 2,
            userSelectionMessage: payload
        };
    
    default:
        throw new Error("Unhandled action type");
  };
};

export default letterReducer;

