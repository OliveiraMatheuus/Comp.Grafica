// ====================================================================
// 1. CÓDIGO DOS SHADERS (GLSL)
// ====================================================================

const vertexShaderSource = `
    attribute vec4 a_position;
    uniform vec2 u_scale;
    uniform vec2 u_translation;
    void main() {
        vec4 scaled_position = vec4(a_position.xy * u_scale, a_position.zw);
        gl_Position = scaled_position + vec4(u_translation, 0.0, 0.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color; // A cor vem de um uniform agora
    void main() {
        gl_FragColor = u_color;
    }
`;

// ====================================================================
// 2. FUNÇÕES AUXILIARES
// ====================================================================

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function createCircleVertices(gl, radius, segments) {
    const vertices = [];
    const angleIncrement = (2.0 * Math.PI) / segments;
    const aspectRatio = gl.canvas.width / gl.canvas.height;

    for (let i = 0; i < segments; i++) {
        const angle1 = i * angleIncrement;
        const x1 = (radius * Math.cos(angle1)) / aspectRatio;
        const y1 = radius * Math.sin(angle1);
        const angle2 = (i + 1) * angleIncrement;
        const x2 = (radius * Math.cos(angle2)) / aspectRatio;
        const y2 = radius * Math.sin(angle2);
        vertices.push(0.0, 0.0, x1, y1, x2, y2);
    }
    return new Float32Array(vertices);
}

// ====================================================================
// 3. FUNÇÃO PRINCIPAL (MAIN)
// ====================================================================

function main1() {
    const canvas = document.getElementById('glCanvas1'); // corrigido
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Pega a localização dos atributos e uniforms
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const scaleLocation = gl.getUniformLocation(program, 'u_scale');
    const translationLocation = gl.getUniformLocation(program, 'u_translation');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    // Configura o buffer de VÉRTICES (apenas posições)
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const circleVertexData = createCircleVertices(gl, 0.5, 30);
    gl.bufferData(gl.ARRAY_BUFFER, circleVertexData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Limpa a tela
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // --- FUNÇÃO DE DESENHO ---
    function drawObject(scale, transX, transY, color) {
        gl.uniform2f(scaleLocation, scale, scale);
        gl.uniform2f(translationLocation, transX, transY);
        gl.uniform4fv(colorLocation, color); // Envia a cor como uniform
        const vertexCount = 30 * 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    // --- CHAMADAS DE DESENHO ---

    const verde = [0.0, 1.0, 0.0, 1.0];
    const azul = [0.0, 0.0, 1.0, 1.0];
   
    drawObject(0.9, 0.0, 0.0, azul);  // Círculo grande
    drawObject(0.4, 0.3, 0.0, verde); // Círculo pequeno à direita
    drawObject(0.4, -0.3, 0.0, verde); // Círculo pequeno à esquerda
    drawObject(0.4, 0.0, 0.6, verde);  // Círculo pequeno em cima
    drawObject(0.4, 0.0, -0.6, verde); // Círculo pequeno embaixo
}

// ====================================================================
// 4. INICIALIZAÇÃO
// ====================================================================

window.addEventListener('load', main1);