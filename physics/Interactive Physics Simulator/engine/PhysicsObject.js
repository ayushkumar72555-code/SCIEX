import { Vector2 } from "./Vector2.js";

export class PhysicsObject {

    constructor({
        mass = 1,
        position = new Vector2(),
        velocity = new Vector2()
    } = {}) {

        if (mass <= 0) {
            throw new Error(
                "Mass must be greater than zero."
            );
        }

        this.mass = mass;

        this.position =
            position.clone();

        this.velocity =
            velocity.clone();

        this.acceleration =
            new Vector2();

        this.force =
            new Vector2();

    }


    resetForces() {

        this.force =
            new Vector2();

    }


    applyForce(force) {

        this.force =
            this.force.add(force);

    }


    calculateAcceleration() {

        this.acceleration =
            this.force.divide(
                this.mass
            );

        return this.acceleration;

    }

}