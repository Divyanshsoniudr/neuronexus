import React, { useRef, useEffect } from "react";

const NeuralFabric = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    // Fragment shader (Flowing Neural Fabric)
    const fsSource = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float time = uTime * 0.2;
        
        // Flowing wave logic - Mouse Interaction Removed
        float wave1 = sin(uv.x * 3.0 + time) * 0.5 + 0.5;
        float wave2 = sin(uv.y * 2.0 - time * 0.7) * 0.5 + 0.5;
        float wave3 = sin((uv.x + uv.y) * 1.5 + time * 1.3) * 0.5 + 0.5;

        // Neural Color Palette (Deep Blues, Purples, Neutrals)
        vec3 color1 = vec3(0.02, 0.03, 0.1); // Deep Navy
        vec3 color2 = vec3(0.1, 0.05, 0.2); // Dark Purple
        vec3 color3 = vec3(0.05, 0.1, 0.15); // Steel Teal
        
        vec3 finalColor = mix(color1, color2, wave1);
        finalColor = mix(finalColor, color3, wave2 * wave3);
        
        // Soft gradient transitions
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttr = gl.getAttribLocation(program, "aVertexPosition");
    const timeUniform = gl.getUniformLocation(program, "uTime");
    const resolutionUniform = gl.getUniformLocation(program, "uResolution");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = (time) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttr);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeUniform, time * 0.001);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-60"
    />
  );
};

export default NeuralFabric;
