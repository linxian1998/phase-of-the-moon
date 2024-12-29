<template>
  <canvas id="cann"></canvas>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onUnmounted, ref } from 'vue';
// import OrbitControls from 'three-orbitcontrols';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSun, update, createCubeRt } from '../class/sun-test';
import { usePlane } from '@/stores/plane';
const {setCurr} = usePlane()
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
let sphere;
let axesHelper;
const moonOrbitRadius = 100 ; // 月球到地球的距离
const renderTarget = new THREE.WebGLRenderTarget(256, 256);
 // 创建透视相机

// 用于显示捕捉画面的平面
const planeGeometry = new THREE.PlaneGeometry(400, 400);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(600, 0, 0);
plane.rotation.y = Math.PI 
let shanghai;
const newCamera1 = new THREE.PerspectiveCamera(
    75,
    1,
    10,
    300
    );

// 创建新相机并捕捉地球的瞬间视图
function createNewCameraSnapshot(moonRelativeToTarget,target, plane, renderTarget) {
  const moonPosition = new THREE.Vector3();
  moonRelativeToTarget.getWorldPosition(moonPosition);
  // 假设camera是你的Three.js相机对象
  const cameraPosition = new THREE.Vector3();
  newCamera1.getWorldPosition(cameraPosition);
// 现在cameraDirection包含了相机的当前拍摄方向
  const worldPositionaEarth = new THREE.Vector3();

  // const newCamera2 = new THREE.OrthographicCamera(
  //   400,
  //   -400,
  //   400,
  //   -400,
  //   50,
  //   150
  //   );
  //   newCamera2.position.set(cameraPosition.x,cameraPosition.y,cameraPosition.z);
  //   const targetPoint = new THREE.Vector3().copy(cameraPosition).addScaledVector(cameraDirection, moonOrbitRadius); // 假设距离为1000单位
  //   newCamera2.lookAt(targetPoint);
  //   newCamera2.updateProjectionMatrix();
  target.getWorldPosition(worldPositionaEarth);

  // 创建一个新的向量来存储结果
  const result = new THREE.Vector3();
  
  // 计算 a - b 并将结果存储在 result 中
  result.subVectors(cameraPosition.clone(), worldPositionaEarth.clone());
  let currRad = caculateRad(worldPositionaEarth.clone().normalize(),result.normalize());
  // console.log(currRad);
  if(currRad <= 90){
    //说明是黑夜 能看见月亮
    newCamera1.lookAt(moonPosition);
    scene.remove(sphere)
    scene.remove(axesHelper)
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, newCamera1);
    renderer.setRenderTarget(null);
    scene.add(sphere)
    scene.add(axesHelper)
    // 更新平面的纹理
    plane.material.map = renderTarget.texture;
    plane.material.needsUpdate = true;
  }else{
    plane.material.map = null;
    plane.material.needsUpdate = true;
  }
  
  // const worldPosition = new THREE.Vector3();
  // shanghai.getWorldPosition(worldPosition);
  // // newCamera.position.set(targetWorldPosition.x,targetWorldPosition.y,targetWorldPosition.z);
  // newCamera.position.set(worldPosition.x,worldPosition.y,worldPosition.z);
  // var vectorBetween = worldPositionaEarth.clone().sub(worldPosition.clone()).normalize()
  // newCamera.lookAt(vectorBetween.x * moonOrbitRadius,vectorBetween.y* moonOrbitRadius,vectorBetween.z* moonOrbitRadius);
  
}
function animate() {
  // 让球动起来
  // sphere.rotation.x += 0.01;
  // sphere.rotation.y += 0.005;

  // Rotate earth around the sun
  const time = Date.now() *0.001 ; // Time in seconds
  const angle = (time * 2 * Math.PI) / 3600; // Rotate once every 60 seconds (1 minute)

  localScene.position.x = Math.cos(angle) * orbitRadius;
  localScene.position.z = Math.sin(angle) * orbitRadius;

  // earth rotate by itemself
  // 计算地球自转的角度
  const earthRotationAngle = time * 2 * Math.PI; // 转换为弧度制
  earthGroup.rotation.y = earthRotationAngle / 20; // 绕y轴自转

  // moon rotate by earth
  const angle_moon = (time * 2 * Math.PI) / 600; // Rotate once every 60 seconds (1 minute)

  moonGroup.position.x = Math.cos(angle_moon) * moonOrbitRadius;
  moonGroup.position.z = Math.sin(angle_moon) * moonOrbitRadius;
  // 月球自转 
  moonGroup.rotation.y = angle_moon; // 绕y轴自转
  controls.value.update();
  createNewCameraSnapshot(moonGroup,localScene, plane, renderTarget);

  if (index++ > 5) { 

    update(renderer)
    index = 0
  }
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

function convertGeoTo3D(lat, lon, radius) {
    const latRad = lat * (Math.PI / 180);
    const lonRad = lon * (Math.PI / 180);
    
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.cos(latRad) * Math.sin(lonRad);
    const z = radius * Math.sin(latRad);
    
    return { x, y, z };
  }
function caculateRad(v1,v2){
  // 假设你已经有两个向量 v1 和 v2

// 计算两个向量的点积
let dotProduct = v1.dot(v2);

// 计算两个向量的模（长度）
let magnitudeV1 = v1.length();
let magnitudeV2 = v2.length();

// 使用点积和模来计算夹角的余弦值
let cosineAngle = dotProduct / (magnitudeV1 * magnitudeV2);

// 计算夹角（弧度）
let angleInRadians = Math.acos(cosineAngle);

// 将弧度转换为角度（可选）
let angleInDegrees = THREE.MathUtils.radToDeg(angleInRadians);

// 输出夹角
// console.log('Angle in radians:', angleInRadians);
// console.log('Angle in degrees:', angleInDegrees);
return angleInDegrees
}
onMounted(() => {
  canvas = document.getElementById('cann');
  camera = new THREE.OrthographicCamera(
    canvas?.offsetWidth / 2,
    -canvas?.offsetWidth / 2,
    canvas?.offsetHeight / 2, // 屏幕宽度/屏幕高度
    -canvas?.offsetHeight / 2,
    -10000, // 近端
    10000 // 远端
  );
  camera.position.set(0, 0, 5000);
  camera.zoom = 0.5
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  controls.value = new OrbitControls(camera, renderer.domElement);
  controls.value.enableDamping = true;
  controls.value.enableRotate = true;
  controls.value.enablezoom = true;
  // 
   scene = new THREE.Scene();
 

  // 太阳

  const textureLoader = new THREE.TextureLoader();
  sphere = createSun()
  scene.add(sphere);
  createCubeRt();
  camera.lookAt(sphere.position)
  // 给太阳添加一个点光源
  const pointLight = new THREE.PointLight(0xffffff, 15, 0, 0);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
  // 创建一个环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 柔和的白色光
  scene.add(ambientLight);
  // 创建一个“局部场景”来包含地球和月球
  localScene = new THREE.Group();
  orbitRadius =800; // Distance from sun to earth
  // 地球
  // 加载地球纹理
  const earthTexture = textureLoader.load('/src/assets/earth.jpg'); // 替换为你的地球纹理图片路径
  const material_earth = new THREE.MeshLambertMaterial({
      map: earthTexture,
      shininess: 100 // 调整光泽度
  });
  const geometry_earth = new THREE.SphereGeometry(24, 64, 64);
  earthGroup = new THREE.Mesh(geometry_earth, material_earth);

  localScene.add(earthGroup)

  

  // 上海的地理坐标
  const shanghaiLat = 90;
  const shanghaiLon = 121.4737;

  // 地球模型的半径
  const earthModelRadius = 24;

  // 计算上海相对于地球模型的三维坐标
  const shanghai3DCoords = convertGeoTo3D(shanghaiLat, shanghaiLon, earthModelRadius);

  const shanghaiGeometry = new THREE.BoxGeometry(10, 10, 10); // 尺寸可以根据需要调整
  const shanghaiMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 绿色材质
  shanghai = new THREE.Mesh(shanghaiGeometry, shanghaiMaterial);
  
  // 将上海添加到地球组中
  // earthGroup.add(shanghai);
  earthGroup.add(newCamera1);
  
  // 设置上海的初始位置（在地球表面上，根据纬度和经度计算得到的x, y, z坐标）
  // 注意：这里的x, y, z需要根据实际的纬度和经度以及地球半径来计算
  // 这里只是示例，所以直接设置了某个位置
  shanghai.position.set(shanghai3DCoords.x, shanghai3DCoords.y, shanghai3DCoords.z); // 其中x, y, z是之前计算得到的上海的三维坐标
  newCamera1.position.set(shanghai3DCoords.x, shanghai3DCoords.y, shanghai3DCoords.z); // 其中x, y, z是之前计算得到的上海的三维坐标

  // 创建月球
  const geometry_moon = new THREE.SphereGeometry(7.2, 16, 16); // 更小的尺寸代表月球
  const moonTexture = textureLoader.load('/src/assets/月球.jfif'); // 替换为你的地球纹理图片路径
  const material_moon = new THREE.MeshLambertMaterial({
      map: moonTexture,
      shininess: 100 // 调整光泽度
  });
  // const material_moon = new THREE.MeshLambertMaterial({ color: 'gray', wireframe: true });
  moonGroup = new THREE.Mesh(geometry_moon, material_moon);
  
  // 将月球添加到地球组中，这样月球将围绕地球旋转
  localScene.add(moonGroup);
  
  // 设置月球围绕地球的轨道半径
  moonGroup.position.set(moonOrbitRadius, 0, 0);



  scene.add(localScene);
  // 添加坐标轴辅助器
  axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);
  scene.add(plane);
  
  resize();
  animate();
});

window.addEventListener('resize', resize);

function resize() {

  camera.aspect = canvas.offsetWidth/ canvas.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

}
</script>
<style scoped>
#cann {
  width: 100%;
  height: 100%;
}
</style>
