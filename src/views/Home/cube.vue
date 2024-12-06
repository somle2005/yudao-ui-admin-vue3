<template>
  <div ref="threeContainer" style="width: 100%; height: 100%; background: black; cursor: grab;"></div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DraggableCube' })
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';


// Props to customize the cube
const props = defineProps<{
  color?: string; // Cube color
  size?: number;  // Cube size
}>();

const threeContainer = ref<HTMLDivElement | null>(null);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 }; // Track previous mouse position
let rotationSpeed = 0.005; // Rotation sensitivity

onMounted(() => {
  if (!threeContainer.value) return;

  // Initialize scene, camera, and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(
    threeContainer.value.clientWidth,
    threeContainer.value.clientHeight
  );
  threeContainer.value.appendChild(renderer.domElement);

  // 添加 AR 按钮
  document.body.appendChild(ARButton.createButton(renderer));

  // // Add a cube
  // const geometry = new THREE.BoxGeometry(props.size || 1, props.size || 1, props.size || 1);
  // const material = new THREE.MeshBasicMaterial({ color: props.color || '#00ff00' });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  let model;
  let boundingBox;

// // Add ambient light
//   const ambientLight = new THREE.AmbientLight(0xffffff, 10); // Bright white light
//   scene.add(ambientLight);

// Optionally, add a directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
  // scene.add(lightHelper);

  // 加载 GLTF 模型
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/models/');
  dracoLoader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);
  loader.load('/models/EIFFEL.glb', (gltf) => {
    model = gltf.scene;
    // Calculate the center of the model
    const box = new THREE.Box3().setFromObject(model);

    // Normalize the scale
    const size = box.getSize(new THREE.Vector3());



    // Get the center of the bounding box
    const center = box.getCenter(new THREE.Vector3());

    // Create a visible bounding box
    const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true, // Wireframe mode for better visibility
    });
    const boundingBox = new THREE.Mesh(boxGeometry, boxMaterial);

    // Position the bounding box at the center of the model
    boundingBox.position.copy(center);
    // model.add(boundingBox);

    // // Scale the model
    // const maxAxis = Math.max(size.x, size.y, size.z);
    // model.scale.multiplyScalar(3 / maxAxis);

    // model.position.set(-center.x, -center.y, -center.z);
    model.position.set(0,0,0);
    // model.position.set(center.x, center.y, center.z);




    // // Add a sphere to represent the rotation center
    // const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Small sphere
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' }); // Red color
    // const centerMarker = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // centerMarker.position.set(0, 0, 0); // Set it to the origin (cube center)
    // scene.add(centerMarker);
    //
    // // Optionally, add an AxesHelper to visualize orientation
    // const axesHelper = new THREE.AxesHelper(1); // Size of 1
    // centerMarker.add(axesHelper); // Attach it to the center marker

    scene.add(model);



  });



  const controls = new OrbitControls(camera, renderer.domElement);
  // const controls = new TrackballControls(camera, renderer.domElement);

  // controls.enableDamping = true; // 启用阻尼效果
  // controls.dampingFactor = 0.05; // 阻尼系数
  // controls.enableZoom = true;    // 是否允许缩放
  // controls.enablePan = true;     // 是否允许平移
  // controls.enableRotate = true;  // 是否允许旋转

  // Animation loop
  const animate = () => {
    // Render the scene
    controls.update(); // 更新控件状态
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();


});
</script>
