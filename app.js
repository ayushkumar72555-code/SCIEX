/* =====================================================
   SCIEX
   MAIN APPLICATION CONTROLLER
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const moduleContainer =
    document.getElementById(
        "moduleContainer"
    );


const navigationItems =
    document.querySelectorAll(
        ".nav-item[data-module]"
    );


/* =====================================================
   MODULE DEFINITIONS
===================================================== */

const modules = {

    physics: {

        name:
            "Interactive Physics Simulator",

        path:
            "physics/Interactive%20Physics%20Simulator/"

    },


    nbody: {

        name:
            "N-Body Gravitational Simulation",

        path:
            "physics/N-Body%20Gravitational%20Simulation/"

    }

};


/* =====================================================
   CURRENT MODULE
===================================================== */

let currentModule =
    null;


/* =====================================================
   LOAD MODULE
===================================================== */

async function loadModule(
    moduleId
) {

    const module =
        modules[moduleId];


    if (!module) {

        console.error(
            `Unknown SCIEX module: ${moduleId}`
        );

        return;

    }


    currentModule =
        moduleId;


    /*
       Update navigation
    */

    navigationItems.forEach(

        item => {

            item.classList.toggle(

                "active",

                item.dataset.module ===
                moduleId

            );

        }

    );


    /*
       Show loading state
    */

    moduleContainer.innerHTML = `

        <div class="module-loading">

            Loading ${module.name}...

        </div>

    `;


    try {

        /*
           Load module HTML
        */

        const htmlResponse =
            await fetch(
                module.path +
                "index.html"
            );


        if (
            !htmlResponse.ok
        ) {

            throw new Error(

                `Could not load module HTML: ${
                    htmlResponse.status
                }`

            );

        }


        const html =
            await htmlResponse.text();


        /*
           Insert HTML
        */

        moduleContainer.innerHTML =
            html;


        /*
           Load module CSS
        */

        await loadCSS(

            module.path +
            "style.css"

        );


        /*
           Load module JavaScript
        */

        await loadJavaScript(

            module.path +
            "app.js"

        );


        /*
           Load N-body collision physics after the
           main N-body simulator has defined its
           physics state and integration function.
        */

        if (
            moduleId === "nbody"
        ) {

            await loadJavaScript(

                module.path +
                "collision.js"

            );

        }


    }

    catch (error) {

        console.error(
            error
        );


        moduleContainer.innerHTML = `

            <div class="module-error">

                <h2>
                    Module could not be loaded
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


/* =====================================================
   LOAD CSS
===================================================== */

function loadCSS(
    href
) {

    return new Promise(

        (
            resolve,
            reject
        ) => {

            /*
               Avoid loading the same stylesheet
               more than once.
            */

            if (
                document.querySelector(
                    `link[href="${href}"]`
                )
            ) {

                resolve();

                return;

            }


            const link =
                document.createElement(
                    "link"
                );


            link.rel =
                "stylesheet";


            link.href =
                href;


            link.onload =
                resolve;


            link.onerror =
                () => reject(

                    new Error(
                        `Could not load CSS: ${href}`
                    )

                );


            document.head.appendChild(
                link
            );

        }

    );

}


/* =====================================================
   LOAD JAVASCRIPT
===================================================== */

function loadJavaScript(
    src
) {

    return new Promise(

        (
            resolve,
            reject
        ) => {

            const script =
                document.createElement(
                    "script"
                );


            script.src =
                src;


            /*
               Add a unique query string so the
               browser does not incorrectly reuse
               an old module script during development.
            */

            script.src +=
                `?t=${Date.now()}`;


            script.onload =
                resolve;


            script.onerror =
                () => reject(

                    new Error(
                        `Could not load JavaScript: ${src}`
                    )

                );


            document.body.appendChild(
                script
            );

        }

    );

}


/* =====================================================
   NAVIGATION EVENTS
===================================================== */

navigationItems.forEach(

    item => {

        item.addEventListener(

            "click",

            () => {

                const moduleId =
                    item.dataset.module;


                loadModule(
                    moduleId
                );

            }

        );

    }

);


/* =====================================================
   INITIAL STATE
===================================================== */

console.log(
    "SCIEX initialized."
);