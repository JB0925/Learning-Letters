import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useLetterGameContext } from "../useUpdateLetters";
import Oops from "../sounds/oops.mp3";
import Yay from "../sounds/yay.mp3";
import "../CSS/GameContainer.css";
import Letter from "./Letter";
import DIRECTIONS from "./AudioImports";

/**
 * GameContainer Component
 * 
 * Props: None
 * 
 * Returns:
 *      - a Letter game, where the user is asked to choose the
 *        correct letter from a group of letters. Also has a
 *        start button to kick off the game, and a replay button
 *        to replay the direction in case the user needs to hear
 *        it again.
 */
export default function GameContainer() {
  const gameRef = useRef();
  const [{ numberOfLettersInDOM, correctLetter, isStarted, letters }, dispatch] = useLetterGameContext();

  const LETTERS = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),[]);
  const STARTING_CARD_AMT = 5;
  const MAX_CARD_AMT = 10;
  const COLORS = useMemo(() => [
    "red", "blue", "gold", "green",
    "purple", "orange", "lime"
  ],[]);
  
  // A helper function used to pick a random color for the letters
  // in the DOM.
  const pickColor = useCallback(() => {
    const index = Math.floor(Math.random() * COLORS.length);
    return COLORS[index];
  },[COLORS]);

  // A helper function whose job is the same as the function above,
  // except this time it picks a random letter instead of a color.
  const pickLetter = useCallback((groupOfLetters = LETTERS) => {
    const index = Math.floor(Math.random() * groupOfLetters.length);
    return groupOfLetters[index]
  },[LETTERS]);

  
  // A helper function used to get a new group of letters after the user
  // has made their choice. Utilizes a set instead of an array due to 
  // the Set's O(1) lookup time (roughly).
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
  
  
  // A helper method used to return a new group of letters, a new
  // correct letter, and its corresponding audio direction. Takes in a 
  // number of letters to get as a parameter. Is used in the dispatch 
  // function after a user makes their choice.
  const updateLettersAndGetDirections = useCallback(numberOfLetters => {
    const newLetters = getNewLetters(numberOfLetters);
    const newCorrectLetter = pickLetter(newLetters)
    const newAudioDirection = DIRECTIONS[newCorrectLetter];
    return { newLetters, newAudioDirection, newCorrectLetter };
  },[getNewLetters, pickLetter]);

  
  // A helper used to choose the correct action type to pass into the dispatch
  // function.
  const determineActionType = useCallback((currentNumberOfCards, isCorrect) => {
    if (!isStarted) return "get started";
    if (currentNumberOfCards >= MAX_CARD_AMT && isCorrect) return "plusMaxAmount";
    if (currentNumberOfCards < MAX_CARD_AMT && isCorrect) return "plus 1";
    return "minus 1";
  },[isStarted]);
  

  // A helper function used to determine how many Letter Cards the user will need
  // to see for their next turn.
  const determineNewNumberOfCards = useCallback((currentNumberOfCards, isCorrect) => {
    if (!isStarted) return STARTING_CARD_AMT;
    if (currentNumberOfCards >= MAX_CARD_AMT && isCorrect) return MAX_CARD_AMT;
    if (currentNumberOfCards >= MAX_CARD_AMT && !isCorrect) return MAX_CARD_AMT - 1;
    if (currentNumberOfCards < MAX_CARD_AMT && isCorrect) return numberOfLettersInDOM + 1;
    return numberOfLettersInDOM - 1;
  },[numberOfLettersInDOM, isStarted]);

  
  // A helper used to choose the correct action type, the correct amount of cards,
  // use those to get the new letters, new correct letter, and new audio direction,
  // and then dispatch all of those to the reducer function that is handling state.
  // Utilizes setTimeout to give the user some time between each guess and allow 
  // time for the audio to play.
  const handleStateChanges = useCallback((currentNumberOfCards, isCorrect, timeOutLength = 3000) => {
    const type = determineActionType(currentNumberOfCards, isCorrect);
    const newNumberOfCards = determineNewNumberOfCards(currentNumberOfCards, isCorrect);

    setTimeout(() => {
        const { newLetters, newAudioDirection, newCorrectLetter } = updateLettersAndGetDirections(newNumberOfCards);
        newAudioDirection.play();
        dispatch({
          type,
          payload: {
            correctLetter: newCorrectLetter,
            letters: newLetters
          }
        });
    }, timeOutLength);
  },[determineNewNumberOfCards, dispatch, updateLettersAndGetDirections, determineActionType]);

  
  // A helper used as a more readable of saying "there are five cards
  // and the user got the first one wrong."
  const gotFirstOneWrong = useCallback(isCorrect => !isCorrect && numberOfLettersInDOM === STARTING_CARD_AMT, [numberOfLettersInDOM]);
  
  
  // Function that determines whether or not the user's guess was correct, then
  // handles the updating of state via the dispatch function from useReducer.
  // Disables pointer events on all letters afterward, so that the user can't
  // click and hear multiple messages.
  const updateGameState = useCallback(evt => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    /* eslint-disable no-unused-vars */
    const audioCtx = new AudioContext();
    /* eslint-enable no-unused-vars */
    const oops = new Audio(Oops);
    const yay = new Audio(Yay);

    const { innerText: userChoice } = evt.target;
    const isCorrect = userChoice === correctLetter;

    if (gotFirstOneWrong(isCorrect)) return;

    if (isCorrect) yay.play();
    else oops.play();
    // gameRef.current.children.style.pointerEvents = "none";
    Array.from(gameRef.current.children).forEach(child => child.style.pointerEvents = "none");
    handleStateChanges(numberOfLettersInDOM, isCorrect);
    
  },[correctLetter, numberOfLettersInDOM, handleStateChanges, gotFirstOneWrong]);

  // Creating the letter cards that will be displayed in the DOM.
  const createLetterCards = useCallback(() => {
    return letters.map(letter => <Letter letter={letter} color={pickColor()} updateParent={updateGameState} key={letter} />);
  },[letters, pickColor, updateGameState]);

  
  // Calling handleStateChanges, except changing the timeout value to 0,
  // so that there is no delay on start.
  const handleStart = () => {
    handleStateChanges(STARTING_CARD_AMT, false, 0);
  };
  
  // Handles replaying the audio direction in case the user needs
  // to hear it again. Passed to a click event handler in a 
  // button element.
  const handleReplay = () => {
    const currentAudioDirection = DIRECTIONS[correctLetter];
    currentAudioDirection.play();
  };
  
  // The pointer events on each letter card are disabled after the
  // user makes a choice. Here, we re-enable them once the letters 
  // change, so that the user can make their next choice.
  useLayoutEffect(() => {
    gameRef.current && Array.from(gameRef.current.children)
        .forEach(child => child.style.pointerEvents = "auto");
  }, [letters]);

  return (
    isStarted ?
    <div className="parent">
      <div className="GameContainer" ref={gameRef}>
        {createLetterCards()}
      </div>
      <div className="btn-holder">
        <button onClick={handleStart} disabled={isStarted}>Start</button>
        <button onClick={handleReplay}>Replay</button>
      </div>
    </div>
    :
    <div className="parent">
      <div className="GameContainer" style={{ border: "none" }}>
      </div>
      <button onClick={handleStart} disabled={isStarted}>Start</button>
    </div>
  );
};