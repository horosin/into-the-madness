class Film {

    constructor(scene) {

        console.log("Film instantiated");

        this.scene = scene;

        // array for meshsets
        this.meshSets = [];
        this.c1 = false;
    }

    createMeshes1(objectsNo = 20) {

        // bounds for random placement
        let startZ = -3;
        let minX = -7;
        let maxX = 7;
        let minY = 0;
        let maxY = 5;

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

        this.meshSets.push(objects);

        // add all to scene
        for (let i = 0; i < objects.length; i++) {
            this.scene.add(objects[i]);
        }


    }

    checkAndRemove() {

        for (let i = this.meshSets.length - 1; i > -1; i--) {
            let meshSet = this.meshSets[i];

            for (let j = meshSet.length - 1; j > -1; j--) {

                if (meshSet[j].position.z > 12) {
                    this.scene.remove(meshSet[j]);
                    meshSet.splice(j, 1);
                }
            }

            // remove set if empty
            if (meshSet.length < 1) {
                this.meshSets.splice(i, 1);
            }
        }
    }

    mover(delta) {

        for (let i = this.meshSets.length - 1; i > -1; i--) {
            let meshSet = this.meshSets[i];

            for (let j = meshSet.length - 1; j > -1; j--) {

                meshSet[j].position.z += delta * 0.5;
                meshSet[j].rotateX(delta * Math.PI * Math.random());
                meshSet[j].rotateY(delta * Math.PI * Math.random());


            }

        }
    }


    animate(delta = 0.1, elapsed = 0) {

        // first, create stuff if needed
        if (!this.c1 && elapsed > 1) {

            this.createMeshes1();
            this.c1 = true;
        }


        // animate
        this.mover(delta);

        // check and remove
        this.checkAndRemove();


    }
};