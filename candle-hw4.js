import * as THREE from "https://threejs.org/build/three.module.js";
import { scene, candles, pickables } from "./main-hw4.js";

export class Candle {
	constructor(pos, flameMesh){
		this.pos = pos;
		this.mesh = new THREE.Mesh (new THREE.CylinderGeometry(5,5,20,20), new THREE.MeshNormalMaterial());
		this.mesh.position.copy(pos);
		this.mesh.position.y = 10;
		this.flameMesh = flameMesh;
		this.light = new THREE.PointLight( 0xffffff, 1, 80 );
		this.light.position.y = 18;
		
		this.count = 1;
		this.mesh.picked = 0;
		
		this.mesh.add(this.light, this.flameMesh);	
		//candles.push(this);	
		//pickables.push(this.mesh);
		
		scene.add(this.mesh);
		
		setInterval(this.texAnimate, 150, this);
	}
	
	texAnimate(c){
		
		//let c = this;
		//debugger;
		//console.log(c);
		if (c.flameMesh!== undefined & c.mesh.picked === 0){
			var texture = c.flameMesh.material.map;
			c.light.power = 4*Math.PI;
			c.flameMesh.visible = true;
			//console.log (`${c.count}: [${texture.offset.x},${texture.offset.y}]`);
			texture.offset.x += 1/3;

			if (c.count % 3 === 0) {
				texture.offset.y -= 1/3;
			}
			c.count++;
		}else {
			c.mesh.picked--;
		}
		
	}
	
}

export function makeFlame2(pos) {
	//var flameMesh;

	let loader = new THREE.TextureLoader();
	// load a resource
	loader.load(
		// URL ...
		'./M2tr5Tm.png',
		// onLoad ...
		function(texture) {
			// do something with the texture
			// Plane with default texture coordinates [0,1]x[0,1]
			let texMat = new THREE.MeshBasicMaterial({
				map: texture,
				alphaTest:0.5
			});
			let flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(30,30), texMat);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set (1/3,1/3);
			texture.offset.set (0,2/3);
			flameMesh.position.y = 18;
			var candle = new Candle(pos, flameMesh);
			pickables.push(candle.mesh);
			candles.push(candle);	

		},
		undefined, // onProgress
		// onError ...
		function(xhr) {
			console.log('An error happened');
		}
	);

}