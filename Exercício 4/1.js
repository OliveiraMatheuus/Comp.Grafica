
// 1. SHADERS (Definidos como strings)
const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_viewingMatrix;
    uniform mat4 u_projectionMatrix;

    void main() {
        gl_Position = u_projectionMatrix * u_viewingMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

// 2. FUNÇÕES DE UTILIDADE (do seu código original)

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

// Funções de Geometria (do seu código original)
function setCubeVertices(side) {
    let v = side / 2;
    return new Float32Array([
        v, v, v, v, -v, v, -v, v, v, -v, v, v, v, -v, v, -v, -v, v,
        -v, v, v, -v, -v, v, -v, v, -v, -v, v, -v, -v, -v, v, -v, -v, -v,
        -v, v, -v, -v, -v, -v, v, v, -v, v, v, -v, -v, -v, -v, v, -v, -v,
        v, v, -v, v, -v, -v, v, v, v, v, v, v, v, -v, v, v, -v, -v,
        v, v, v, v, v, -v, -v, v, v, -v, v, v, v, v, -v, -v, v, -v,
        v, -v, v, v, -v, -v, -v, -v, v, -v, -v, v, v, -v, -v, -v, -v, -v,
    ]);
}

function setCubeColors() {
    let colors = [];
    let color = [];
    for (let i = 0; i < 6; i++) {
        color = [Math.random(), Math.random(), Math.random()];
        for (let j = 0; j < 6; j++)
            colors.push(...color);
    }
    return new Float32Array(colors);
}

function defineCoordinateAxes() {
    return new Float32Array([
        -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // X
        0.0, -1.0, 0.0, 0.0, 1.0, 0.0, // Y
        0.0, 0.0, -1.0, 0.0, 0.0, 1.0, // Z
    ]);
}

function defineCoordinateAxesColors() {
    return new Float32Array([
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // X (Vermelho)
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // Y (Verde)
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // Z (Azul)
    ]);
}

function degToRad(d) { return d * Math.PI / 180; }

// 3. FUNÇÃO PRINCIPAL
function main() {

    const canvas = document.getElementById('glCanvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext('webgl');
    if (!gl) { console.error('WebGL not supported'); return; }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Localizações
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const modelViewMatrixUniformLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
    const viewingMatrixUniformLocation = gl.getUniformLocation(program, 'u_viewingMatrix');
    const projectionMatrixUniformLocation = gl.getUniformLocation(program, 'u_projectionMatrix');

    // Buffers
    const VertexBuffer = gl.createBuffer();
    const ColorBuffer = gl.createBuffer();
    
    // Geometria
    const cubeVertices = setCubeVertices(0.5);
    const cubeColors = setCubeColors();
    const coordinateAxes = defineCoordinateAxes();
    const coordinateAxesColors = defineCoordinateAxesColors();

    // Configuração do GL
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Fundo branco

    let P0 = [0.0, 0.0, 5.0]; // Posição da câmera (Ponto de Visão)
    let Pref = [0.0, 0.0, 0.0]; // Ponto para onde olhamos
    let V = [0.0, 1.0, 0.0];  // Vetor "para cima"
    
    // Matrizes que serão usadas no loop
    let viewingMatrix;
    let projectionMatrix;

    // Event listener para as teclas
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            P0[0] -= 0.1; // Move a câmera para a esquerda (muda X)
        } else if (event.key === 'ArrowRight') {
            P0[0] += 0.1; // Move a câmera para a direita (muda X)
        }
    });

    let theta = 0.0; // Para rotação do cubo

    function drawCube() {
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

        // Usa as funções do m4.js
        let modelViewMatrix = m4.identity();
        modelViewMatrix = m4.yRotate(modelViewMatrix, degToRad(theta)); // m4.yRotate(m, rad)
        
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
        gl.uniformMatrix4fv(viewingMatrixUniformLocation, false, viewingMatrix);
        gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    function drawCoordinateAxes() {
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, coordinateAxes, gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, coordinateAxesColors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

        let modelViewMatrix = m4.identity(); // Eixos não giram

        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
        gl.uniformMatrix4fv(viewingMatrixUniformLocation, false, viewingMatrix);
        gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

        gl.drawArrays(gl.LINES, 0, 6);
    }

    // Loop de Animação
    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        theta += 0.5; // Gira o cubo lentamente

        // ATUALIZA AS MATRIZES DE VISÃO E PROJEÇÃO (COM m4.js)
        
        // 1. Atualiza a Matriz de Visão (Câmera)
        // Usa a função exata do seu m4.js
        viewingMatrix = m4.setViewingMatrix(P0, Pref, V);

        // 2. Define a Matriz de Projeção (Perspectiva)
        projectionMatrix = m4.setPerspectiveProjectionMatrix(-1.0, 1.0, -1.0, 1.0, 1.0, 100.0);
       // para projeção perspectiva que olha na direção -Z.

        // Desenha os objetos
        drawCube();
        drawCoordinateAxes();

        requestAnimationFrame(drawScene);
    }

    drawScene();
}

window.addEventListener('load', main);