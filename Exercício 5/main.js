"use strict";

function main() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL não está disponível!");
    return;
  }

  const vsSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_matrix * a_position;
      v_color = a_color;
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

  function createAndFillBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  function createAndFillIndexBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  const cubePositionBuffer = createAndFillBuffer(gl, [
    -0.5, -0.5, 0.5,
     0.5, -0.5, 0.5,
     0.5,  0.5, 0.5,
    -0.5,  0.5, 0.5,
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
  ]);
  
  const faceColors = [
    [1, 0, 0, 1], 
    [0, 1, 0, 1], 
    [0, 0, 1, 1], 
    [1, 1, 0, 1], 
    [1, 0, 1, 1], 
    [0, 1, 1, 1], 
  ];
  let cubeColors = [];
  faceColors.forEach(color => {
    for (let i = 0; i < 4; i++) {
      cubeColors = cubeColors.concat(color);
    }
  });
  const cubeColorBuffer = createAndFillBuffer(gl, cubeColors);

  const cubeIndexBuffer = createAndFillIndexBuffer(gl, [
    0, 1, 2,    0, 2, 3,    
    4, 5, 6,    4, 6, 7,    
    8, 9, 10,   8, 10, 11,  
    12, 13, 14, 12, 14, 15, 
    16, 17, 18, 16, 18, 19, 
    20, 21, 22, 20, 22, 23, 
  ]);

  const planeSize = 10;
  const planePositionBuffer = createAndFillBuffer(gl, [
    -planeSize, 0, -planeSize,
     planeSize, 0, -planeSize,
     planeSize, 0,  planeSize,
    -planeSize, 0, -planeSize,
     planeSize, 0,  planeSize,
    -planeSize, 0,  planeSize,
  ]);
  const planeColorBuffer = createAndFillBuffer(gl, [
    0.5, 0.5, 0.5, 1,
    0.5, 0.5, 0.5, 1,
    0.5, 0.5, 0.5, 1,
    0.5, 0.5, 0.5, 1,
    0.5, 0.5, 0.5, 1,
    0.5, 0.5, 0.5, 1,
  ]);

  const axisLength = 5.0;
  const axisPositionBuffer = createAndFillBuffer(gl, [
    0, 0, 0,  axisLength, 0, 0, 
    0, 0, 0,  0, axisLength, 0, 
    0, 0, 0,  0, 0, axisLength, 
  ]);
  const axisColorBuffer = createAndFillBuffer(gl, [
    1, 0, 0, 1,  1, 0, 0, 1, 
    0, 1, 0, 1,  0, 1, 0, 1, 
    0, 0, 1, 1,  0, 0, 1, 1, 
  ]);

  const keysPressed = {};
  document.addEventListener('keydown', (e) => {
    keysPressed[e.key.toLowerCase()] = true;
  });
  document.addEventListener('keyup', (e) => {
    keysPressed[e.key.toLowerCase()] = false;
  });

  // ===== CÂMERA ALTERADA AQUI =====
  let cameraPosition = [0, 1, 5]; 
  
  // ===== ROTAÇÃO ALTERADA AQUI =====
  let cameraRotationY = 0; 

  const moveSpeed = 0.1;
  const rotationSpeed = 0.03;
  
  let fieldOfViewRadians = degToRad(60); 
  let zNear = 0.1; 
  let zFar = 200.0;
  
  let then = 0; 

  requestAnimationFrame(drawScene);

  function drawScene(now) {
    now *= 0.001;  
    const deltaTime = now - then;
    then = now;

    updateCamera();
    
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.1, 0.1, 0.1, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix = m4.perspective(
      fieldOfViewRadians, 
      aspect, 
      zNear, 
      zFar
    );
    
    let cameraMatrix = m4.translation(
      cameraPosition[0], 
      cameraPosition[1], 
      cameraPosition[2]
    );
    cameraMatrix = m4.yRotate(cameraMatrix, cameraRotationY);
    
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    
    let worldMatrix = m4.scaling(1, 1, 1);
    let mvpMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    drawObject(cubePositionBuffer, cubeColorBuffer, mvpMatrix, gl.TRIANGLES, 36, cubeIndexBuffer);

    worldMatrix = m4.scaling(1, 1, 1);
    mvpMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    drawObject(planePositionBuffer, planeColorBuffer, mvpMatrix, gl.TRIANGLES, 6);

    worldMatrix = m4.scaling(1, 1, 1); 
    mvpMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    drawObject(axisPositionBuffer, axisColorBuffer, mvpMatrix, gl.LINES, 6);
    
    requestAnimationFrame(drawScene);
  }

  function drawObject(positionBuffer, colorBuffer, mvpMatrix, drawMode, vertexCount, indexBuffer = null) {
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        positionAttributeLocation, 
        3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(
        colorAttributeLocation,
        4, gl.FLOAT, false, 0, 0);
    
    gl.uniformMatrix4fv(
        matrixUniformLocation, 
        false, 
        mvpMatrix
    );

    if (indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(drawMode, vertexCount, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(drawMode, 0, vertexCount);
    }
  }

  function updateCamera() {
    let cameraMatrix = m4.yRotation(cameraRotationY);
    
    const forwardVector = [cameraMatrix[8], cameraMatrix[9], cameraMatrix[10]];
    const rightVector = [cameraMatrix[0], cameraMatrix[1], cameraMatrix[2]];
    
    if (keysPressed['w']) {
      cameraPosition[0] -= forwardVector[0] * moveSpeed;
      cameraPosition[1] -= forwardVector[1] * moveSpeed;
      cameraPosition[2] -= forwardVector[2] * moveSpeed;
    }
    if (keysPressed['s']) {
      cameraPosition[0] += forwardVector[0] * moveSpeed;
      cameraPosition[1] += forwardVector[1] * moveSpeed;
      cameraPosition[2] += forwardVector[2] * moveSpeed;
    }

    if (keysPressed['a']) {
      cameraPosition[0] -= rightVector[0] * moveSpeed;
      cameraPosition[1] -= rightVector[1] * moveSpeed;
      cameraPosition[2] -= rightVector[2] * moveSpeed;
    }
    if (keysPressed['d']) {
      cameraPosition[0] += rightVector[0] * moveSpeed;
      cameraPosition[1] += rightVector[1] * moveSpeed;
      cameraPosition[2] += rightVector[2] * moveSpeed;
    }
    
    if (keysPressed['e']) {
      cameraPosition[1] += moveSpeed;
    }
    if (keysPressed['q']) {
      cameraPosition[1] -= moveSpeed;
    }

    if (keysPressed['arrowleft']) {
      cameraRotationY += rotationSpeed;
    }
    if (keysPressed['arrowright']) {
      cameraRotationY -= rotationSpeed;
    }
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }
  
  function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
      return true;
    }
    return false;
  }
}

main();