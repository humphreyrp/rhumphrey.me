
let ans;
let equation_text;

const Operations = {
    ADD: 0,
    SUBTRACT: 1,
    MULTIPLY: 2,
    DIVIDE: 3,
    PERCENT: 4
}

const Difficulty = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function onRefresh() {
    refresh();
}

function refresh() {

    let a, b, op_str;

    // Get the operation we're going to perform
    const op = getRandomInt(0, 3);
    const diff = getRandomInt(0, 2);
    switch(op) {
        case Operations.ADD: {
            let min, max;
            switch(diff) {
                case Difficulty.EASY: { min = 10; max = 30; break; }
                case Difficulty.MEDIUM: { min = 30; max = 300; break; }
                case Difficulty.MEDIUM: { min = 300; max = 3000; break; }
            }
            a = getRandomInt(min, max);
            b = getRandomInt(min, max);
            op_str = "+";
            ans = a + b;
            break;
        }
        case Operations.SUBTRACT: {
            let min, max;
            switch(diff) {
                case Difficulty.EASY: { min = 10; max = 30; break; }
                case Difficulty.MEDIUM: { min = 30; max = 300; break; }
                case Difficulty.MEDIUM: { min = 300; max = 3000; break; }
            }
            a = getRandomInt(min, max);
            b = getRandomInt(min, max);
            op_str = "-";
            ans = a - b;
            break;
        }
        case Operations.MULTIPLY: {
            let min, max;
            switch(diff) {
                case Difficulty.EASY: { min = 2; max = 10; break; }
                case Difficulty.MEDIUM: { min = 2; max = 15; break; }
                case Difficulty.MEDIUM: { min = 2; max = 30; break; }
            }
            a = getRandomInt(min, max);
            b = getRandomInt(min, max);
            op_str = "*";
            ans = a * b;
            break;
        }
        case Operations.DIVIDE: {
            a = getRandomInt(10);
            b = getRandomInt(a);
            a *= 5;
            op_str = "/";
            ans = a / b;
            break;
        }
    }

    equation_text = a.toString() + " " + op_str + " " + b.toString() + " = ";

    const equation_elem = document.getElementById("equation");
    equation_elem.innerHTML = equation_text + "__";
}

function showAnswer() {
    const equation_elem = document.getElementById("equation");
    equation_elem.innerHTML = equation_text + ans.toString();
}
