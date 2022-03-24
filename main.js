var table;
var board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
var table;

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

    window.setTimeout(() => {window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}, 3000);
}

function initGUI() {
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
    var done = false;
    var row = -1;
    var col = -1;
    while (!done) {
        row = Math.floor(Math.random() * 4);
        col = Math.floor(Math.random() * 4);
        if (board[row][col] == 0) {
            done = true;
        }
    }
    board[row][col] = value;
}

function updateTable() {
    for (var row = 0; row < 4; row++) {
        let tableRow = table.getElementsByTagName("tr")[row];
        for (var col = 0; col < 4; col++) {
            var value = board[row][col];
            var tile = tableRow.children[col];
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
}