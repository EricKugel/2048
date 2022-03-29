var table;
var board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var table;

const maxDepth = 3;

var botInterval; 

const values = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
const colors = {
    0: "#ffffff",
    2: "#1dde50",
    4: "#c0e82e",
    8: "#dfe82e",
    16: "#ecf23a",
    32: "#ffec3d",
    64: "#ffd23d",
    128: "#ffbb3d",
    256: "#ffae3d",
    512: "#ff872b",
    1024: "#ff6b2b",
    2048: "#ff2b2b"
}

window.onload = function() {
    table = document.getElementById("table");
    initGUI();
    generateTile();
    generateTile();
    updateTable();

    window.addEventListener('keydown', (e) => {
        shift(board, e.code)
        generateTile();
        updateTable();
    });
    document.addEventListener('swiped', function(e) {
        shift(board, e.detail.dir);
        generateTile();
        updateTable();
    });
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, {
        passive: false,
        useCapture: false
    });
}

function findBestMove(board, depth = 0) {
    const directions = ["up", "down", "left", "right"];
    var moveScores = [0, 0, 0, 0];
    for (var i = 0; i < directions.length; i++) {
        var newBoard = JSON.parse(JSON.stringify(board));
        newBoard = shift(newBoard, directions[i]);
        if (depth < maxDepth) {
            moveScores[i] = findBestMove(newBoard, depth + 1);
        } else {
            moveScores[i] = staticAnalysis(newBoard);
        }
    }
    
    var index = 0;
    var max = moveScores[0];
    var squaredSum = 0;
    for (var i = 0; i < moveScores.length; i++) {
        if (depth == 0 && moveScores[i] > max) {
            max = moveScores[i];
            index = i;
        } else {
            squaredSum += Math.pow(moveScores[i], 2);  
        } 
    }

    if (depth == 0) {
        return directions[index];
    } else {
        return squaredSum / 4;
    }
}

function staticAnalysis(board) {
    var numZeros = 0;
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[0].length; col++) {
            if (board[row][col] == 0) {
                numZeros += 1;
            }
        }
    }

    var score = 0;
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board.length; col++) {
            score += Math.pow(board[row][col], 2);
        }
    }

    score = score * (16 - numZeros) / 16;
    return score;
}

function initGUI() {
    table.innerHTML = "";
    var size = (Math.min(window.innerHeight, window.innerWidth)) * 0.75;
    var tileSize = size / 4;
    table.style.width = "" + size + "px";
    table.style.height = "" + size + "px";
    table.style.marginTop = "" + (size * 4 / 30) + "px";
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (var row = 0; row < 4; row++) {
        var tr = document.createElement("tr");
        for (var col = 0; col < 4; col++) {
            var td = document.createElement("td");
            td.style.height = "" + tileSize + "px";
            td.style.width = "" + tileSize + "px";
            td.style.fontSize = "" + (tileSize / 3) + "px";
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function generateTile() {
    var value = 2;
    if (Math.random() > .66) {
        value = 4;
    }
    
    var rows = [0, 1, 2, 3];
    while(rows.length > 0) {
        var rowIndex = Math.floor(Math.random() * rows.length)
        var row = rows[rowIndex];
        var cols = [0, 1, 2, 3];
        while(cols.length > 0) {
            var colIndex = Math.floor(Math.random() * cols.length);
            var col = cols[colIndex];
            if (board[row][col] == 0) {
                board[row][col] = value;
                return true;
            }
            cols.splice(colIndex, 1);
        }
        rows.splice(rowIndex, 1);
    }

    return false;
}

function updateTable() {
    var gameOver = false;
    for (var row = 0; row < 4; row++) {
        let tableRow = table.getElementsByTagName("tr")[row];
        for (var col = 0; col < 4; col++) {
            var value = board[row][col];
            if (value == 2048) {
                gameOver = true;
            }
            var tile = tableRow.children[col];
            tile.innerText = "";
            if (values.includes(value)) {
                tile.style.backgroundColor = colors[value];
                if (value != 0) {
                    tile.innerText = value;
                }
            } else {
                tile.style.backgroundColor = "#ffffff";
            }
        }
    }

    if (gameOver) {
        window.setTimeout(() => {window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}, 1000);
    }
}

function shift(board, direction) {
    if (direction == "ArrowLeft" || direction == "left") {
        for (var row = 0; row < 4; row++) {
            board[row] = condenseArray(board[row])
        }
    } else if (direction == "ArrowRight" || direction == "right") {
        for (var row = 0; row < 4; row++) {
            board[row] = condenseArray(board[row].reverse()).reverse();
        }
    } else if (direction == "ArrowUp" || direction == "up") {
        for (var col = 0; col < 4; col++) {
            var numbers = [];
            for (var row = 0; row < 4; row++) {
                numbers.push(board[row][col]);
            }
            numbers = condenseArray(numbers);
            for (var row = 0; row < 4; row++) {
                board[row][col] = numbers[row];
            }
        }
    } else if (direction == "ArrowDown" || direction == "down") {
        for (var col = 0; col < 4; col++) {
            var numbers = [];
            for (var row = 3; row >= 0; row--) {
                numbers.push(board[row][col]);
            }
            numbers = condenseArray(numbers);
            for (var row = 3; row >= 0; row--) {
                board[row][col] = numbers[3 - row];
            }
        }
    }
    return board;
}

function condenseArray(numbers) {
    numbers = numbers.filter(num => num != 0);
    for (var i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] == numbers[i + 1]) {
            numbers[i] = numbers[i] * 2;
            numbers.splice(i + 1, 1);
        }
    }
    while (numbers.length < 4) {
        numbers.push(0);
    }
    return numbers;
}

function buttonClicked() {
    let button = document.getElementById("button");
    if (button.innerText == "Run Bot (Beta)") {
        botInterval = setInterval(() => {
            var direction = findBestMove(board);
            board = shift(board, direction);
            generateTile();
            updateTable();
        }, 200);
        button.innerText = "Pause Bot (Beta)";
    } else {
        clearInterval(botInterval);
        button.innerText = "Run Bot (Beta)";
    }
}