import { LoadingManager } from 'three';
import { audio } from '../config';
import * as THREE from "three";

export function Manager(animate) {
    const manager = new LoadingManager();
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

    return manager;
}

export function configureMusic(manager, camera) {
    // add song in bg
    if (audio) {
        const listener = new THREE.AudioListener();

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

}
