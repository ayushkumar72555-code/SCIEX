import { Vector2 } from "./Vector2.js";


export function gravity(
    object,
    gravitationalAcceleration = 9.81
) {

    return new Vector2(
        0,
        -object.mass *
        gravitationalAcceleration
    );

}


export function quadraticDrag(
    object,
    airDensity,
    dragCoefficient,
    area
) {

    const velocity =
        object.velocity;

    const speed =
        velocity.magnitude();


    if (speed === 0) {

        return new Vector2();

    }


    const coefficient =
        0.5 *
        airDensity *
        dragCoefficient *
        area;


    return velocity.multiply(
        -coefficient * speed
    );

}


export function friction(
    object,
    coefficient,
    normalForce
) {

    const speed =
        object.velocity.magnitude();


    if (speed === 0) {

        return new Vector2();

    }


    return object.velocity
        .normalize()
        .multiply(
            -coefficient *
            normalForce
        );

}


export function springForce(
    object,
    anchor,
    springConstant
) {

    const displacement =
        object.position.subtract(anchor);


    return displacement.multiply(
        -springConstant
    );

}