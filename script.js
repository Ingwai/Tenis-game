const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 100;
let winScreen = false;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
let paddle1Y = 250;
let paddle1X = PADDLE_WIDTH;
let paddle2Y = 250;
let paddle2X = canvas.width - PADDLE_WIDTH - 10;

const handleMouseClick = e => {
	if (winScreen) {
		player1Score = 0;
		player2Score = 0;
		winScreen = false;
	}
};

const start = () => {
	let framesPerSeconds = 30;

	setInterval(() => {
		moveEverything();
		drawEverything();
	}, 1000 / framesPerSeconds);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', e => {
		let mousePos = calcMousePos(e);
		paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
	});
};

const calcMousePos = e => {
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = e.clientX - rect.left - root.scrollLeft;
	let mouseY = e.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY,
	};
};

const ballReset = () => {
	if (player2Score >= WINNING_SCORE || player1Score >= WINNING_SCORE) {
		winScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
};

const computerMove = () => {
	const paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
	if (paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY + 35) {
		paddle2Y -= 6;
	}
};

const moveEverything = () => {
	if (winScreen == true) {
		return;
	}
	computerMove();
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	if (ballX <= 20) {
		if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++;
			ballReset();
		}
	}
	if (ballX >= canvas.width - PADDLE_WIDTH - 10) {
		if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++;
			ballReset();
		}
	}

	ballY <= 0 ? (ballSpeedY = -ballSpeedY) : '';
	ballY >= canvas.height ? (ballSpeedY = -ballSpeedY) : '';
};

const drawMiddleLine = () => {
	for (let i = 0; i < canvas.height; i += 40) {
		colorRect(canvas.width / 2 - 1, i+10, 2, 20, 'white');
	}
};

const drawEverything = () => {
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if (winScreen) {
		ctx.fillStyle = 'white';
		if (player1Score >= WINNING_SCORE) {
			ctx.fillText('PLAYER WIN', 350, 200);
		} else if (player2Score >= WINNING_SCORE) {
			ctx.fillText('COMPUTER WIN', 350, 200);
		}
		ctx.fillStyle = 'white';
		ctx.fillText('Click to continue', 350, 500);

		return;
	}

	drawMiddleLine();
	colorRect(paddle1X, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); //paddle left
	colorRect(paddle2X, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); //paddle right
	colorCircle(ballX, ballY, 6, 0);

	ctx.fillText(player1Score, 300, 100);
	ctx.fillText(player2Score, canvas.width - 300, 100);
};

const colorRect = (leftX, topY, width, height, drawColor) => {
	ctx.fillStyle = drawColor;
	ctx.fillRect(leftX, topY, width, height);
};

const colorCircle = (centerX, centerY, radius, drawColor) => {
	ctx.beginPath();
	ctx.fillStyle = drawColor;
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true); //ball
	ctx.fill();
};

start();
