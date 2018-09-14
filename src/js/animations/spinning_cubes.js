import * as THREE from "three";

export function createMeshesReg(objectsNo = 30) {

    // bounds for random placement
    let startZ = -2;
    let minX = -5;
    let maxX = 5;
    let minY = 1;
    let maxY = 4;

    let objects = [];
    for (let i = 0; i < objectsNo; i++) {
        let size = Math.random();

        let geometry = new THREE.BoxBufferGeometry(size, size, size);
        let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        let cube = new THREE.Mesh(geometry, material);

        cube.translateZ(startZ);
        cube.translateX(minX + Math.random() * (maxX - minX));
        cube.translateY(minY + Math.random() * (maxY - minY));

        cube.castShadow = true;

        objects.push(cube);

    }

    return objects;
}

export function animateMeshes(delta, objects) {
    for (let mesh of objects) {

        mesh.position.z += delta * 0.5;
        // if (meshSet.spinning) {
        mesh.rotateX(delta * Math.PI * Math.random());
        mesh.rotateY(delta * Math.PI * Math.random());
        // }


    }
}

export function deleteMeshes(objects) {
    return true;
}
