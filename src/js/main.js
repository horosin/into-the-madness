import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "three-orbitcontrols";

import { Film } from "./film.js"

import {
    createMeshesReg as createCubes,
    animateMeshes as animateCubes,
    deleteMeshes as deleteCubes } from './animations/spinning_cubes'

import {
    createFence,
    animateMeshes as animateFence,
    deleteMeshes as deleteFence } from './animations/fence'

import { createLights } from './lights'
import { createGround } from './ground'
import { createCharacter, fadeAction, animateCharacter } from './character'

var clock, container, camera, scene, renderer, controls, listener;
var audio = false;
const stats = true;

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

var loader = new THREE.JSONLoader(manager);



// var debug = true;
var debug = false;

window.addEventListener('load', init, false);

function init() {
    scene = createScene();

    createLights(scene);

    createGround(scene);

    let character = createCharacter(loader, scene);

    film = new Film(scene, character);
    registerAnimations(film);

}

function registerAnimations(film) {
    film.registerEvent(5, 20, createCubes, animateCubes, deleteCubes);
    film.registerEvent(10, 100, createFence, animateFence, deleteFence);
    film.registerEvent(20, 100, createCubes, animateCubes, deleteCubes);
    film.registerEvent(25, 100, createFence, animateFence, deleteFence);
    film.registerEvent(30, 100, createCubes, animateCubes, deleteCubes);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

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

    animateCharacter(delta);
    render(delta);
    if(stats) {
        window.stats.end();
    }
    requestAnimationFrame(animate);
}

function render(delta) {
    renderer.render(scene, camera);
}

function createScene() {
    clock = new THREE.Clock();

    let scene = new THREE.Scene();

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

    return scene;
}
