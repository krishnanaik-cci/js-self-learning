//global constants
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 12;
const STRONG_ATTACK_VALUE = 17;
const HEAL_PLAYER_VALUE = 20;
const ATTACK_MODE = "ATTACK";
const STRONG_ATTACK_MODE = "STRONG_ATTACK";
const MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_BONUS_LIFE_APPLIED = "BONUS_LIFE_APPLIED";
const LOG_HEAL_PLAYER = "HEAL_PLAYER";
const LOG_GAME_OVER = "GAME_OVER";
const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSOR = "SCISSOR";
const DRAW = "DRAW!";
const PLAYER_WON = "PLAYER WON!";
const COMPUTER_WON = "COMPUTER WON!";
let isBonusHealthAvailable = true;
let logData = [];
let chosenMaxLife;

function getMaxLifeValue() {
  const healthValue = prompt("Enter health value for monster and you", "100");
  const inputValue = parseInt(healthValue);
  // since the first condition is wrong || will go for next one
  if (isNaN(inputValue) || inputValue <= 0) {
    // throw sets message property to error object
    throw { message: "Invalid input, Please enter a number value" }; //throws custom error in function
  }
  return inputValue;
}

try {
  chosenMaxLife = getMaxLifeValue(); //this will throw an exception
} catch (error) {
  // executes becuase getMaxLifeValue funtion has an error
  console.log("Error = " + error.message);
  chosenMaxLife = 100;
  alert("You enterd wrong value. We have set default max life value to 100");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

// sets the UI of Monster and Player health bar
adjustHealthBars(chosenMaxLife);

function restartGameHandler() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

// we also need to write to log draw!
function writeToLog(ev, val, playerHealth, monsterHealth) {
  let logDetails = {
    event: ev,
    value: val,
    playerHealthStatus: playerHealth,
    monsterHealthStatus: monsterHealth,
  };
  switch (ev) {
    case LOG_EVENT_MONSTER_ATTACK:
      logDetails.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_ATTACK:
      logDetails.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logDetails.target = "MONSTER";
  }
  logData.push(logDetails);
}

function endRound() {
  let initialPlayerHealth = currentPlayerHealth;
  // monster will also attack while increasing the health
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE); // this updates the progressbar ui
  currentPlayerHealth -= playerDamage;
  // how do we know if the attack is normal or strong
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentPlayerHealth,
    currentMonsterHealth
  );

  // applying bonus life if currentPlayerHealth <= 0 & if player bonus health is available
  if (currentPlayerHealth <= 0 && isBonusHealthAvailable) {
    removeBonusLife();
    isBonusHealthAvailable = false;
    // sets previous currentPlayerHealth value before it became negative/zero
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Bonus life applied!"); //show alert only when
    writeToLog(
      LOG_BONUS_LIFE_APPLIED,
      initialPlayerHealth,
      currentPlayerHealth,
      currentMonsterHealth
    );
  }
  // if currentMonsterHealth is <=0 you win but if currentPlayerHelth also goes down to zero then
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    declareWinner("PLAYER WON!");
    writeToLog(
      LOG_GAME_OVER,
      "PLAYER WON!",
      currentPlayerHealth,
      currentMonsterHealth
    );
    // if currentPlayerHealth is <=0 you lost but if currentMonsterHealth also goes down to zero then
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    declareWinner("MONSTER WON!");
    writeToLog(
      LOG_GAME_OVER,
      "MONSTER WON!",
      currentPlayerHealth,
      currentMonsterHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    declareWinner("DRAW! BOTH LOST");
    writeToLog(
      LOG_GAME_OVER,
      "DRAW!",
      currentPlayerHealth,
      currentMonsterHealth
    );
  }

  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    disableBtns(true);
  }
}

function attackMonster(mode) {
  const maxDamage = mode === ATTACK_MODE ? ATTACK_VALUE : STRONG_ATTACK_VALUE; //condition using ternary operator
  const attackMode =
    mode === ATTACK_MODE
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;
  writeToLog(
    attackMode,
    monsterDamage,
    currentPlayerHealth,
    currentMonsterHealth
  );
  endRound();
}

function attackHandler() {
  attackMonster(ATTACK_MODE);
}

function strongAttackHandler() {
  // why attackMonster is not throwing an error when we dont pass any parameters to it
  attackMonster(STRONG_ATTACK_MODE);
}

function healPlayerHandler() {
  /* 
    if the player health reaches 100 dont increase it further
    to check that we first need to check the difference between the 
    current maxhealth value and the player health. this difference is then added to currentPlayerHealth
  */
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_PLAYER_VALUE) {
    alert("You cannot heal more than max health!");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_PLAYER_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_HEAL_PLAYER,
    healValue,
    currentPlayerHealth,
    currentMonsterHealth
  );
  endRound();
}

function printLogHandler() {
  let i = 0;
  for (logs of logData) {
    console.log(`#${i}`);
    for (key in logs) {
      console.log(`${key} => ${logs[key]}`);
    }
    i++;
  }
}

// function with arguments and default value
const greet = (greetMessage = "Namaste!", userName) => {
  return `${greetMessage} ${userName}`;
};
console.log(greet(undefined, "Krishna"));

// function without arguments hardcoded message
const greetAgain = () => {
  console.log("Hi! Welcome Back");
};
greetAgain();

// if all the strings is not empty throw an alert
const checkInput = (cb, ...inputVal) => {
  console.log(inputVal);
  let isEmpty = false;
  for (inptVal of inputVal) {
    if (!inptVal) {
      //checks if string is empty or not
      isEmpty = true;
      break;
    }
  }
  if (isEmpty) {
    cb();
  }
};
checkInput(
  () => console.log("String is not empty!"),
  "J",
  "a",
  "v",
  "a",
  "s",
  "c",
  "r",
  "i",
  "p",
  "t"
);

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
restartGame.addEventListener("click", restartGameHandler);

const getPlayerChoice = () => {
  // prompt option to allow user to enter his/hers option
  const selectedOption = prompt(
    `Choose ${ROCK}, ${PAPER} OR ${SCISSOR}`,
    ""
  ).toUpperCase();
  // if selected option is not rock or paper or scissor show below alert and return nothing
  if (
    selectedOption !== ROCK &&
    selectedOption !== PAPER &&
    selectedOption !== SCISSOR
  ) {
    alert(`Invalid option. Default option set is ${ROCK}`);
    return;
  }
  return selectedOption;
};

// computer choice gets dynamically generated using Math.random()
const getComputerChoice = () => {
  const choice = Math.random();
  if (choice < 0.3) {
    return ROCK;
  } else if (choice < 0.6) {
    return PAPER;
  } else {
    return SCISSOR;
  }
};

// gets the winner based on player and computer choice
// if player choice is not selected or invalid ROCK option is selected by default
const getWinner = (compChoice, plyrChoice = ROCK) =>
  plyrChoice === compChoice
    ? DRAW
    : (plyrChoice === PAPER && compChoice === ROCK) ||
      (plyrChoice === SCISSOR && compChoice === PAPER) ||
      (plyrChoice === ROCK && compChoice === SCISSOR)
    ? PLAYER_WON
    : COMPUTER_WON;

startGame2.addEventListener("click", () => {
  console.log("Game 2 Started!");
  const playerOption = getPlayerChoice();
  const computerOption = getComputerChoice();
  let winner;
  // saves the winner
  if (playerOption) {
    winner = getWinner(computerOption, playerOption);
  } else {
    winner = getWinner(computerOption);
  }

  // displays the message along with options selected by player and computer
  const message = `Player Selected ${
    playerOption || ROCK
  } Computer Selected ${computerOption}. `;

  if (winner === PLAYER_WON) {
    alert(`${message} PLAYER WON!`);
  } else if (winner === COMPUTER_WON) {
    alert(`${message} COMPUTER WON!`);
  } else {
    alert(`${message} DRAW!`);
  }
});

// displaying name based on dynamic characters
const getName = (...characters) => {
  //Rest operator will convert the dynamic arguments to array
  console.log(characters);
  let alphabet = "";
  for (character of characters) {
    alphabet += character;
  }
  return alphabet;
};
console.log("Total = " + getName("K", "R", "I", "S", "H", "N", "A"));

// example of call back function
const calc = (finalResult, operation, ...numbers) => {
  const checkEmptyInput = (number) => (isNaN(number) ? 0 : number);
  let reslt = 0;
  // let msg = "";
  if (operation === "ADD") {
    // msg = "Result after addition";
    for (number of numbers) {
      reslt += checkEmptyInput(number);
    }
  } else if (operation === "SUBTRACT") {
    // msg = "Result after subtraction";
    for (number of numbers) {
      reslt -= checkEmptyInput(number);
    }
  }
  finalResult(reslt);
};

// function which will be called as callback function
const outputResult = (message, result) => {
  alert(`${message} ${result}`);
};

calc(
  outputResult.bind(this, "Result after addition"),
  "ADD",
  10,
  20,
  30,
  40,
  "Hello",
  "Hi"
);
calc(
  outputResult.bind(this, "Result after addition"),
  "ADD",
  10,
  20,
  30,
  40,
  100,
  50
);
calc(
  outputResult.bind(this, "Result after subtraction"),
  "SUBTRACT",
  100,
  50,
  10,
  5
);
