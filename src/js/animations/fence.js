import * as THREE from "three";


export function createFence(objectsNo = 100) {

    let blocks = [];

    for (let i = 0; i < objectsNo; i++) {

        let geometry = new THREE.BoxBufferGeometry(0.2, 0.4, 0.2);
        let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        let cube = new THREE.Mesh(geometry, material);

        if (i % 2) {
            cube.translateX(-1);

        } else {
            cube.translateX(1);

        }
        cube.translateZ(Math.floor(i / 2) * -1);

        cube.castShadow = true;

        blocks.push(cube);
    }

    return blocks;
}

export function animateMeshes(delta, objects) {
    for (let mesh of objects) {
        mesh.position.z += delta * 0.5;
    }
}

export function deleteMeshes(objects) {
    return true;
}
