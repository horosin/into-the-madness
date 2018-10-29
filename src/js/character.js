import * as THREE from "three";

let action = {};
var activeActionName = 'idle';
let mixer;
var isLoaded = false;

export function createCharacter(loader, scene) {
    let character;
    loader.load('assets/models/eva-animated.json', function(geometry, materials) {
        materials.forEach(function(material) {
            material.skinning = true;
        });

        character = new THREE.SkinnedMesh(
            geometry,
            materials
        );
        character.scale.set(0.5, 0.5, 0.5);
        mixer = new THREE.AnimationMixer(character);

        action.hello = mixer.clipAction(geometry.animations[0]);
        action.idle = mixer.clipAction(geometry.animations[1]);
        action.run = mixer.clipAction(geometry.animations[3]);
        action.walk = mixer.clipAction(geometry.animations[4]);

        action.hello.setEffectiveWeight(1);
        action.idle.setEffectiveWeight(1);
        action.run.setEffectiveWeight(1);
        action.walk.setEffectiveWeight(1);

        action.hello.setLoop(THREE.LoopOnce, 0);
        action.hello.clampWhenFinished = true;

        action.hello.enabled = true;
        action.idle.enabled = true;
        action.run.enabled = true;
        action.walk.enabled = true;

        character.castShadow = true;

        scene.add(character);
        character.rotateY(Math.PI);
        character.translateZ(-5);
        character.geometry.computeVertexNormals();
        // character.updateMatrixWorld();
        // character.computeFaceNormals();
        // shine dir light at our character
        // light.target = character;
        // scene.add(light.target);

        isLoaded = true;
        action.idle.play();
    });
    return character;
}

export function fadeAction(name) {
    var from = action[activeActionName].play();
    var to = action[name].play();

    from.enabled = true;
    to.enabled = true;

    if (to.loop === THREE.LoopOnce) {
        to.reset();
    }

    from.crossFadeTo(to, 1.0);
    activeActionName = name;

}

export function animateCharacter(delta) {
    if (isLoaded) {
        mixer.update(delta);
    }
}
