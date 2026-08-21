/* =========================================================
   SCIEX
   N-BODY GRAVITATIONAL SIMULATION

   Version 1.2

   Physics:
   Newtonian Gravity

   Integrator:
   Velocity Verlet

   Internal Units:
   SI

   User Interface Units:
   Position  = AU
   Velocity  = km/s
   Mass      = kg
   Radius    = km
========================================================= */


/* =========================================================
   CONSTANTS
========================================================= */

const G =
    6.67430e-11;

const SOLAR_MASS =
    1.98847e30;

const EARTH_MASS =
    5.9722e24;

const MOON_MASS =
    7.342e22;

const AU =
    1.495978707e11;

const EARTH_RADIUS =
    6.371e6;

const MOON_RADIUS =
    1.7374e6;


/* =========================================================
   DOM
========================================================= */

const canvas =
    document.getElementById(
        "nbodyCanvas"
    );

const ctx =
    canvas.getContext(
        "2d"
    );


const startButton =
    document.getElementById(
        "nbodyStart"
    );

const pauseButton =
    document.getElementById(
        "nbodyPause"
    );

const resetButton =
    document.getElementById(
        "nbodyReset"
    );

const presetSelect =
    document.getElementById(
        "nbodyPreset"
    );


const dtSlider =
    document.getElementById(
        "nbodyDt"
    );

const dtValue =
    document.getElementById(
        "nbodyDtValue"
    );


const speedSlider =
    document.getElementById(
        "nbodySpeed"
    );

const speedValue =
    document.getElementById(
        "nbodySpeedValue"
    );


const status =
    document.getElementById(
        "nbodyStatus"
    );


const zoomIn =
    document.getElementById(
        "zoomIn"
    );

const zoomOut =
    document.getElementById(
        "zoomOut"
    );

const zoomReset =
    document.getElementById(
        "zoomReset"
    );

const autoFitButton =
    document.getElementById(
        "autoFit"
    );

const fullscreenButton =
    document.getElementById(
        "fullscreenButton"
    );

const zoomValue =
    document.getElementById(
        "zoomValue"
    );


const followCheckbox =
    document.getElementById(
        "followSystem"
    );

const autoFitCheckbox =
    document.getElementById(
        "autoFitCheckbox"
    );


const trailsCheckbox =
    document.getElementById(
        "nbodyTrails"
    );

const velocityCheckbox =
    document.getElementById(
        "nbodyVelocityVectors"
    );

const forceCheckbox =
    document.getElementById(
        "nbodyForceVectors"
    );

const labelsCheckbox =
    document.getElementById(
        "nbodyLabels"
    );
    const canvasAddBodyButton =
    document.getElementById(
        "canvasAddBodyButton"
    );


const placementModeCheckbox =
    document.getElementById(
        "placementMode"
    );


const placementInstructions =
    document.getElementById(
        "placementInstructions"
    );


const placementSettings =
    document.getElementById(
        "placementSettings"
    );


const canvasBodyName =
    document.getElementById(
        "canvasBodyName"
    );


const canvasBodyMass =
    document.getElementById(
        "canvasBodyMass"
    );


const canvasBodyRadius =
    document.getElementById(
        "canvasBodyRadius"
    );


const canvasVelocityScale =
    document.getElementById(
        "canvasVelocityScale"
    );


/* =========================================================
   PHYSICS INFORMATION
========================================================= */

const countDisplay =
    document.getElementById(
        "nbodyCount"
    );

const timeDisplay =
    document.getElementById(
        "nbodyTime"
    );

const energyDisplay =
    document.getElementById(
        "nbodyEnergy"
    );

const momentumDisplay =
    document.getElementById(
        "nbodyMomentum"
    );


const bodyCards =
    document.getElementById(
        "nbodyBodyCards"
    );


/* =========================================================
   CUSTOM BODY UI
========================================================= */

const bodyName =
    document.getElementById(
        "bodyName"
    );

const bodyMass =
    document.getElementById(
        "bodyMass"
    );

const bodyRadius =
    document.getElementById(
        "bodyRadius"
    );

const bodyX =
    document.getElementById(
        "bodyX"
    );

const bodyY =
    document.getElementById(
        "bodyY"
    );

const bodyVx =
    document.getElementById(
        "bodyVx"
    );

const bodyVy =
    document.getElementById(
        "bodyVy"
    );


const addBodyButton =
    document.getElementById(
        "addBodyButton"
    );

const clearBodiesButton =
    document.getElementById(
        "clearBodiesButton"
    );


const bodyTable =
    document.getElementById(
        "customBodyTable"
    );


/* =========================================================
   BODY CLASS
========================================================= */

class Body {

    constructor({

        name,

        mass,

        radius,

        x,

        y,

        vx,

        vy,

        custom = false

    }) {

        this.name =
            name;

        this.mass =
            mass;

        this.radius =
            radius;

        this.position = {

            x: x,

            y: y

        };

        this.velocity = {

            x: vx,

            y: vy

        };

        this.acceleration = {

            x: 0,

            y: 0

        };

        this.force = {

            x: 0,

            y: 0

        };

        this.custom =
            custom;

        this.trail = [];

    }

}


/* =========================================================
   SIMULATION STATE
========================================================= */

const simulation = {

    bodies: [],

    running: false,

    simulationTime: 0,

    dt: 3600,

    speed: 1,

    cameraX: 0,

    cameraY: 0,

    zoom: 1,

    fitScale: 1,

    follow: true,

    autoFit: false,

    initialEnergy: 0,

    initialMomentum: {

        x: 0,

        y: 0

    }

};
/* =========================================================
   CANVAS PLACEMENT STATE
========================================================= */

const placement = {

    active: false,

    dragging: false,

    startX: 0,

    startY: 0,

    currentX: 0,

    currentY: 0

};


/* =========================================================
   VECTOR MAGNITUDE
========================================================= */

function magnitude(
    x,
    y
) {

    return Math.sqrt(

        x * x +
        y * y

    );

}


/* =========================================================
   PRESETS
========================================================= */

function createSunEarth() {

    simulation.bodies = [

        new Body({

            name: "Sun",

            mass:
                SOLAR_MASS,

            radius:
                6.9634e8,

            x: 0,

            y: 0,

            vx: 0,

            vy: 0

        }),


        new Body({

            name: "Earth",

            mass:
                EARTH_MASS,

            radius:
                EARTH_RADIUS,

            x: AU,

            y: 0,

            vx: 0,

            vy: 29784.7

        })

    ];

}


function createEarthMoon() {

    simulation.bodies = [

        new Body({

            name: "Earth",

            mass:
                EARTH_MASS,

            radius:
                EARTH_RADIUS,

            x: 0,

            y: 0,

            vx: 0,

            vy: 0

        }),


        new Body({

            name: "Moon",

            mass:
                MOON_MASS,

            radius:
                MOON_RADIUS,

            x:
                384400e3,

            y: 0,

            vx: 0,

            vy: 1022

        })

    ];

}


function createSunEarthMoon() {

    simulation.bodies = [

        new Body({

            name: "Sun",

            mass:
                SOLAR_MASS,

            radius:
                6.9634e8,

            x: 0,

            y: 0,

            vx: 0,

            vy: 0

        }),


        new Body({

            name: "Earth",

            mass:
                EARTH_MASS,

            radius:
                EARTH_RADIUS,

            x:
                AU,

            y: 0,

            vx: 0,

            vy: 29784.7

        }),


        new Body({

            name: "Moon",

            mass:
                MOON_MASS,

            radius:
                MOON_RADIUS,

            x:
                AU + 384400e3,

            y: 0,

            vx: 0,

            vy:
                29784.7 + 1022

        })

    ];

}


function createBinary() {

    const separation =
        2 * AU;

    const distance =
        separation / 2;

    const mass =
        SOLAR_MASS;


    const velocity =

        Math.sqrt(

            G *
            mass /
            (
                2 *
                separation
            )

        );


    simulation.bodies = [

        new Body({

            name:
                "Star A",

            mass:

                mass,

            radius:
                6.9634e8,

            x:
                -distance,

            y:
                0,

            vx:
                0,

            vy:
                -velocity

        }),


        new Body({

            name:
                "Star B",

            mass:
                mass,

            radius:
                6.9634e8,

            x:
                distance,

            y:
                0,

            vx:
                0,

            vy:
                velocity

        })

    ];

}


function createThreeBody() {

    const mass =
        SOLAR_MASS;

    const distance =
        2 * AU;


    simulation.bodies = [];


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const angle =

            i *
            (
                2 *
                Math.PI /
                3
            );


        simulation.bodies.push(

            new Body({

                name:
                    `Star ${i + 1}`,

                mass:
                    mass,

                radius:
                    6.9634e8,

                x:
                    distance *
                    Math.cos(angle),

                y:
                    distance *
                    Math.sin(angle),

                vx:
                    -15000 *
                    Math.sin(angle),

                vy:
                    15000 *
                    Math.cos(angle)

            })

        );

    }

}


/* =========================================================
   CENTER OF MASS FRAME
========================================================= */

function moveToCenterOfMassFrame() {

    if (
        simulation.bodies.length === 0
    ) {

        return;

    }


    let totalMass = 0;

    let centerX = 0;

    let centerY = 0;

    let momentumX = 0;

    let momentumY = 0;


    simulation.bodies.forEach(

        body => {

            totalMass +=
                body.mass;


            centerX +=
                body.mass *
                body.position.x;


            centerY +=
                body.mass *
                body.position.y;


            momentumX +=
                body.mass *
                body.velocity.x;


            momentumY +=
                body.mass *
                body.velocity.y;

        }

    );


    centerX /=
        totalMass;


    centerY /=
        totalMass;


    const cmVelocityX =
        momentumX /
        totalMass;


    const cmVelocityY =
        momentumY /
        totalMass;


    simulation.bodies.forEach(

        body => {

            body.position.x -=
                centerX;


            body.position.y -=
                centerY;


            body.velocity.x -=
                cmVelocityX;


            body.velocity.y -=
                cmVelocityY;

        }

    );

}


/* =========================================================
   LOAD PRESET
========================================================= */

function loadPreset() {

    simulation.running =
        false;


    switch (
        presetSelect.value
    ) {

        case "earth-sun":

            createSunEarth();

            break;


        case "earth-moon":

            createEarthMoon();

            break;


        case "sun-earth-moon":

            createSunEarthMoon();

            break;


        case "binary":

            createBinary();

            break;


        case "three-body":

            createThreeBody();

            break;


        case "custom":

            simulation.bodies = [];

            break;

    }


    simulation.simulationTime =
        0;


    simulation.bodies.forEach(

        body => {

            body.trail = [];

        }

    );


    moveToCenterOfMassFrame();


    calculateAccelerations();


    simulation.initialEnergy =
        calculateTotalEnergy();


    simulation.initialMomentum =
        calculateTotalMomentum();


    fitCamera();


    updateAllUI();


    status.textContent =
        "READY";

}


/* =========================================================
   GRAVITY
========================================================= */

function calculateAccelerations() {

    const bodies =
        simulation.bodies;


    bodies.forEach(

        body => {

            body.force.x =
                0;

            body.force.y =
                0;

        }

    );


    for (
        let i = 0;
        i < bodies.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < bodies.length;
            j++
        ) {

            const A =
                bodies[i];

            const B =
                bodies[j];


            const dx =
                B.position.x -
                A.position.x;


            const dy =
                B.position.y -
                A.position.y;


            const distance =
                Math.max(

                    magnitude(
                        dx,
                        dy
                    ),

                    1

                );


            const force =

                G *
                A.mass *
                B.mass /
                (
                    distance *
                    distance
                );


            const fx =
                force *
                dx /
                distance;


            const fy =
                force *
                dy /
                distance;


            A.force.x +=
                fx;

            A.force.y +=
                fy;


            B.force.x -=
                fx;

            B.force.y -=
                fy;

        }

    }


    bodies.forEach(

        body => {

            body.acceleration.x =

                body.force.x /
                body.mass;


            body.acceleration.y =

                body.force.y /
                body.mass;

        }

    );

}


/* =========================================================
   VELOCITY VERLET
========================================================= */

function integrate(
    dt
) {

    simulation.bodies.forEach(

        body => {

            body.velocity.x +=

                0.5 *
                body.acceleration.x *
                dt;


            body.velocity.y +=

                0.5 *
                body.acceleration.y *
                dt;

        }

    );


    simulation.bodies.forEach(

        body => {

            body.position.x +=

                body.velocity.x *
                dt;


            body.position.y +=

                body.velocity.y *
                dt;

        }

    );


    calculateAccelerations();


    simulation.bodies.forEach(

        body => {

            body.velocity.x +=

                0.5 *
                body.acceleration.x *
                dt;


            body.velocity.y +=

                0.5 *
                body.acceleration.y *
                dt;

        }

    );


    simulation.simulationTime +=
        dt;

}


/* =========================================================
   ENERGY
========================================================= */

function calculateTotalEnergy() {

    let kinetic =
        0;

    let potential =
        0;


    const bodies =
        simulation.bodies;


    for (
        const body of bodies
    ) {

        const speedSquared =

            body.velocity.x *
            body.velocity.x +

            body.velocity.y *
            body.velocity.y;


        kinetic +=

            0.5 *
            body.mass *
            speedSquared;

    }


    for (
        let i = 0;
        i < bodies.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < bodies.length;
            j++
        ) {

            const A =
                bodies[i];

            const B =
                bodies[j];


            const dx =
                B.position.x -
                A.position.x;


            const dy =
                B.position.y -
                A.position.y;


            const distance =

                Math.max(

                    magnitude(
                        dx,
                        dy
                    ),

                    1

                );


            potential -=

                G *
                A.mass *
                B.mass /
                distance;

        }

    }


    return (
        kinetic +
        potential
    );

}


/* =========================================================
   MOMENTUM
========================================================= */

function calculateTotalMomentum() {

    let px =
        0;

    let py =
        0;


    simulation.bodies.forEach(

        body => {

            px +=
                body.mass *
                body.velocity.x;


            py +=
                body.mass *
                body.velocity.y;

        }

    );


    return {

        x: px,

        y: py

    };

}


/* =========================================================
   CENTER OF MASS
========================================================= */

function calculateCenterOfMass() {

    let totalMass =
        0;

    let x =
        0;

    let y =
        0;


    simulation.bodies.forEach(

        body => {

            totalMass +=
                body.mass;


            x +=
                body.mass *
                body.position.x;


            y +=
                body.mass *
                body.position.y;

        }

    );


    if (
        totalMass === 0
    ) {

        return {

            x: 0,

            y: 0

        };

    }


    return {

        x:
            x /
            totalMass,

        y:
            y /
            totalMass

    };

}


/* =========================================================
   CAMERA FIT
========================================================= */

function fitCamera() {

    if (
        simulation.bodies.length === 0
    ) {

        simulation.cameraX =
            0;

        simulation.cameraY =
            0;

        simulation.fitScale =
            1;

        simulation.zoom =
            1;

        updateZoomDisplay();

        return;

    }


    let minX =
        Infinity;

    let maxX =
        -Infinity;

    let minY =
        Infinity;

    let maxY =
        -Infinity;


    simulation.bodies.forEach(

        body => {

            minX =
                Math.min(
                    minX,
                    body.position.x
                );


            maxX =
                Math.max(
                    maxX,
                    body.position.x
                );


            minY =
                Math.min(
                    minY,
                    body.position.y
                );


            maxY =
                Math.max(
                    maxY,
                    body.position.y
                );

        }

    );


    simulation.cameraX =
        (minX + maxX) / 2;


    simulation.cameraY =
        (minY + maxY) / 2;


    const range =

        Math.max(

            maxX - minX,

            maxY - minY,

            AU * 0.01

        );


    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    simulation.fitScale =

        0.75 *
        Math.min(
            width,
            height
        ) /
        range;


    simulation.zoom =
        1;


    updateZoomDisplay();

}


/* =========================================================
   UPDATE CAMERA
========================================================= */

function updateCamera() {

    if (
        simulation.bodies.length === 0
    ) {

        return;

    }


    if (
        simulation.follow
    ) {

        const center =
            calculateCenterOfMass();


        simulation.cameraX =
            center.x;


        simulation.cameraY =
            center.y;

    }


    if (
        simulation.autoFit
    ) {

        autoFitCamera();

    }

}


/* =========================================================
   AUTO FIT
========================================================= */

function autoFitCamera() {

    if (
        simulation.bodies.length === 0
    ) {

        return;

    }


    let minX =
        Infinity;

    let maxX =
        -Infinity;

    let minY =
        Infinity;

    let maxY =
        -Infinity;


    simulation.bodies.forEach(

        body => {

            minX =
                Math.min(
                    minX,
                    body.position.x
                );


            maxX =
                Math.max(
                    maxX,
                    body.position.x
                );


            minY =
                Math.min(
                    minY,
                    body.position.y
                );


            maxY =
                Math.max(
                    maxY,
                    body.position.y
                );

        }

    );


    const range =

        Math.max(

            maxX - minX,

            maxY - minY,

            AU * 0.01

        );


    simulation.fitScale =

        0.72 *
        Math.min(

            canvas.clientWidth,

            canvas.clientHeight

        ) /
        range;

}


/* =========================================================
   WORLD → SCREEN
========================================================= */

function worldToScreen(
    x,
    y
) {

    const scale =

        simulation.fitScale *
        simulation.zoom;


    return {

        x:

            canvas.clientWidth / 2 +

            (
                x -
                simulation.cameraX
            ) *
            scale,


        y:

            canvas.clientHeight / 2 -

            (
                y -
                simulation.cameraY
            ) *
            scale

    };

}


/* =========================================================
   SCREEN → WORLD
========================================================= */

function screenToWorld(
    x,
    y
) {

    const scale =

        simulation.fitScale *
        simulation.zoom;


    return {

        x:

            simulation.cameraX +

            (
                x -
                canvas.clientWidth / 2
            ) /
            scale,


        y:

            simulation.cameraY -

            (
                y -
                canvas.clientHeight / 2
            ) /
            scale

    };

}
function getCanvasMousePosition(
    event
) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };

}
function calculatePlacementVelocity() {

    const dx =
        placement.currentX -
        placement.startX;


    const dy =
        placement.currentY -
        placement.startY;


    const scale =
        Number(
            canvasVelocityScale.value
        );


    /*
       Convert screen pixels into km/s.

       Dragging upward gives positive Y velocity
       because the canvas Y axis points downward.
    */

    const vxKms =
        dx *
        scale;


    const vyKms =
        -dy *
        scale;


    return {

        x:
            vxKms *
            1000,

        y:
            vyKms *
            1000

    };

}

function drawPlacementPreview() {

    if (
        !placement.active ||
        !placement.dragging
    ) {

        return;

    }


    const startX =
        placement.startX;


    const startY =
        placement.startY;


    const currentX =
        placement.currentX;


    const currentY =
        placement.currentY;


    ctx.strokeStyle =
        "#60a5fa";

    ctx.fillStyle =
        "#60a5fa";

    ctx.lineWidth =
        2;


    ctx.setLineDash([
        6,
        4
    ]);


    ctx.beginPath();


    ctx.moveTo(
        startX,
        startY
    );


    ctx.lineTo(
        currentX,
        currentY
    );


    ctx.stroke();


    ctx.setLineDash([]);


    ctx.beginPath();


    ctx.arc(

        startX,
        startY,

        7,

        0,
        Math.PI * 2

    );


    ctx.fill();


    const dx =
        currentX -
        startX;


    const dy =
        currentY -
        startY;


    const angle =
        Math.atan2(
            dy,
            dx
        );


    ctx.beginPath();


    ctx.moveTo(
        currentX,
        currentY
    );


    ctx.lineTo(

        currentX -
        10 *
        Math.cos(
            angle -
            Math.PI / 6
        ),

        currentY -
        10 *
        Math.sin(
            angle -
            Math.PI / 6
        )

    );


    ctx.lineTo(

        currentX -
        10 *
        Math.cos(
            angle +
            Math.PI / 6
        ),

        currentY -
        10 *
        Math.sin(
            angle +
            Math.PI / 6
        )

    );


    ctx.closePath();

    ctx.fill();


    const velocity =
        calculatePlacementVelocity();


    const velocityKms =

        magnitude(

            velocity.x,

            velocity.y

        ) /
        1000;


    ctx.fillStyle =
        "#edf2f7";

    ctx.font =
        "12px system-ui";


    ctx.fillText(

        `Velocity: ${velocityKms.toFixed(2)} km/s`,

        currentX + 12,

        currentY - 12

    );

}


/* =========================================================
   ZOOM
========================================================= */

function setZoom(
    value
) {

    simulation.zoom =

        Math.max(

            0.05,

            Math.min(
                20,
                value
            )

        );


    updateZoomDisplay();

}


function updateZoomDisplay() {

    zoomValue.textContent =

        `${Math.round(
            simulation.zoom * 100
        )}%`;

}


function zoomAroundPoint(
    factor,
    x,
    y
) {

    const before =
        screenToWorld(
            x,
            y
        );


    simulation.zoom *=
        factor;


    simulation.zoom =

        Math.max(

            0.05,

            Math.min(
                20,
                simulation.zoom
            )

        );


    const after =
        screenToWorld(
            x,
            y
        );


    simulation.cameraX +=

        before.x -
        after.x;


    simulation.cameraY +=

        before.y -
        after.y;


    updateZoomDisplay();

}


/* =========================================================
   DRAW
========================================================= */

const stars = [];


function createStars() {

    stars.length =
        0;


    for (
        let i = 0;
        i < 180;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                canvas.clientWidth,

            y:
                Math.random() *
                canvas.clientHeight,

            radius:
                Math.random() *
                1.2

        });

    }

}


function drawBackground() {

    ctx.fillStyle =
        "#03050a";


    ctx.fillRect(

        0,
        0,

        canvas.clientWidth,
        canvas.clientHeight

    );


    ctx.fillStyle =
        "#ffffff";


    stars.forEach(

        star => {

            ctx.beginPath();


            ctx.arc(

                star.x,

                star.y,

                star.radius,

                0,

                Math.PI * 2

            );


            ctx.fill();

        }

    );

}


/* =========================================================
   TRAILS
========================================================= */

function drawTrails() {

    if (
        !trailsCheckbox.checked
    ) {

        return;

    }


    simulation.bodies.forEach(

        body => {

            if (
                body.trail.length < 2
            ) {

                return;

            }


            ctx.beginPath();


            body.trail.forEach(

                (
                    point,
                    index
                ) => {

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
                "rgba(96,165,250,0.45)";


            ctx.lineWidth =
                1;


            ctx.stroke();

        }

    );

}


/* =========================================================
   BODY COLOR
========================================================= */

function getBodyColor(
    body
) {

    if (
        body.name
            .toLowerCase()
            .includes("sun")
    ) {

        return "#fbbf24";

    }


    if (
        body.name
            .toLowerCase()
            .includes("star")
    ) {

        return "#fbbf24";

    }


    if (
        body.name ===
        "Earth"
    ) {

        return "#60a5fa";

    }


    if (
        body.name ===
        "Moon"
    ) {

        return "#d1d5db";

    }


    return "#c084fc";

}


/* =========================================================
   DRAW BODY
========================================================= */

function drawBody(
    body
) {

    const screen =
        worldToScreen(

            body.position.x,

            body.position.y

        );


    let radius = 4;


    if (
        body.mass >=
        SOLAR_MASS * 0.1
    ) {

        radius =
            9;

    }

    else if (
        body.mass >=
        EARTH_MASS * 0.1
    ) {

        radius =
            6;

    }


    radius =
        Math.max(
            radius,
            2
        );


    ctx.beginPath();


    ctx.arc(

        screen.x,

        screen.y,

        radius,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        getBodyColor(
            body
        );


    ctx.fill();


    if (
        body.mass >=
        SOLAR_MASS * 0.1
    ) {

        ctx.beginPath();


        ctx.arc(

            screen.x,

            screen.y,

            radius * 2.5,

            0,

            Math.PI * 2

        );


        const gradient =

            ctx.createRadialGradient(

                screen.x,
                screen.y,
                radius,

                screen.x,
                screen.y,
                radius * 2.5

            );


        gradient.addColorStop(
            0,
            "rgba(251,191,36,0.25)"
        );


        gradient.addColorStop(
            1,
            "rgba(251,191,36,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fill();

    }


    if (
        labelsCheckbox.checked
    ) {

        ctx.fillStyle =
            "#edf2f7";


        ctx.font =
            "12px system-ui";


        ctx.fillText(

            body.name,

            screen.x +
            radius +
            5,

            screen.y -
            radius -
            2

        );

    }

}


/* =========================================================
   VECTORS
========================================================= */

function drawArrow(
    x1,
    y1,
    x2,
    y2,
    color
) {

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    const length =
        magnitude(
            dx,
            dy
        );


    if (
        length < 1
    ) {

        return;

    }


    const angle =
        Math.atan2(
            dy,
            dx
        );


    ctx.strokeStyle =
        color;

    ctx.fillStyle =
        color;

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );


    ctx.lineTo(

        x2 -
        7 *
        Math.cos(
            angle - Math.PI / 6
        ),

        y2 -
        7 *
        Math.sin(
            angle - Math.PI / 6
        )

    );


    ctx.lineTo(

        x2 -
        7 *
        Math.cos(
            angle + Math.PI / 6
        ),

        y2 -
        7 *
        Math.sin(
            angle + Math.PI / 6
        )

    );


    ctx.closePath();

    ctx.fill();

}


function drawVectors() {

    simulation.bodies.forEach(

        body => {

            const screen =
                worldToScreen(

                    body.position.x,

                    body.position.y

                );


            if (
                velocityCheckbox.checked
            ) {

                const scale =
                    100000;


                drawArrow(

                    screen.x,

                    screen.y,

                    screen.x +
                    body.velocity.x /
                    scale,

                    screen.y -
                    body.velocity.y /
                    scale,

                    "#60a5fa"

                );

            }


            if (
                forceCheckbox.checked
            ) {

                const scale =
                    1e25;


                drawArrow(

                    screen.x,

                    screen.y,

                    screen.x +
                    body.force.x /
                    scale,

                    screen.y -
                    body.force.y /
                    scale,

                    "#ef4444"

                );

            }

        }

    );

}


/* =========================================================
   DRAW
========================================================= */

function draw() {

    drawBackground();

    drawTrails();

    drawVectors();


    simulation.bodies.forEach(

        body => {

            drawBody(
                body
            );

        }

    );


    /*
       Draw the interactive body placement
       after the simulation objects.
    */

    drawPlacementPreview();

}

function createBodyFromCanvas() {

    const worldPosition =
        screenToWorld(

            placement.startX,

            placement.startY

        );


    const velocity =
        calculatePlacementVelocity();


    const name =
        canvasBodyName.value.trim();


    const mass =
        Number(
            canvasBodyMass.value
        );


    const radiusKm =
        Number(
            canvasBodyRadius.value
        );


    if (
        !name
    ) {

        alert(
            "Enter a body name."
        );

        return;

    }


    if (
        !Number.isFinite(mass) ||
        mass <= 0
    ) {

        alert(
            "Mass must be greater than zero."
        );

        return;

    }


    if (
        !Number.isFinite(radiusKm) ||
        radiusKm < 0
    ) {

        alert(
            "Radius cannot be negative."
        );

        return;

    }


    const newBody =
        new Body({

            name:
                name,

            mass:
                mass,

            radius:
                radiusKm *
                1000,

            x:
                worldPosition.x,

            y:
                worldPosition.y,

            vx:
                velocity.x,

            vy:
                velocity.y,

            custom:
                true

        });


    simulation.bodies.push(
        newBody
    );


    calculateAccelerations();


    simulation.initialEnergy =
        calculateTotalEnergy();


    simulation.initialMomentum =
        calculateTotalMomentum();


    updateAllUI();


    status.textContent =
        `${name} ADDED`;

}

canvas.addEventListener(

    "pointerdown",

    event => {

        if (
            !placement.active
        ) {

            return;

        }


        const position =
            getCanvasMousePosition(
                event
            );


        placement.dragging =
            true;


        placement.startX =
            position.x;


        placement.startY =
            position.y;


        placement.currentX =
            position.x;


        placement.currentY =
            position.y;


        canvas.setPointerCapture(
            event.pointerId
        );


        draw();

    }

);

canvas.addEventListener(

    "pointermove",

    event => {

        if (
            !placement.active ||
            !placement.dragging
        ) {

            return;

        }


        const position =
            getCanvasMousePosition(
                event
            );


        placement.currentX =
            position.x;


        placement.currentY =
            position.y;


        draw();

    }

);

canvas.addEventListener(

    "pointerup",

    event => {

        if (
            !placement.active ||
            !placement.dragging
        ) {

            return;

        }


        const dx =

            placement.currentX -
            placement.startX;


        const dy =

            placement.currentY -
            placement.startY;


        const dragDistance =

            magnitude(
                dx,
                dy
            );


        /*
           Ignore accidental clicks.
        */

        if (
            dragDistance >= 5
        ) {

            createBodyFromCanvas();

        }


        placement.dragging =
            false;


        canvas.releasePointerCapture(
            event.pointerId
        );


        draw();

    }

);

function setPlacementMode(
    enabled
) {

    placement.active =
        enabled;


    placement.dragging =
        false;


    canvas.classList.toggle(

        "placement-active",

        enabled

    );


    placementSettings.style.display =

        enabled
            ? "block"
            : "none";


    if (
        enabled
    ) {

        placementInstructions.textContent =

            "Click and drag on the simulation to create a body. Drag direction controls velocity direction.";

        status.textContent =
            "PLACEMENT MODE";

    }

    else {

        placementInstructions.textContent =

            "Click and drag on the simulation to create a body.";

        status.textContent =
            "READY";

    }


    draw();

}

placementModeCheckbox.addEventListener(

    "change",

    () => {

        setPlacementMode(

            placementModeCheckbox.checked

        );

    }

);

canvasAddBodyButton.addEventListener(

    "click",

    () => {

        placementModeCheckbox.checked =
            !placementModeCheckbox.checked;


        setPlacementMode(

            placementModeCheckbox.checked

        );

    }

);

/* =========================================================
   TRAILS
========================================================= */

function recordTrails() {

    if (
        !trailsCheckbox.checked
    ) {

        return;

    }


    simulation.bodies.forEach(

        body => {

            body.trail.push({

                x:
                    body.position.x,

                y:
                    body.position.y

            });


            if (
                body.trail.length >
                1200
            ) {

                body.trail.shift();

            }

        }

    );

}


/* =========================================================
   FORMAT
========================================================= */

function formatScientific(
    value
) {

    if (
        value === 0
    ) {

        return "0";

    }


    return value.toExponential(
        3
    );

}


/* =========================================================
   BODY ANALYSIS
========================================================= */

function updateBodyCards() {

    bodyCards.innerHTML =
        "";


    simulation.bodies.forEach(

        body => {

            const speed =

                magnitude(

                    body.velocity.x,

                    body.velocity.y

                );


            const acceleration =

                magnitude(

                    body.acceleration.x,

                    body.acceleration.y

                );


            const kinetic =

                0.5 *
                body.mass *
                speed *
                speed;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "nbody-body-card";


            card.innerHTML = `

                <h3>
                    ${body.name}
                </h3>

                <div>

                    <span>
                        Mass
                    </span>

                    <strong>
                        ${formatScientific(body.mass)}
                        kg
                    </strong>

                </div>

                <div>

                    <span>
                        Position
                    </span>

                    <strong>
                        (${formatScientific(body.position.x)},
                        ${formatScientific(body.position.y)}) m
                    </strong>

                </div>

                <div>

                    <span>
                        Velocity
                    </span>

                    <strong>
                        ${formatScientific(speed)}
                        m/s
                    </strong>

                </div>

                <div>

                    <span>
                        Acceleration
                    </span>

                    <strong>
                        ${formatScientific(acceleration)}
                        m/s²
                    </strong>

                </div>

                <div>

                    <span>
                        Kinetic Energy
                    </span>

                    <strong>
                        ${formatScientific(kinetic)}
                        J
                    </strong>

                </div>

            `;


            bodyCards.appendChild(
                card
            );

        }

    );

}


/* =========================================================
   BODY TABLE
========================================================= */

function updateBodyTable() {

    bodyTable.innerHTML =
        "";


    simulation.bodies.forEach(

        (
            body,
            index
        ) => {

            const row =
                document.createElement(
                    "tr"
                );


            const positionAU =

                magnitude(

                    body.position.x,
                    body.position.y

                ) /
                AU;


            const speedKms =

                magnitude(

                    body.velocity.x,
                    body.velocity.y

                ) /
                1000;


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${body.name}
                </td>

                <td>
                    ${formatScientific(body.mass)}
                    kg
                </td>

                <td>
                    ${positionAU.toFixed(4)}
                    AU
                </td>

                <td>
                    ${speedKms.toFixed(4)}
                    km/s
                </td>

                <td>

                    <button
                        class="body-remove-button"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </td>

            `;


            bodyTable.appendChild(
                row
            );

        }

    );


    document
        .querySelectorAll(
            ".body-remove-button"
        )
        .forEach(

            button => {

                button.addEventListener(

                    "click",

                    () => {

                        removeBody(

                            Number(
                                button.dataset.index
                            )

                        );

                    }

                );

            }

        );

}


/* =========================================================
   PHYSICS DISPLAY
========================================================= */

function updatePhysicsDisplay() {

    countDisplay.textContent =
        simulation.bodies.length;


    const days =

        simulation.simulationTime /
        86400;


    timeDisplay.textContent =

        days.toFixed(3) +
        " days";


    energyDisplay.textContent =

        formatScientific(

            calculateTotalEnergy()

        );


    const momentum =
        calculateTotalMomentum();


    momentumDisplay.textContent =

        formatScientific(

            magnitude(

                momentum.x,

                momentum.y

            )

        );

}


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateAllUI() {

    updatePhysicsDisplay();

    updateBodyCards();

    updateBodyTable();

}


/* =========================================================
   ADD CUSTOM BODY
========================================================= */

function addCustomBody() {

    const name =
        bodyName.value.trim();


    const mass =
        Number(
            bodyMass.value
        );


    const radiusKm =
        Number(
            bodyRadius.value
        );


    const xAU =
        Number(
            bodyX.value
        );


    const yAU =
        Number(
            bodyY.value
        );


    const vxKms =
        Number(
            bodyVx.value
        );


    const vyKms =
        Number(
            bodyVy.value
        );


    /*
       Validate input.
    */

    if (
        !name
    ) {

        alert(
            "Enter a body name."
        );

        return;

    }


    if (
        !Number.isFinite(mass) ||
        mass <= 0
    ) {

        alert(
            "Mass must be greater than zero."
        );

        return;

    }


    if (
        !Number.isFinite(radiusKm) ||
        radiusKm < 0
    ) {

        alert(
            "Radius cannot be negative."
        );

        return;

    }


    if (
        !Number.isFinite(xAU) ||
        !Number.isFinite(yAU) ||
        !Number.isFinite(vxKms) ||
        !Number.isFinite(vyKms)
    ) {

        alert(
            "Position and velocity values must be valid numbers."
        );

        return;

    }


    /*
       Convert user units to SI.

       AU → m
       km → m
       km/s → m/s
    */

    const body =
        new Body({

            name:

                name,

            mass:

                mass,

            radius:

                radiusKm *
                1000,

            x:

                xAU *
                AU,

            y:

                yAU *
                AU,

            vx:

                vxKms *
                1000,

            vy:

                vyKms *
                1000,

            custom:
                true

        });


    simulation.bodies.push(
        body
    );


    /*
       Recalculate gravitational field.
    */

    calculateAccelerations();


    /*
       Keep the system in the
       center-of-mass frame.
    */

    moveToCenterOfMassFrame();


    calculateAccelerations();


    /*
       Recalculate reference energy.
    */

    simulation.initialEnergy =
        calculateTotalEnergy();


    simulation.initialMomentum =
        calculateTotalMomentum();


    /*
       Make sure the new body is visible.
    */

    fitCamera();


    updateAllUI();


    status.textContent =
        `${name} ADDED`;

}


/* =========================================================
   REMOVE BODY
========================================================= */

function removeBody(
    index
) {

    if (
        index < 0 ||
        index >=
        simulation.bodies.length
    ) {

        return;

    }


    const removed =
        simulation.bodies[index];


    simulation.bodies.splice(
        index,
        1
    );


    calculateAccelerations();


    updateAllUI();


    status.textContent =
        `${removed.name} REMOVED`;

}


/* =========================================================
   CLEAR BODIES
========================================================= */

function clearBodies() {

    simulation.running =
        false;


    simulation.bodies = [];


    simulation.simulationTime =
        0;


    simulation.cameraX =
        0;


    simulation.cameraY =
        0;


    simulation.fitScale =
        1;


    updateAllUI();


    draw();


    status.textContent =
        "SYSTEM CLEARED";

}


/* =========================================================
   CANVAS RESIZE
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


    createStars();


    if (
        simulation.bodies.length === 0
    ) {

        simulation.fitScale =
            1;

    }


    draw();

}


/* =========================================================
   FULLSCREEN
========================================================= */

async function toggleFullscreen() {

    const wrapper =
        document.querySelector(
            ".canvas-wrapper"
        );


    try {

        if (
            !document.fullscreenElement
        ) {

            await wrapper.requestFullscreen();

        }

        else {

            await document.exitFullscreen();

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   SIMULATION LOOP
========================================================= */

function simulationLoop() {

    if (
        simulation.running
    ) {

        const steps =

            Math.max(

                1,

                Math.round(
                    simulation.speed
                )

            );


        for (
            let i = 0;
            i < steps;
            i++
        ) {

            integrate(
                simulation.dt
            );


            recordTrails();

        }


        updateCamera();

        updateAllUI();

    }


    draw();


    requestAnimationFrame(
        simulationLoop
    );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

startButton.addEventListener(

    "click",

    () => {

        if (
            simulation.bodies.length <
            2
        ) {

            alert(
                "At least two bodies are required for gravitational interaction."
            );

            return;

        }


        simulation.running =
            true;


        status.textContent =
            "RUNNING";

    }

);


pauseButton.addEventListener(

    "click",

    () => {

        simulation.running =
            false;


        status.textContent =
            "PAUSED";

    }

);


resetButton.addEventListener(

    "click",

    () => {

        loadPreset();

    }

);


presetSelect.addEventListener(

    "change",

    () => {

        loadPreset();

    }

);


dtSlider.addEventListener(

    "input",

    () => {

        simulation.dt =
            Number(
                dtSlider.value
            );


        dtValue.textContent =

            simulation.dt.toLocaleString()
            +
            " s";

    }

);


speedSlider.addEventListener(

    "input",

    () => {

        simulation.speed =
            Number(
                speedSlider.value
            );


        speedValue.textContent =

            simulation.speed.toFixed(1)
            +
            "×";

    }

);


/* =========================================================
   CAMERA EVENTS
========================================================= */

zoomIn.addEventListener(

    "click",

    () => {

        setZoom(
            simulation.zoom * 1.25
        );

    }

);


zoomOut.addEventListener(

    "click",

    () => {

        setZoom(
            simulation.zoom / 1.25
        );

    }

);


zoomReset.addEventListener(

    "click",

    () => {

        setZoom(
            1
        );

    }

);


autoFitButton.addEventListener(

    "click",

    () => {

        fitCamera();

    }

);


followCheckbox.addEventListener(

    "change",

    () => {

        simulation.follow =
            followCheckbox.checked;

    }

);


autoFitCheckbox.addEventListener(

    "change",

    () => {

        simulation.autoFit =
            autoFitCheckbox.checked;

    }

);


fullscreenButton.addEventListener(

    "click",

    toggleFullscreen

);


/* =========================================================
   MOUSE WHEEL ZOOM
========================================================= */

canvas.addEventListener(

    "wheel",

    event => {

        event.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        const factor =

            event.deltaY < 0
                ? 1.15
                : 1 / 1.15;


        zoomAroundPoint(

            factor,

            x,

            y

        );

    },

    {
        passive: false
    }

);


/* =========================================================
   CUSTOM BODY EVENTS
========================================================= */

addBodyButton.addEventListener(

    "click",

    addCustomBody

);


clearBodiesButton.addEventListener(

    "click",

    clearBodies

);


/* =========================================================
   FULLSCREEN RESIZE
========================================================= */

document.addEventListener(

    "fullscreenchange",

    () => {

        setTimeout(

            () => {

                resizeCanvas();

            },

            100

        );

    }

);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(

    "resize",

    resizeCanvas

);


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(

    "keydown",

    event => {

        if (
            !document.body.contains(
                canvas
            )
        ) {

            return;

        }


        if (
            event.key === "+"
            ||
            event.key === "="
        ) {

            setZoom(
                simulation.zoom * 1.15
            );

        }


        if (
            event.key === "-"
        ) {

            setZoom(
                simulation.zoom / 1.15
            );

        }


        if (
            event.key === "0"
        ) {

            fitCamera();

        }

    }

);


/* =========================================================
   INITIALIZATION
========================================================= */

simulation.follow =
    true;


simulation.autoFit =
    false;


simulation.dt =
    Number(
        dtSlider.value
    );


simulation.speed =
    Number(
        speedSlider.value
    );


dtValue.textContent =

    simulation.dt.toLocaleString()
    +
    " s";


speedValue.textContent =

    simulation.speed.toFixed(1)
    +
    "×";


resizeCanvas();

loadPreset();

requestAnimationFrame(
    simulationLoop
);