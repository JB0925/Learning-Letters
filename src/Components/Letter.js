import React from "react";
import "../CSS/Letter.css";

function Letter({ letter, color, updateParent }) {
  return <h1 className="Letter" data-testid="letter"
             style={{ color, pointerEvents: "auto" }} 
             onClick={updateParent}
        >{letter}</h1>;
};

export default React.memo(Letter);