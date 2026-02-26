import React, { useRef, useEffect, useMemo } from "react";

const WireframeAtom = ({ size = 400, color = "#DFFF00", speed = 1 }) => {
  const canvasRef = useRef(null);

  // Geometry Generation
  const createSphere = (radius, segments = 12) => {
    const vertices = [];
    const lines = [];

    for (let i = 0; i <= segments; i++) {
      const lat = (i * Math.PI) / segments - Math.PI / 2;
      const y = radius * Math.sin(lat);
      const ringRadius = radius * Math.cos(lat);

      for (let j = 0; j < segments; j++) {
        const lon = (j * 2 * Math.PI) / segments;
        const x = ringRadius * Math.cos(lon);
        const z = ringRadius * Math.sin(lon);
        vertices.push({ x, y, z });

        // Connect horizontal
        const nextLon = (j + 1) % segments;
        lines.push([i * segments + j, i * segments + nextLon]);

        // Connect vertical
        if (i < segments) {
          lines.push([i * segments + j, (i + 1) * segments + j]);
        }
      }
    }
    return { vertices, lines };
  };

  const nucleus = useMemo(() => createSphere(45, 12), []);
  const electronMesh = useMemo(() => createSphere(10, 8), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let rotation = 0;

    const rotate = (v, rotateX, rotateY, rotateZ) => {
      // Rotate X
      let y1 = v.y * Math.cos(rotateX) - v.z * Math.sin(rotateX);
      let z1 = v.y * Math.sin(rotateX) + v.z * Math.cos(rotateX);
      // Rotate Y
      let x2 = v.x * Math.cos(rotateY) + z1 * Math.sin(rotateY);
      let z2 = -v.x * Math.sin(rotateY) + z1 * Math.cos(rotateY);
      // Rotate Z
      let x3 = x2 * Math.cos(rotateZ) - y1 * Math.sin(rotateZ);
      let y3 = x2 * Math.sin(rotateZ) + y1 * Math.cos(rotateZ);
      return { x: x3, y: y3, z: z2 };
    };

    const project = (v, offsetZ = 400) => {
      const perspective = 800 / (800 + v.z + offsetZ);
      return {
        x: v.x * perspective + canvas.width / 2,
        y: v.y * perspective + canvas.height / 2,
      };
    };

    const orbits = [
      { rx: 0.6, ry: 1.1, rz: 0.3, radius: 140 },
      { rx: 1.2, ry: 0.5, rz: -0.6, radius: 170 },
      { rx: -0.4, ry: 0.8, rz: 1.0, radius: 150 },
    ];

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.008 * speed;

      // Draw Nucleus
      ctx.beginPath();
      nucleus.lines.forEach(([i, j]) => {
        const v1 = rotate(nucleus.vertices[i], rotation, rotation * 0.5, 0);
        const v2 = rotate(nucleus.vertices[j], rotation, rotation * 0.5, 0);
        const p1 = project(v1);
        const p2 = project(v2);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      });
      ctx.strokeStyle = `${color}44`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Draw Orbits and Electrons
      orbits.forEach((orbit, i) => {
        const orbitRotZ = rotation * 0.15 + orbit.rz;

        // 1. Draw Orbit Ring (Solid-feeling path)
        ctx.beginPath();
        const segments = 120; // Smoother ring
        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          const ox = Math.cos(angle) * orbit.radius;
          const oy = Math.sin(angle) * orbit.radius;
          const v = rotate(
            { x: ox, y: oy, z: 0 },
            orbit.rx,
            orbit.ry,
            orbitRotZ,
          );
          const p = project(v);
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `${color}33`; // Brighter more solid-looking path
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2. Draw Electron Mesh (Solid and high contrast)
        const eAngle = rotation * 1.2 + (i * Math.PI * 2) / orbits.length;
        const exFlat = Math.cos(eAngle) * orbit.radius;
        const eyFlat = Math.sin(eAngle) * orbit.radius;

        ctx.beginPath();
        electronMesh.lines.forEach(([idx1, idx2]) => {
          // Local spin
          const lv1 = rotate(
            electronMesh.vertices[idx1],
            rotation * 2,
            rotation * 3,
            0,
          );
          const lv2 = rotate(
            electronMesh.vertices[idx2],
            rotation * 2,
            rotation * 3,
            0,
          );

          // Add to flat orbit position
          const ev1 = { x: lv1.x + exFlat, y: lv1.y + eyFlat, z: lv1.z };
          const ev2 = { x: lv2.x + exFlat, y: lv2.y + eyFlat, z: lv2.z };

          // Final global orbital tilt/rotation
          const gv1 = rotate(ev1, orbit.rx, orbit.ry, orbitRotZ);
          const gv2 = rotate(ev2, orbit.rx, orbit.ry, orbitRotZ);

          const p1 = project(gv1);
          const p2 = project(gv2);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        });
        ctx.strokeStyle = `${color}FF`; // Full opacity for electrons
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Glow around electron point
        const eCenterV = rotate(
          { x: exFlat, y: eyFlat, z: 0 },
          orbit.rx,
          orbit.ry,
          orbitRotZ,
        );
        const eCenterP = project(eCenterV);
        ctx.beginPath();
        ctx.arc(eCenterP.x, eCenterP.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = size;
      canvas.height = size;
    };
    resize();

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [size, color, speed, nucleus, electronMesh]);

  return (
    <div
      className="relative flex items-center justify-center bg-black/5 rounded-full p-4"
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default WireframeAtom;
