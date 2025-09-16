



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
    uniform vec4 u_color; 
    void main() {
        gl_FragColor = u_color;
    }
`;





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





function main1() {
    const canvas = document.getElementById('glCanvas1'); 
    const gl = canvas.getContext('webgl');
    if (!gl) { return; }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const scaleLocation = gl.getUniformLocation(program, 'u_scale');
    const translationLocation = gl.getUniformLocation(program, 'u_translation');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const circleVertexData = createCircleVertices(gl, 0.5, 30);
    gl.bufferData(gl.ARRAY_BUFFER, circleVertexData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    function drawObject(scale, transX, transY, color) {
        gl.uniform2f(scaleLocation, scale, scale);
        gl.uniform2f(translationLocation, transX, transY);
        gl.uniform4fv(colorLocation, color); 
        const vertexCount = 30 * 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    

    const verde = [0.0, 1.0, 0.0, 1.0];
    const azul = [0.0, 0.0, 1.0, 1.0];
   
    drawObject(0.9, 0.0, 0.0, azul);  
    drawObject(0.4, 0.3, 0.0, verde); 
    drawObject(0.4, -0.3, 0.0, verde); 
    drawObject(0.4, 0.0, 0.6, verde);  
    drawObject(0.4, 0.0, -0.6, verde); 
}





window.addEventListener('load', main1);