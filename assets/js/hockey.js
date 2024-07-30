const canvas = document.getElementById('hockeyCanvas');
const context = canvas.getContext('2d');
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');
const dashboard = document.getElementById('dashboard');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

let player1 = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: '#00ff00',
    dy: 0
};

let player2 = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: '#ff0000',
    dy: 0
};

let puck = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: '#ffffff',
    dx: 5,
    dy: 4
};

let isOnePlayer = false;
let score1 = 0;
let score2 = 0;

function startGame(players) {
    isOnePlayer = players === 1;
    document.getElementById('playerSelection').classList.add('hidden');
    canvas.classList.remove('hidden');
    dashboard.classList.remove('hidden');
    loop();
}

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function movePlayer(player) {
    player.y += player.dy;

    if (player.y < 0) {
        player.y = 0;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function movePuck() {
    puck.x += puck.dx;
    puck.y += puck.dy;

    // Collision avec le haut et le bas du canvas
    if (puck.y < 0 || puck.y + puck.radius > canvas.height) {
        puck.dy *= -1;
    }

    // Collision avec les joueurs
    if (puck.x - puck.radius < player1.x + player1.width &&
        puck.y > player1.y && puck.y < player1.y + player1.height) {
        puck.dx *= -1;
        puck.x = player1.x + player1.width + puck.radius; // Éviter la collision multiple
    }

    if (puck.x + puck.radius > player2.x &&
        puck.y > player2.y && puck.y < player2.y + player2.height) {
        puck.dx *= -1;
        puck.x = player2.x - puck.radius; // Éviter la collision multiple
    }

    // Recommencer la partie si le puck dépasse les bords gauche ou droit
    if (puck.x < 0) {
        score2++;
        updateScore();
        resetPuck();
    } else if (puck.x > canvas.width) {
        score1++;
        updateScore();
        resetPuck();
    }
}

function updateScore() {
    score1Display.textContent = score1;
    score2Display.textContent = score2;
}

function resetPuck() {
    puck.x = canvas.width / 2;
    puck.y = canvas.height / 2;
    puck.dx = -puck.dx;
}

function update() {
    movePlayer(player1);
    movePlayer(player2);
    movePuck();

    if (isOnePlayer) {
        moveComputer(player2);
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
    drawCircle(puck.x, puck.y, puck.radius, puck.color);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function moveComputer(player) {
    let targetY = puck.y - player.height / 2;
    let deltaY = targetY - player.y;

    if (deltaY < -5) {
        player.dy = -5;
    } else if (deltaY > 5) {
        player.dy = 5;
    } else {
        player.dy = deltaY;
    }
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            player2.dy = -5;
            break;
        case 'ArrowDown':
            player2.dy = 5;
            break;
        case 'w':
            player1.dy = -5;
            break;
        case 's':
            player1.dy = 5;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            player2.dy = 0;
            break;
        case 'w':
        case 's':
            player1.dy = 0;
            break;
    }
});

canvas.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    player1.y = mouseY - player1.height / 2;
});

canvas.addEventListener('touchmove', function(event) {
    let rect = canvas.getBoundingClientRect();
    let touch = event.touches[0];
    let touchY = touch.clientY - rect.top;
    player1.y = touchY - player1.height / 2;
});
