/* =========================================================
   SCIEX PHYSICS
   Version 0.7

   Added:
   - Analysis tabs
   - Final result calculation
   - Step-by-step mathematical derivation
   - Numerical substitution
========================================================= */


/* =========================================================
   CANVAS
========================================================= */

const canvas =
    document.getElementById(
        "simulationCanvas"
    );

const ctx =
    canvas.getContext("2d");


const positionGraph =
    document.getElementById(
        "positionGraph"
    );

const velocityGraph =
    document.getElementById(
        "velocityGraph"
    );

const energyGraph =
    document.getElementById(
        "energyGraph"
    );


const positionCtx =
    positionGraph.getContext("2d");

const velocityCtx =
    velocityGraph.getContext("2d");

const energyCtx =
    energyGraph.getContext("2d");


/* =========================================================
   BUTTONS
========================================================= */

const startButton =
    document.getElementById(
        "startButton"
    );

const pauseButton =
    document.getElementById(
        "pauseButton"
    );

const resetButton =
    document.getElementById(
        "resetButton"
    );


/* =========================================================
   INPUTS
========================================================= */

const experimentInput =
    document.getElementById(
        "experiment"
    );

const modelInput =
    document.getElementById(
        "model"
    );


const velocityInput =
    document.getElementById(
        "velocity"
    );

const angleInput =
    document.getElementById(
        "angle"
    );

const heightInput =
    document.getElementById(
        "height"
    );

const freefallVelocityInput =
    document.getElementById(
        "freefallVelocity"
    );


const inclineAngleInput =
    document.getElementById(
        "inclineAngle"
    );

const inclineLengthInput =
    document.getElementById(
        "inclineLength"
    );

const inclineVelocityInput =
    document.getElementById(
        "inclineVelocity"
    );

const staticFrictionInput =
    document.getElementById(
        "staticFriction"
    );

const kineticFrictionInput =
    document.getElementById(
        "kineticFriction"
    );


const gravityInput =
    document.getElementById(
        "gravity"
    );

const massInput =
    document.getElementById(
        "mass"
    );


const airDensityInput =
    document.getElementById(
        "airDensity"
    );

const dragCoefficientInput =
    document.getElementById(
        "dragCoefficient"
    );

const areaInput =
    document.getElementById(
        "area"
    );


/* =========================================================
   CONTROL GROUPS
========================================================= */

const projectileControls =
    document.getElementById(
        "projectileControls"
    );

const freefallControls =
    document.getElementById(
        "freefallControls"
    );

const inclineControls =
    document.getElementById(
        "inclineControls"
    );

const dragControls =
    document.getElementById(
        "dragControls"
    );


/* =========================================================
   TEXT ELEMENTS
========================================================= */

const statusElement =
    document.getElementById(
        "status"
    );

const modelBadge =
    document.getElementById(
        "modelBadge"
    );

const experimentTitle =
    document.getElementById(
        "experimentTitle"
    );

const experimentDescription =
    document.getElementById(
        "experimentDescription"
    );


/* =========================================================
   VALUE ELEMENTS
========================================================= */

const velocityValue =
    document.getElementById(
        "velocityValue"
    );

const angleValue =
    document.getElementById(
        "angleValue"
    );

const heightValue =
    document.getElementById(
        "heightValue"
    );

const freefallVelocityValue =
    document.getElementById(
        "freefallVelocityValue"
    );


const inclineAngleValue =
    document.getElementById(
        "inclineAngleValue"
    );

const inclineLengthValue =
    document.getElementById(
        "inclineLengthValue"
    );

const inclineVelocityValue =
    document.getElementById(
        "inclineVelocityValue"
    );

const staticFrictionValue =
    document.getElementById(
        "staticFrictionValue"
    );

const kineticFrictionValue =
    document.getElementById(
        "kineticFrictionValue"
    );


const gravityValue =
    document.getElementById(
        "gravityValue"
    );

const massValue =
    document.getElementById(
        "massValue"
    );

const airDensityValue =
    document.getElementById(
        "airDensityValue"
    );

const dragCoefficientValue =
    document.getElementById(
        "dragCoefficientValue"
    );

const areaValue =
    document.getElementById(
        "areaValue"
    );


/* =========================================================
   DATA
========================================================= */

const timeElement =
    document.getElementById(
        "time"
    );

const xElement =
    document.getElementById(
        "xPosition"
    );

const yElement =
    document.getElementById(
        "yPosition"
    );

const speedElement =
    document.getElementById(
        "speed"
    );

const accelerationElement =
    document.getElementById(
        "acceleration"
    );

const maxHeightElement =
    document.getElementById(
        "maxHeight"
    );

const rangeElement =
    document.getElementById(
        "range"
    );

const flightTimeElement =
    document.getElementById(
        "flightTime"
    );

const impactSpeedElement =
    document.getElementById(
        "impactSpeed"
    );

const normalForceElement =
    document.getElementById(
        "normalForce"
    );

const frictionForceElement =
    document.getElementById(
        "frictionForce"
    );

const kineticEnergyElement =
    document.getElementById(
        "kineticEnergy"
    );

const potentialEnergyElement =
    document.getElementById(
        "potentialEnergy"
    );

const totalEnergyElement =
    document.getElementById(
        "totalEnergy"
    );

const momentumElement =
    document.getElementById(
        "momentum"
    );


const positionLabel =
    document.getElementById(
        "positionLabel"
    );

const heightLabel =
    document.getElementById(
        "heightLabel"
    );

const rangeLabel =
    document.getElementById(
        "rangeLabel"
    );


const equations =
    document.getElementById(
        "equations"
    );


/* =========================================================
   ANALYSIS
========================================================= */

const calculationContent =
    document.getElementById(
        "calculationContent"
    );


const analysisTabs =
    document.querySelectorAll(
        ".analysis-tab"
    );

const analysisContents =
    document.querySelectorAll(
        ".analysis-content"
    );


analysisTabs.forEach(

    tab => {

        tab.addEventListener(

            "click",

            () => {

                const target =
                    tab.dataset.tab;


                analysisTabs.forEach(

                    other => {

                        other.classList.remove(
                            "active"
                        );

                    }

                );


                analysisContents.forEach(

                    content => {

                        content.classList.remove(
                            "active"
                        );

                    }

                );


                tab.classList.add(
                    "active"
                );


                document
                    .getElementById(target)
                    .classList.add(
                        "active"
                    );

            }

        );

    }

);


/* =========================================================
   VECTOR
========================================================= */

class Vector2 {

    constructor(
        x = 0,
        y = 0
    ) {

        this.x = x;

        this.y = y;

    }


    add(vector) {

        return new Vector2(

            this.x +
            vector.x,

            this.y +
            vector.y

        );

    }


    multiply(number) {

        return new Vector2(

            this.x *
            number,

            this.y *
            number

        );

    }


    magnitude() {

        return Math.sqrt(

            this.x *
            this.x +

            this.y *
            this.y

        );

    }

}


/* =========================================================
   PHYSICS OBJECT
========================================================= */

class PhysicsObject {

    constructor() {

        this.mass =
            1;

        this.position =
            new Vector2();

        this.velocity =
            new Vector2();

        this.acceleration =
            new Vector2();

        this.force =
            new Vector2();

    }


    resetForce() {

        this.force =
            new Vector2();

    }


    applyForce(force) {

        this.force =
            this.force.add(
                force
            );

    }


    calculateAcceleration() {

        this.acceleration =
            this.force.multiply(
                1 /
                this.mass
            );

    }

}


/* =========================================================
   SIMULATION
========================================================= */

const simulation = {

    experiment:
        "projectile",

    object:
        new PhysicsObject(),

    time:
        0,

    running:
        false,

    finished:
        false,

    maxHeight:
        0,

    range:
        0,

    flightTime:
        0,

    impactSpeed:
        0,

    normalForce:
        0,

    frictionForce:
        0,

    inclineDistance:
        0,

    inclineMoving:
        false,

    inclineStuck:
        false,

    trajectory: [],

    history: {

        time: [],

        x: [],

        y: [],

        speed: [],

        velocityX: [],

        velocityY: [],

        acceleration: [],

        kineticEnergy: [],

        potentialEnergy: [],

        totalEnergy: []

    }

};


/* =========================================================
   PARAMETERS
========================================================= */

function getParameters() {

    return {

        experiment:
            experimentInput.value,

        model:
            modelInput.value,

        velocity:
            Number(
                velocityInput.value
            ),

        angle:
            Number(
                angleInput.value
            ),

        height:
            Number(
                heightInput.value
            ),

        freefallVelocity:
            Number(
                freefallVelocityInput.value
            ),

        inclineAngle:
            Number(
                inclineAngleInput.value
            ),

        inclineLength:
            Number(
                inclineLengthInput.value
            ),

        inclineVelocity:
            Number(
                inclineVelocityInput.value
            ),

        staticFriction:
            Number(
                staticFrictionInput.value
            ),

        kineticFriction:
            Number(
                kineticFrictionInput.value
            ),

        gravity:
            Number(
                gravityInput.value
            ),

        mass:
            Number(
                massInput.value
            ),

        airDensity:
            Number(
                airDensityInput.value
            ),

        dragCoefficient:
            Number(
                dragCoefficientInput.value
            ),

        area:
            Number(
                areaInput.value
            )

    };

}


/* =========================================================
   INITIALIZE
========================================================= */

function initialize() {

    const p =
        getParameters();


    const object =
        new PhysicsObject();


    object.mass =
        p.mass;


    if (
        p.experiment ===
        "projectile"
    ) {

        const angle =
            p.angle *
            Math.PI /
            180;


        object.position =
            new Vector2(
                0,
                0
            );


        object.velocity =
            new Vector2(

                p.velocity *
                Math.cos(angle),

                p.velocity *
                Math.sin(angle)

            );

    }


    else if (
        p.experiment ===
        "freefall"
    ) {

        object.position =
            new Vector2(
                0,
                p.height
            );


        object.velocity =
            new Vector2(

                0,

                p.freefallVelocity

            );

    }


    else {

        object.position =
            new Vector2(
                0,
                0
            );


        object.velocity =
            new Vector2(

                p.inclineVelocity,

                0

            );

    }


    object.acceleration =
        new Vector2(
            0,
            0
        );


    simulation.experiment =
        p.experiment;


    simulation.object =
        object;


    simulation.time =
        0;


    simulation.running =
        false;


    simulation.finished =
        false;


    simulation.maxHeight =

        p.experiment ===
        "freefall"

            ? p.height

            : 0;


    simulation.range =
        0;


    simulation.flightTime =
        0;


    simulation.impactSpeed =
        0;


    simulation.normalForce =
        0;


    simulation.frictionForce =
        0;


    simulation.inclineDistance =
        0;


    simulation.inclineMoving =
        false;


    simulation.inclineStuck =
        false;


    simulation.trajectory = [

        {

            x:
                object.position.x,

            y:
                object.position.y

        }

    ];


    simulation.history = {

        time: [],

        x: [],

        y: [],

        speed: [],

        velocityX: [],

        velocityY: [],

        acceleration: [],

        kineticEnergy: [],

        potentialEnergy: [],

        totalEnergy: []

    };


    updateInterface();

    updateEquations();

    updateDisplay();

    recordHistory();

    updateCalculations();

    draw();

    drawGraphs();

}


/* =========================================================
   FORCE CALCULATIONS
========================================================= */

function calculateGravity() {

    const p =
        getParameters();


    return new Vector2(

        0,

        -simulation.object.mass *
        p.gravity

    );

}


function calculateDrag() {

    const p =
        getParameters();


    const object =
        simulation.object;


    const speed =
        object.velocity.magnitude();


    if (
        speed === 0
    ) {

        return new Vector2();

    }


    const coefficient =

        0.5 *
        p.airDensity *
        p.dragCoefficient *
        p.area;


    return object.velocity.multiply(

        -coefficient *
        speed

    );

}


/* =========================================================
   INCLINED PLANE
========================================================= */

function calculateInclinePhysics(
    dt
) {

    const p =
        getParameters();


    const object =
        simulation.object;


    const theta =
        p.inclineAngle *
        Math.PI /
        180;


    const mass =
        object.mass;


    const g =
        p.gravity;


    const normalForce =

        mass *
        g *
        Math.cos(theta);


    simulation.normalForce =
        normalForce;


    const gravityParallel =

        mass *
        g *
        Math.sin(theta);


    if (
        !simulation.inclineMoving
    ) {

        const maximumStaticFriction =

            p.staticFriction *
            normalForce;


        if (

            Math.abs(
                object.velocity.x
            ) < 0.0001 &&

            gravityParallel <=
            maximumStaticFriction

        ) {

            simulation.inclineStuck =
                true;


            simulation.frictionForce =
                gravityParallel;


            object.acceleration =
                new Vector2(
                    0,
                    0
                );


            object.velocity =
                new Vector2(
                    0,
                    0
                );


            return;

        }


        simulation.inclineMoving =
            true;

    }


    simulation.inclineStuck =
        false;


    const kineticFriction =

        p.kineticFriction *
        normalForce;


    let frictionDirection;


    if (
        object.velocity.x > 0.0001
    ) {

        frictionDirection =
            -1;

    }

    else if (
        object.velocity.x < -0.0001
    ) {

        frictionDirection =
            1;

    }

    else {

        frictionDirection =
            -1;

    }


    simulation.frictionForce =
        kineticFriction;


    let netForce =

        gravityParallel +

        frictionDirection *
        kineticFriction;


    if (
        p.model ===
        "drag"
    ) {

        const speed =
            Math.abs(
                object.velocity.x
            );


        if (
            speed > 0
        ) {

            const coefficient =

                0.5 *
                p.airDensity *
                p.dragCoefficient *
                p.area;


            const dragForce =

                coefficient *
                speed *
                speed;


            if (
                object.velocity.x > 0
            ) {

                netForce -=
                    dragForce;

            }

            else {

                netForce +=
                    dragForce;

            }

        }

    }


    const acceleration =
        netForce /
        mass;


    object.acceleration =
        new Vector2(
            acceleration,
            0
        );


    object.velocity.x +=

        acceleration *
        dt;


    if (

        Math.abs(
            object.velocity.x
        ) < 0.001 &&

        gravityParallel <=
        kineticFriction

    ) {

        object.velocity.x =
            0;

    }


    object.position.x +=

        object.velocity.x *
        dt;


    simulation.inclineDistance =
        object.position.x;


    if (
        object.position.x >=
        p.inclineLength
    ) {

        object.position.x =
            p.inclineLength;


        simulation.range =
            p.inclineLength;


        simulation.flightTime =
            simulation.time;


        simulation.impactSpeed =
            Math.abs(
                object.velocity.x
            );


        simulation.finished =
            true;


        simulation.running =
            false;


        statusElement.textContent =
            "Finished";

    }

}


/* =========================================================
   PHYSICS STEP
========================================================= */

function physicsStep(dt) {

    if (
        !simulation.running ||
        simulation.finished
    ) {

        return;

    }


    const p =
        getParameters();


    const object =
        simulation.object;


    if (
        p.experiment ===
        "incline"
    ) {

        calculateInclinePhysics(
            dt
        );


        simulation.time +=
            dt;


        simulation.trajectory.push({

            x:
                object.position.x,

            y:
                0

        });


        recordHistory();

        updateDisplay();

        updateCalculations();

        return;

    }


    object.resetForce();


    object.applyForce(
        calculateGravity()
    );


    if (
        p.model ===
        "drag"
    ) {

        object.applyForce(
            calculateDrag()
        );

    }


    object.calculateAcceleration();


    object.velocity =
        object.velocity.add(

            object.acceleration.multiply(
                dt
            )

        );


    object.position =
        object.position.add(

            object.velocity.multiply(
                dt
            )

        );


    simulation.time +=
        dt;


    simulation.maxHeight =

        Math.max(

            simulation.maxHeight,

            object.position.y

        );


    simulation.trajectory.push({

        x:
            object.position.x,

        y:
            Math.max(
                object.position.y,
                0
            )

    });


    if (

        object.position.y <= 0 &&

        simulation.time > 0.01

    ) {

        object.position.y =
            0;


        simulation.range =
            object.position.x;


        simulation.flightTime =
            simulation.time;


        simulation.impactSpeed =
            object.velocity.magnitude();


        simulation.finished =
            true;


        simulation.running =
            false;


        statusElement.textContent =
            "Finished";

    }


    recordHistory();

    updateDisplay();

    updateCalculations();

}


/* =========================================================
   HISTORY
========================================================= */

function recordHistory() {

    const p =
        getParameters();


    const object =
        simulation.object;


    const speed =
        object.velocity.magnitude();


    const kineticEnergy =

        0.5 *
        object.mass *
        speed *
        speed;


    let height;


    if (
        p.experiment ===
        "incline"
    ) {

        const theta =
            p.inclineAngle *
            Math.PI /
            180;


        height =

            (
                p.inclineLength -
                object.position.x
            ) *

            Math.sin(theta);

    }

    else {

        height =
            Math.max(
                object.position.y,
                0
            );

    }


    const potentialEnergy =

        object.mass *
        p.gravity *
        Math.max(
            height,
            0
        );


    const totalEnergy =

        kineticEnergy +
        potentialEnergy;


    simulation.history.time.push(
        simulation.time
    );


    simulation.history.x.push(
        object.position.x
    );


    simulation.history.y.push(
        height
    );


    simulation.history.speed.push(
        speed
    );


    simulation.history.velocityX.push(
        object.velocity.x
    );


    simulation.history.velocityY.push(
        object.velocity.y
    );


    simulation.history.acceleration.push(

        object.acceleration.magnitude()

    );


    simulation.history.kineticEnergy.push(
        kineticEnergy
    );


    simulation.history.potentialEnergy.push(
        potentialEnergy
    );


    simulation.history.totalEnergy.push(
        totalEnergy
    );

}


/* =========================================================
   INTERFACE
========================================================= */

function updateInterface() {

    const p =
        getParameters();


    const projectile =
        p.experiment ===
        "projectile";


    const freefall =
        p.experiment ===
        "freefall";


    const incline =
        p.experiment ===
        "incline";


    projectileControls.classList.toggle(
        "hidden",
        !projectile
    );


    freefallControls.classList.toggle(
        "hidden",
        !freefall
    );


    inclineControls.classList.toggle(
        "hidden",
        !incline
    );


    dragControls.classList.toggle(

        "disabled",

        p.model !==
        "drag"

    );


    modelBadge.textContent =

        p.model ===
        "drag"

            ? "Air Resistance"

            : "Ideal";


    if (
        projectile
    ) {

        experimentTitle.textContent =
            "Projectile Motion";


        experimentDescription.textContent =
            "Two-dimensional motion under gravity.";


        positionLabel.textContent =
            "X Position";


        heightLabel.textContent =
            "Y Position";


        rangeLabel.textContent =
            "Range";

    }


    else if (
        freefall
    ) {

        experimentTitle.textContent =
            "Free Fall";


        experimentDescription.textContent =
            "Vertical motion under gravity.";


        positionLabel.textContent =
            "X Position";


        heightLabel.textContent =
            "Height";


        rangeLabel.textContent =
            "Horizontal Distance";

    }


    else {

        experimentTitle.textContent =
            "Inclined Plane";


        experimentDescription.textContent =
            "Motion of a block along an inclined surface.";


        positionLabel.textContent =
            "Distance Along Plane";


        heightLabel.textContent =
            "Vertical Height";


        rangeLabel.textContent =
            "Plane Distance";

    }

}


/* =========================================================
   DISPLAY
========================================================= */

function updateDisplay() {

    const p =
        getParameters();


    const object =
        simulation.object;


    velocityValue.textContent =
        p.velocity.toFixed(1);


    angleValue.textContent =
        p.angle.toFixed(0);


    heightValue.textContent =
        p.height.toFixed(0);


    freefallVelocityValue.textContent =
        p.freefallVelocity.toFixed(1);


    inclineAngleValue.textContent =
        p.inclineAngle.toFixed(0);


    inclineLengthValue.textContent =
        p.inclineLength.toFixed(0);


    inclineVelocityValue.textContent =
        p.inclineVelocity.toFixed(1);


    staticFrictionValue.textContent =
        p.staticFriction.toFixed(2);


    kineticFrictionValue.textContent =
        p.kineticFriction.toFixed(2);


    gravityValue.textContent =
        p.gravity.toFixed(2);


    massValue.textContent =
        p.mass.toFixed(2);


    airDensityValue.textContent =
        p.airDensity.toFixed(3);


    dragCoefficientValue.textContent =
        p.dragCoefficient.toFixed(2);


    areaValue.textContent =
        p.area.toFixed(3);


    timeElement.textContent =
        simulation.time.toFixed(2)
        + " s";


    xElement.textContent =
        object.position.x.toFixed(2)
        + " m";


    let physicalHeight;


    if (
        p.experiment ===
        "incline"
    ) {

        const theta =
            p.inclineAngle *
            Math.PI /
            180;


        physicalHeight =

            (
                p.inclineLength -
                object.position.x
            ) *

            Math.sin(theta);

    }

    else {

        physicalHeight =
            object.position.y;

    }


    yElement.textContent =

        Math.max(
            physicalHeight,
            0
        ).toFixed(2)
        + " m";


    const speed =
        object.velocity.magnitude();


    speedElement.textContent =
        speed.toFixed(2)
        + " m/s";


    accelerationElement.textContent =

        object.acceleration
            .magnitude()
            .toFixed(2)
        + " m/s²";


    maxHeightElement.textContent =

        Math.max(
            simulation.maxHeight,
            0
        ).toFixed(2)
        + " m";


    rangeElement.textContent =
        simulation.range.toFixed(2)
        + " m";


    flightTimeElement.textContent =
        simulation.flightTime.toFixed(2)
        + " s";


    impactSpeedElement.textContent =
        simulation.impactSpeed.toFixed(2)
        + " m/s";


    normalForceElement.textContent =
        simulation.normalForce.toFixed(2)
        + " N";


    frictionForceElement.textContent =
        simulation.frictionForce.toFixed(2)
        + " N";


    const kineticEnergy =

        0.5 *
        object.mass *
        speed *
        speed;


    kineticEnergyElement.textContent =
        kineticEnergy.toFixed(2)
        + " J";


    const potentialEnergy =

        object.mass *
        p.gravity *
        Math.max(
            physicalHeight,
            0
        );


    potentialEnergyElement.textContent =
        potentialEnergy.toFixed(2)
        + " J";


    totalEnergyElement.textContent =

        (
            kineticEnergy +
            potentialEnergy
        ).toFixed(2)
        + " J";


    momentumElement.textContent =

        (
            object.mass *
            speed
        ).toFixed(2)
        + " kg·m/s";

}


/* =========================================================
   CALCULATION HELPERS
========================================================= */

function fmt(
    value,
    digits = 3
) {

    if (
        !Number.isFinite(value)
    ) {

        return "0";

    }


    return Number(value)
        .toFixed(digits);

}


function step(
    number,
    title,
    equation,
    substitution,
    result,
    explanation
) {

    return `

        <div class="calculation-step">

            <div class="calculation-step-header">

                <span class="step-number">
                    ${number}
                </span>

                <span class="step-title">
                    ${title}
                </span>

            </div>


            <div class="math-line">

                ${equation}

            </div>


            <div class="math-line substitution">

                ${substitution}

            </div>


            <div class="math-line result">

                ${result}

            </div>


            <p class="calculation-explanation">

                ${explanation}

            </p>

        </div>

    `;

}


/* =========================================================
   CALCULATION ENGINE
========================================================= */

function updateCalculations() {

    const p =
        getParameters();


    if (
        p.experiment ===
        "incline"
    ) {

        generateInclineCalculations();

    }

    else if (
        p.experiment ===
        "freefall"
    ) {

        generateFreeFallCalculations();

    }

    else {

        generateProjectileCalculations();

    }

}


/* =========================================================
   INCLINED PLANE CALCULATIONS
========================================================= */

function generateInclineCalculations() {

    const p =
        getParameters();


    const theta =
        p.inclineAngle *
        Math.PI /
        180;


    const m =
        p.mass;


    const g =
        p.gravity;


    const normal =

        m *
        g *
        Math.cos(theta);


    const gravityParallel =

        m *
        g *
        Math.sin(theta);


    const maxStatic =

        p.staticFriction *
        normal;


    const kinetic =

        p.kineticFriction *
        normal;


    const willSlide =
        gravityParallel >
        maxStatic;


    const netForce =

        willSlide

            ? gravityParallel -
              kinetic

            : 0;


    const acceleration =

        willSlide

            ? netForce / m

            : 0;


    const heightDrop =

        p.inclineLength *
        Math.sin(theta);


    const finalVelocity =

        willSlide

            ? Math.sqrt(

                Math.max(

                    0,

                    p.inclineVelocity *
                    p.inclineVelocity +

                    2 *
                    acceleration *
                    p.inclineLength

                )

            )

            : p.inclineVelocity;


    const travelTime =

        willSlide &&
        acceleration > 0

            ? (

                -p.inclineVelocity +

                Math.sqrt(

                    p.inclineVelocity *
                    p.inclineVelocity +

                    2 *
                    acceleration *
                    p.inclineLength

                )

              ) /
              acceleration

            : 0;


    calculationContent.innerHTML = `

        <div class="calculation-container">


            ${step(

                1,

                "Resolve the angle",

                "θ = angle × π / 180",

                `θ = ${p.inclineAngle} × π / 180`,

                `θ = ${fmt(theta, 6)} rad`,

                "The slider gives the angle in degrees, while trigonometric functions use radians."

            )}


            ${step(

                2,

                "Calculate the normal force",

                "N = mg cosθ",

                `N = (${fmt(m, 3)})(${fmt(g, 3)})cos(${fmt(p.inclineAngle, 3)}°)`,

                `N = ${fmt(normal)} N`,

                "The normal force balances the component of gravitational force perpendicular to the plane."

            )}


            ${step(

                3,

                "Resolve gravity along the plane",

                "F∥ = mg sinθ",

                `F∥ = (${fmt(m, 3)})(${fmt(g, 3)})sin(${fmt(p.inclineAngle, 3)}°)`,

                `F∥ = ${fmt(gravityParallel)} N`,

                "This is the component of gravity pulling the object downhill."

            )}


            ${step(

                4,

                "Calculate maximum static friction",

                "fₛ,max = μₛN",

                `fₛ,max = (${fmt(p.staticFriction, 3)})(${fmt(normal, 3)})`,

                `fₛ,max = ${fmt(maxStatic)} N`,

                "Static friction adjusts up to this maximum value to prevent motion."

            )}


            ${step(

                5,

                "Determine whether the block moves",

                "Compare F∥ with fₛ,max",

                `${fmt(gravityParallel)} N ${willSlide ? ">" : "≤"} ${fmt(maxStatic)} N`,

                willSlide
                    ? "Block slides downhill"
                    : "Block remains at rest",

                willSlide
                    ? "Gravity along the plane exceeds the maximum static friction."
                    : "Static friction is sufficient to balance the downhill component of gravity."

            )}


            ${willSlide ? step(

                6,

                "Calculate kinetic friction",

                "fₖ = μₖN",

                `fₖ = (${fmt(p.kineticFriction, 3)})(${fmt(normal, 3)})`,

                `fₖ = ${fmt(kinetic)} N`,

                "Once the block is sliding, kinetic friction opposes the direction of motion."

            ) : ""}


            ${willSlide ? step(

                7,

                "Calculate net force",

                "Fnet = mg sinθ − fₖ",

                `Fnet = ${fmt(gravityParallel, 3)} − ${fmt(kinetic, 3)}`,

                `Fnet = ${fmt(netForce)} N`,

                "The net force is the downhill gravitational component minus kinetic friction."

            ) : ""}


            ${willSlide ? step(

                8,

                "Calculate acceleration",

                "a = Fnet / m",

                `a = ${fmt(netForce, 3)} / ${fmt(m, 3)}`,

                `a = ${fmt(acceleration)} m/s²`,

                "Newton's second law gives the acceleration of the block along the plane."

            ) : ""}


            ${willSlide ? step(

                9,

                "Calculate final velocity",

                "v² = u² + 2as",

                `v² = (${fmt(p.inclineVelocity, 3)})² + 2(${fmt(acceleration, 3)})(${fmt(p.inclineLength, 3)})`,

                `v = ${fmt(finalVelocity)} m/s`,

                "The kinematic equation gives the velocity when the block reaches the end of the plane."

            ) : ""}


            ${willSlide ? step(

                10,

                "Calculate travel time",

                "s = ut + ½at²",

                `${fmt(p.inclineLength, 3)} = (${fmt(p.inclineVelocity, 3)})t + ½(${fmt(acceleration, 3)})t²`,

                `t ≈ ${fmt(travelTime)} s`,

                "The positive physical root of the quadratic equation gives the travel time."

            ) : ""}


        </div>

    `;

}


/* =========================================================
   FREE FALL CALCULATIONS
========================================================= */

function generateFreeFallCalculations() {

    const p =
        getParameters();


    const h =
        p.height;


    const u =
        p.freefallVelocity;


    const g =
        p.gravity;


    const discriminant =

        u * u +
        2 * g * h;


    const t =

        g > 0

            ? (

                u +
                Math.sqrt(discriminant)

              ) /
              g

            : 0;


    const impactVelocity =

        u -
        g *
        t;


    const impactSpeed =
        Math.abs(
            impactVelocity
        );


    const potentialInitial =

        p.mass *
        g *
        h;


    const kineticFinal =

        0.5 *
        p.mass *
        impactSpeed *
        impactSpeed;


    calculationContent.innerHTML = `

        <div class="calculation-container">


            ${step(

                1,

                "Write the free-fall equation",

                "y = y₀ + ut − ½gt²",

                `0 = ${fmt(h, 3)} + (${fmt(u, 3)})t − ½(${fmt(g, 3)})t²`,

                "A quadratic equation in t",

                "The ground is chosen as y = 0."

            )}


            ${step(

                2,

                "Rearrange the equation",

                "½gt² − ut − y₀ = 0",

                `½(${fmt(g, 3)})t² − (${fmt(u, 3)})t − ${fmt(h, 3)} = 0`,

                `a=${fmt(0.5*g)}, b=${fmt(-u)}, c=${fmt(-h)}`,

                "This puts the equation into standard quadratic form."

            )}


            ${step(

                3,

                "Calculate the flight time",

                "t = [u + √(u² + 2gh)] / g",

                `t = [${fmt(u, 3)} + √((${fmt(u, 3)})² + 2(${fmt(g, 3)})(${fmt(h, 3)}))] / ${fmt(g, 3)}`,

                `t = ${fmt(t)} s`,

                "The positive root is selected because time after release must be positive."

            )}


            ${step(

                4,

                "Calculate impact velocity",

                "v = u − gt",

                `v = ${fmt(u, 3)} − (${fmt(g, 3)})(${fmt(t, 3)})`,

                `v = ${fmt(impactVelocity)} m/s`,

                "The negative sign indicates downward velocity under the chosen coordinate convention."

            )}


            ${step(

                5,

                "Calculate impact speed",

                "speed = |v|",

                `speed = |${fmt(impactVelocity, 3)}|`,

                `speed = ${fmt(impactSpeed)} m/s`,

                "Speed is the magnitude of velocity and is therefore positive."

            )}


            ${step(

                6,

                "Initial potential energy",

                "U = mgh",

                `U = (${fmt(p.mass, 3)})(${fmt(g, 3)})(${fmt(h, 3)})`,

                `U = ${fmt(potentialInitial)} J`,

                "The initial gravitational potential energy is measured relative to the ground."

            )}


            ${step(

                7,

                "Final kinetic energy",

                "K = ½mv²",

                `K = ½(${fmt(p.mass, 3)})(${fmt(impactSpeed, 3)})²`,

                `K = ${fmt(kineticFinal)} J`,

                "For ideal free fall, the initial potential energy should approximately equal the final kinetic energy."

            )}

        </div>

    `;

}


/* =========================================================
   PROJECTILE CALCULATIONS
========================================================= */

function generateProjectileCalculations() {

    const p =
        getParameters();


    const theta =
        p.angle *
        Math.PI /
        180;


    const vx =
        p.velocity *
        Math.cos(theta);


    const vy =
        p.velocity *
        Math.sin(theta);


    const g =
        p.gravity;


    const flightTime =

        g > 0

            ? 2 * vy / g

            : 0;


    const maxHeight =

        g > 0

            ? vy * vy /
              (2 * g)

            : 0;


    const range =

        vx *
        flightTime;


    const finalVerticalVelocity =

        vy -
        g *
        flightTime;


    const impactSpeed =

        Math.sqrt(

            vx * vx +

            finalVerticalVelocity *
            finalVerticalVelocity

        );


    calculationContent.innerHTML = `

        <div class="calculation-container">


            ${step(

                1,

                "Resolve the launch angle",

                "θ = angle × π / 180",

                `θ = ${fmt(p.angle, 3)} × π / 180`,

                `θ = ${fmt(theta, 6)} rad`,

                "The angle is converted from degrees to radians for the trigonometric calculations."

            )}


            ${step(

                2,

                "Horizontal velocity",

                "vₓ = v₀ cosθ",

                `vₓ = (${fmt(p.velocity, 3)})cos(${fmt(p.angle, 3)}°)`,

                `vₓ = ${fmt(vx)} m/s`,

                "Horizontal velocity remains constant in the ideal model."

            )}


            ${step(

                3,

                "Vertical velocity",

                "vᵧ = v₀ sinθ",

                `vᵧ = (${fmt(p.velocity, 3)})sin(${fmt(p.angle, 3)}°)`,

                `vᵧ = ${fmt(vy)} m/s`,

                "The vertical component determines the height and flight time."

            )}


            ${step(

                4,

                "Time of flight",

                "T = 2vᵧ / g",

                `T = 2(${fmt(vy, 3)}) / ${fmt(g, 3)}`,

                `T = ${fmt(flightTime)} s`,

                "This assumes the projectile lands at the same vertical level from which it was launched."

            )}


            ${step(

                5,

                "Maximum height",

                "H = vᵧ² / 2g",

                `H = (${fmt(vy, 3)})² / [2(${fmt(g, 3)})]`,

                `H = ${fmt(maxHeight)} m`,

                "At maximum height the vertical velocity becomes zero."

            )}


            ${step(

                6,

                "Horizontal range",

                "R = vₓT",

                `R = (${fmt(vx, 3)})(${fmt(flightTime, 3)})`,

                `R = ${fmt(range)} m`,

                "The horizontal range is the horizontal velocity multiplied by the total flight time."

            )}


            ${step(

                7,

                "Impact velocity",

                "vᵧ,f = vᵧ − gT",

                `vᵧ,f = ${fmt(vy, 3)} − (${fmt(g, 3)})(${fmt(flightTime, 3)})`,

                `vᵧ,f = ${fmt(finalVerticalVelocity)} m/s`,

                "The vertical velocity reverses sign because the projectile is moving downward at impact."

            )}


            ${step(

                8,

                "Impact speed",

                "v = √(vₓ² + vᵧ²)",

                `v = √[(${fmt(vx, 3)})² + (${fmt(finalVerticalVelocity, 3)})²]`,

                `v = ${fmt(impactSpeed)} m/s`,

                "The magnitude of the velocity vector gives the impact speed."

            )}

        </div>

    `;

}



/* =========================================================
   EQUATIONS PANEL
========================================================= */

function updateEquations() {

    const p =
        getParameters();


    if (
        p.experiment ===
        "projectile"
    ) {

        equations.innerHTML = `

            <div class="equation-card">

                <h3>
                    Projectile Motion
                </h3>

                <div class="equation">
                    F<sub>g</sub> = mg
                </div>

                <div class="equation">
                    x(t)
                    =
                    v<sub>0</sub>cosθt
                </div>

                <div class="equation">
                    y(t)
                    =
                    v<sub>0</sub>sinθt
                    −
                    ½gt²
                </div>

                <p class="note">
                    The detailed numerical calculation
                    is available under
                    Step-by-Step Calculation.
                </p>

            </div>

        `;

    }


    else if (
        p.experiment ===
        "freefall"
    ) {

        equations.innerHTML = `

            <div class="equation-card">

                <h3>
                    Free Fall
                </h3>

                <div class="equation">
                    y(t)
                    =
                    y₀ + v₀t − ½gt²
                </div>

                <div class="equation">
                    v(t)
                    =
                    v₀ − gt
                </div>

                <div class="equation">
                    U = mgh
                </div>

                <div class="equation">
                    K = ½mv²
                </div>

                <p class="note">
                    In ideal free fall, mass does not
                    affect acceleration or fall time.
                </p>

            </div>

        `;

    }


    else {

        const theta =
            p.inclineAngle *
            Math.PI /
            180;


        const normal =

            p.mass *
            p.gravity *
            Math.cos(theta);


        const parallel =

            p.mass *
            p.gravity *
            Math.sin(theta);


        const staticLimit =

            p.staticFriction *
            normal;


        equations.innerHTML = `

            <div class="equation-card">

                <h3>
                    Inclined Plane
                </h3>

                <div class="equation">
                    F<sub>g,∥</sub>
                    =
                    mg sinθ
                </div>

                <div class="equation">
                    N
                    =
                    mg cosθ
                </div>

                <div class="equation">
                    f<sub>k</sub>
                    =
                    μ<sub>k</sub>N
                </div>

                <div class="equation">
                    a
                    =
                    g(
                    sinθ
                    −
                    μ<sub>k</sub>cosθ
                    )
                </div>


                <div class="force-summary">

                    <div class="force-item">

                        <span>
                            Gravity Parallel
                        </span>

                        <strong>
                            ${fmt(parallel)}
                            N
                        </strong>

                    </div>


                    <div class="force-item">

                        <span>
                            Normal Force
                        </span>

                        <strong>
                            ${fmt(normal)}
                            N
                        </strong>

                    </div>


                    <div class="force-item">

                        <span>
                            Maximum Static Friction
                        </span>

                        <strong>
                            ${fmt(staticLimit)}
                            N
                        </strong>

                    </div>

                </div>


                <p class="note">

                    Open Step-by-Step Calculation
                    for the complete numerical derivation.

                </p>

            </div>

        `;

    }

}


/* =========================================================
   CANVAS
========================================================= */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        rect.width *
        dpr;


    canvas.height =
        rect.height *
        dpr;


    ctx.setTransform(

        dpr,
        0,
        0,
        dpr,
        0,
        0

    );


    draw();

}


/* =========================================================
   GRAPH RESIZE
========================================================= */

function resizeGraphCanvas(
    graph
) {

    const rect =
        graph.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio ||
        1;


    graph.width =
        rect.width *
        dpr;


    graph.height =
        rect.height *
        dpr;


    const context =
        graph.getContext(
            "2d"
        );


    context.setTransform(

        dpr,
        0,
        0,
        dpr,
        0,
        0

    );

}


function resizeGraphs() {

    resizeGraphCanvas(
        positionGraph
    );


    resizeGraphCanvas(
        velocityGraph
    );


    resizeGraphCanvas(
        energyGraph
    );


    drawGraphs();

}


/* =========================================================
   SCALE
========================================================= */

function getScale() {

    const p =
        getParameters();


    let maxX =
        10;

    let maxY =
        10;


    if (
        p.experiment ===
        "incline"
    ) {

        maxX =
            p.inclineLength;


        maxY =

            p.inclineLength *
            Math.sin(
                p.inclineAngle *
                Math.PI /
                180
            );

    }

    else {

        for (
            const point
            of simulation.trajectory
        ) {

            maxX =
                Math.max(
                    maxX,
                    Math.abs(point.x)
                );


            maxY =
                Math.max(
                    maxY,
                    point.y
                );

        }


        if (
            p.experiment ===
            "projectile"
        ) {

            const theta =
                p.angle *
                Math.PI /
                180;


            if (
                p.gravity > 0
            ) {

                maxX =

                    Math.max(

                        maxX,

                        p.velocity *
                        p.velocity *
                        Math.sin(
                            2 * theta
                        ) /
                        p.gravity

                    );


                maxY =

                    Math.max(

                        maxY,

                        Math.pow(

                            p.velocity *
                            Math.sin(theta),

                            2

                        ) /

                        (
                            2 *
                            p.gravity
                        )

                    );

            }

        }

        else {

            maxY =
                Math.max(
                    maxY,
                    p.height
                );

        }

    }


    const width =
        canvas.clientWidth -
        60;


    const height =
        canvas.clientHeight -
        60;


    return Math.min(

        width /
        Math.max(
            maxX * 1.15,
            10
        ),

        height /
        Math.max(
            maxY * 1.25,
            10
        )

    );

}


/* =========================================================
   WORLD → SCREEN
========================================================= */

function worldToScreen(
    x,
    y
) {

    const scale =
        getScale();


    const ground =
        canvas.clientHeight -
        30;


    return {

        x:
            30 +
            x *
            scale,

        y:
            ground -
            y *
            scale

    };

}


/* =========================================================
   GRID
========================================================= */

function drawGrid() {

    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    const ground =
        height -
        30;


    ctx.strokeStyle =
        "rgba(148,163,184,0.10)";


    ctx.lineWidth =
        1;


    for (
        let x = 30;
        x < width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            ground
        );

        ctx.stroke();

    }


    for (
        let y = ground;
        y > 0;
        y -= 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }

}


/* =========================================================
   DRAW INCLINE
========================================================= */

function drawIncline() {

    const p =
        getParameters();


    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    const theta =
        p.inclineAngle *
        Math.PI /
        180;


    const startX =
        80;


    const groundY =
        height -
        80;


    const planeLength =
        Math.min(

            width - 130,

            p.inclineLength *
            20

        );


    const endX =
        startX +
        planeLength *
        Math.cos(theta);


    const endY =
        groundY -
        planeLength *
        Math.sin(theta);


    ctx.beginPath();

    ctx.moveTo(
        30,
        groundY
    );

    ctx.lineTo(
        width - 30,
        groundY
    );


    ctx.strokeStyle =
        "#475569";


    ctx.lineWidth =
        2;


    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        startX,
        groundY
    );

    ctx.lineTo(
        endX,
        endY
    );


    ctx.strokeStyle =
        "#94a3b8";


    ctx.lineWidth =
        5;


    ctx.stroke();


    const fraction =

        Math.min(

            simulation.object.position.x /
            p.inclineLength,

            1

        );


    const blockX =

        startX +

        fraction *
        (
            endX -
            startX
        );


    const blockY =

        groundY +

        fraction *
        (
            endY -
            groundY
        );


    ctx.save();


    ctx.translate(
        blockX,
        blockY - 12
    );


    ctx.rotate(
        -theta
    );


    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        -12,
        -12,
        24,
        24
    );


    ctx.restore();


    /*
       Gravity
    */

    ctx.beginPath();

    ctx.moveTo(
        blockX,
        blockY - 12
    );

    ctx.lineTo(
        blockX,
        blockY + 45
    );


    ctx.strokeStyle =
        "#ef4444";


    ctx.lineWidth =
        2;


    ctx.stroke();


    /*
       Normal
    */

    const normalScale =
        35;


    const nx =
        Math.sin(theta) *
        normalScale;


    const ny =
        -Math.cos(theta) *
        normalScale;


    ctx.beginPath();

    ctx.moveTo(
        blockX,
        blockY - 12
    );

    ctx.lineTo(

        blockX +
        nx,

        blockY +
        ny -
        12

    );


    ctx.strokeStyle =
        "#4ade80";


    ctx.stroke();


    /*
       Parallel component
    */

    const parallelScale =
        45;


    const px =
        Math.cos(theta) *
        parallelScale;


    const py =
        Math.sin(theta) *
        parallelScale;


    ctx.beginPath();

    ctx.moveTo(
        blockX,
        blockY - 12
    );

    ctx.lineTo(

        blockX +
        px,

        blockY -
        12 +
        py

    );


    ctx.strokeStyle =
        "#60a5fa";


    ctx.stroke();


    ctx.fillStyle =
        "#ef4444";


    ctx.font =
        "12px system-ui";


    ctx.fillText(
        "mg",
        blockX + 8,
        blockY + 40
    );


    ctx.fillStyle =
        "#4ade80";


    ctx.fillText(
        "N",
        blockX + nx + 5,
        blockY + ny - 12
    );


    ctx.fillStyle =
        "#60a5fa";


    ctx.fillText(
        "mg sinθ",
        blockX + px + 5,
        blockY - 12 + py
    );

}


/* =========================================================
   DRAW
========================================================= */

function draw() {

    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    if (
        simulation.experiment ===
        "incline"
    ) {

        drawIncline();

        return;

    }


    drawGrid();


    const ground =
        height -
        30;


    ctx.beginPath();

    ctx.moveTo(
        0,
        ground
    );

    ctx.lineTo(
        width,
        ground
    );


    ctx.strokeStyle =
        "#64748b";


    ctx.lineWidth =
        2;


    ctx.stroke();


    if (
        simulation.trajectory.length > 1
    ) {

        ctx.beginPath();


        simulation.trajectory.forEach(

            (point, index) => {

                const screen =
                    worldToScreen(
                        point.x,
                        point.y
                    );


                if (
                    index === 0
                ) {

                    ctx.moveTo(
                        screen.x,
                        screen.y
                    );

                }

                else {

                    ctx.lineTo(
                        screen.x,
                        screen.y
                    );

                }

            }

        );


        ctx.strokeStyle =
            "#60a5fa";


        ctx.lineWidth =
            2;


        ctx.stroke();

    }


    const object =
        simulation.object;


    const position =
        worldToScreen(

            object.position.x,

            Math.max(
                object.position.y,
                0
            )

        );


    ctx.beginPath();

    ctx.arc(

        position.x,
        position.y,
        8,
        0,
        Math.PI * 2

    );


    ctx.fillStyle =
        "#ffffff";


    ctx.fill();

}


/* =========================================================
   GRAPH
========================================================= */

function drawGraph({

    canvas,
    context,
    datasets,
    yLabel

}) {

    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    context.clearRect(
        0,
        0,
        width,
        height
    );


    const times =
        simulation.history.time;


    if (
        times.length < 2
    ) {

        context.fillStyle =
            "#94a3b8";


        context.font =
            "13px system-ui";


        context.fillText(
            "Start the simulation",
            20,
            30
        );


        return;

    }


    const maxTime =
        Math.max(
            ...times,
            1
        );


    let minY =
        Infinity;


    let maxY =
        -Infinity;


    datasets.forEach(

        dataset => {

            dataset.values.forEach(

                value => {

                    minY =
                        Math.min(
                            minY,
                            value
                        );


                    maxY =
                        Math.max(
                            maxY,
                            value
                        );

                }

            );

        }

    );


    if (
        minY === maxY
    ) {

        minY -= 1;

        maxY += 1;

    }


    const range =
        maxY -
        minY;


    minY -=
        range *
        0.08;


    maxY +=
        range *
        0.08;


    const margin = {

        left: 45,

        right: 15,

        top: 15,

        bottom: 30

    };


    const graphWidth =
        width -
        margin.left -
        margin.right;


    const graphHeight =
        height -
        margin.top -
        margin.bottom;


    const xScale =
        value =>
            margin.left +
            (
                value /
                maxTime
            ) *
            graphWidth;


    const yScale =
        value =>
            margin.top +
            (
                1 -
                (
                    value -
                    minY
                ) /
                (
                    maxY -
                    minY
                )
            ) *
            graphHeight;


    context.strokeStyle =
        "rgba(148,163,184,0.12)";


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const y =

            margin.top +

            (
                i /
                5
            ) *
            graphHeight;


        context.beginPath();

        context.moveTo(
            margin.left,
            y
        );

        context.lineTo(
            width -
            margin.right,
            y
        );

        context.stroke();

    }


    context.strokeStyle =
        "#64748b";


    context.beginPath();

    context.moveTo(
        margin.left,
        margin.top
    );

    context.lineTo(
        margin.left,
        height -
        margin.bottom
    );

    context.lineTo(
        width -
        margin.right,
        height -
        margin.bottom
    );

    context.stroke();


    datasets.forEach(

        dataset => {

            context.beginPath();


            dataset.values.forEach(

                (value, index) => {

                    const x =
                        xScale(
                            times[index]
                        );


                    const y =
                        yScale(
                            value
                        );


                    if (
                        index === 0
                    ) {

                        context.moveTo(
                            x,
                            y
                        );

                    }

                    else {

                        context.lineTo(
                            x,
                            y
                        );

                    }

                }

            );


            context.strokeStyle =
                dataset.color;


            context.lineWidth =
                2;


            context.stroke();

        }

    );


    context.fillStyle =
        "#94a3b8";


    context.font =
        "11px system-ui";


    context.fillText(
        "0",
        8,
        height -
        margin.bottom +
        4
    );


    context.fillText(

        maxTime.toFixed(1) +
        " s",

        width -
        45,

        height -
        margin.bottom +
        20

    );


    context.save();


    context.translate(
        12,
        height / 2
    );


    context.rotate(
        -Math.PI / 2
    );


    context.fillText(
        yLabel,
        0,
        0
    );


    context.restore();

}


/* =========================================================
   GRAPHS
========================================================= */

function drawGraphs() {

    drawGraph({

        canvas:
            positionGraph,

        context:
            positionCtx,

        datasets: [

            {

                values:
                    simulation.history.y,

                color:
                    "#60a5fa"

            }

        ],

        yLabel:
            "Position (m)"

    });


    drawGraph({

        canvas:
            velocityGraph,

        context:
            velocityCtx,

        datasets: [

            {

                values:
                    simulation.history.velocityX,

                color:
                    "#60a5fa"

            },

            {

                values:
                    simulation.history.velocityY,

                color:
                    "#f59e0b"

            }

        ],

        yLabel:
            "Velocity (m/s)"

    });


    drawGraph({

        canvas:
            energyGraph,

        context:
            energyCtx,

        datasets: [

            {

                values:
                    simulation.history.kineticEnergy,

                color:
                    "#60a5fa"

            },

            {

                values:
                    simulation.history.potentialEnergy,

                color:
                    "#f59e0b"

            },

            {

                values:
                    simulation.history.totalEnergy,

                color:
                    "#4ade80"

            }

        ],

        yLabel:
            "Energy (J)"

    });

}


/* =========================================================
   ANIMATION
========================================================= */

let lastTime =
    performance.now();


function animationLoop(now) {

    let dt =

        (
            now -
            lastTime
        ) /
        1000;


    lastTime =
        now;


    dt =
        Math.min(
            dt,
            0.02
        );


    physicsStep(dt);

    draw();

    drawGraphs();


    requestAnimationFrame(
        animationLoop
    );

}


requestAnimationFrame(
    animationLoop
);


/* =========================================================
   BUTTON EVENTS
========================================================= */

startButton.addEventListener(

    "click",

    () => {

        if (
            simulation.finished
        ) {

            initialize();

        }


        simulation.running =
            true;


        statusElement.textContent =
            "Running";

    }

);


pauseButton.addEventListener(

    "click",

    () => {

        simulation.running =
            false;


        statusElement.textContent =
            "Paused";

    }

);


resetButton.addEventListener(

    "click",

    () => {

        initialize();


        statusElement.textContent =
            "Ready";

    }

);


/* =========================================================
   INPUT EVENTS
========================================================= */

experimentInput.addEventListener(

    "change",

    () => {

        initialize();

        statusElement.textContent =
            "Ready";

    }

);


modelInput.addEventListener(

    "change",

    () => {

        initialize();

        statusElement.textContent =
            "Ready";

    }

);


function parameterChanged() {

    simulation.running =
        false;


    initialize();


    statusElement.textContent =
        "Ready";

}


[
    velocityInput,
    angleInput,
    heightInput,
    freefallVelocityInput,
    inclineAngleInput,
    inclineLengthInput,
    inclineVelocityInput,
    staticFrictionInput,
    kineticFrictionInput,
    gravityInput,
    massInput,
    airDensityInput,
    dragCoefficientInput,
    areaInput

].forEach(

    input => {

        input.addEventListener(
            "input",
            parameterChanged
        );

    }

);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(

    "resize",

    () => {

        resizeCanvas();

        resizeGraphs();

    }

);


/* =========================================================
   START
========================================================= */

initialize();

resizeCanvas();

resizeGraphs();

drawGraphs();