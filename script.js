import * as THREE from 'three';

// --- Three.js Star Tunnel Animation ---
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');

    // Scene setup
    const scene = new THREE.Scene();
    // Fog to fade stars in the distance
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 1000; // Start back

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles (Stars)
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0xff7722); // Orange
    const color2 = new THREE.Color(0xffffff); // White

    for (let i = 0; i < count; i++) {
        // Random positions in a large volume
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 4000; // Deep depth

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Mix colors
        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    // Animation Loop
    let targetZ = 1000;

    const animate = () => {
        requestAnimationFrame(animate);

        // Rotate slightly for dynamic feel
        starField.rotation.z += 0.0005;

        // Move camera based on scroll
        // Map scrollY to Z position
        // As we scroll down, camera moves forward (decreasing Z)
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = scrollY / maxScroll;

        // Move from z=1000 to z=-1000 based on scroll
        const targetCameraZ = 1000 - (scrollFraction * 2000);

        // Smooth camera movement
        camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// --- Scroll Animation (Intersection Observer) ---
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollAnimations();
});
