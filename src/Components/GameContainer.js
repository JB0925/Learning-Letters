import React, { useCallback, useMemo } from "react";
import { useLetterGameContext } from "../useUpdateLetters";
import Oops from "../sounds/oops.mp3";
import Yay from "../sounds/yay.mp3";
import "../CSS/GameContainer.css";
import Letter from "./Letter";
import DIRECTIONS from "./AudioImports";

export default function GameContainer() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  /* eslint-disable no-unused-vars */
  const audioCtx = new AudioContext();
  /* eslint-enable no-unused-vars */
  const [{ numberOfLettersInDOM, correctLetter, isStarted, letters }, dispatch] = useLetterGameContext();

  const LETTERS = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),[]);
  const STARTING_CARD_AMT = 5;
  const MAX_CARD_AMT = 10;
  const COLORS = useMemo(() => [
    "red", "blue", "gold", "green",
    "purple", "orange", "lime"
  ],[]);

  const pickColor = useCallback(() => {
    const index = Math.floor(Math.random() * COLORS.length);
    return COLORS[index];
  },[COLORS]);


  const pickLetter = useCallback(() => {
    const index = Math.floor(Math.random() * LETTERS.length);
    return LETTERS[index]
  },[LETTERS]);


  const getNewLetters = useCallback(numberOfLettersToGet => {
    const newLetters = new Set();

    while (newLetters.size < numberOfLettersToGet) {
      const letter = pickLetter();
      if (!newLetters.has(letter)) {
        newLetters.add(letter);
      };
    };

    return Array.from(newLetters);
  },[pickLetter]);
  

  const updateLettersAndGetDirections = useCallback(numberOfLetters => {
    const newLetters = getNewLetters(numberOfLetters);
    const index = Math.floor(Math.random() * newLetters.length);
    const newCorrectLetter = newLetters[index];
    const newDirection = DIRECTIONS[newCorrectLetter];
    return { newLetters, newDirection, newCorrectLetter };
  },[getNewLetters]);


  const determineType = useCallback((currentNumberOfCards, isCorrect) => {
    if (!isStarted) return "get started";
    if (currentNumberOfCards >= MAX_CARD_AMT && isCorrect) return "plusMaxAmount";
    if (currentNumberOfCards < MAX_CARD_AMT && isCorrect) return "plus 1";
    return "minus 1";
  },[isStarted]);

  const determineNewNumberOfCards = useCallback((currentNumberOfCards, isCorrect) => {
    if (!isStarted) return STARTING_CARD_AMT;
    if (currentNumberOfCards >= MAX_CARD_AMT && isCorrect) return MAX_CARD_AMT;
    if (currentNumberOfCards >= MAX_CARD_AMT && !isCorrect) return MAX_CARD_AMT - 1;
    if (currentNumberOfCards < MAX_CARD_AMT && isCorrect) return numberOfLettersInDOM + 1;
    return numberOfLettersInDOM - 1;
  },[numberOfLettersInDOM, isStarted]);


  const handleStateChanges = useCallback((currentNumberOfCards, isCorrect, timeOutLength = 3000) => {
    const type = determineType(currentNumberOfCards, isCorrect);
    const newNumberOfCards = determineNewNumberOfCards(currentNumberOfCards, isCorrect);

    setTimeout(() => {
        const { newLetters, newDirection, newCorrectLetter } = updateLettersAndGetDirections(newNumberOfCards);
        newDirection.play();
        dispatch({
          type,
          payload: {
            correctLetter: newCorrectLetter,
            letters: newLetters
          }
        });
    }, timeOutLength);
  },[determineNewNumberOfCards, dispatch, updateLettersAndGetDirections, determineType]);


  const gotFirstOneWrong = useCallback(isCorrect => !isCorrect && numberOfLettersInDOM === STARTING_CARD_AMT, [numberOfLettersInDOM]);
  

  const updateGameState = useCallback(evt => {
    const oops = new Audio(Oops);
    const yay = new Audio(Yay);

    const { innerText } = evt.target;
    const isCorrect = innerText === correctLetter;

    if (gotFirstOneWrong(isCorrect)) return;

    if (isCorrect) yay.play();
    else oops.play();
    handleStateChanges(numberOfLettersInDOM, isCorrect);
    
  },[correctLetter, numberOfLettersInDOM, handleStateChanges, gotFirstOneWrong]);


  const createLetterCards = useCallback(() => {
    return letters.map(letter => <Letter letter={letter} color={pickColor()} updateParent={updateGameState} key={letter} />);
  },[letters, pickColor, updateGameState]);


  const handleStart = () => {
    handleStateChanges(STARTING_CARD_AMT, false, 0);
  };

  return (
    isStarted ?
    <div className="parent">
      <div className="GameContainer">
        {createLetterCards()}
      </div>
      <button onClick={handleStart} disabled={isStarted}>Start</button>
    </div>
    :
    <div className="parent">
      <div className="GameContainer" style={{ border: "none" }}>
      </div>
      <button onClick={handleStart} disabled={isStarted}>Start</button>
    </div>
  );
};