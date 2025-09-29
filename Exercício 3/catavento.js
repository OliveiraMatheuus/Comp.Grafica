const fragmentSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

const vertexSource = `
    attribute vec4 a_position;
    uniform mat3 u_transform; 
    void main() {
        vec3 transformed_position = u_transform * vec3(a_position.xy, 1.0);
        gl_Position = vec4(transformed_position.xy, a_position.zw);
    }
`;


function createCenterSquareVertices() { return new Float32Array([-0.3,-0.3, 0.3,-0.3, 0.3,0.3, -0.3,-0.3, 0.3,0.3, -0.3,0.3]); }
function createTopBladeVertices() { return new Float32Array([-0.2, 0.2, 0.2, 0.2, 0.0, 0.8]); }
function createRightBladeVertices() { return new Float32Array([0.2, 0.2, 0.2, -0.2, 0.8, 0.0]); }
function createBottomBladeVertices() { return new Float32Array([0.2, -0.2, -0.2, -0.2, 0.0, -0.8]); }
function createLeftBladeVertices() { return new Float32Array([-0.2, -0.2, -0.2, 0.2, -0.8, 0.0]); }


function main2() {

    const canvas = document.getElementById('glCanvas2');
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const transformLocation = gl.getUniformLocation(program, 'u_transform');

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    let currentAngle = 0;

    function animate() {

        currentAngle += 0.015;
        if (currentAngle > 2 * Math.PI) {
            currentAngle -= 2 * Math.PI;
        }
        const cos = Math.cos(currentAngle);
        const sin = Math.sin(currentAngle);
        
        const rotationMatrix = [
            cos, -sin, 0,
            sin, cos,  0,
            0,   0,    1
        ];
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.9, 0.9, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix3fv(transformLocation, false, rotationMatrix);

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
        
        const identityMatrix = [1,0,0, 0,1,0, 0,0,1]; 
        gl.uniformMatrix3fv(transformLocation, false, identityMatrix);
        const mioloCor = [0.3, 0.3, 0.3, 1.0];
        gl.bufferData(gl.ARRAY_BUFFER, createCenterSquareVertices(), gl.STATIC_DRAW);
        gl.uniform4fv(colorLocation, mioloCor);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    
        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener('load', main2);