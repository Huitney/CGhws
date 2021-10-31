import * as THREE from "https://threejs.org/build/three.module.js";
import {car, keyboard, obstacles, thirdPVCamera} from './init-hw2.js';

export function dDrive(deltaT){

	dDrive.fSlowDown = (dDrive.fSlowDown === undefined) ? 0 : dDrive.fSlowDown;
    dDrive.bSlowDown = (dDrive.bSlowDown === undefined) ? 0 : dDrive.bSlowDown;
	
	if (keyboard.pressed('down')){
		car.speed -= 1;
	}
	if (keyboard.pressed('up')){
		car.speed += 1;
	}
	car.speed = Math.clamp (car.speed, -50, 50);

	
    if (keyboard.pressed('right')){
		car.theta -= 0.01;
	}
    if (keyboard.pressed('left')){
		car.theta += 0.01;  
	}
	if(!keyboard.pressed('left') & !keyboard.pressed('right')){
		PDControl(deltaT);
		if(car.theta.toFixed(5) == 0.0000)
			car.theta = 0.0001;
	}
    car.theta = Math.clamp (car.theta, -Math.PI/7, Math.PI/7);
	
	//////////////////////////////////////////////////////////////
    // slowing down    after keyboard up
    if (keyboard.up("up")){
		dDrive.fSlowDown = 1; 
	}
    else if (keyboard.up("down")){
		dDrive.bSlowDown = 1;
	}
       
    if (keyboard.down("up") ||  keyboard.down("down"))
		dDrive.fSlowDown = dDrive.bSlowDown = 0;
		
	if (dDrive.fSlowDown == 1) {
		if(car.speed > 0) {
			car.speed -= 1;
		} else if (car.speed <= 0) {
			car.speed = 0;
			dDrive.fSlowDown = 0;
		}
    } else if (dDrive.bSlowDown == 1) {
		if(car.speed < 0) {
			car.speed += 1;
		} else if (car.speed >= 0) {
			car.speed = 0;
			dDrive.bSlowDown = 0;
		}
    }
}

export function moveCar(deltaT){
	
	let RC = car.mesh.localToWorld (new THREE.Vector3(-20/2,0,-20/Math.tan(car.theta)));
	let omega = car.speed * Math.tan(car.theta)/20;
	// C is the center of car body
    let C = car.mesh.position.clone();
    var vv = C.clone().sub(RC).applyAxisAngle (new THREE.Vector3(0,1,0), omega*deltaT).add(RC);
	
	car.move(vv);
	car.rotate(car.angle + omega*deltaT);
	for(var i = 0;i < obstacles.length;i++){
		if(car.calculateDistance(obstacles[i]) < 0){    //intersect
			car.move(C);
			car.rotate(car.angle - omega*deltaT);
			break;
		}
	}
	
	thirdPVCamera.position.copy(car.mesh.localToWorld(new THREE.Vector3(-50, 30, 0)));
	thirdPVCamera.lookAt (car.mesh.localToWorld (new THREE.Vector3(30,0,0)));
	thirdPVCamera.lookAt(car.center);
}

function PDControl(dt){
	var KP = 50;
	var KD = 15;
	PDControl.vv = (PDControl.vv === undefined) ? 0 : PDControl.vv;
	
	var f = KP*(-car.theta) - KD*PDControl.vv;

	// plant dynamics 
	PDControl.vv += f*dt;
	car.theta += PDControl.vv*dt
}