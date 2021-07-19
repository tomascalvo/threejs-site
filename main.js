import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

const scene = new THREE.Scene();

// camera

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


const startingCameraPosition = [-3, 0, -30]

camera.position.setZ(startingCameraPosition[0]);
camera.position.setY(startingCameraPosition[1]);
camera.position.setX(startingCameraPosition[2]);

renderer.render(scene, camera);

// lights

const pointLight = new THREE.PointLight(0xffd900);
pointLight.position.set(100, 100, -500);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

const cameraLight = new THREE.PointLight(0xffffff);
cameraLight.position.set(-3, 1, -30);

scene.add(pointLight, ambientLight, cameraLight);

// controls

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
const controls = new OrbitControls(camera, renderer.domElement);
// scene.add(lightHelper, gridHelper);
// scene.add(controls);

// icosahedron

const geometry = new THREE.IcosahedronGeometry(5);
const material = new THREE.MeshStandardMaterial({
  color: 0x225577,
  // wireframe: true,
});
const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.position.set(-80, -67, 0);

scene.add(icosahedron);

// paint sphere

const cyanTexture = new THREE.TextureLoader().load("cyanRipple.jpg");
const normalMapTexture = new THREE.TextureLoader().load("normalMap1.jpg");

const paintSphere = new THREE.Mesh(
  new THREE.SphereGeometry(100, 32, 32),
  new THREE.MeshStandardMaterial({
    map: cyanTexture,
    normalMap: normalMapTexture,
  })
);

scene.add(paintSphere);

paintSphere.position.setX(-80);
paintSphere.position.y = -67;
paintSphere.position.z = -50;

paintSphere.rotation.y = 180;
paintSphere.rotation.z = 23;

// stars

function addStar() {
  const geometry = new THREE.SphereGeometry(0.5, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(-1000, 1000));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(2000).fill().forEach(addStar);

const orangeTexture = new THREE.TextureLoader().load("orangeTexture.jpg");
scene.background = orangeTexture;

// camera motion

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // paintSphere.rotation.x += 0.05;
  // paintSphere.rotation.y += 0.075;
  // paintSphere.rotation.z += 0.05;

  icosahedron.rotation.y += 0.01;
  icosahedron.rotation.z += 0.01;

  // camera.position.z = t * -0.1;
  // camera.position.x = t * -0.0002;
  // camera.position.y = t * -0.0002;

  camera.position.x = startingCameraPosition[0] + (Math.sin(t * -0.0005) * 125);
  camera.position.y = startingCameraPosition[1] + (Math.sin(t * -0.0005) * 50);
  camera.position.z = startingCameraPosition[2] + (Math.cos(t * -0.0005) * 125);

  cameraLight.position.x = camera.position.x;
  cameraLight.position.y = camera.position.y;
  cameraLight.position.z = camera.position.z;
}

document.body.onscroll = moveCamera;
moveCamera();

let counter = 1.86;

function animate() {
  requestAnimationFrame(animate);

  icosahedron.rotation.x += 0.01;
  icosahedron.rotation.y += 0.005;
  icosahedron.rotation.z += 0.02;

  icosahedron.position.x = -80 + (Math.sin(counter += 0.0005) * 125);
  icosahedron.position.y = -67 + (Math.sin(counter += 0.0005) * 50);
  icosahedron.position.z = -50 + Math.cos(counter += 0.0005) * 125;

  // paintSphere.rotation.x += 0.01;
  paintSphere.rotation.y += 0.0005;
  // paintSphere.rotation.z += 0.02;

  controls.update();

  renderer.render(scene, camera);
}

animate();
