



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






function createRectangleVertices(x, y, width, height) {
    const x2 = x + width;
    const y2 = y + height;
    return new Float32Array([
        x, y,    
        x2, y,
        x, y2,
        x, y2,   
        x2, y,
        x2, y2
    ]);
}






function main3() { 
    const canvas = document.getElementById('glCanvas3'); 
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource_Robo);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource_Robo);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    

    
    const corCorpo = [0.4, 0.4, 0.9, 1.0]; 
    const corMembros = [0.3, 0.8, 0.3, 1.0]; 
    const corCabeca = [0.8, 0.3, 0.3, 1.0]; 

    
    let vertices = createRectangleVertices(-0.25, -0.4, 0.5, 0.6);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corCorpo);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    
    vertices = createRectangleVertices(-0.15, 0.2, 0.3, 0.3);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corCabeca);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    
    vertices = createRectangleVertices(-0.45, -0.2, 0.2, 0.15);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    
    vertices = createRectangleVertices(0.25, -0.2, 0.2, 0.15);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    
    vertices = createRectangleVertices(-0.2, -0.8, 0.1, 0.4);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    
    vertices = createRectangleVertices(0.1, -0.8, 0.1, 0.4);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, corMembros);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}




window.addEventListener('load', main3);