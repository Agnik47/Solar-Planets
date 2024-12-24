import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Create the scene
const scene = new THREE.Scene();

// Create a camera, which determines what we'll see when we render the scene
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
// Load HDRI texture
const loader = new RGBELoader();
loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonless_golf_1k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularRefractionMapping;
    // scene.background = texture;
    scene.environment = texture;
  }
);

// Add standard lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create a renderer and attach it to our document
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true, // for fixing pixelated images
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const radius = 1.3;
const segments = 64;
const orbitRadius = 4.5;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
const textures = [
  "./csilla/color.png",
  "./earth/map.jpg",
  "./venus/map.jpg",
  "./volcanic/color.png",
];
const spheres = new THREE.Group();

// Create a big sphere and apply a star texture to it
const bigSphereRadius = 50;
const bigSphereSegments = 64;
const bigSphereGeometry = new THREE.SphereGeometry(
  bigSphereRadius,
  bigSphereSegments,
  bigSphereSegments
);

// Load the star texture
const starTextureLoader = new THREE.TextureLoader();
const starTexture = starTextureLoader.load("./stars.jpg");

const bigSphereMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  opacity: 0.25,
  transparent: true,
  side: THREE.BackSide,
});

const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
scene.add(bigSphere);

for (let i = 0; i < 4; i++) {
  // Load texture for the sphere
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Create a sphere geometry
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture }); // Initialize material here
  const sphere = new THREE.Mesh(geometry, material);

  // Set position based on angle
  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  // Add the sphere to the group
  spheres.add(sphere);
}

spheres.rotation.x = 0.1;
spheres.position.y = -0.8;

camera.position.z = 9;

scene.add(spheres);

setInterval(() => {
  gsap.to(spheres.rotation, {
    y: `+=${Math.PI / 2}`,
    duration: 2,
    ease: "expo.easeInOut",
  });
}, 3500);

// Create an animation loop to render the scene
// Create an animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate each sphere on its own axis
  spheres.children.forEach((sphere) => {
    sphere.rotation.y += 0.001; // Adjust rotation speed here
  });

  // Rotate the big sphere (stars) slowly
  bigSphere.rotation.y += 0.0001; // Adjust rotation speed for stars here

  renderer.render(scene, camera);
}


// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
});

// Start the animation loop
animate();
