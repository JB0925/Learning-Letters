import React from "react";

export default function Letter({ letter, color, topPosition, leftPosition }) {
  return <h1 
           style={{
             color,
             position: "absolute",
             top: topPosition,
             left: leftPosition
           }}>
            {letter}
         </h1>
};