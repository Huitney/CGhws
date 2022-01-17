import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {teapots, buildTeapots} from "./teapos-hw5-2.js";

var scene, renderer, camera;
var pointLight;
var turn = true;
var angle = 0;
var sceneRTT, torus, renderTarget;
var quad;

export function init() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x888888);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.y = 160;
    camera.position.z = 400;

    let controls = new OrbitControls(camera, renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

    /*var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
    scene.add(gridXZ);*/

	var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
	
	/////////////////////////////////
	sceneRTT = new THREE.Scene();
	pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 100, 100);
	sceneRTT.add(pointLight);
	
	buildTeapots();

	renderTarget = new THREE.WebGLRenderTarget(
		4096, 4096, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBFormat
		}
	);
	
	let plane = new THREE.PlaneBufferGeometry(500, 500);
  
    let rttmaterial = new THREE.ShaderMaterial({
		uniforms: {
			mytex: {
				type: "t",
				value: renderTarget.texture
			}
		},
		vertexShader: document.getElementById('myVertexShader2').textContent,
		fragmentShader: document.getElementById('myFragmentShader2').textContent
	});

	quad = new THREE.Mesh(plane, rttmaterial);
	quad.position.set(0, 0, 50);
	scene.add(quad);
}

export function animate() {
    
    angle += 0.01;
    
    pointLight.position.set(50 * Math.cos(angle), 80, 50 * Math.sin(angle));   
	
	if(teapots)
		teapots.forEach (function(t) {
			t.material.uniforms.lightpos.value.copy (pointLight.position);
			t.rotation.y = angle;
		});

    //mesh.rotation.y = 1.3*angle;
    requestAnimationFrame(animate);
    render();
}

function render() {
	// render torusKnot to texture
	renderer.setRenderTarget (renderTarget);
	renderer.setClearColor(0xffff00);
	renderer.render(sceneRTT, camera);

	// render texture to quad
	renderer.setRenderTarget(null);
	renderer.setClearColor(0x888888);
	renderer.render(scene, camera);
	quad.lookAt (camera.position);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export {scene, sceneRTT};