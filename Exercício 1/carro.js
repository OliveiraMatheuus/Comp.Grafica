// ====================================================================
// 1. CÓDIGO DOS SHADERS (GLSL) - Usaremos o shader com translação/escala
// ====================================================================

const vertexSource_Carro = `
    attribute vec4 a_position;
    uniform vec2 u_scale;
    uniform vec2 u_translation;
    void main() {
        // Aplica escala e depois translação
        vec4 scaled_position = vec4(a_position.xy * u_scale, a_position.zw);
        gl_Position = scaled_position + vec4(u_translation, 0.0, 0.0);
    }
`;

const fragmentSource_Carro = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

// ====================================================================
// 2. FUNÇÕES DE GEOMETRIA
// ====================================================================

// Função para criar retângulos (igual à do robô)
function createRectangleVertices(x, y, width, height) {
    const x2 = x + width;
    const y2 = y + height;
    return new Float32Array([ x, y, x2, y, x, y2, x, y2, x2, y, x2, y2 ]);
}

// Função para criar círculos (igual à da flor)
function createCircleVertices(gl, radius, segments) {
    const vertices = [];
    const angleIncrement = (2.0 * Math.PI) / segments;
    // O aspect ratio corrige a distorção para o canvas não ser um quadrado perfeito
    const aspectRatio = gl.canvas.width / gl.canvas.height;

    for (let i = 0; i < segments; i++) {
        const angle1 = i * angleIncrement;
        const x1 = (radius * Math.cos(angle1)) / aspectRatio;
        const y1 = radius * Math.sin(angle1);
        const angle2 = (i + 1) * angleIncrement;
        const x2 = (radius * Math.cos(angle2)) / aspectRatio;
        const y2 = radius * Math.sin(angle2);
        // Cria um triângulo do centro para a borda
        vertices.push(0.0, 0.0, x1, y1, x2, y2);
    }
    return new Float32Array(vertices);
}


// ====================================================================
// 3. FUNÇÃO PRINCIPAL DE DESENHO DO CARRO
// ====================================================================

function main4() { // Usando main4 para o quarto canvas
    const canvas = document.getElementById('glCanvas4');
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    // Compila shaders e cria o programa
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource_Carro);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource_Carro);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Pega a localização dos atributos e uniforms
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const scaleLocation = gl.getUniformLocation(program, 'u_scale');
    const translationLocation = gl.getUniformLocation(program, 'u_translation');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    // Configura o buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Prepara a tela
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0); // Fundo cinza claro (asfalto)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // --- Função auxiliar para desenhar objetos ---
    // Isso ajuda a não repetir código
    function drawObject(vertices, color, translation, scale) {
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.uniform4fv(colorLocation, color);
        gl.uniform2fv(translationLocation, translation);
        gl.uniform2fv(scaleLocation, scale);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }

    // --- MONTANDO O CARRO ---

    const corCorpo = [1.0, 0.2, 0.2, 1.0]; // Vermelho
    const corVidro = [0.6, 0.8, 1.0, 1.0]; // Azul claro
    const corRoda = [0.1, 0.1, 0.1, 1.0]; // Preto

    // Geometrias
    const corpoVertices = createRectangleVertices(-0.7, -0.2, 1.4, 0.4);
    const cabineVertices = createRectangleVertices(-0.4, 0.2, 0.7, 0.3);
    const rodaVertices = createCircleVertices(gl, 0.15, 20); // 20 segmentos é suficiente

    // Desenha as partes do carro
    drawObject(corpoVertices, corCorpo, [0.0, 0.0], [1.0, 1.0]);
    drawObject(cabineVertices, corVidro, [0.0, 0.0], [1.0, 1.0]);
    
    // Desenha as duas rodas usando a MESMA geometria, apenas mudando a translação!
    drawObject(rodaVertices, corRoda, [-0.4, -0.2], [1.0, 1.0]); // Roda traseira
    drawObject(rodaVertices, corRoda, [0.4, -0.2], [1.0, 1.0]);  // Roda dianteira
}

// ====================================================================
// 4. INICIALIZAÇÃO
// ====================================================================
window.addEventListener('load', main4);