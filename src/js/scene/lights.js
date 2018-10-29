import * as THREE from 'three';
import { debug } from '../config';

export function createLights(scene) {

    var light, ambientLight;

    if (debug) {
        ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
    }
    light = new THREE.SpotLight(
        0xffffff, // color
        2, // intensity
        27, // distance
        Math.PI / 10, // minimum angle
        0.2, // penumbra
        0 // light dims
    );
    light.position.set(0, 10, 7);

    // set up shadows for desired mood
    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    light.shadow.camera.near = 5;
    light.shadow.camera.far = 14;

    light.target.position.set(0, 0, 5);

    scene.add(light, light.target);
    light.target.updateMatrixWorld()

    // show development helpers
    if (debug) {
        var helper = new THREE.SpotLightHelper(light);
        scene.add(helper);

        var helper2 = new THREE.CameraHelper(light.shadow.camera);
        scene.add(helper2);
    }
}
