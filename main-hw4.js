import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { Candle, makeFlame2 } from "./candle-hw4.js";

var camera, scene, renderer;
var candles = [];
var pickables = [], raycaster;
var mouse = new THREE.Vector2();

//var flameOff = false;

export function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setClearColor (0x888888);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 100, 100);

	let controls = new OrbitControls (camera, renderer.domElement);
	////////////////////////////////////////////////////////////
	
	var plane = new THREE.Mesh(new THREE.PlaneGeometry( 120, 120 ), new THREE.MeshPhongMaterial({color: 0x0414f6, side: THREE.DoubleSide}));
	plane.rotation.x = Math.PI/2;
	scene.add( plane );
	
	for(let i = 0;i<5;i++){
		makeFlame2(new THREE.Vector3(Math.floor(Math.random()*100)-50, 0, Math.floor(Math.random()*100)-50));
	}
	
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener ('pointerdown', onPointerDown, false);
	raycaster = new THREE.Raycaster();

	//flameInterval = setInterval (textureAnimate, 100);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export function animate() {
	requestAnimationFrame(animate);
	render();

	
	candles.forEach (function(c) {
		if(c.flameMesh)
			c.flameMesh.lookAt (camera.position.x, 0, camera.position.z);
	});
}

function render() {
  renderer.render(scene, camera);
}

function onPointerDown (event) {
	
	event.preventDefault();  // may not be necessary
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// find intersections
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(pickables, true);
	
	if (intersects.length > 0) {
		if(intersects[0].object){
			intersects[0].object.children[0].visible = false;
			intersects[0].object.children[1].visible = false;
			intersects[0].object.picked = 20;
			//console.log(intersects[0].object)
		}
	}
}

export{scene, candles, pickables};