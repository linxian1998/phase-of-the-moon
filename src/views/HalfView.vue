<template>
  <canvas id="can"></canvas>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onUnmounted, ref } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSun, update, createCubeRt } from '../class/sun-test copy';

let canvas;
let renderer;
let camera;
let scene;
let localScene;
let controls = {};
let index = 0;
let earthGroup;
let moonGroup;
let orbitRadius;
const moonOrbitRadius = 40; // 月球到地球的距离

function animate() {
  const time = Date.now() * 0.001; // Time in seconds
  const angle = (time * 2 * Math.PI) / 3600; // Rotate once every 60 seconds (1 minute)

  localScene.position.x = Math.cos(angle) * orbitRadius;
  localScene.position.z = Math.sin(angle) * orbitRadius;

  const earthRotationAngle = time * 2 * Math.PI; // 转换为弧度制
  earthGroup.rotation.y = earthRotationAngle * 0.1; // 绕y轴自转

  const angle_moon = (time * 2 * Math.PI) / 300; // Rotate once every 60 seconds (1 minute)

  moonGroup.position.x = Math.cos(angle_moon) * moonOrbitRadius;
  moonGroup.position.z = Math.sin(angle_moon) * moonOrbitRadius;
  moonGroup.rotation.y = angle_moon; // 绕y轴自转
  controls.value.update();
  if (index++ > 5) {
    update(renderer);
    index = 0;
  }
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

onMounted(() => {
  canvas = document.getElementById('can');

  camera = new THREE.OrthographicCamera(
    canvas?.offsetWidth / 2,
    -canvas?.offsetWidth / 2,
    canvas?.offsetHeight / 2,
    -canvas?.offsetHeight / 2,
    -10000,
    10000
  );
  camera.position.set(0, 5000, 0); // 从上向下看
  camera.lookAt(0, 0, 0); // 看向场景中心
  camera.zoom = 1;
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  controls.value = new OrbitControls(camera, renderer.domElement);
  controls.value.enableDamping = true;
  controls.value.enableRotate = true;
  controls.value.enablezoom = true;

  scene = new THREE.Scene();

  const textureLoader = new THREE.TextureLoader();
  const sphere = createSun();
  sphere.position.set(500, 0, 0); // 太阳位于左下角
  scene.add(sphere);
  createCubeRt();

  const pointLight = new THREE.PointLight(0xffffff, 15, 0, 0);
  pointLight.position.set(0, 0, 0); // 光源位置与太阳一致
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 柔和的白色光
  scene.add(ambientLight);

  localScene = new THREE.Group();
  // shishi
  orbitRadius = 400; // Distance from sun to earth

  const earthTexture = textureLoader.load('/src/assets/earth.jpg'); // 替换为你的地球纹理图片路径
  const material_earth = new THREE.MeshLambertMaterial({
    map: earthTexture,
    shininess: 100 // 调整光泽度
  });
  const geometry_earth = new THREE.SphereGeometry(24, 64, 64);
  earthGroup = new THREE.Mesh(geometry_earth, material_earth);

  localScene.add(earthGroup);

  const geometry_moon = new THREE.SphereGeometry(4, 16, 16); // 更小的尺寸代表月球
  const moonTexture = textureLoader.load('/src/assets/月球.jfif'); // 替换为你的地球纹理图片路径
  const material_moon = new THREE.MeshLambertMaterial({
    map: moonTexture,
    shininess: 100 // 调整光泽度
  });
  moonGroup = new THREE.Mesh(geometry_moon, material_moon);

  localScene.add(moonGroup);

  moonGroup.position.set(moonOrbitRadius, 0, 0);

  scene.add(localScene);

  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  resize();
  animate();
});

window.addEventListener('resize', resize);

function resize() {
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}
</script>
<style scoped>
#can {
  width: 100%;
  height: 100%;
}
</style>