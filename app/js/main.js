
var clock, container, camera, scene, renderer, controls, listener;

var manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
manager.onLoad = function ( ) {
  console.log( 'Loading complete!');
  animate();
};
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

// enable statistics
window.stats = new Stats();
window.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( window.stats.dom );


var ground, character;
var light, ambientLight;
var textureLoader = new THREE.TextureLoader(manager);
var loader = new THREE.JSONLoader(manager);
var isLoaded = false;
var action = {}, mixer;
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

function animate() {
  
  window.stats.begin();  
  
  controls.update();
  render();

  window.stats.end();
  requestAnimationFrame(animate);
}

function render() {
  var delta = clock.getDelta();
  if(isLoaded) {
    mixer.update(delta);
  }
  renderer.render(scene, camera);
}

function createScene() {
  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color( colors.background );
  
  scene.fog = new THREE.Fog(colors.blue, 100, 950);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 10);
  //camera.lookAt(new THREE.Vector3(0, 20, 10));

  // Enable shadow rendering
	renderer.shadowMap.enabled = true;

  listener = new THREE.AudioListener();
  camera.add(listener);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.target = new THREE.Vector3(0, 0.6, 0);
}

function createLights() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(0,5,10);
  //light.castShadow = true;  
  light.target.position.set(0,5,0);
  scene.add(light, light.target );


  if( debug ) {
    var helper = new THREE.DirectionalLightHelper( light, 5 );
    scene.add( helper );
  }
}

function createGround() {
  textureLoader.load('textures/ground.png', function (texture) {
    var geometry = new THREE.PlaneBufferGeometry(15, 2);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshStandardMaterial({ map: texture });
    ground = new THREE.Mesh(geometry, material);
    ground.translateZ(5);
    scene.add(ground);
  });
}

function createCharacter() {
  loader.load('./models/eva-animated.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    character = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    character.rotateY(Math.PI);
    character.translateZ(-5);

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

    scene.add(character);

    // shine dir light at our character
    // light.target = character;
    // scene.add(light.target);

    window.addEventListener('resize', onWindowResize, false);

    

    isLoaded = true;
    action.idle.play();
    fadeAction('walk');
    fadeAction('run');
  });
}