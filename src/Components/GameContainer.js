import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLetterGameContext } from "../useUpdateLetters";
import Oops from "../sounds/oops.mp3";
import Yay from "../sounds/yay.mp3";
import "../CSS/GameContainer.css";
import GameValue from "./GameValue";
import { LETTER_DIRECTIONS, NUMBER_DIRECTIONS } from "./AudioImports";
import Sidebar from "./Sidebar";

/**
 * GameContainer Component
 *
 * Props: None
 *
 * Returns:
 *      - a game where the user is asked to choose the
 *        correct value from a group of values. Those values
 *        can be upper case letters, lower case letters, or
 *        numbers from 1 - 10. Also has a
 *        start button to kick off the game, and a replay button
 *        to replay the direction in case the user needs to hear
 *        it again.
 */
export default function GameContainer() {
  const gameRef = useRef();
  const sidebarRef = useRef();
  const burgerRef = useRef();
  const [{ numberOfValuesInDOM, correctValue, isStarted, values }, dispatch] =
    useLetterGameContext();

  const UPPER_LETTERS = useMemo(
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    []
  );
  const LOWER_LETTERS = useMemo(
    () => "abcdefghijklmnopqrstuvwxyz".split(""),
    []
  );
  const NUMBERS = useMemo(() => "1 2 3 4 5 6 7 8 9 10".split(" "), []);
  const STARTING_CARD_AMT = 5;
  const MAX_CARD_AMT = 10;
  const COLORS = useMemo(
    () => ["red", "blue", "gold", "green", "purple", "orange", "lime"],
    []
  );

  // local state for the container. Allows the user to choose
  // between uppercase letters, lowercase letters, and numbers.
  // Defaults to uppercase letters.
  const [gameValues, setGameValues] = useState(UPPER_LETTERS);

  // A helper function used to pick a random color for the letters
  // in the DOM.
  const pickColor = useCallback(() => {
    const index = Math.floor(Math.random() * COLORS.length);
    return COLORS[index];
  }, [COLORS]);

  // A helper function whose job is the same as the function above,
  // except this time it picks a random member of the gameValues instead of a color.
  const pickValue = useCallback(
    (groupOfGameValues = gameValues) => {
      const index = Math.floor(Math.random() * groupOfGameValues.length);
      return groupOfGameValues[index];
    },
    [gameValues]
  );

  // A helper function used to get a new group of gameValues after the user
  // has made their choice. Utilizes a set instead of an array due to
  // the Set's O(1) lookup time (roughly).
  // NOTE: typeOfValues refers to the three choices for the game: both sets
  // of letters, and the numbers.
  const getNewGameValues = useCallback(
    (numberOfGameValuesToGet, typeOfValues) => {
      const newGameValues = new Set();

      while (newGameValues.size < numberOfGameValuesToGet) {
        const gameValue = pickValue(typeOfValues);
        if (!newGameValues.has(gameValue)) {
          newGameValues.add(gameValue);
        }
      }

      return Array.from(newGameValues);
    },
    [pickValue]
  );

  // Determines the proper audio direction to give to the user
  // based on whether it is a number value, or a letter. If it
  // is a letter, we account for casing as well.
  const getAudioDirection = useCallback(
    (correctGameValue) => {
      if (NUMBERS.indexOf(correctGameValue) !== -1) {
        return NUMBER_DIRECTIONS[correctGameValue];
      }

      return LETTER_DIRECTIONS[correctGameValue.toUpperCase()];
    },
    [NUMBERS]
  );

  // A helper method used to return a new group of game values, a new
  // correct game value, and its corresponding audio direction. Takes in a
  // number of letters to get as a parameter. Is used in the dispatch
  // function after a user makes their choice.
  const updateLettersAndGetDirections = useCallback(
    (numberOfGameValues, typeOfValues) => {
      const newGameValues = getNewGameValues(numberOfGameValues, typeOfValues);
      const newCorrectGameValue = pickValue(newGameValues);
      const newAudioDirection = getAudioDirection(newCorrectGameValue);
      return { newGameValues, newAudioDirection, newCorrectGameValue };
    },
    [getNewGameValues, pickValue, getAudioDirection]
  );

  // A helper used to choose the correct action type to pass into the dispatch
  // function.
  const determineActionType = useCallback(
    (currentNumberOfCards, isCorrect) => {
      if (!isStarted) return "get started";
      if (currentNumberOfCards >= MAX_CARD_AMT && isCorrect)
        return "plusMaxAmount";
      if (currentNumberOfCards < MAX_CARD_AMT && isCorrect) return "plus 1";
      return "minus 1";
    },
    [isStarted]
  );

  // A helper function used to determine how many Letter Cards the user will need
  // to see for their next turn.
  const determineNewNumberOfCards = useCallback(
    (currentNumberOfCards, isCorrect) => {
      if (!isStarted) return STARTING_CARD_AMT;
      if (currentNumberOfCards >= MAX_CARD_AMT && isCorrect)
        return MAX_CARD_AMT;
      if (currentNumberOfCards >= MAX_CARD_AMT && !isCorrect)
        return MAX_CARD_AMT - 1;
      if (currentNumberOfCards < MAX_CARD_AMT && isCorrect)
        return numberOfValuesInDOM + 1;
      return numberOfValuesInDOM - 1;
    },
    [numberOfValuesInDOM, isStarted]
  );

  // A helper used to choose the correct action type, the correct amount of cards,
  // use those to get the new letters, new correct letter, and new audio direction,
  // and then dispatch all of those to the reducer function that is handling state.
  // Utilizes setTimeout to give the user some time between each guess and allow
  // time for the audio to play.
  const handleStateChanges = useCallback(
    (
      currentNumberOfCards,
      isCorrect,
      isNewGame = false,
      timeOutLength = 3000,
      typeOfValues = gameValues
    ) => {
      const type = isNewGame
        ? "switchGame"
        : determineActionType(currentNumberOfCards, isCorrect);
      const newNumberOfCards = isNewGame
        ? currentNumberOfCards
        : determineNewNumberOfCards(currentNumberOfCards, isCorrect);

      setTimeout(() => {
        const { newGameValues, newCorrectGameValue, newAudioDirection } =
          updateLettersAndGetDirections(newNumberOfCards, typeOfValues);

        newAudioDirection.play();
        dispatch({
          type,
          payload: {
            correctValue: newCorrectGameValue,
            values: newGameValues,
          },
        });
      }, timeOutLength);
    },
    [
      determineNewNumberOfCards,
      dispatch,
      updateLettersAndGetDirections,
      determineActionType,
      gameValues,
    ]
  );

  // A helper used as a more readable way of saying "there are five cards
  // and the user got the first one wrong."
  const gotFirstOneWrong = useCallback(
    (isCorrect) => !isCorrect && numberOfValuesInDOM === STARTING_CARD_AMT,
    [numberOfValuesInDOM]
  );

  // Function that determines whether or not the user's guess was correct, then
  // handles the updating of state via the dispatch function from useReducer.
  // Disables pointer events on all letters afterward, so that the user can't
  // click and hear multiple messages. AudioContext is used to make the mobile
  // audio experience smoother / work better.
  const updateGameState = useCallback(
    (evt) => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      /* eslint-disable no-unused-vars */
      const audioCtx = new AudioContext();
      /* eslint-enable no-unused-vars */
      const oops = new Audio(Oops);
      const yay = new Audio(Yay);

      const { innerText: userChoice } = evt.target;
      const isCorrect = userChoice === correctValue;

      if (gotFirstOneWrong(isCorrect)) return;

      if (isCorrect) yay.play();
      else oops.play();

      Array.from(gameRef.current.children).forEach(
        (child) => (child.style.pointerEvents = "none")
      );
      handleStateChanges(numberOfValuesInDOM, isCorrect);
    },
    [correctValue, numberOfValuesInDOM, handleStateChanges, gotFirstOneWrong]
  );

  // Creating the game cards that will be displayed in the DOM.
  const createGameValueCards = useCallback(() => {
    return values.map((gameValue) => (
      <GameValue
        gameValue={gameValue}
        color={pickColor()}
        updateParent={updateGameState}
        key={gameValue}
      />
    ));
  }, [values, pickColor, updateGameState]);

  // Calling handleStateChanges, except changing the timeout value to 0,
  // so that there is no delay on start.
  const handleStart = () => {
    handleStateChanges(STARTING_CARD_AMT, false, false, 0);
  };

  // Handles replaying the audio direction in case the user needs
  // to hear it again. Passed to a click event handler in a
  // button element.
  const handleReplay = () => {
    const currentAudioDirection = getAudioDirection(correctValue);
    currentAudioDirection.play();
  };

  // The pointer events on each letter card are disabled after the
  // user makes a choice. Here, we re-enable them once the letters
  // change, so that the user can make their next choice.
  useLayoutEffect(() => {
    gameRef.current &&
      Array.from(gameRef.current.children).forEach(
        (child) => (child.style.pointerEvents = "auto")
      );
  }, [values]);

  // Used to toggle a class that opens and closes the sidebar and,
  // for each link in the sidebar (if clicked), also toggles the same
  // class to ensure that the sidebar closes. Removes the event listeners
  // on component unmount.
  useLayoutEffect(() => {
    burgerRef.current.addEventListener("click", () => {
      sidebarRef.current.classList.toggle("sidebar-open");
    });

    document.querySelectorAll("li button").forEach((btn) => {
      btn.addEventListener("click", () => {
        sidebarRef.current.classList.toggle("sidebar-open");
      });
    });
  }, []);

  // The four functions below are used to pass to the sidebar and used
  // to update the state of the game and close the sidebar.
  const switchToUpperCase = () => {
    setGameValues(UPPER_LETTERS);
    handleStateChanges(numberOfValuesInDOM, false, true, 0, UPPER_LETTERS);
  };

  const switchToLowerCase = () => {
    setGameValues(LOWER_LETTERS);
    handleStateChanges(numberOfValuesInDOM, false, true, 0, LOWER_LETTERS);
  };

  const switchToNumbers = () => {
    setGameValues(NUMBERS);
    handleStateChanges(numberOfValuesInDOM, false, true, 0, NUMBERS);
  };

  const closeSidebar = () =>
    sidebarRef.current.classList.toggle("sidebar-open");

  return isStarted ? (
    <>
      <i id="burgerMenu" className="fas fa-bars" ref={burgerRef}></i>
      <div className="sidebar-parent" ref={sidebarRef}>
        <Sidebar
          closeSidebar={closeSidebar}
          switchToLowerCase={switchToLowerCase}
          switchToUpperCase={switchToUpperCase}
          switchToNumbers={switchToNumbers}
        />
      </div>
      <div className="parent">
        <div className="GameContainer" ref={gameRef}>
          {createGameValueCards()}
        </div>
        <div className="btn-holder">
          <button onClick={handleStart} disabled={isStarted}>
            Start
          </button>
          <button onClick={handleReplay}>Replay</button>
        </div>
      </div>
    </>
  ) : (
    <>
      <i id="burgerMenu" className="fas fa-bars" ref={burgerRef}></i>
      <div className="sidebar-parent" ref={sidebarRef}>
        <Sidebar
          closeSidebar={closeSidebar}
          switchToLowerCase={switchToLowerCase}
          switchToUpperCase={switchToUpperCase}
          switchToNumbers={switchToNumbers}
        />
      </div>
      <div className="parent">
        <div
          ref={gameRef}
          className="GameContainer"
          style={{ border: "none" }}
        ></div>
        <button onClick={handleStart} disabled={isStarted}>
          Start
        </button>
      </div>
    </>
  );
}
