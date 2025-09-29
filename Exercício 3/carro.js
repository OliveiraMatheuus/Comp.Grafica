const vertexSource_Carro = `
    attribute vec4 a_position;
    uniform mat3 u_transform;
    void main() {
        vec3 transformed_position = u_transform * vec3(a_position.xy, 1.0);
        gl_Position = vec4(transformed_position.xy, 0.0, 1.0);
    }
`;

const fragmentSource_Carro = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

function createRectangleVertices(width, height) {
    const x1 = -width / 2, y1 = -height / 2;
    const x2 = width / 2,  y2 = height / 2;
    return new Float32Array([ x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2 ]);
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

function main4() { 
    const canvas = document.getElementById('glCanvas4');
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource_Carro);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource_Carro);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const transformLocation = gl.getUniformLocation(program, 'u_transform');

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    const corCorpo = [1.0, 0.2, 0.2, 1.0]; 
    const corVidro = [0.6, 0.8, 1.0, 1.0]; 
    const corRoda = [0.1, 0.1, 0.1, 1.0]; 
    const corpoVertices = createRectangleVertices(1.4, 0.4);
    const cabineVertices = createRectangleVertices(0.7, 0.3);
    const rodaVertices = createCircleVertices(gl, 0.15, 20); 

    let carPositionX = -1.5;
    let wheelAngle = 0;

    function drawObject(vertices, color, transformMatrix) {
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.uniform4fv(colorLocation, color);
        gl.uniformMatrix3fv(transformLocation, false, transformMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }

    function createTransformMatrix(translation, rotation = 0) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const tx = translation[0];
        const ty = translation[1];
        return [ cos, -sin, 0, sin, cos, 0, tx, ty, 1 ];
    }

    function animate() {
    
        carPositionX += 0.005;
        if (carPositionX > 1.5) {
            carPositionX = -1.5;
        }
    
        wheelAngle -= 0.05; 

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.8, 0.8, 0.8, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);

        
        const corpoMatrix = createTransformMatrix([carPositionX, 0.0]);
        const cabineMatrix = createTransformMatrix([carPositionX, 0.35]);
        const rodaTraseiraMatrix = createTransformMatrix([carPositionX - 0.4, -0.2], wheelAngle);
        const rodaDianteiraMatrix = createTransformMatrix([carPositionX + 0.4, -0.2], wheelAngle);
      
        drawObject(corpoVertices, corCorpo, corpoMatrix);
        drawObject(cabineVertices, corVidro, cabineMatrix);
        drawObject(rodaVertices, corRoda, rodaTraseiraMatrix);
        drawObject(rodaVertices, corRoda, rodaDianteiraMatrix);
    
        requestAnimationFrame(animate);
    }
    
    animate();
}

window.addEventListener('load', main4);