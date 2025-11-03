import '../style.css'

// Imports
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Escena
const scene = new THREE.Scene();

// Camara
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(20, 12, 24); // X, Y, Z
camera.rotation.x = -100;

camera.fov = 60;

// Renderizador
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg'),
    antialias: true
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Configuración básica
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 🔹 Limitar el eje Y (rotación vertical)
controls.minPolarAngle = Math.PI / 4; // 45 grados
controls.maxPolarAngle = Math.PI / 2.2; // 90 grados

// 🔹 (Opcional) limitar la distancia del zoom
controls.minDistance = 5;
controls.maxDistance = 100;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio);

controls.addEventListener('change', () => {
  controls.target.y = Math.max(0, Math.min(controls.target.y, 10)); // entre 0 y 10
});

// Geometría

const loader = new GLTFLoader();

loader.load( '/models/exterior.glb', function ( gltf ) {

  scene.add( gltf.scene );


}, undefined, function ( error ) {

  console.error( error );

} );


// Luz
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 1.5;
scene.add(ambientLight)

// Luz solar (DirectionalLight = luz paralela, como el sol)
const sunLight = new THREE.DirectionalLight(0xffffff, 2); // (color, intensidad)
sunLight.position.set(30, 50, -20); // dirección desde donde entra la luz
sunLight.intensity = 1;
sunLight.castShadow = true;

scene.add(sunLight);

// 🔹 (Opcional) ayuda visual
const sunHelper = new THREE.DirectionalLightHelper(sunLight, 1);
scene.add(sunHelper);

// Animación
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}
animate();