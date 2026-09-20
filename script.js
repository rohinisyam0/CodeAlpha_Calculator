const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentInput = "";
let previousInput = "";
let operation = null;
let shouldResetDisplay = false;


// -----------------------------
// Number Input
// -----------------------------

function inputNumber(number) {

    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (number === "." && currentInput === "") {
        currentInput = "0";
    }

    currentInput += number;

    updateDisplay();
}


// -----------------------------
// Operation Selection
// -----------------------------

function chooseOperation(selectedOperation) {

    if (currentInput === "" && previousInput === "") {
        return;
    }

    if (currentInput === "" && previousInput !== "") {
        operation = selectedOperation;
        return;
    }

    if (previousInput !== "" && operation !== null) {
        calculate();
    }

    previousInput = currentInput;
    currentInput = "";
    operation = selectedOperation;

    updateDisplay();
}


// -----------------------------
// Calculation
// -----------------------------

function calculate() {

    if (previousInput === "" || currentInput === "" || operation === null) {
        return;
    }

    const previous = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    let result;

    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {
                currentInput = "Cannot divide by 0";
                previousInput = "";
                operation = null;

                updateDisplay();

                return;
            }

            result = previous / current;
            break;

        case "%":
            result = previous % current;
            break;

        default:
            return;
    }

    currentInput = formatResult(result);

    previousInput = "";
    operation = null;

    shouldResetDisplay = true;

    updateDisplay();
}


// -----------------------------
// Format Result
// -----------------------------

function formatResult(result) {

    if (!Number.isFinite(result)) {
        return "Error";
    }

    return Number(result.toFixed(10)).toString();
}


// -----------------------------
// Clear Calculator
// -----------------------------

function clearCalculator() {

    currentInput = "";
    previousInput = "";
    operation = null;
    shouldResetDisplay = false;

    updateDisplay();
}


// -----------------------------
// Delete Last Character
// -----------------------------

function deleteNumber() {

    if (shouldResetDisplay) {
        return;
    }

    currentInput = currentInput.slice(0, -1);

    updateDisplay();
}


// -----------------------------
// Update Display
// -----------------------------

function updateDisplay() {

    currentDisplay.textContent = currentInput || "0";

    if (previousInput && operation) {

        let symbol = operation;

        if (operation === "*") {
            symbol = "×";
        }

        if (operation === "/") {
            symbol = "÷";
        }

        previousDisplay.textContent =
            `${previousInput} ${symbol}`;

    } else {

        previousDisplay.textContent = "";
    }
}


// -----------------------------
// Button Click Events
// -----------------------------

document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {

        inputNumber(button.dataset.number);

    });

});


document.querySelectorAll("[data-operation]").forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


document.querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);


document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);


// -----------------------------
// Keyboard Support
// -----------------------------

document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {

        inputNumber(key);

        return;
    }

    // Decimal
    if (key === ".") {

        inputNumber(".");

        return;
    }

    // Operators
    if (["+", "-", "*", "/", "%"].includes(key)) {

        chooseOperation(key);

        return;
    }

    // Enter or =
    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

        return;
    }

    // Backspace
    if (key === "Backspace") {

        deleteNumber();

        return;
    }

    // Escape
    if (key === "Escape") {

        clearCalculator();

        return;
    }

});


// Start display
updateDisplay();