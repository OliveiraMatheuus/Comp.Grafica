



const vertexSource_Carro = `
    attribute vec4 a_position;
    uniform vec2 u_scale;
    uniform vec2 u_translation;
    void main() {
        
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






function createRectangleVertices(x, y, width, height) {
    const x2 = x + width;
    const y2 = y + height;
    return new Float32Array([ x, y, x2, y, x, y2, x, y2, x2, y, x2, y2 ]);
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
    const scaleLocation = gl.getUniformLocation(program, 'u_scale');
    const translationLocation = gl.getUniformLocation(program, 'u_translation');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    
    function drawObject(vertices, color, translation, scale) {
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.uniform4fv(colorLocation, color);
        gl.uniform2fv(translationLocation, translation);
        gl.uniform2fv(scaleLocation, scale);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }

    

    const corCorpo = [1.0, 0.2, 0.2, 1.0]; 
    const corVidro = [0.6, 0.8, 1.0, 1.0]; 
    const corRoda = [0.1, 0.1, 0.1, 1.0]; 

    
    const corpoVertices = createRectangleVertices(-0.7, -0.2, 1.4, 0.4);
    const cabineVertices = createRectangleVertices(-0.4, 0.2, 0.7, 0.3);
    const rodaVertices = createCircleVertices(gl, 0.15, 20); 

    
    drawObject(corpoVertices, corCorpo, [0.0, 0.0], [1.0, 1.0]);
    drawObject(cabineVertices, corVidro, [0.0, 0.0], [1.0, 1.0]);
    
    
    drawObject(rodaVertices, corRoda, [-0.4, -0.2], [1.0, 1.0]); 
    drawObject(rodaVertices, corRoda, [0.4, -0.2], [1.0, 1.0]);  
}




window.addEventListener('load', main4);