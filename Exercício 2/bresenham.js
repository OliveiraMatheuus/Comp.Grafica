window.addEventListener('load', () => {

    const canvas = document.getElementById('meuCanvas');
    const ctx = canvas.getContext('2d');
    const instructionText = document.getElementById('instructionText');
    const modeRadios = document.querySelectorAll('input[name="drawMode"]');
    
    // --- VARIÁVEIS DE ESTADO ---
    let currentMode = 'centerAndRadius'; // Modo inicial
    let clickedPoints = [];
    const RAIO_FIXO = 100;

    // --- FUNÇÕES DE DESENHO E CÁLCULO (AS MESMAS DE ANTES) ---
    
    function plotPixel(context, x, y, color = '#FF0000') { /* ... */ }
    function plotCirclePoints(xc, yc, x, y) { /* ... */ }
    function drawCircleBresenham(xc, yc, radius) { /* ... */ }
    function calculateCircleFromPoints(p1, p2, p3) { /* ... */ }

    // --- LÓGICA DE CONTROLE ---

    function resetState() {
        clickedPoints = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentMode === 'centerAndRadius') {
            instructionText.textContent = "Clique no quadro para definir o centro da circunferência.";
        } else {
            instructionText.textContent = "Clique em 3 pontos para definir a circunferência. Pontos: 0/3";
        }
    }

    modeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentMode = event.target.value;
            console.log("Modo alterado para:", currentMode);
            resetState();
        });
    });

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        // --- VERIFICA O MODO ATUAL E EXECUTA A LÓGICA CORRETA ---
        if (currentMode === 'centerAndRadius') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCircleBresenham(mouseX, mouseY, RAIO_FIXO);
        } 
        else if (currentMode === 'threePoints') {
            clickedPoints.push({ x: mouseX, y: mouseY });
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clickedPoints.forEach(p => plotPixel(ctx, p.x, p.y, '#FF0000'));
            
            instructionText.textContent = `Clique em 3 pontos para definir a circunferência. Pontos: ${clickedPoints.length}/3`;

            if (clickedPoints.length === 3) {
                const circle = calculateCircleFromPoints(clickedPoints[0], clickedPoints[1], clickedPoints[2]);
                if (circle) {
                    drawCircleBresenham(Math.round(circle.center.x), Math.round(circle.center.y), Math.round(circle.radius));
                    plotPixel(ctx, circle.center.x, circle.center.y, '#00AA00');
                }
                clickedPoints = []; // Reinicia para o próximo desenho
                instructionText.textContent = "Clique em 3 pontos para definir a circunferência. Pontos: 0/3";
            }
        }
    });
    
    // --- COLE AS FUNÇÕES COMPLETAS DE DESENHO E CÁLCULO AQUI ---
    function plotPixel(context, x, y, color = '#FF0000') { context.fillStyle = color; context.fillRect(x - 2, y - 2, 5, 5); }
    function plotCirclePoints(xc, yc, x, y) { const color = '#0000FF'; plotPixel(ctx, xc + x, yc + y, color); plotPixel(ctx, xc - x, yc + y, color); plotPixel(ctx, xc + x, yc - y, color); plotPixel(ctx, xc - x, yc - y, color); plotPixel(ctx, xc + y, yc + x, color); plotPixel(ctx, xc - y, yc + x, color); plotPixel(ctx, xc + y, yc - x, color); plotPixel(ctx, xc - y, yc - x, color); }
    function drawCircleBresenham(xc, yc, radius) { let x = 0, y = radius, d = 3 - 2 * radius; plotCirclePoints(xc, yc, x, y); while (y >= x) { x++; if (d > 0) { y--; d = d + 4 * (x - y) + 10; } else { d = d + 4 * x + 6; } plotCirclePoints(xc, yc, x, y); } }
    function calculateCircleFromPoints(p1,p2,p3){const D=2*(p1.x*(p2.y-p3.y)+p2.x*(p3.y-p1.y)+p3.x*(p1.y-p2.y));if(Math.abs(D)<1e-6){console.warn("Pontos colineares");return null;}const p1_sq=p1.x*p1.x+p1.y*p1.y;const p2_sq=p2.x*p2.x+p2.y*p2.y;const p3_sq=p3.x*p3.x+p3.y*p3.y;const Ux=(p1_sq*(p2.y-p3.y)+p2_sq*(p3.y-p1.y)+p3_sq*(p1.y-p2.y))/D;const Uy=(p1_sq*(p3.x-p2.x)+p2_sq*(p1.x-p3.x)+p3_sq*(p2.x-p1.x))/D;const center={x:Ux,y:Uy};const radius=Math.sqrt(Math.pow(p1.x-Ux,2)+Math.pow(p1.y-Uy,2));return{center,radius};}

});