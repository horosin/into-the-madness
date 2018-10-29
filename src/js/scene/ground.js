import * as THREE from "three";
import { colors } from '../config'

export function createGround(scene) {
    var geometry = new THREE.PlaneBufferGeometry(100, 100);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshPhongMaterial({ color: colors.grapefruit });
    var ground = new THREE.Mesh(geometry, material);

    ground.receiveShadow = true;
    ground.translateZ(5);

    scene.add(ground);
}
