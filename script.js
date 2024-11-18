const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const resultContainer = document.getElementById('result-container');
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext('2d');

const prizes = ["Premio 1", "Premio 2", "Premio 3", "Premio 4", "Premio 5", "Premio 6", "Premio 7", "Premio 8", "Premio 9", "Premio 10"];
const numSegments = prizes.length;
const wheelRadius = canvas.width / 2;
const colors = ['#ff88c2', '#88d8ff'];

let currentAngle = 0;
let isSpinning = false;

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

function drawWheel() {
    const segmentAngle = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        const startAngle = currentAngle + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        ctx.beginPath();
        ctx.moveTo(wheelRadius, wheelRadius);
        ctx.arc(wheelRadius, wheelRadius, wheelRadius, startAngle, endAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(prizes[i], wheelRadius - 20, 0);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    resultContainer.style.display = 'none';
    resultDisplay.textContent = "";

    let spinAngle = Math.random() * 360 + 1440;
    let spinTime = 7000;
    let start = null;

    function rotate(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;

        currentAngle = (spinAngle * Math.sqrt(progress / spinTime)) % 360;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate((currentAngle * Math.PI) / 180);
        ctx.translate(-wheelRadius, -wheelRadius);
        drawWheel();
        ctx.restore();

        if (progress < spinTime) {
            requestAnimationFrame(rotate);
        } else {
            isSpinning = false;
            determinePrize();
        }
    }

    requestAnimationFrame(rotate);
}

function determinePrize() {
    const segmentAngle = 360 / numSegments;
    const rotatedAngle = (360 - (currentAngle % 360)) % 360;
    const winningIndex = Math.floor(rotatedAngle / segmentAngle);

    resultContainer.style.display = 'block';
    resultDisplay.textContent = `¡Ganaste: ${prizes[winningIndex]}!`;

    launchConfetti();
}

// Confeti
function launchConfetti() {
    const confettiCount = 100;
    const confettiColors = ['#ff6ec7', '#41c4f9', '#ffffff'];

    function createConfettiPiece() {
        return {
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            size: Math.random() * 6 + 2,
            speedY: Math.random() * 3 + 1,
        };
    }

    const confettiPieces = Array.from({ length: confettiCount }, createConfettiPiece);

    function drawConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces.forEach(p => {
            confettiCtx.beginPath();
            confettiCtx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fill();
            p.y += p.speedY;
        });

        requestAnimationFrame(drawConfetti);
    }

    drawConfetti();
}

spinButton.addEventListener('click', spinWheel);
drawWheel();









