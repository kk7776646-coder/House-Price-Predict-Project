/* =====================================================
   CONFIGURATION
===================================================== */

const API_BASE_URL =
    "https://house-price-predict-project-7.onrender.com";

const API_URL =
    "https://house-price-predict-project-7.onrender.com/predict";


/* =====================================================
   ELEMENTS
===================================================== */

const navLinks = document.querySelectorAll(".nav-link");
const navLinksContainer = document.getElementById("nav-links");
const hamburger = document.getElementById("nav-hamburger");

const predictionForm =
    document.getElementById("prediction-form");

const startPrediction =
    document.getElementById("start-prediction");

const predictionResult =
    document.getElementById("prediction-result");

const resultPrice =
    document.getElementById("result-price");

const resultMessage =
    document.getElementById("result-message");

const qualitySlider =
    document.getElementById("OverallQual");

const qualityDisplay =
    document.getElementById("quality-display");


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function switchPage(pageName) {

    /*
        Hide all pages
    */

    document.querySelectorAll(".page-section").forEach(section => {

        section.classList.remove("active-page");

    });


    /*
        Show selected page
    */

    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    /*
        Update active navigation item
    */

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageName) {

            link.classList.add("active");

        }

    });


    /*
        Close mobile menu
    */

    navLinksContainer.classList.remove("open");

    hamburger.classList.remove("active");


    /*
        Scroll to top
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   NAVIGATION CLICK
===================================================== */

navLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const page =
            this.dataset.page;

        switchPage(page);

        history.replaceState(
            null,
            "",
            "#" + page
        );

    });

});


/* =====================================================
   MOBILE HAMBURGER
===================================================== */

hamburger.addEventListener("click", function () {

    navLinksContainer.classList.toggle("open");

    this.classList.toggle("active");

});


/* =====================================================
   START PREDICTION BUTTON
===================================================== */

startPrediction.addEventListener("click", function () {

    switchPage("prediction");

    history.replaceState(
        null,
        "",
        "#prediction"
    );

});


/* =====================================================
   QUALITY SLIDER
===================================================== */

qualitySlider.addEventListener("input", function () {

    qualityDisplay.textContent =
        this.value;

});


/* =====================================================
   PLUS / MINUS CONTROLS
===================================================== */

document.querySelectorAll(".plus-btn").forEach(button => {

    button.addEventListener("click", function () {

        const targetId =
            this.dataset.target;

        const input =
            document.getElementById(targetId);

        if (!input) return;

        const currentValue =
            Number(input.value) || 0;

        const max =
            input.max
                ? Number(input.max)
                : Infinity;

        input.value =
            Math.min(currentValue + 1, max);

    });

});


document.querySelectorAll(".minus-btn").forEach(button => {

    button.addEventListener("click", function () {

        const targetId =
            this.dataset.target;

        const input =
            document.getElementById(targetId);

        if (!input) return;

        const currentValue =
            Number(input.value) || 0;

        const min =
            input.min
                ? Number(input.min)
                : 0;

        input.value =
            Math.max(currentValue - 1, min);

    });

});


/* =====================================================
   WAKE UP RENDER BACKEND
===================================================== */

async function wakeUpBackend() {

    try {

        console.log("Waking up prediction server...");

        await fetch(API_BASE_URL, {
            method: "GET",
            mode: "no-cors",
            cache: "no-store"
        });

        console.log(
            "Backend wake-up request sent."
        );

    } catch (error) {

        console.log(
            "Backend wake-up request failed:",
            error
        );

    }

}


/* =====================================================
   FORM SUBMISSION
===================================================== */

predictionForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const predictButton =
        document.getElementById("predict-btn");


    /*
        Collect data
    */

    const data = {

        OverallQual:
            Number(
                document.getElementById("OverallQual").value
            ),

        YearBuilt:
            Number(
                document.getElementById("YearBuilt").value
            ),

        YearRemodAdd:
            Number(
                document.getElementById("YearRemodAdd").value
            ),

        TotalBsmtSF:
            Number(
                document.getElementById("TotalBsmtSF").value
            ),

        GrLivArea:
            Number(
                document.getElementById("GrLivArea").value
            ),

        FirstFloorArea:
            Number(
                document.getElementById("FirstFloorArea").value
            ),

        GarageArea:
            Number(
                document.getElementById("GarageArea").value
            ),

        GarageCars:
            Number(
                document.getElementById("GarageCars").value
            ),

        FullBath:
            Number(
                document.getElementById("FullBath").value
            ),

        HalfBath:
            Number(
                document.getElementById("HalfBath").value
            ),

        BedroomAbvGr:
            Number(
                document.getElementById("BedroomAbvGr").value
            ),

        TotRmsAbvGrd:
            Number(
                document.getElementById("TotRmsAbvGrd").value
            )
    };


    /*
        Loading state
    */

    predictButton.disabled = true;

    predictButton.innerHTML = `
        <span class="material-icons-round">
            hourglass_top
        </span>

        Predicting...
    `;


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const result =
            await response.json();


        /*
            Display prediction
        */

        if (
            result.success &&
            result.predicted_price !== undefined
        ) {

            const price =
                Number(result.predicted_price);


            resultPrice.textContent =
                "$" +
                price.toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits: 0
                    }
                );


            resultMessage.textContent =
                "Estimated value generated successfully from the property details.";


            predictionResult.classList.add("show");


            predictionResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        } else {

            throw new Error(
                "Invalid prediction response"
            );

        }

    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        resultPrice.textContent =
            "Unable to predict";


        resultMessage.textContent =
            "Something went wrong while connecting to the prediction server. Please try again.";


        predictionResult.classList.add("show");

    }


    /*
        Restore button
    */

    predictButton.disabled = false;

    predictButton.innerHTML = `
        <span class="material-icons-round">
            query_stats
        </span>

        Predict House Price

        <span class="material-icons-round">
            arrow_forward
        </span>
    `;

});


/* =====================================================
   LOAD PAGE FROM URL HASH
===================================================== */

function loadPageFromHash() {

    const hash =
        window.location.hash.replace("#", "");


    if (
        hash === "prediction" ||
        hash === "about" ||
        hash === "dashboard"
    ) {

        switchPage(hash);

    } else {

        switchPage("dashboard");

    }

}


window.addEventListener(
    "load",
    function () {

        loadPageFromHash();

        // Wake Render backend in the background.
        wakeUpBackend();

    }
);


/* =====================================================
   CLOSE MOBILE MENU ON OUTSIDE CLICK
===================================================== */

document.addEventListener("click", function (event) {

    const clickedInsideNavbar =
        event.target.closest(".nav-container");

    if (!clickedInsideNavbar) {

        navLinksContainer.classList.remove("open");

        hamburger.classList.remove("active");

    }

});
