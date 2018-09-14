export class Film {

    constructor(scene, character) {

        console.debug("Film instantiated");

        this.timeline = [];
        this.events = [];
        this.currentlyAnimated = [];

        this.scene = scene;
        this.character = character;

    }

    registerEvent(beg, end, eventCreator, eventAnimator, eventCleaner) {

        // Register event in event array
        let eventId = this.events.push({
            creator: eventCreator,
            animator: eventAnimator,
            cleaner: eventCleaner,
            objects: {}
        }) - 1;

        // Register event start
        if (this.timeline[beg] === undefined ) {
            this.timeline[beg] = {
                time: beg,
                start: [],
                stop: []
            }
        }
        this.timeline[beg].start.push(eventId);

        // Register event end
        if (this.timeline[end] === undefined ) {
            this.timeline[end] = {
                time: end,
                start: [],
                stop: []
            }
        }
        this.timeline[end].stop.push(eventId);

    }

    getNextTimepoint(arr) {
        return this.timeline.findIndex(e => !!e); 
    }

    /**
     * Check if objects are used and remove if not
     * TODO: Needs to be adjusted to the new version
     */
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

    startEvents(events) {
        for (let event of events) {
            console.debug(`Starting event ${event}`);
            this.events[event].objects = this.events[event].creator()
            for (let i = 0; i < this.events[event].objects.length; i++) {
                this.scene.add(this.events[event].objects[i]);
            }
        }
        this.currentlyAnimated = this.currentlyAnimated.concat(events);
    }

    animateEvents(delta) {

        for (let event of this.currentlyAnimated) {
            let objs = this.events[event].objects;
            this.events[event].animator(delta, objs);
        }

    }

    stopEvents(events) {
        for (let event of events) {
            console.debug(`Halting event ${event}`);
            let idx = this.currentlyAnimated.indexOf(event);
            this.currentlyAnimated.splice(idx, 1);

            this.events[event].cleaner();
            
            for (let obj of this.events[event].objects) {
                this.scene.remove(obj);
            }
        }
    }

    handleEventStartStop(elapsed) {
        let nxt = this.getNextTimepoint();
        if (nxt !== -1) {
            let timepoint = this.timeline[nxt]
            if (elapsed > timepoint.time) {
                console.debug("timepoint")
                
                this.startEvents(timepoint.start);
                this.stopEvents(timepoint.stop);

                delete this.timeline[nxt];
            }
        }
    }

    animate(delta = 0.1, elapsed = 0) {

        this.handleEventStartStop(elapsed);

        this.animateEvents(delta);

    }
};