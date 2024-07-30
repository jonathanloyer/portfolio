function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('numPlayers').addEventListener('change', function() {
    alert(`Nombre de joueurs sélectionné : ${this.value}`);
    changeNumberOfPlayers(this.value);
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundImage = document.getElementById('backgroundImage');
const scoreElement1 = document.getElementById('score1');
const scoreElement2 = document.getElementById('score2');
const timePlayedElement = document.getElementById('timePlayed');

const cities = [
    'path/to/city1.jpg',
    'path/to/city2.jpg',
    'path/to/city3.jpg'
];

class Character {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.health = 3;
        this.score = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }

    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height > enemy.y;
    }
}

class Enemy extends Character {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.height;
            this.x = Math.random() * (canvas.width - this.width);
        }
    }
}

const jochouca = new Character(400, 500, 50, 50, 'blue');
const chouquette = new Character(200, 500, 50, 50, 'pink');
const enemies = [
    new Enemy(Math.random() * 750, 0, 50, 50, 'red', 2),
    new Enemy(Math.random() * 750, -100, 50, 50, 'red', 3),
    new Enemy(Math.random() * 750, -200, 50, 50, 'red', 4)
];

let gameOver = false;
let level = 1;
let startTime = Date.now();
let numPlayers = 1;

function updateGame() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Press Start 2P';
        ctx.fillText('Game Over', 300, 300);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    jochouca.draw();
    if (numPlayers === 2) {
        chouquette.draw();
    }

    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();

        if (jochouca.checkCollision(enemy)) {
            jochouca.health -= 1;
            enemy.y = -enemy.height;
            enemy.x = Math.random() * (canvas.width - enemy.width);

            if (jochouca.health <= 0) {
                gameOver = true;
            }
        }

        if (numPlayers === 2 && chouquette.checkCollision(enemy)) {
            chouquette.health -= 1;
            enemy.y = -enemy.height;
            enemy.x = Math.random() * (canvas.width - enemy.width);

            if (chouquette.health <= 0) {
                gameOver = true;
            }
        }
    });

    jochouca.score += 1;
    scoreElement1.textContent = jochouca.score;
    if (numPlayers === 2) {
        chouquette.score += 1;
        scoreElement2.textContent = chouquette.score;
    }
    const elapsedTime = (Date.now() - startTime) / 1000 / 60 / 60;
    timePlayedElement.textContent = elapsedTime.toFixed(2);

    if (jochouca.score % 1000 === 0) {
        level += 1;
        changeCity();
        enemies.forEach(enemy => enemy.speed += 1);
    }

    drawUI();
    requestAnimationFrame(updateGame);
}

function drawUI() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Press Start 2P';
    ctx.fillText(`Score Jochouca: ${jochouca.score}`, 10, 24);
    if (numPlayers === 2) {
        ctx.fillText(`Score Chouquette: ${chouquette.score}`, 10, 50);
    }
    ctx.fillText(`Health Jochouca: ${jochouca.health}`, 10, 76);
    if (numPlayers === 2) {
        ctx.fillText(`Health Chouquette: ${chouquette.health}`, 10, 102);
    }
    ctx.fillText(`Level: ${level}`, 10, 128);
}

function changeCity() {
    const cityIndex = (level - 1) % cities.length;
    backgroundImage.src = cities[cityIndex];
}

function changeNumberOfPlayers(players) {
    numPlayers = parseInt(players);
    resetGame();
}

function resetGame() {
    jochouca.x = 400;
    jochouca.y = 500;
    jochouca.health = 3;
    jochouca.score = 0;

    if (numPlayers === 2) {
        chouquette.x = 200;
        chouquette.y = 500;
        chouquette.health = 3;
        chouquette.score = 0;
    }

    enemies.forEach(enemy => {
        enemy.y = Math.random() * -canvas.height;
        enemy.x = Math.random() * (canvas.width - enemy.width);
    });

    startTime = Date.now();
    gameOver = false;
    level = 1;
    changeCity();
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'ArrowLeft') jochouca.move(-10, 0);
    if (key === 'ArrowRight') jochouca.move(10, 0);
    if (key === 'ArrowUp') jochouca.move(0, -10);
    if (key === 'ArrowDown') jochouca.move(0, 10);

    if (numPlayers === 2) {
        if (key === 'a') chouquette.move(-10, 0);
        if (key === 'd') chouquette.move(10, 0);
        if (key === 'w') chouquette.move(0, -10);
        if (key === 's') chouquette.move(0, 10);
    }
});

changeCity();
updateGame();
