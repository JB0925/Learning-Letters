import React from "react";
import "../CSS/Letter.css";

function Letter({ letter, color, updateParent }) {
  return <h1 className="Letter" style={{ color }} onClick={updateParent} >{letter}</h1>;
};

export default React.memo(Letter);