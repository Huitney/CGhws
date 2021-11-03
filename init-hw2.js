import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {buildCar, buildObstacle} from './build-hw2.js';
import {dDrive, moveCar} from './drive-hw2.js';

var camera, scene, renderer;
var thirdPVCamera;
var clock = new THREE.Clock();
var car, obstacles;
var keyboard = new KeyboardState();

export function init() {
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera(-window.innerWidth/12, window.innerWidth/12
											, window.innerHeight/6, -window.innerHeight/6, 1, 10000);
	camera.position.y = 100;
	camera.up.set(1, 0, 0);
	camera.lookAt(0, 0, 0);
	
	thirdPVCamera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight/2, 1, 1000);
	thirdPVCamera.position.set (-200,200,0);
	
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('darkgray');
	window.addEventListener('resize', onWindowResize, false);
	document.body.appendChild(renderer.domElement);
	let controls = new OrbitControls(camera, renderer.domElement);
	
	let light = new THREE.PointLight(0x404040);
	scene.add(light);
	
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( {color: 0xd4d4d4, side: THREE.DoubleSide} ) );
	plane.rotation.x = Math.PI/2;
	scene.add( plane );
	
	car = buildCar();
	obstacles = buildObstacle();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export function animate() {
	var dt = clock.getDelta();
	keyboard.update();
	dDrive(dt);
	moveCar(dt);
	
	requestAnimationFrame( animate );
	render();
}

function render() {
	
	var WW = window.innerWidth;
	var HH = window.innerHeight;
    renderer.setScissorTest( true );
	
	renderer.setViewport(0, 0, WW, HH);
    renderer.setScissor(0, 0, WW, HH);
	renderer.clear();

    renderer.setViewport(0, 0, WW/2, HH);
    renderer.setScissor(0, 0, WW/2, HH);
    renderer.render(scene, camera);
	renderer.setViewport(WW/2, 0, WW/2, HH);
    renderer.setScissor(WW/2, 0, WW/2, HH);
	renderer.render(scene, thirdPVCamera);

	renderer.setScissorTest( false );
}

export {scene, car, obstacles, keyboard, thirdPVCamera};