const MAX_CARD_AMOUNT = 10;

const letterReducer = (state, { type, payload }) => {
  switch (type) {
    case "get started":
      return {
        ...state,
        correctValue: payload.correctValue,
        isStarted: true,
        values: payload.values,
      };

    case "plus 1":
      return {
        ...state,
        numberOfValuesInDOM: state.numberOfValuesInDOM + 1,
        correctValue: payload.correctValue,
        values: payload.values,
      };

    case "plusMaxAmount":
      return {
        ...state,
        numberOfValuesInDOM: MAX_CARD_AMOUNT,
        correctValue: payload.correctValue,
        values: payload.values,
      };

    case "minus 1":
      return {
        ...state,
        numberOfValuesInDOM: state.numberOfValuesInDOM - 1,
        correctValue: payload.correctValue,
        values: payload.values,
      };

    case "switchGame":
      return {
        ...state,
        values: payload.values,
        correctValue: payload.correctValue,
      };

    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export default letterReducer;
