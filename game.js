let score = 0;
let gameStarted = false;
let timeLeft = 120; 
let countdown;

var rows = 4;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;

const correctOrder = [];
for (let i = 1; i <= rows * columns; i++) {
    correctOrder.push("./Img/" + i + ".png");
}


window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.setAttribute("src", `Img/card.png`)

            tile.draggable = true;
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }

    let pieces = [];
    for (let i = 1; i <= rows * columns; i++) {
        pieces.push(i.toString());
    }
    for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.setAttribute("src", `Img/${pieces[i]}.png`)
        tile.draggable = true;

        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("pieces").append(tile);
    }
}

function dragStart() {
    currTile = this;
}
function dragOver(e) {
    e.preventDefault();
}
function dragEnter(e) {
    e.preventDefault();
}
function dragLeave() {}
function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    
    if (currTile.src.includes("blank")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    turns += 1;
    document.getElementById("turns").innerText = `عدد التبديلات: ${turns}`;

    checkIfPuzzleCompleted();
}

function checkIfPuzzleCompleted() {
    const tiles = document.querySelectorAll('#board img'); 
    let isCorrect = true;

    tiles.forEach((tile, index) => {
        const tileSrc = tile.src.split('/').pop();  
        const expectedSrc = correctOrder[index].split('/').pop(); 
        if (tileSrc !== expectedSrc) {
            isCorrect = false; 
        }
    });

if (isCorrect) {
    clearInterval(countdown); 

    score = (timeLeft * 10) - (turns * 5);
    score = Math.max(score, 0); 
    if (localStorage.getItem('playerScore') < score) {
        localStorage.setItem('playerScore', score)
    }
    document.getElementById('timer').textContent = "تم الانتهاء";
    document.getElementById('score').textContent = `نقاطك: ${score}`;
    document.getElementById('score').style.display = 'block';
    console.log(`storge score:${localStorage.getItem('playerScore')}`);
    const gameArea = document.getElementById('gameArea'); 
        gameArea.classList.add('animate__heartBeat');
    disableDrag(); 

    updateScoreInAPI(score);
}
}
function updateScoreInAPI(score) {
    const playerID = localStorage.getItem('playerID'); 
    const playerName = localStorage.getItem('playerName'); 
    const playerScore = localStorage.getItem('playerScore'); 
    const data = {
        name: playerName,
        score: playerScore
    };

    fetch(`https://66f1060c41537919154f2fc1.mockapi.io/player/${playerID}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score updated successfully:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function disableDrag() {
    const tiles = document.querySelectorAll('img'); // Select all img elements (tiles)
    tiles.forEach(tile => {
        tile.draggable = false; // Disable dragging
        tile.removeEventListener("dragstart", dragStart);
        tile.removeEventListener("dragover", dragOver);
        tile.removeEventListener("dragenter", dragEnter);
        tile.removeEventListener("dragleave", dragLeave);
        tile.removeEventListener("drop", dragDrop);
        tile.removeEventListener("dragend", dragEnd);
    });
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    countdown = setInterval(() => {
        if (timeLeft > 0) {
            timerElement.textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
            timeLeft--;
        } else {
            clearInterval(countdown);
            timerElement.textContent = "انتهى الوقت";
            document.getElementById('score').textContent = `نقاطك: ${score}`;
            document.getElementById('score').style.display = 'block';
            const board = document.getElementById('pieces'); 
            board.classList.add('animate__heartBeat');
            disableDrag();
        }
    }, 1000);
}

function handleGameStart() {
    const startButton = document.getElementById('startButton');
    const gameContainer = document.querySelector('.game-container');

    if (!gameStarted) {
        gameContainer.style.display = 'flex';
        score = 0;
        timeLeft = 150;
        startButton.textContent = 'العب مجددا';
        document.getElementById('score').style.display = 'none';
        startTimer();
        gameStarted = true;
    } else {
        location.reload();
    }
}

document.getElementById('startButton').addEventListener('click', handleGameStart);

const playerName = localStorage.getItem('playerName');
const playerScore = localStorage.getItem('playerScore');
if (!playerName) {
    window.location.href = 'index.html'; 
} else {
    document.getElementById('playerNameDisplay').textContent = `${playerName}`;
}
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('playerName');
    localStorage.removeItem('playerScore');
    localStorage.clear();

    window.location.href = 'index.html'; 
});