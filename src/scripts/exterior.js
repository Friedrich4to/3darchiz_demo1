import '../style.css'

  

// Imports
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { SplatMesh } from "@sparkjsdev/spark";




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
camera.position.set(10, -10, 0); // X, Y, Z
camera.fov = 60;



// Renderizador
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg')
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(-10, -8, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minPolarAngle = Math.PI / 4; // 45 grados
controls.maxPolarAngle = Math.PI / 2.2; // 90 grados

controls.minDistance = 12;
controls.maxDistance = 20;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio);


// Splat
const splatURL = '/models/gausian_v2.ksplat';
const hriv = new SplatMesh({ 
    url: splatURL,
    onLoad: () => {
        console.log("Modelo cargado con éxito");
        document.querySelector('.loading-container')?.classList.add('hidden');
}});
hriv.quaternion.set(1, 0, 0, 0);
hriv.position.set(-5, 0, 0);
hriv.scale.set(4, 4, 4 );

scene.add(hriv);

// Hotspot
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let hoveredObject = null;

const geometry = new THREE.SphereGeometry(.5, 12, 12 );

const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
});
const hoverMaterial = new THREE.MeshBasicMaterial({
    color: 0x284768,
});

const hotspot1 = new THREE.Mesh(geometry, baseMaterial.clone());
hotspot1.position.set(-6.25, -10.5, -2.5); 
hotspot1.name = "hotspot-panellum-1";    

const hotspot2 = new THREE.Mesh(geometry, baseMaterial.clone());
hotspot2.position.set(-7, -10.5, 6); 
hotspot2.name = "hotspot-panellum-2";

scene.add(hotspot1, hotspot2);

window.addEventListener("click", onClick);
window.addEventListener("mousemove", onHover);

function onHover(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([hotspot1, hotspot2], true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;

        // Cambiar cursor
        document.body.style.cursor = "pointer";

        // Restaurar el anterior si es diferente
        if (hoveredObject && hoveredObject !== obj) {
            hoveredObject.material = baseMaterial.clone();
        }

        // Aplicar material hover
        obj.material = hoverMaterial.clone();
        hoveredObject = obj;

    } else {
        // Restaurar si no hay nada en hover
        if (hoveredObject) {
            hoveredObject.material = baseMaterial.clone();
            hoveredObject = null;
        }

        document.body.style.cursor = "default";
    }
}

function onClick(event) {
    event.preventDefault();

    // convertir coordenadas del click
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    console.log("Intersecciones detectadas:", intersects.length);

    if (intersects.length > 0) {
        const obj = intersects[0].object;

        console.log("Objeto clickeado:", obj.name);


        // Hotspot gazebo_1
        if (obj.name === "hotspot-panellum-1") {
            console.log("Hotspot 1 clickeado correctamente");
            openPanellum("p1");
        }

        // Hotspot gazebo_1
        if (obj.name === "hotspot-panellum-2") {
            console.log("Hotspot 2 clickeado correctamente");
            openPanellum("p2");
        }
    }
}

//PANELLUM
function openPanellum(panoramaId, imagePath) {

    const viewerDiv = document.getElementById("panellum-viewer");
    viewerDiv.style.display = "block";

    pannellum.viewer('panellum-viewer', {
        default: {
            firstScene: panoramaId,
            autoLoad: true
        },

        scenes: {

            // PANORAMA 1
            p1: {
                type: "equirectangular",
                panorama: "/images/pano/gazebo_1.jpg",
                hotSpots: [
                    {
                        pitch: 0,
                        yaw: 0,
                        type: "scene",
                        sceneId: "p2",
                    },

                    // ← Aquí puedes agregar más hotspots personalizados
                ]
            },
            // PANORAMA 2
            p2: {
                type: "equirectangular",
                panorama: "/images/pano/gazebo_2.jpg",
                hotSpots: [
                    {
                        pitch: 0,
                        yaw: 0,
                        type: "scene",
                        sceneId: "p1",
                    },

                    // ← Aquí puedes agregar más hotspots personalizados
                ]
            },

            // --------------  
            // (Puedes seguir agregando escenas aquí)
            // --------------

        }
    });
}




// Luz
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 10;

scene.add(ambientLight);

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
