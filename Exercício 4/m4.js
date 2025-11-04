var m4 = {
    // Matriz identidade 4x4
    identity: function () {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    // Transposição de matriz 4x4
    transpose: function (m) {
        return [
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15],
        ];
    },

    // Multiplicação de duas matrizes 4x4
    multiply: function (a, b) {
        var a00 = a[0], a01 = a[4], a02 = a[8], a03 = a[12];
        var a10 = a[1], a11 = a[5], a12 = a[9], a13 = a[13];
        var a20 = a[2], a21 = a[6], a22 = a[10], a23 = a[14];
        var a30 = a[3], a31 = a[7], a32 = a[11], a33 = a[15];

        var b00 = b[0], b01 = b[4], b02 = b[8], b03 = b[12];
        var b10 = b[1], b11 = b[5], b12 = b[9], b13 = b[13];
        var b20 = b[2], b21 = b[6], b22 = b[10], b23 = b[14];
        var b30 = b[3], b31 = b[7], b32 = b[11], b33 = b[15];

        return [
            a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,

            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,

            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,

            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33,
        ];
    },

    // Matriz de translação
    translation: function (tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    },

    // Matrizes de rotação
    xRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },

    yRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },

    zRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    // Matriz de escala
    scaling: function (sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ];
    },

    // Funções de transformação combinadas
    translate: function (m, tx, ty, tz) {
        return m4.multiply(m4.translation(tx, ty, tz), m);
    },

    xRotate: function (m, angleInRadians) {
        return m4.multiply(m4.xRotation(angleInRadians), m);
    },

    yRotate: function (m, angleInRadians) {
        return m4.multiply(m4.yRotation(angleInRadians), m);
    },

    zRotate: function (m, angleInRadians) {
        return m4.multiply(m4.zRotation(angleInRadians), m);
    },

    scale: function (m, sx, sy, sz) {
        return m4.multiply(m4.scaling(sx, sy, sz), m);
    },

    // Vetor unitário
    unitVector: function (v) {
        let vModulus = this.vectorModulus(v);
        if (vModulus < 0.00001) return [0, 0, 0];
        return v.map(function (x) { return x / vModulus; });
    },

    vectorModulus: function (v) {
        return Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    },

    crossProduct: function (v1, v2) {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    },

    // Matriz de visualização (View Matrix)
    setViewingMatrix: function (P0, Pref, V) {
        let N = [P0[0] - Pref[0], P0[1] - Pref[1], P0[2] - Pref[2]];
        let n = this.unitVector(N);
        let u = this.unitVector(this.crossProduct(V, n));
        let v = this.crossProduct(n, u);

        let translationMatrix = this.translation(-P0[0], -P0[1], -P0[2]);
        let rotationMatrix = [
            u[0], v[0], n[0], 0,
            u[1], v[1], n[1], 0,
            u[2], v[2], n[2], 0,
            0, 0, 0, 1
        ];

        return m4.multiply(rotationMatrix, translationMatrix);
    },

    // Matriz de projeção ortográfica
    setOrthographicProjectionMatrix: function (xw_min, xw_max, yw_min, yw_max, z_near, z_far) {
        return [
            2 / (xw_max - xw_min), 0, 0, 0,
            0, 2 / (yw_max - yw_min), 0, 0,
            0, 0, -2 / (z_near - z_far), 0,
            -(xw_max + xw_min) / (xw_max - xw_min),
            -(yw_max + yw_min) / (yw_max - yw_min),
            (z_near + z_far) / (z_near - z_far),
            1
        ];
    },

    // Matriz de projeção perspectiva
    setPerspectiveProjectionMatrix: function (xw_min, xw_max, yw_min, yw_max, z_near, z_far) {
        return [
            (2 * z_near) / (xw_max - xw_min), 0, 0, 0,
            0, (2 * z_near) / (yw_max - yw_min), 0, 0,
            (xw_max + xw_min) / (xw_max - xw_min),
            (yw_max + yw_min) / (yw_max - yw_min),
            -(z_far + z_near) / (z_far - z_near), -1,
            0, 0, (-2 * z_near * z_far) / (z_far - z_near), 0
        ];
    }

};
