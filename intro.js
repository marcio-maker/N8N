// intro.js - Versão corrigida
document.addEventListener('DOMContentLoaded', function() {
    const introContainer = document.getElementById('intro-container');
    const quizContainer = document.querySelector('.quiz-container');
    const startBtn = document.getElementById('startQuizBtn');
    const canvas = document.getElementById('intro-canvas');

    // Verifica se já mostramos a introdução
    const introAlreadyShown = sessionStorage.getItem('introShown');
    
    if (!introAlreadyShown) {
        try {
            // Tenta criar a animação Three.js
            if (typeof THREE !== 'undefined') {
                const renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    alpha: true,
                    antialias: true
                });
                renderer.setSize(window.innerWidth, window.innerHeight);

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = 30;

                const particlesGeometry = new THREE.BufferGeometry();
                const particleCount = 1500;
                const posArray = new Float32Array(particleCount * 3);

                for(let i = 0; i < particleCount * 3; i++) {
                    posArray[i] = (Math.random() - 0.5) * 100;
                }

                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
                
                const particlesMaterial = new THREE.PointsMaterial({
                    size: 0.2,
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending
                });

                const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
                scene.add(particlesMesh);

                function animate() {
                    requestAnimationFrame(animate);
                    particlesMesh.rotation.x += 0.0005;
                    particlesMesh.rotation.y += 0.0005;
                    renderer.render(scene, camera);
                }
                animate();

                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
            }
        } catch (e) {
            console.error("Erro na animação Three.js:", e);
            // Continua mesmo com erro na animação
        }

        // Evento do botão - Versão simplificada e mais robusta
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Adiciona classe de fade out
            introContainer.style.opacity = '0';
            introContainer.style.pointerEvents = 'none'; // Impede interação durante o fade
            
            setTimeout(() => {
                introContainer.style.display = 'none';
                quizContainer.style.display = 'block';
                
                // Pequeno delay para garantir a renderização
                setTimeout(() => {
                    quizContainer.style.opacity = '1';
                }, 50);
                
                sessionStorage.setItem('introShown', 'true');
            }, 500);
        });

    } else {
        // Se já viu a introdução, mostra o quiz diretamente
        introContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        quizContainer.style.opacity = '1';
    }
});