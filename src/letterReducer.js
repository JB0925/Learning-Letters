const MAX_CARD_AMOUNT = 10;

const letterReducer = (state, { type, payload }) => {
  switch (type) {
    case "get started":
      return {
        ...state,
        correctLetter: payload.correctLetter,
        isStarted: true,
        letters: payload.letters,
      };

    case "plus 1":
      return {
        ...state,
        numberOfLettersInDOM: state.numberOfLettersInDOM + 1,
        correctLetter: payload.correctLetter,
        letters: payload.letters,
      };

    case "plusMaxAmount":
      return {
        ...state,
        numberOfLettersInDOM: MAX_CARD_AMOUNT,
        correctLetter: payload.correctLetter,
        letters: payload.letters,
      };

    case "minus 1":
      return {
        ...state,
        numberOfLettersInDOM: state.numberOfLettersInDOM - 1,
        correctLetter: payload.correctLetter,
        letters: payload.letters,
      };

    case "switchGame":
      return {
        ...state,
        letters: payload.letters,
        correctLetter: payload.correctLetter,
      };

    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export default letterReducer;
