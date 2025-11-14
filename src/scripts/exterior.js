import '../style.css'

  

// Imports
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd1e9f3ff);

// Camara
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
camera.position.set(16, 16, 20); // X, Y, Z
camera.fov = 60;



// Renderizador
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg'),
    antialias: true
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 5, -5);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minPolarAngle = Math.PI / 4; // 45 grados
controls.maxPolarAngle = Math.PI / 2.2; // 90 grados

controls.minDistance = 16;
controls.maxDistance = 100;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio);

controls.addEventListener('change', () => {
  controls.target.y = Math.max(0, Math.min(controls.target.y, 10)); // entre 0 y 10
});



// DRACO LOADER
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

// Modelados
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
dracoLoader.dispose();

loader.load( '/models/exterior.glb', function ( gltf ) {

  scene.add( gltf.scene );
  const model = gltf.scene;

      model.traverse((obj) => {
        if (obj.isMesh && obj.material) {

            const mat = obj.material;
            const name = (mat.name || "").toLowerCase();

            if (name.includes("glass")) {

                obj.material = new THREE.MeshPhysicalMaterial({
                    color: 0xCED7E1FF, 
                    metalness: 0,
                    roughness: 0,
                    transmission: 1,        // refracción real
                    ior: 2.33,
                });

                obj.material.needsUpdate = true;
            }
        }
    });



}, undefined, function ( error ) {

  console.error( error );

} );


// Luz
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 3;

const sunLight = new THREE.DirectionalLight(0xffffff, 2); // (color, intensidad)
sunLight.position.set(30, 50, -20); // dirección desde donde entra la luz
sunLight.intensity = 1;
sunLight.castShadow = true;

const sunHelper = new THREE.DirectionalLightHelper(sunLight, 1);

scene.add(sunLight, ambientLight);

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

