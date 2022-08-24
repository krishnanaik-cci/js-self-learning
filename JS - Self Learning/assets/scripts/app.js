const defaultResult = 0;
let currentResult = defaultResult;
let calcLogs = [];

// calculation description and result
function showCalcDescriptionAndResult(initResult, operator, inputValue){
    let calcDescription = `${initResult} ${operator} ${inputValue}`;
    outputResult(currentResult, calcDescription);//vendor.js funtion
}

// gets value from input field
function getInputValue(){
    return parseInt(userInput.value);
}

// stores and prints calculations performed in console
function writeToLog(oldResult, operationIdentifier, enterdNumber, newResult) {
  const logData = {
    previousResult: oldResult,
    operator: operationIdentifier,
    enteredValue: enterdNumber,
    latestResult: newResult,
  };
  calcLogs.push(logData);
  console.log(calcLogs);
}

// addition
function add(){
    const initialResult = currentResult;
    currentResult += getInputValue(); //update current result
    // below currentResult will give me updated current result
    showCalcDescriptionAndResult(initialResult, '+', getInputValue());
    writeToLog(initialResult, 'ADD', getInputValue(), currentResult);
}

// subtraction
function subtract(){
    const initialResult = currentResult;
    currentResult -= getInputValue(); //update current result
    // below currentResult will give me updated current result
    showCalcDescriptionAndResult(initialResult, '-', getInputValue());
    writeToLog(initialResult, 'SUBTRACT', getInputValue(), currentResult);
}

// multiplication
function multiply(){
    const initialResult = currentResult;
    currentResult *= getInputValue(); //update current result
    // below currentResult will give me updated current result
    showCalcDescriptionAndResult(initialResult, '*', getInputValue());
    writeToLog(initialResult, 'MULTIPLY', getInputValue(), currentResult);
}

// division
function divide(){
    const initialResult = currentResult;
    currentResult /= getInputValue(); //update current result
    // below currentResult will give me updated current result
    showCalcDescriptionAndResult(initialResult, '*', getInputValue());
    writeToLog(initialResult, 'DIVIDE', getInputValue(), currentResult);
}

// event handlers calling the functions
addBtn.addEventListener('click', add);
subtractBtn.addEventListener('click', subtract);
multiplyBtn.addEventListener('click', multiply);
divideBtn.addEventListener('click', divide);

