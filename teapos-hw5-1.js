import * as THREE from "https://threejs.org/build/three.module.js";
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";
import {scene} from "./init-hw5-1.js";

var teapots = [];

export function buildTeapots(){

	let meshMaterial = new THREE.ShaderMaterial({
        uniforms: {
        lightpos: {type: 'v3', value: new THREE.Vector3()}
        },
        vertexShader: document.getElementById('myVertexShader').textContent,
        fragmentShader: document.getElementById('myFragmentShader').textContent
    });
    
    var geometry = new TeapotGeometry (5);
	
	for(var i = 0, j = 0;j<10, i<10;j++){
		
		let mesh = new THREE.Mesh(geometry, meshMaterial);
		mesh.position.set(i*20-90, 0, j*20-90);
		teapots.push(mesh);
		scene.add(mesh);
		
		if(j == 9){
			j = -1;
			i++;
		}
	}
}

export {teapots};