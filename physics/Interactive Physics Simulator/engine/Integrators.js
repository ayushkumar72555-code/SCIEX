export const Integrators = {

    semiImplicitEuler(
        object,
        acceleration,
        dt
    ) {

        object.velocity =
            object.velocity.add(
                acceleration.multiply(dt)
            );

        object.position =
            object.position.add(
                object.velocity.multiply(dt)
            );

    },


    explicitEuler(
        object,
        acceleration,
        dt
    ) {

        object.position =
            object.position.add(
                object.velocity.multiply(dt)
            );

        object.velocity =
            object.velocity.add(
                acceleration.multiply(dt)
            );

    }

};