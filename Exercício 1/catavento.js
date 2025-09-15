// ====================================================================
// 1. CÓDIGO DOS SHADERS (GLSL)
// ====================================================================

const vertexSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;
const fragmentSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

// ====================================================================
// 2. FUNÇÕES DE GEOMETRIA
// ====================================================================

function createCenterSquareVertices() { return new Float32Array([-0.2,-0.2, 0.2,-0.2, 0.2,0.2, -0.2,-0.2, 0.2,0.2, -0.2,0.2]); }
function createTopBladeVertices() { return new Float32Array([-0.2, 0.2, 0.2, 0.2, 0.0, 0.8]); }
function createRightBladeVertices() { return new Float32Array([0.2, 0.2, 0.2, -0.2, 0.8, 0.0]); }
function createBottomBladeVertices() { return new Float32Array([0.2, -0.2, -0.2, -0.2, 0.0, -0.8]); }
function createLeftBladeVertices() { return new Float32Array([-0.2, -0.2, -0.2, 0.2, -0.8, 0.0]); }


// ====================================================================
// 3. FUNÇÃO PRINCIPAL
// ====================================================================

function main2() {
    const canvas = document.getElementById('glCanvas2');
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    // --- CORREÇÃO APLICADA AQUI ---
    // Primeiro, compilamos os shaders a partir do código fonte (texto)
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    
    // Depois, criamos o programa a partir dos shaders compilados
    const program = createProgram(gl, vertexShader, fragmentShader);
    // --- FIM DA CORREÇÃO ---

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.9, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // --- DESENHANDO PEÇA POR PEÇA ---
    const mioloCor = [0.3, 0.3, 0.3, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, createCenterSquareVertices(), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, mioloCor);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const paCor1 = [1.0, 0.2, 0.2, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, createTopBladeVertices(), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, paCor1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const paCor2 = [0.2, 0.2, 1.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, createRightBladeVertices(), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, paCor2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bufferData(gl.ARRAY_BUFFER, createBottomBladeVertices(), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, paCor1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bufferData(gl.ARRAY_BUFFER, createLeftBladeVertices(), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, paCor2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ====================================================================
// 4. INICIALIZAÇÃO
// ====================================================================

// As funções createShader e createProgram não precisam estar neste arquivo
// porque o `flor.js` já as disponibilizou para a página inteira.
window.addEventListener('load', main2);