class Film {

    constructor(scene, character) {

        console.log("Film instantiated");

        this.scene = scene;
        this.character = character;

        // array for meshsets
        this.meshSets = [];
        this.c1 = false;
        this.c2 = false;
        this.c3 = false;
        this.c4 = false;
        this.c5 = false;
        this.c6 = false;
        this.c7 = false;
        this.c8 = false;
        this.c9 = false;
        this.c10 = false;
    }

    createMeshes1(objectsNo = 30) {

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

        let meshSet = {};
        meshSet.meshes = objects;
        meshSet.spinning = true;

        this.meshSets.push(meshSet);

        // add all to scene
        for (let i = 0; i < objects.length; i++) {
            this.scene.add(objects[i]);
        }


    }

    /*
     * Create walls
     */
    createMeshes2(objectsNo = 100) {

        let meshSet = {};
        meshSet.meshes = [];

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

            meshSet.meshes.push(cube);
            this.scene.add(cube);

        }

        meshSet.spinning = false;

        this.meshSets.push(meshSet);
    }

    // create mini boxes
    // createMeshes30() {

    //     let meshSet = {};
    //     meshSet.meshes = [];

    //     var geometry = new THREE.CylinderBufferGeometry(2, 2, 2, 32, 1, true);
    //     var material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    //     material.side = THREE.BackSide;

    //     var cylinder = new THREE.Mesh(geometry, material);

    //     cylinder.rotateX(Math.PI / 2);

    //     meshSet.meshes.push(cylinder);
    //     meshSet.spinning = false;
    //     this.scene.add(cylinder);

    //     this.meshSets.push(meshSet);
    // }



    checkAndRemove() {

        for (let i = this.meshSets.length - 1; i > -1; i--) {
            let meshSet = this.meshSets[i];
            for (let j = meshSet.meshes.length - 1; j > -1; j--) {

                if (meshSet.meshes[j].position.z > 12) {
                    this.scene.remove(meshSet.meshes[j]);
                    meshSet.meshes.splice(j, 1);
                }
            }

            // remove set if empty
            if (meshSet.meshes.length < 1) {
                this.meshSets.splice(i, 1);
            }
        }
    }

    mover(delta) {

        for (let i = this.meshSets.length - 1; i > -1; i--) {
            let meshSet = this.meshSets[i];

            for (let j = meshSet.meshes.length - 1; j > -1; j--) {

                meshSet.meshes[j].position.z += delta * 0.5;
                if (meshSet.spinning) {
                    meshSet.meshes[j].rotateX(delta * Math.PI * Math.random());
                    meshSet.meshes[j].rotateY(delta * Math.PI * Math.random());
                }


            }

        }
    }


    animate(delta = 0.1, elapsed = 0) {

        // first, create stuff if needed
        if (!this.c1 && elapsed > 5) {

            this.createMeshes1();
            this.c1 = true;
        }

        if (!this.c2 && elapsed > 15) {
            this.createMeshes2();
            this.c2 = true;
        }

        if (!this.c3 && elapsed > 20) {

            this.createMeshes1();
            this.c3 = true;
        }

        if (!this.c4 && elapsed > 25) {
            this.createMeshes2();
            this.c4 = true;
        }

        if (!this.c5 && elapsed > 30) {

            this.createMeshes1();
            this.c5 = true;
        }

        if (!this.c6 && elapsed > 35) {
            this.createMeshes2();
            this.c6 = true;
        }

        if (!this.c7 && elapsed > 35) {

            this.createMeshes1();
            this.c7 = true;
        }

        if (!this.c8 && elapsed > 50) {
            this.createMeshes2();
            this.c8 = true;
        }

        if (!this.c9 && elapsed > 47) {

            this.createMeshes1();
            this.c9 = true;
        }

        if (!this.c10 && elapsed > 60) {
            this.createMeshes2();
            this.c10 = true;
        }

        // animate
        this.mover(delta);

        // check and remove
        this.checkAndRemove();


    }
};