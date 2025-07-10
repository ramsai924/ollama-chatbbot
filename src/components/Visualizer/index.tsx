import { useRef, useEffect } from 'react';
import type { AudioVisualizerProps } from '../../types/audio';

interface Particle {
    x: number;
    y: number;
    angle: number;
    radius: number;
    baseRadius: number;
    speed: number;
    size: number;
}

const Visualizer = ({ audioData, settings, enabled }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);

    const getColor = (intensity: number) => {
        const { colorTheme } = settings;
        let hue = 0;

        switch (colorTheme) {
            case 'rainbow':
                hue = (Date.now() * 0.02) % 360;
                break;
            case 'ocean':
                hue = 180;
                break;
            case 'fire':
                hue = 20;
                break;
            case 'pulse':
                hue = 200;
                break;
        }

        return `hsla(${hue}, 80%, ${70 + intensity * 20}%, ${0.4 + intensity * 0.6})`;
    };

    const initializeParticles = (width: number, height: number) => {
        const particles: Particle[] = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.4;

        for (let i = 0; i < settings.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * maxRadius;

            particles.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                angle,
                radius,
                baseRadius: radius,
                speed: settings.rotationSpeed + Math.random() * settings.rotationSpeed,
                size: 1 + Math.random() * 2
            });
        }

        return particles;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Initialize particles if not already done
        if (particlesRef.current.length === 0) {
            particlesRef.current = initializeParticles(rect.width, rect.height);
        }

        const animate = () => {
            ctx.fillStyle = '#122121';
            ctx.fillRect(0, 0, rect.width, rect.height);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            particlesRef.current.forEach((particle, index) => {
                // Always update the circular motion
                particle.angle += particle.speed;

                // Only apply audio-based effects when enabled
                let currentRadius = particle.baseRadius;
                let currentSize = particle.size;

                if (enabled) {
                    const audioIndex = Math.floor((index / settings.particleCount) * audioData.bufferLength);
                    const audioValue = audioData.isActive ? (audioData.dataArray[audioIndex] || 0) / 255.0 : 0;
                    currentRadius = particle.baseRadius + (audioValue * 50 * settings.sensitivity);
                    currentSize = particle.size * (1 + audioValue);
                }

                particle.x = centerX + Math.cos(particle.angle) * currentRadius;
                particle.y = centerY + Math.sin(particle.angle) * currentRadius;

                // Draw particle
                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    currentSize,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = getColor(enabled ? 0.8 : 0.3);
                ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [audioData, settings, enabled]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default Visualizer;