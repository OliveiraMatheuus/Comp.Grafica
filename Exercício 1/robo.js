// ====================================================================
// 1. CÓDIGO DOS SHADERS (GLSL) - Simples, igual ao do catavento
// ====================================================================

const vertexSource_Robo = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;
const fragmentSource_Robo = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

// ====================================================================
// 2. FUNÇÃO AUXILIAR DE GEOMETRIA (A parte mais importante!)
// ====================================================================

/**
 * Cria os vértices para um retângulo (composto por 2 triângulos).
 * @param {number} x - Posição X do canto inferior esquerdo.
 * @param {number} y - Posição Y do canto inferior esquerdo.
 * @param {number} width - Largura do retângulo.
 * @param {number} height - Altura do retângulo.
 * @returns {Float32Array} - Um array com os 6 vértices.
 */
function createRectangleVertices(x, y, width, height) {
    const x2 = x + width;
    const y2 = y + height;
    return new Float32Array([
        x, y,    // Primeiro triângulo
        x2, y,
        x, y2,
        x, y2,   // Segundo triângulo
        x2, y,
        x2, y2
    ]);
}


// ====================================================================
// 3. FUNÇÃO PRINCIPAL DE DESENHO DO ROBÔ
// ====================================================================

function main3() { // Usando main3 para não conflitar com main1 e main2
    const canvas = document.getElementById('glCanvas3'); // Vamos usar o terceiro canvas
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    // Compila shaders e cria o programa (usando as funções de flor.js)
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource_Robo);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource_Robo);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Prepara a tela
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1.0); // Fundo cinza escuro
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // --- MONTANDO O ROBÔ PEÇA POR PEÇA ---

    // Define as cores
    const corCorpo = [0.4, 0.4, 0.9, 1.0]; // Azul
    const corMembros = [0.3, 0.8, 0.3, 1.0]; // Verde
    const corCabeca = [0.8, 0.3, 0.3, 1.0]; // Vermelho

    // 1. Desenha o Corpo
    let vertices = createRectangleVertices(-0.25, -0.4, 0.5, 0.6);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corCorpo);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 2. Desenha a Cabeça
    vertices = createRectangleVertices(-0.15, 0.2, 0.3, 0.3);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corCabeca);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 3. Desenha o Braço Esquerdo
    vertices = createRectangleVertices(-0.45, -0.2, 0.2, 0.15);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 4. Desenha o Braço Direito
    vertices = createRectangleVertices(0.25, -0.2, 0.2, 0.15);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 5. Desenha a Perna Esquerda
    vertices = createRectangleVertices(-0.2, -0.8, 0.1, 0.4);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 6. Desenha a Perna Direita
    vertices = createRectangleVertices(0.1, -0.8, 0.1, 0.4);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// ====================================================================
// 4. INICIALIZAÇÃO
// ====================================================================
window.addEventListener('load', main3);