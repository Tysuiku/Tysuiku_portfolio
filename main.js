import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.15, 69, 69);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  star.renderOrder = 0;
  scene.add(star);
}

Array(420).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("assets/background.png");
scene.background = spaceTexture;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

// Load the texture
const starTexture = new THREE.TextureLoader().load("assets/space.png"); // <-- Replace 'assets/yourStarTexture.png' with the path to your texture file

const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture, // assign the texture as a map to the material
});

const star = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 0), starMaterial);

scene.add(star);

star.position.z = 0;
star.position.setX(2);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

let earthRotationSpeed = 0.005;
function animate() {
  requestAnimationFrame(animate);
  star.rotation.y += earthRotationSpeed;

  renderer.render(scene, camera);
}

animate();

// Load the texture for the tail particles
const tailTexture = new THREE.TextureLoader().load("assets/star.png"); // <-- Replace 'assets/tail.png' with the path to your texture file

const tailMaterial = new THREE.PointsMaterial({
  map: tailTexture, // assign the new texture to the tail particles
  size: 0.3,
  transparent: true,
});

const tailGeometry = new THREE.BufferGeometry();

const tailParticles = new Float32Array(200 * 3); // times 3 for x, y, z coordinates

for (let i = 0; i < tailParticles.length; i += 3) {
  tailParticles[i] = (Math.random() - 0.5) * 10; // x coordinate
  tailParticles[i + 1] = (Math.random() - 0.5) * 10; // y coordinate
  tailParticles[i + 2] = (Math.random() - 0.5) * 10; // z coordinate
}

tailGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(tailParticles, 3)
);

const tail = new THREE.Points(tailGeometry, tailMaterial);
star.add(tail); // we add the tail as a child of the star so they move together

const textArray = [
  "Full-Stack Developer and Gaming Aficionado",
  "Bridging the Gap Between Technology and Entertainment",
  "Streamer with a Passion for Community Building",
  "Adept at Learning New Technologies",
  "Creative Problem Solver",
  "Frontend Developer & UI/UX Enthusiast",
];

const textElement = document.querySelector(".quote");
let currentTextIndex = 0;

setInterval(() => {
  currentTextIndex = (currentTextIndex + 1) % textArray.length;
  textElement.textContent = textArray[currentTextIndex];
}, 5000);
