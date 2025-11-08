import '../style.css'

  

// Imports
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181818); 

// Camara
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
camera.position.set(10, 10, 18); // X, Y, Z
camera.fov = 60;



// Renderizador
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg'),
    antialias: true
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minPolarAngle = Math.PI / 8; // 45 grados
controls.maxPolarAngle = Math.PI / 2; // 90 grados

controls.minDistance = 10;
controls.maxDistance = 50;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio);

controls.addEventListener('change', () => {
  controls.target.y = Math.max(0, Math.min(controls.target.y, 10)); // entre 0 y 10
});


const loader = new GLTFLoader();

loader.load(
  '/models/interior.glb',
  (gltf) => {
    scene.add(gltf.scene);

    const piso2Objects = [];
    gltf.scene.traverse((child) => {
      if (child.name.startsWith('piso2')) {
        piso2Objects.push(child);
      }
    });

    // Crear un grupo para manejarlos fácilmente
    const piso2Group = new THREE.Group();
    piso2Objects.forEach(obj => piso2Group.add(obj));

    // Añadir el grupo a la escena
    scene.add(piso2Group);

    // Guardar referencia global
  window.THREE_APP = { scene, camera, renderer, piso2: piso2Group };

    console.log('Agrupados objetos de piso2:', piso2Group);
  },
  undefined,
  (error) => console.error('Error cargando modelo:', error)
);


// Luz
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 1.5;

const sunLight = new THREE.DirectionalLight(0xffffff, 2); // (color, intensidad)
sunLight.position.set(30, 50, -20); // dirección desde donde entra la luz
sunLight.intensity = 1;
sunLight.castShadow = true;

scene.add(sunLight, ambientLight);


// Resizer
function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onWindowResize);


// Animación & Rrender
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();