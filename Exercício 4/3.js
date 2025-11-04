// 1. SHADERS (Idêntico ao Exemplo 1)
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

// 2. FUNÇÕES DE UTILIDADE (Idêntico ao Exemplo 1)
function createShader(gl, type, source) {  const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { console.error('Error compiling shader:', gl.getShaderInfoLog(shader)); gl.deleteShader(shader); return null; } return shader; }
function createProgram(gl, vertexShader, fragmentShader) { const program = gl.createProgram(); gl.attachShader(program, vertexShader); gl.attachShader(program, fragmentShader); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error('Error linking program:', gl.getProgramInfoLog(program)); gl.deleteProgram(program); return null; } return program; }
function setCubeVertices(side) { let v = side / 2; return new Float32Array([v, v, v, v, -v, v, -v, v, v, -v, v, v, v, -v, v, -v, -v, v, -v, v, v, -v, -v, v, -v, v, -v, -v, v, -v, -v, -v, v, -v, -v, -v, -v, v, -v, -v, -v, -v, v, v, -v, v, v, -v, -v, -v, -v, v, -v, -v, v, v, -v, v, -v, -v, v, v, v, v, v, v, v, -v, v, v, -v, -v, v, v, v, v, -v, -v, v, v, -v, v, v, v, v, -v, -v, v, -v, v, -v, v, v, -v, -v, -v, -v, v, -v, -v, v, v, -v, -v, -v, -v, -v,]); }
function setCubeColors() { let colors = []; let color = []; for (let i = 0; i < 6; i++) { color = [Math.random(), Math.random(), Math.random()]; for (let j = 0; j < 6; j++) colors.push(...color); } return new Float32Array(colors); }
function defineCoordinateAxes() {  return new Float32Array([-1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0,]); }
function defineCoordinateAxesColors() {  return new Float32Array([1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,]); }
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

    // GL
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    let P0 = [0.0, 0.0, -5.0];    // posição fixa da câmera
    let Pref = [0.0, 0.0, 0.0];    // para onde a câmera olha — será atualizado pelo mouse
    let V = [0.0, 1.0, 0.0];       // up vector

    let viewingMatrix = m4.identity();
    let projectionMatrix = m4.setPerspectiveProjectionMatrix(-1.0, 1.0, -1.0, 1.0, 0.1, 100.0);

    // Faz referência ao canvas para coordenadas corretas
    const rect = () => canvas.getBoundingClientRect();

    // Evita Pref == P0 (que quebraria normalização)
    function safeSetPref(x, y, z) {
        // pequeno deslocamento caso coincidam
        if (Math.abs(x - P0[0]) < 1e-4 && Math.abs(y - P0[1]) < 1e-4 && Math.abs(z - P0[2]) < 1e-4) {
            z += 1e-3;
        }
        Pref[0] = x; Pref[1] = y; Pref[2] = z;
    }

    // Listener do mouse — atualiza para onde a câmera olha (Pref)
    canvas.addEventListener('mousemove', (event) => {
        const r = rect();
        // coordenadas do mouse em -1 .. +1 no espaço do canvas
        let mouseX = ((event.clientX - r.left) / r.width) * 2 - 1;
        let mouseY = -((event.clientY - r.top) / r.height) * 2 + 1;

        // ajuste da amplitude (quanto a "cabeça" pode virar)
        const amp = 2.0;
        // Mantemos Pref em z = 0 (olhar para planos ao redor do objeto)
        safeSetPref(mouseX * amp, mouseY * amp, 0.0);
    });

    let theta = 0.0;

    function drawCube() {
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

        let modelViewMatrix = m4.identity();
        modelViewMatrix = m4.yRotate(modelViewMatrix, degToRad(theta));

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

        let modelViewMatrix = m4.identity();
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
        gl.uniformMatrix4fv(viewingMatrixUniformLocation, false, viewingMatrix);
        gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

        gl.drawArrays(gl.LINES, 0, 6);
    }

    // Loop
    function drawScene(now) {
        now *= 0.001;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        theta += 0.5;

        // Atualiza matriz de visão (P0 fixo, Pref atualizado pelo mouse)
        viewingMatrix = m4.setViewingMatrix(P0, Pref, V);

        // Projeção já definida, mas podemos recomputar caso o canvas mude de tamanho:
        projectionMatrix = m4.setPerspectiveProjectionMatrix(-1.0, 1.0, -1.0, 1.0, 0.1, 100.0);

        drawCube();
        drawCoordinateAxes();

        requestAnimationFrame(drawScene);
    }

    requestAnimationFrame(drawScene);
}
window.addEventListener('load', main);

