import React from "react";
import "../CSS/GameValue.css";

/**
 * Letter Component
 *
 * Props:
 *      - gameValue -> string: the letter to display in the DOM
 *      - color -> string: the color to pass to the letter via the "style" object
 *      - updateParent -> function: the function used to update the overall game state
 *
 * Returns:
 *      - An h1 element with a colored letter, and a click event handler
 *        to update the state of its parent, the GameContainer component.
 */
function GameValue({ gameValue, color, updateParent }) {
  return (
    <h1
      className="GameValue"
      data-testid="letter"
      style={{ color, pointerEvents: "auto" }}
      onClick={updateParent}
    >
      {gameValue}
    </h1>
  );
}

export default React.memo(GameValue);
