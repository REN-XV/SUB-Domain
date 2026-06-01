// Fungsi untuk toggle sidebar di mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.display === "none" || sidebar.style.display === "") {
        sidebar.style.display = "block";
    } else {
        sidebar.style.display = "none";
    }
}

// ============ 3D Network Background with Three.js ============
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('network-canvas');
    if (!canvas || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    // Tambahkan efek kabut agar jaringan yang jauh terlihat pudar
    scene.fog = new THREE.FogExp2(0x0b0e14, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 1. Buat Partikel
    const particleCount = 180; // Sesuaikan agar tidak terlalu berat
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 600; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600; // z
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.5
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x2ecc71,
        size: 3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Buat material untuk garis penghubung
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    
    const linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    scene.add(linesMesh);

    // 3. Interaksi Mouse
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // 4. Animasi Utama
    function animate() {
        requestAnimationFrame(animate);

        // Rotasi Pelan untuk seluruh jaringan
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        linesMesh.rotation.y += 0.0005;
        linesMesh.rotation.x += 0.0002;

        // Efek Pergerakan Kamera mengikuti mouse
        camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        const posArray = particles.geometry.attributes.position.array;
        const linePositions = [];
        
        // Update pergerakan titik-titik dan buat garis ke titik terdekat
        for (let i = 0; i < particleCount; i++) {
            // Apply velocity
            posArray[i * 3] += velocities[i].x;
            posArray[i * 3 + 1] += velocities[i].y;
            posArray[i * 3 + 2] += velocities[i].z;

            // Batasan ruang (Bounce back)
            if (posArray[i * 3] > 300 || posArray[i * 3] < -300) velocities[i].x *= -1;
            if (posArray[i * 3 + 1] > 300 || posArray[i * 3 + 1] < -300) velocities[i].y *= -1;
            if (posArray[i * 3 + 2] > 300 || posArray[i * 3 + 2] < -300) velocities[i].z *= -1;

            // Hubungkan titik-titik jika jaraknya cukup dekat
            for (let j = i + 1; j < particleCount; j++) {
                const dx = posArray[i * 3] - posArray[j * 3];
                const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                const distSq = dx*dx + dy*dy + dz*dz;

                if (distSq < 10000) { // Threshold jarak
                    linePositions.push(
                        posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                        posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
                    );
                }
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        renderer.render(scene, camera);
    }
    
    animate();

    // 5. Responsive saat ukuran jendela berubah
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});