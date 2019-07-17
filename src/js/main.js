import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "three-orbitcontrols";

import { Film } from "./scene/film.js"

import {
    createMeshesReg as createCubes,
    animateMeshes as animateCubes,
    deleteMeshes as deleteCubes } from './animations/spinning_cubes'

import {
    createFence,
    animateMeshes as animateFence,
    deleteMeshes as deleteFence } from './animations/fence'

import { createLights } from './scene/lights'
import { createGround } from './scene/ground'
import { createCharacter, animateCharacter } from './character'
import { stats, controlsOn } from './config'
import { Manager, configureMusic } from './scene/utils'

const manager = Manager(animate);
var clock, container, camera, scene, renderer, controls;

var film;


// enable statistics
if(stats) {
    window.stats = new Stats();
    window.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(window.stats.dom);
}

function init() {
    scene = createScene();

    createLights(scene);

    createGround(scene);

    let character = createCharacter(manager, scene);

    film = new Film(scene, character);
    registerAnimations(film);

}
window.addEventListener('load', init, false);

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

function animate() {

    if(stats) {
        window.stats.begin();
    }

    let delta = clock.getDelta();
    let elapsed = clock.getElapsedTime();

    controls.update();

    film.animate(delta, elapsed);

    animateCharacter(delta, elapsed);
    render();
    if(stats) {
        window.stats.end();
    }
    requestAnimationFrame(animate);
}

function render() {
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

    configureMusic(manager, camera);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = controlsOn;

    return scene;
}
