let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForSecondOperand = false;
let calculationHistory = [];
let memoryValue = 0;

const display = document.getElementById('display');
const historyList = document.getElementById('historyList');
const noHistoryMessage = document.getElementById('noHistoryMessage');

function updateDisplay() {
    display.textContent = currentInput;
    // Adjust font size if a number is too long
    if (currentInput.length > 10) {
        display.style.fontSize = '1.8rem';
    } else if (currentInput.length > 7) {
        display.style.fontSize = '2.2rem';
    }
    else {
        display.style.fontSize = '2.5rem';
    }
}

function appendNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function appendOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && previousInput !== null && !waitingForSecondOperand) {
        const result = performCalculation[operator](previousInput, inputValue);
        currentInput = String(parseFloat(result.toFixed(10))); // Limit precision
        previousInput = result;
    } else {
        previousInput = inputValue;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
    updateDisplay(); // Update display to show the current number before it's replaced by next input
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => {
        if (secondOperand === 0) {
            return 'Error'; // Handle division by zero
        }
        return firstOperand / secondOperand;
    },
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
};

function calculate() {
    if (operator === null || previousInput === null || waitingForSecondOperand) {
        return;
    }
    const inputValue = parseFloat(currentInput);
    const result = performCalculation[operator](previousInput, inputValue);

    if (result === 'Error') {
        currentInput = 'Error';
    } else {
        currentInput = String(parseFloat(result.toFixed(10))); // Limit precision
    }

    operator = null;
    previousInput = null; // Reset previousInput after calculation
    // waitingForSecondOperand is not reset here, it will be reset when a new number is entered
    updateDisplay();
    // After calculation, the result is shown. If the user types a number next, it should start a new input.
    waitingForSecondOperand = true;
}

function clearAll() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    // If CE is pressed when waiting for the second operand,
    // it should not clear the operator or the first operand.
    if (waitingForSecondOperand && operator && previousInput !== null) {
        // Do nothing to operator and previousInput
    } else {
        // If CE is pressed for the first number or after an operation, behave like C
        operator = null;
        previousInput = null;
    }
    updateDisplay();
}


function backspace() {
    if (waitingForSecondOperand) { // Don't allow backspace on the result of an operation or when an operator is active
        return;
    }
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') {
        currentInput = '0';
    }
    updateDisplay();
}

function negate() {
    if (currentInput === '0' || currentInput === 'Error') return;
    currentInput = String(parseFloat(currentInput) * -1);
    updateDisplay();
}

function percentage() {
    if (currentInput === 'Error') return;
    const value = parseFloat(currentInput);
    if (operator && previousInput !== null) {
        // If there's a pending operation, calculate percentage of the previous input
        currentInput = String(parseFloat((previousInput * (value / 100)).toFixed(10)));
    } else {
        // Otherwise, calculate percentage of the current input (e.g., 90% -> 0.9)
        currentInput = String(parseFloat((value / 100).toFixed(10)));
    }
    // Unlike other operations, percentage is usually an immediate operation on the current number,
    // or used to modify the second operand in context of the first.
    // We won't set waitingForSecondOperand = true or change operator here,
    // allowing the user to continue the operation.
    // Example: 100 + 10% (of 100) = 110.
    // Or, if user just presses 10 then %, display becomes 0.1
    updateDisplay();
}

function squareRoot() {
    if (currentInput === 'Error') return;
    const value = parseFloat(currentInput);
    if (value < 0) {
        currentInput = 'Error'; // Square root of negative number
    } else {
        currentInput = String(parseFloat(Math.sqrt(value).toFixed(10)));
    }
    // Square root is an immediate operation.
    // The result can be used as the first operand of a new operation.
    operator = null;
    previousInput = null;
    waitingForSecondOperand = true; // Ready for a new number or operator
    updateDisplay();
}

// Initialize display
updateDisplay();

// Klavye Desteği
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        appendOperator('/');
    } else if (key === '%') {
        percentage();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Form gönderimini engelle (eğer varsa)
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key.toLowerCase() === 'c') {
        if (event.shiftKey) { // Shift + C -> CE
            clearEntry();
        } else { // C -> Clear All
            clearAll();
        }
    } else if (key === 'Escape') { // Esc -> Clear All
        clearAll();
    }
    // Karekök için doğrudan bir klavye kısayolu yaygın değildir,
    // ancak istenirse eklenebilir (örneğin 's' veya 'r' tuşu).
    // Şimdilik √ düğmesiyle sınırlı bırakıyoruz.
    // +/- için de benzer bir durum geçerli, genelde bir tuşla toggle edilir
    // ancak burada bir düğme ile yapılıyor. İstenirse bir kısayol atanabilir.
});

// Geçmiş İşlevselliği
function addToHistory(expression, result) {
    if (calculationHistory.length >= 20) { // Keep last 20 history items
        calculationHistory.shift();
    }
    calculationHistory.push({ expression, result });
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = ''; // Clear existing history items
    if (calculationHistory.length === 0) {
        if (noHistoryMessage) noHistoryMessage.style.display = 'block';
        return;
    }

    if (noHistoryMessage) noHistoryMessage.style.display = 'none';

    calculationHistory.slice().reverse().forEach(item => { // Show newest first
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${item.expression} = <br><strong>${item.result}</strong>`;
        li.addEventListener('click', () => {
            currentInput = String(item.result);
            operator = null;
            previousInput = null;
            waitingForSecondOperand = true; // Ready for new operation or number
            updateDisplay();
        });
        historyList.appendChild(li);
    });
}

function clearHistoryDisplay() {
    calculationHistory = [];
    renderHistory();
}

// calculate fonksiyonunu geçmişi kaydetmek için güncelle
const originalCalculate = calculate;
calculate = function() {
    if (operator === null || previousInput === null || waitingForSecondOperand) {
        return;
    }
    const firstNum = previousInput;
    const secondNum = parseFloat(currentInput);
    const op = operator;

    originalCalculate.call(this); // Call original calculate function

    // Sadece başarılı bir hesaplama ve geçerli bir sonuç varsa geçmişe ekle
    if (currentInput !== 'Error' && !isNaN(parseFloat(currentInput))) {
        // currentInput is the result after originalCalculate
        const expression = `${firstNum} ${opSymbol(op)} ${secondNum}`;
        addToHistory(expression, currentInput);
    }
}

function opSymbol(opString) {
    const symbols = {
        '/': '÷',
        '*': '×',
        '+': '+',
        '-': '−'
    };
    return symbols[opString] || opString;
}

// Initialize history display
renderHistory();

// Hafıza İşlevselliği
function memoryClear() {
    memoryValue = 0;
    // Optionally, indicate memory is cleared (e.g., disable MR button or show an indicator)
}

function memoryRecall() {
    currentInput = String(memoryValue);
    waitingForSecondOperand = true; // Allow the recalled number to be overwritten or used in new calculation
    updateDisplay();
}

function memoryAdd() {
    if (currentInput === 'Error') return;
    const currentValue = parseFloat(currentInput);
    if (!isNaN(currentValue)) {
        memoryValue += currentValue;
    }
    // M+ is usually an immediate operation, the display doesn't change
    // but the next number typed should start a new input.
    waitingForSecondOperand = true;
}

function memorySubtract() {
    if (currentInput === 'Error') return;
    const currentValue = parseFloat(currentInput);
    if (!isNaN(currentValue)) {
        memoryValue -= currentValue;
    }
    // M- is usually an immediate operation, the display doesn't change
    waitingForSecondOperand = true;
}

// Hafıza durumu göstergesi (isteğe bağlı)
// Örneğin, display'in yanında küçük bir "M" gösterebilirsiniz.
// function updateMemoryIndicator() {
//     const indicator = document.getElementById('memoryIndicator'); // HTML'e eklenmeli
//     if (indicator) {
//         indicator.textContent = memoryValue !== 0 ? 'M' : '';
//     }
// }
// MC, M+, M- çağrıldığında updateMemoryIndicator() çağrılabilir.
