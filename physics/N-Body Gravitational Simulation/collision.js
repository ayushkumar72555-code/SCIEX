/* =========================================================
   SCIEX
   N-BODY GRAVITATIONAL SIMULATION

   Collision Model:
   Elastic / partially elastic sphere collision

   This file is loaded after app.js and wraps the existing
   Velocity Verlet integration step.
========================================================= */

const COLLISION_RESTITUTION = 0.90;
const COLLISION_POSITION_CORRECTION = 0.80;
const COLLISION_SLOP = 1;


function resolveGravitationalCollisions() {

    const bodies = simulation.bodies;

    for (let i = 0; i < bodies.length; i++) {

        for (let j = i + 1; j < bodies.length; j++) {

            const A = bodies[i];
            const B = bodies[j];

            const dx = B.position.x - A.position.x;
            const dy = B.position.y - A.position.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            const minimumDistance =
                Math.max(0, A.radius + B.radius);

            if (minimumDistance <= 0 || distance > minimumDistance) {
                continue;
            }

            /*
               Prevent division by zero when two bodies are created
               at exactly the same position.
            */
            if (distance === 0) {
                distance = 1;
            }

            const nx = dx / distance;
            const ny = dy / distance;

            const relativeVelocityX =
                B.velocity.x - A.velocity.x;

            const relativeVelocityY =
                B.velocity.y - A.velocity.y;

            const relativeNormalVelocity =
                relativeVelocityX * nx +
                relativeVelocityY * ny;

            const inverseMassA =
                1 / A.mass;

            const inverseMassB =
                1 / B.mass;

            const inverseMassSum =
                inverseMassA + inverseMassB;

            if (inverseMassSum <= 0) {
                continue;
            }

            /*
               Apply an impulse only when the bodies are moving
               toward one another. If they are already separating,
               positional correction below is still required.
            */
            if (relativeNormalVelocity < 0) {

                const impulseMagnitude =
                    -(
                        1 + COLLISION_RESTITUTION
                    ) *
                    relativeNormalVelocity /
                    inverseMassSum;

                const impulseX =
                    impulseMagnitude * nx;

                const impulseY =
                    impulseMagnitude * ny;

                A.velocity.x -=
                    impulseX * inverseMassA;

                A.velocity.y -=
                    impulseY * inverseMassA;

                B.velocity.x +=
                    impulseX * inverseMassB;

                B.velocity.y +=
                    impulseY * inverseMassB;

            }

            /*
               Separate overlapping bodies so the same collision
               cannot be repeatedly resolved on every frame.
            */
            const penetration =
                minimumDistance - distance;

            if (penetration > COLLISION_SLOP) {

                const correction =
                    (
                        penetration -
                        COLLISION_SLOP
                    ) *
                    COLLISION_POSITION_CORRECTION /
                    inverseMassSum;

                A.position.x -=
                    correction *
                    nx *
                    inverseMassA;

                A.position.y -=
                    correction *
                    ny *
                    inverseMassA;

                B.position.x +=
                    correction *
                    nx *
                    inverseMassB;

                B.position.y +=
                    correction *
                    ny *
                    inverseMassB;

            }

        }

    }

    calculateAccelerations();
}


/*
   Keep the existing simulator untouched while adding collision
   handling after every Velocity Verlet step.
*/
const sciExOriginalIntegrate = integrate;

integrate = function (dt) {

    sciExOriginalIntegrate(dt);
    resolveGravitationalCollisions();

};


console.log(
    "SCIEX N-body collision physics enabled."
);