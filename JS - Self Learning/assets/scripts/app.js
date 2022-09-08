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
const LOG_HEAL_PLAYER = "HEAL_PLAYER";
const LOG_GAME_OVER = "GAME_OVER";
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
  chosenMaxLife = getMaxLifeValue();
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

function reset() {
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
      break;
  }
  logData.push(logDetails);
}

function endRound() {
  let initialPlayerHealth = currentPlayerHealth;
  // monster will also attack while increasing the health
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  console.log('currentPlayerHealth ',currentPlayerHealth);
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
  }
  // if currentMonsterHealth is <=0 you win but if currentPlayerHelth also goes down to zero then
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writeToLog(
      LOG_GAME_OVER,
      "PLAYER WON!",
      currentPlayerHealth,
      currentMonsterHealth
    );
    // if currentPlayerHealth is <=0 you lost but if currentMonsterHealth also goes down to zero then
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You Lost!");
    writeToLog(
      LOG_GAME_OVER,
      "MONSTER WON!",
      currentPlayerHealth,
      currentMonsterHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("Draw! Both Lost");
    writeToLog(
      LOG_GAME_OVER,
      "DRAW!",
      currentPlayerHealth,
      currentMonsterHealth
    );
  }

  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
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

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
