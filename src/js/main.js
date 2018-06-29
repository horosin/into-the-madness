import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "three-orbitcontrols";

import { Film } from "./Film.js"

var clock, container, camera, scene, renderer, controls, listener;
var audio = false;
const stats = false;

var film;

// loading stuff
var manager = new THREE.LoadingManager();
manager.onStart = function(url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onLoad = function() {
    console.log('Loading complete!');
    animate();
};
manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onError = function(url) {
    console.log('There was an error loading ' + url);
};


// enable statistics
if(stats) {
    window.stats = new Stats();
    window.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(window.stats.dom);
}


var ground, character;
var light, ambientLight;
var textureLoader = new THREE.TextureLoader(manager);
var loader = new THREE.JSONLoader(manager);
var isLoaded = false;
var action = {},
    mixer;
var activeActionName = 'idle';

// var debug = true;
var debug = false;

var arrAnimations = [
    'idle',
    'walk',
    'run',
    'hello'
];
var actualAnimation = 0;

var colors = {
    background: 0x452C57,
    orange: 0xFFB300,
    grapefruit: 0xFF6136,
    pink: 0xCC0052,
    blue: 0x006E96
}

window.addEventListener('load', init, false);

function init() {
    createScene();

    createLights();

    createGround();

    createCharacter();

    film = new Film(scene, character);

}

function fadeAction(name) {
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

var walked = false,
    runned = false;

function animate() {

    if(stats) {
        window.stats.begin();
    }

    let delta = clock.getDelta();
    let elapsed = clock.getElapsedTime();
    //console.log(clock.getElapsedTime());

    controls.update();

    film.animate(delta, elapsed);


    if (!walked && elapsed > 5) {
        fadeAction('walk');
        walked = true;
    } else if (!runned && elapsed > 10) {
        fadeAction('run');
        runned = true;
    }


    render(delta);
    if(stats) {
        window.stats.end();
    }
    requestAnimationFrame(animate);
}

function render(delta) {
    if (isLoaded) {
        mixer.update(delta);
    }
    renderer.render(scene, camera);
}

function createScene() {
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(colors.background);

    //scene.fog = new THREE.Fog(colors.blue, 10, 950);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6);
    camera.lookAt(new THREE.Vector3(0, 20, 0));

    // add song in bg
    if (audio) {
        listener = new THREE.AudioListener();

        // create a global audio source
        var sound = new THREE.Audio(listener);
        var audioLoader = new THREE.AudioLoader(manager);

        //Load a sound and set it as the Audio object's buffer
        audioLoader.load('assets/music/song.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.play();
        });
        camera.add(listener);
    }

    controls = new OrbitControls(camera, renderer.domElement);
    //controls.target = new THREE.Vector3(0, 0.6, 0);
}

function createLights() {

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
    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    light.shadow.camera.near = 5;
    light.shadow.camera.far = 14;
    // light.shadow.camera.fov = 10;

    light.target.position.set(0, 0, 5);
    scene.add(light, light.target);
    light.target.updateMatrixWorld()

    // debug = true;
    if (debug) {
        var helper = new THREE.SpotLightHelper(light);
        scene.add(helper);

        var helper2 = new THREE.CameraHelper(light.shadow.camera);
        scene.add(helper2);
    }
}

function createGround() {
    var geometry = new THREE.PlaneBufferGeometry(100, 100);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshPhongMaterial({ color: colors.grapefruit });
    ground = new THREE.Mesh(geometry, material);

    ground.receiveShadow = true;
    ground.translateZ(5);
    scene.add(ground);
}

function createCharacter() {
    loader.load('assets/models/eva-animated.json', function(geometry, materials) {
        materials.forEach(function(material) {
            material.skinning = true;
        });

        character = new THREE.SkinnedMesh(
            geometry,
            new THREE.MeshFaceMaterial(materials)
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

        window.addEventListener('resize', onWindowResize, false);



        isLoaded = true;
        action.idle.play();
    });
}