/* =====================================================
   API CONFIGURATION
===================================================== */

const API_BASE_URL =
    "https://house-price-predict-project-7.onrender.com";

const API_URL =
    `${API_BASE_URL}/predict`;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const navLinks =
    document.querySelectorAll(".nav-link");

const pageSections =
    document.querySelectorAll(".page-section");

const navHamburger =
    document.getElementById("nav-hamburger");

const navLinksContainer =
    document.getElementById("nav-links");

const startPredictionButton =
    document.getElementById("start-prediction");

const predictionForm =
    document.getElementById("prediction-form");

const predictButton =
    document.getElementById("predict-btn");


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageName) {

    pageSections.forEach(section => {

        section.classList.remove("active-page");

        if (section.id === pageName) {
            section.classList.add("active-page");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageName) {
            link.classList.add("active");
        }

    });

}


/* =====================================================
   HASH NAVIGATION
===================================================== */

function loadPageFromHash() {

    const hash =
        window.location.hash.replace("#", "");

    const validPages = [
        "dashboard",
        "prediction",
        "about"
    ];

    if (validPages.includes(hash)) {

        showPage(hash);

    } else {

        showPage("dashboard");

    }

}


/* =====================================================
   NAVIGATION CLICK
===================================================== */

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        const page =
            this.dataset.page;

        showPage(page);

        window.location.hash =
            page;

        if (navLinksContainer) {
            navLinksContainer.classList.remove("open");
        }

    });

});


/* =====================================================
   MOBILE MENU
===================================================== */

if (navHamburger) {

    navHamburger.addEventListener(
        "click",
        function () {

            navLinksContainer.classList.toggle("open");

        }
    );

}


/* =====================================================
   START PREDICTION BUTTON
===================================================== */

if (startPredictionButton) {

    startPredictionButton.addEventListener(
        "click",
        function () {

            showPage("prediction");

            window.location.hash =
                "prediction";

        }
    );

}


/* =====================================================
   NUMBER INPUT CONTROLS
===================================================== */

document.querySelectorAll(
    ".number-control"
).forEach(control => {

    const input =
        control.querySelector("input");

    const buttons =
        control.querySelectorAll("button");

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const action =
                    this.dataset.action;

                let value =
                    parseFloat(input.value) || 0;

                const step =
                    parseFloat(input.step) || 1;

                const min =
                    input.min !== ""
                        ? parseFloat(input.min)
                        : -Infinity;

                const max =
                    input.max !== ""
                        ? parseFloat(input.max)
                        : Infinity;

                if (action === "increase") {

                    value += step;

                }

                if (action === "decrease") {

                    value -= step;

                }

                value =
                    Math.max(
                        min,
                        Math.min(max, value)
                    );

                input.value = value;

                input.dispatchEvent(
                    new Event(
                        "input",
                        { bubbles: true }
                    )
                );

            }
        );

    });

});


/* =====================================================
   OVERALL QUALITY RANGE
===================================================== */

const overallQuality =
    document.getElementById("OverallQual");

const qualityValue =
    document.querySelector(".quality-value strong");

if (overallQuality && qualityValue) {

    function updateQualityValue() {

        qualityValue.textContent =
            overallQuality.value;

    }

    overallQuality.addEventListener(
        "input",
        updateQualityValue
    );

    updateQualityValue();

}


/* =====================================================
   WAKE UP BACKEND
===================================================== */

async function wakeUpBackend() {

    try {

        console.log(
            "Waking up prediction server..."
        );

        const response =
            await fetch(
                API_BASE_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        if (response.ok) {

            console.log(
                "Prediction server is ready."
            );

        } else {

            console.log(
                "Prediction server responded with status:",
                response.status
            );

        }

    } catch (error) {

        console.log(
            "Backend wake-up request failed:",
            error
        );

    }

}


/* =====================================================
   PREDICTION
===================================================== */

if (predictionForm) {

    predictionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (predictButton) {

                predictButton.disabled =
                    true;

                predictButton.innerHTML = `
                    <span class="material-icons-round">
                        hourglass_top
                    </span>
                    Predicting...
                `;

            }

            const formData =
                new FormData(predictionForm);

            const data = {};

            formData.forEach(
                (value, key) => {

                    data[key] =
                        parseFloat(value);

                }
            );


            try {

                console.log(
                    "Sending prediction request..."
                );

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Server error: ${response.status}`
                    );

                }


                const result =
                    await response.json();

                console.log(
                    "Prediction result:",
                    result
                );


                /* =====================================
                   DISPLAY RESULT
                ===================================== */

                const predictionResult =
                    document.querySelector(
                        ".prediction-result"
                    );

                const resultPrice =
                    document.querySelector(
                        ".result-price"
                    );


                if (predictionResult) {

                    predictionResult.classList.add(
                        "show"
                    );

                }


                if (resultPrice) {

                    const price =
                        result.predicted_price ??
                        result.prediction ??
                        result.price;

                    resultPrice.textContent =
                        `₹${Number(price).toLocaleString("en-IN")}`;

                }


            } catch (error) {

                console.error(
                    "Prediction failed:",
                    error
                );

                alert(
                    "Unable to get prediction. Please try again."
                );


            } finally {

                if (predictButton) {

                    predictButton.disabled =
                        false;

                    predictButton.innerHTML = `
                        <span class="material-icons-round">
                            auto_awesome
                        </span>
                        Predict House Price
                    `;

                }

            }

        }
    );

}


/* =====================================================
   INITIAL PAGE LOAD
===================================================== */

window.addEventListener(
    "load",
    function () {

        loadPageFromHash();

        /*
         * Wake up Render backend in the background.
         * This helps reduce the delay caused by
         * Render cold starts.
         */

        wakeUpBackend();

    }
);


/* =====================================================
   HASH CHANGE
===================================================== */

window.addEventListener(
    "hashchange",
    loadPageFromHash
);
