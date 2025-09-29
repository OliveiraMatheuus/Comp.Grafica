const vertexSource_Robo = `
    attribute vec4 a_position;
    uniform mat3 u_transform; 
    void main() {
        vec3 transformed_position = u_transform * vec3(a_position.xy, 1.0);
        gl_Position = vec4(transformed_position.xy, 0.0, 1.0);
    }
`;

const fragmentSource_Robo = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

function createRectangleVertices(width, height) {
    const x1 = -width / 2;
    const y1 = -height / 2;
    const x2 = width / 2;
    const y2 = height / 2;
    return new Float32Array([
        x1, y1,   x2, y1,   x1, y2,
        x1, y2,   x2, y1,   x2, y2
    ]);
}

function main3() { 
    const canvas = document.getElementById('glCanvas3'); 
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource_Robo);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource_Robo);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const transformLocation = gl.getUniformLocation(program, 'u_transform');

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const corCorpo = [0.4, 0.4, 0.9, 1.0]; 
    const corMembros = [0.3, 0.8, 0.3, 1.0]; 
    const corCabeca = [0.8, 0.3, 0.3, 1.0]; 
    
    const corpoVertices = createRectangleVertices(0.5, 0.6);
    const cabecaVertices = createRectangleVertices(0.3, 0.3);
    const bracoVertices = createRectangleVertices(0.2, 0.15); 
    const pernaVertices = createRectangleVertices(0.1, 0.4);

    let time = 0;

    
    function animate() {
        
        time += 0.03;
        const swingAngle = 0.4 * Math.sin(time);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.2, 0.2, 0.2, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);

        function drawPart(vertices, color, translation, rotation = 0) {
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.uniform4fv(colorLocation, color);

            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            const tx = translation[0];
            const ty = translation[1];

            const transformMatrix = [
                cos, -sin, 0,
                sin,  cos, 0,
                tx,   ty,  1
            ];
            
            gl.uniformMatrix3fv(transformLocation, false, transformMatrix);
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
        }

       
        drawPart(corpoVertices, corCorpo, [0, -0.1]);
        drawPart(cabecaVertices, corCabeca, [0, 0.35]);
        drawPart(bracoVertices, corMembros, [-0.35, 0.05], swingAngle);
        drawPart(bracoVertices, corMembros, [0.35, 0.05], -swingAngle);
        drawPart(pernaVertices, corMembros, [-0.15, -0.6]);
        drawPart(pernaVertices, corMembros, [0.15, -0.6]);

        
        requestAnimationFrame(animate);
    }

    
    animate();
}

window.addEventListener('load', main3);