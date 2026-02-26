import React, { useRef, useEffect } from "react";

const NeuralAtoms = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Adjust canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle settings
    const particleCount = window.innerWidth < 768 ? 30 : 60; // Fewer, more deliberate particles
    const particles = [];
    const connectionDist = 200;

    // Orbital centers
    const centers = [
      { x: canvas.width * 0.25, y: canvas.height * 0.3, radius: 250 },
      { x: canvas.width * 0.75, y: canvas.height * 0.6, radius: 300 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 400 },
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.center = centers[Math.floor(Math.random() * centers.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.radiusX = Math.random() * this.center.radius + 100;
        this.radiusY = this.radiusX * (0.4 + Math.random() * 0.2); // Elliptical paths
        this.speed =
          (Math.random() * 0.001 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.depth = Math.random() * 0.8 + 0.2;

        // Initial position
        this.updatePosition();
      }

      updatePosition() {
        this.x = this.center.x + Math.cos(this.angle) * this.radiusX;
        this.y = this.center.y + Math.sin(this.angle) * this.radiusY;
      }

      update() {
        this.angle += this.speed;
        this.updatePosition();

        // Subtle mouse influence
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223, 255, 0, ${this.opacity * this.depth})`;
        ctx.fill();

        // Add a slight glow to some particles
        if (this.depth > 0.8) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = "rgba(223, 255, 0, 0.4)";
        } else {
          ctx.shadowBlur = 0;
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(223, 255, 0, ${opacity * p1.depth * p2.depth})`;
            ctx.lineWidth = 0.5 * p1.depth;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ filter: "blur(0.5px)" }}
    />
  );
};

export default NeuralAtoms;
