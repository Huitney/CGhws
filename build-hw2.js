import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './init-hw2.js';

export class Car {
	constructor(pos, size, mesh) {
		this.center = pos;
		this.size = size;
		this.speed = 0;
		this.theta = 0.0001;
		this.mesh = new THREE.Group();
		this.mesh.position.copy(pos);
		
		this.light = new THREE.PointLight(0x404040);
		this.light.position.set(-5, 50, 0);
		
		//wheel
		this.leftfrontWheel = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 1, 32 ), new THREE.MeshPhongMaterial( {color: 0xbbbbbb, transparent: true, opacity: 0.9} ) );
		this.leftfrontWheel.position.set(10, 2, -5);
		this.leftfrontWheel.rotation.x = Math.PI/2;
		
		this.rightfrontWheel = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 1, 32 ), new THREE.MeshPhongMaterial( {color: 0xbbbbbb, transparent: true, opacity: 0.9} ) );
		this.rightfrontWheel.position.set(10, 2, 5);
		this.rightfrontWheel.rotation.x = Math.PI/2;
		
		this.leftRearWheel = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 1, 32 ), new THREE.MeshPhongMaterial( {color: 0xbbbbbb, transparent: true, opacity: 0.9} ) );
		this.leftRearWheel.position.set(-10, 2, -5);
		this.leftRearWheel.rotation.x = Math.PI/2;
		
		this.rightRearWheel = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 1, 32 ), new THREE.MeshPhongMaterial( {color: 0xbbbbbb, transparent: true, opacity: 0.9} ) );
		this.rightRearWheel.position.set(-10, 2, 5);
		this.rightRearWheel.rotation.x = Math.PI/2;
		
		this.mesh.add(mesh, this.light, this.leftfrontWheel, this.rightfrontWheel, this.leftRearWheel, this.rightRearWheel);
		scene.add( this.mesh );
		
		this.rotate(0); // set initial axes
	}
	
	rotate(angle) {
		this.angle = angle;

		let yAxis = new THREE.Vector3(0, 1, 0);
		this.axes = [];
		this.axes[0] = (new THREE.Vector3(1, 0, 0)).applyAxisAngle(yAxis, angle);
		this.axes[1] = (new THREE.Vector3(0, 0, 1)).applyAxisAngle(yAxis, angle);
		
		this.dir = [];
		this.dir[0] = (new THREE.Vector3(1, 0, 0)).applyAxisAngle(yAxis, angle);
		this.dir[1] = (new THREE.Vector3(-1, 0, 0)).applyAxisAngle(yAxis, angle);
		this.dir[2] = (new THREE.Vector3(0, 0, 1)).applyAxisAngle(yAxis, angle);
		this.dir[3] = (new THREE.Vector3(0, 0, -1)).applyAxisAngle(yAxis, angle);
		
		this.c = [];
		this.mesh.updateWorldMatrix(true, false);
		this.c[0] = this.mesh.localToWorld(new THREE.Vector3(this.size[0], 0, 0));
		this.c[1] = this.mesh.localToWorld(new THREE.Vector3(-this.size[0], 0, 0));
		this.c[2] = this.mesh.localToWorld(new THREE.Vector3(0, 0, this.size[2]));
		this.c[3] = this.mesh.localToWorld(new THREE.Vector3(0, 0, -this.size[2]));
								
		this.mesh.rotation.y = angle;
	}
	
	move(pos){
		this.center.copy(pos);
		this.mesh.position.copy(this.center);
	}
	
	calculateDistance(obs) {
		// four axes to check
		let obbA = this;
		
		let x1 = (obs.mesh.clone().position.sub(obbA.c[0])).dot(obbA.dir[0]);
		let x2 = (obs.mesh.clone().position.sub(obbA.c[1])).dot(obbA.dir[1]);
		let z1 = (obs.mesh.clone().position.sub(obbA.c[2])).dot(obbA.dir[2]);
		let z2 = (obs.mesh.clone().position.sub(obbA.c[3])).dot(obbA.dir[3]);

		let dis = new THREE.Vector3(0, 0, 0), dir;
		if(x1 > 0){
			if(z1 > 0){
				dis = obs.mesh.position.clone().sub(obbA.mesh.localToWorld(new THREE.Vector3(obbA.size[0], 0, obbA.size[2])));
				dir = 'xz';
			}else if(z2 > 0){
				dis = obs.mesh.position.clone().sub(obbA.mesh.localToWorld(new THREE.Vector3(obbA.size[0], 0, -obbA.size[2])));
				dir = 'x-z';
			}else {
				dis.x = obs.mesh.position.clone().sub(obbA.c[0]).dot(obbA.dir[0]);
				dis.z = 0;
				dir = 'x';
			}
		}else if(x2 > 0){
			if(z1 > 0){
				dis = obs.mesh.position.clone().sub(obbA.mesh.localToWorld(new THREE.Vector3(-obbA.size[0], 0, obbA.size[2])));
				dir = '-xz';
			}else if(z2 > 0){
				dis = obs.mesh.position.clone().sub(obbA.mesh.localToWorld(new THREE.Vector3(-obbA.size[0], 0, -obbA.size[2])));
				dir = '-x-z';
			}else {
				dis.x = obs.mesh.position.clone().sub(obbA.c[1]).dot(obbA.dir[1]);
				dis.z = 0;
				dir = '-x';
			}
		}else if(z1 > 0){
			dis.z = obs.mesh.position.clone().sub(obbA.c[2]).dot(obbA.dir[2]);
			dis.x = 0;
			dir = 'z';
		}else if(z2 > 0){
			dis.z = obs.mesh.position.clone().sub(obbA.c[3]).dot(obbA.dir[3]);
			dis.x = 0;
			dir = '-z';
		}else{
			dis.x = dis.z = 0;
			dir = 0;
		}
		
		return Math.sqrt(dis.x*dis.x + dis.z*dis.z) - obs.radius;
	}
}

export class Obstacle {
	constructor(pos, radius, height, color = 'yellow') {
		this.center = pos;
		this.radius = radius;
		this.height = height;
		this.mesh = new THREE.Mesh( new THREE.CylinderGeometry( this.radius, this.radius, this.height, 32 ), new THREE.MeshBasicMaterial({color: color}));
		this.mesh.position.copy(pos);
				
		//this.mesh.add(mesh);
		scene.add( this.mesh );
	}
	
	collision(pos, radius){
		//console.log(pos.distanceTo(this.center) - this.radius - radius, pos.distanceTo(this.center), this.radius, radius)
		if(pos.distanceTo(this.center) - this.radius - radius <= 0) return true;
		else return false;
	}
}

export function buildCar(){
	//car mesh
	let shape = new THREE.Shape();
	shape.moveTo( 0,0 );
	shape.lineTo( 0, 5 );
	shape.lineTo( 3, 5 );
	shape.lineTo( 5, 11 );
	shape.lineTo( 15, 11 );
	shape.lineTo( 20, 5 );
	shape.lineTo( 25, 5 );
	shape.lineTo( 25, 0 );
	shape.lineTo( 0, 0 );

	const extrudeSettings = {
		steps: 2,
		depth: 8,
		bevelEnabled: true,
		bevelThickness: 2,
		bevelSize: 1,
		bevelSegments: 1
	};

	let mesh = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, extrudeSettings )
							, new THREE.MeshPhongMaterial({color: 0x666666, transparent: true, opacity: 0.9, specular: 0x2d2d2d, shininess: 20})) ;
	mesh.position.set(-12.5, 3, -4);
	
	let car = new Car(new THREE.Vector3(0, 0, 0), [12.5, 6.5, 5.5], mesh);
	
	return car;
}

export function buildObstacle(){
	
	let obstacles = [];
	for(var i = 0;i < 10; i++){
		let radius = Math.floor(Math.random()*8)+3;
		let height = Math.floor(Math.random()*20)+1;
		let x = Math.random()*150-75;
		let z = Math.random()*150-75;
		let pos = new THREE.Vector3(x, height/2, z);
		if((x < 20 & x > -20) | (z < 20 & z > -20)){
			i--;
			continue;
		}
		
		for(var j = 0;j < i;j++){
			if(obstacles[j].collision(pos, radius)){
				i--;
				break;
			}
		}
		if(j !== i) continue;
		
		let color = new THREE.Color( 0xffffff );
        color.setHex( Math.random() * 0xffffff );
		let cylinder = new Obstacle(pos, radius, height, color);
		obstacles.push(cylinder);
	}
	return obstacles;
}