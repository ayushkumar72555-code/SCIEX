export class Simulation {

    constructor({
        dt = 1 / 120,
        integrator
    }) {

        this.dt = dt;

        this.integrator =
            integrator;

        this.objects = [];

        this.forces = [];

        this.time = 0;

        this.running = false;

    }


    addObject(object) {

        this.objects.push(object);

        return object;

    }


    addForce(forceFunction) {

        this.forces.push(
            forceFunction
        );

    }


    clearForces() {

        this.forces = [];

    }


    step() {

        for (
            const object of this.objects
        ) {

            object.resetForces();

        }


        /*
         * Calculate every force
         * acting on every object.
         */

        for (
            const object of this.objects
        ) {

            for (
                const forceFunction
                of this.forces
            ) {

                const force =
                    forceFunction(
                        object,
                        this
                    );


                object.applyForce(
                    force
                );

            }

        }


        /*
         * Convert force → acceleration
         */

        for (
            const object of this.objects
        ) {

            const acceleration =
                object.calculateAcceleration();


            /*
             * Numerical integration
             */

            this.integrator(
                object,
                acceleration,
                this.dt
            );

        }


        this.time += this.dt;

    }


    reset() {

        this.time = 0;

        this.running = false;

    }


    start() {

        this.running = true;

    }


    pause() {

        this.running = false;

    }

}