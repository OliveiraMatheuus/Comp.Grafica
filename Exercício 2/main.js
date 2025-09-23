window.addEventListener('load', () => {

    const canvas = document.getElementById('bresenhamCanvas');
    const ctx = canvas.getContext('2d');
    const instructionText = document.getElementById('instructionText');
    const mainModeRadios = document.querySelectorAll('input[name="mainMode"]');
    const circleModeRadios = document.querySelectorAll('input[name="circleDrawMode"]');
    const circleControlsDiv = document.getElementById('circle-controls');
    
    let currentMainMode = 'lines';
    let currentCircleMode = 'centerAndRadius';
    let clickedPoints = [];
    const RAIO_FIXO = 100;
    
    const COLORS = [ "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#C0C0C0", "#FFA500", "#800080" ];
    let currentLineColor = COLORS[3];

    function plotPixel(x, y, color, size = 3) {
        ctx.fillStyle = color;
        ctx.fillRect(x - Math.floor(size / 2), y - Math.floor(size / 2), size, size);
    }

    function bresenhamLine(x0, y0, x1, y1) {
        const points = [];
        const dx = Math.abs(x1 - x0);
        const dy = -Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;

        while (true) {
            points.push({ x: x0, y: y0 });
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 >= dy) { err += dy; x0 += sx; }
            if (e2 <= dx) { err += dx; y0 += sy; }
        }
        return points;
    }

    function plotCirclePoints(xc, yc, x, y) {
        const color = '#0000FF';
        plotPixel(xc + x, yc + y, color); plotPixel(xc - x, yc + y, color);
        plotPixel(xc + x, yc - y, color); plotPixel(xc - x, yc - y, color);
        plotPixel(xc + y, yc + x, color); plotPixel(xc - y, yc + x, color);
        plotPixel(xc + y, yc - x, color); plotPixel(xc - y, yc - x, color);
    }

    function drawCircleBresenham(xc, yc, radius) {
        let x = 0, y = radius, d = 3 - 2 * radius;
        plotCirclePoints(xc, yc, x, y);
        while (y >= x) {
            x++;
            if (d > 0) { y--; d = d + 4 * (x - y) + 10; } 
            else { d = d + 4 * x + 6; }
            plotCirclePoints(xc, yc, x, y);
        }
    }

    function calculateCircleFromPoints(p1, p2, p3) {
        const D = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
        if (Math.abs(D) < 1e-6) { return null; }
        const p1_sq = p1.x * p1.x + p1.y * p1.y;
        const p2_sq = p2.x * p2.x + p2.y * p2.y;
        const p3_sq = p3.x * p3.x + p3.y * p3.y;
        const Ux = (p1_sq * (p2.y - p3.y) + p2_sq * (p3.y - p1.y) + p3_sq * (p1.y - p2.y)) / D;
        const Uy = (p1_sq * (p3.x - p2.x) + p2_sq * (p1.x - p3.x) + p3_sq * (p2.x - p1.x)) / D;
        const center = { x: Ux, y: Uy };
        const radius = Math.sqrt(Math.pow(p1.x - Ux, 2) + Math.pow(p1.y - Uy, 2));
        return { center, radius };
    }

    function resetState() {
        clickedPoints = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateInstructions();
    }

    function updateInstructions() {
        if (currentMainMode === 'lines') {
            instructionText.textContent = `Clique em 2 pontos para desenhar uma linha. Pontos: ${clickedPoints.length}/2. Pressione 0-9 para mudar a cor.`;
        } else {
            if (currentCircleMode === 'centerAndRadius') {
                instructionText.textContent = "Clique no quadro para definir o centro da circunferência.";
            } else {
                instructionText.textContent = `Clique em 3 pontos para definir a circunferência. Pontos: ${clickedPoints.length}/3`;
            }
        }
    }

    mainModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentMainMode = event.target.value;
            circleControlsDiv.style.display = (currentMainMode === 'circles') ? 'block' : 'none';
            resetState();
        });
    });
    
    circleModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentCircleMode = event.target.value;
            resetState();
        });
    });

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        if (currentMainMode === 'lines') {
            clickedPoints.push({ x: mouseX, y: mouseY });
            plotPixel(mouseX, mouseY, '#000000');
            updateInstructions();

            if (clickedPoints.length === 2) {
                const linePoints = bresenhamLine(clickedPoints[0].x, clickedPoints[0].y, clickedPoints[1].x, clickedPoints[1].y);
                linePoints.forEach(p => plotPixel(p.x, p.y, currentLineColor));
                clickedPoints = [];
                updateInstructions();
            }
        } else {
            if (currentCircleMode === 'centerAndRadius') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawCircleBresenham(mouseX, mouseY, RAIO_FIXO);
            } else {
                clickedPoints.push({ x: mouseX, y: mouseY });
                plotPixel(mouseX, mouseY, '#FF0000');
                updateInstructions();

                if (clickedPoints.length === 3) {
                    const circle = calculateCircleFromPoints(clickedPoints[0], clickedPoints[1], clickedPoints[2]);
                    if (circle) {
                        drawCircleBresenham(Math.round(circle.center.x), Math.round(circle.center.y), Math.round(circle.radius));
                    }
                    clickedPoints = [];
                    updateInstructions();
                }
            }
        }
    });

    window.addEventListener("keydown", (event) => {
        const key = parseInt(event.key);
        if (!isNaN(key) && key >= 0 && key <= 9) {
            currentLineColor = COLORS[key];
            console.log(`Cor da linha alterada para: ${currentLineColor}`);
        }
    });

    resetState();
});