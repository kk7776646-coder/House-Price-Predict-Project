/* ============================================
   HOUSE PRICE PREDICTION - MAIN JAVASCRIPT
   script.js
   
   This file handles:
   1. Navigation (page switching, mobile menu)
   2. Stepper controls (minus/plus buttons for numeric inputs)
   3. Slider value display (Overall Quality)
   4. Form submission & prediction function
   5. Navbar scroll effect
   
   NOTE: The ML model is NOT connected yet.
   The predictHousePrice() function is prepared
   for future FastAPI integration.
   ============================================ */


// ============================================
// Wait for the DOM to fully load before running scripts
// ============================================
document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // CACHE DOM ELEMENTS
    // Store references to frequently used elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navLinksContainer = document.getElementById('nav-links');
    const hamburger = document.getElementById('nav-hamburger');
    const pages = document.querySelectorAll('.page');
    const predictionForm = document.getElementById('prediction-form');
    const predictionResult = document.getElementById('prediction-result');
    const resultPrice = document.getElementById('result-price');
    const slider = document.getElementById('overallQual');
    const sliderValueDisplay = document.getElementById('overallQual-value');
    const heroCTA = document.getElementById('hero-cta-btn');


    // ============================================
    // 1. NAVIGATION - PAGE SWITCHING
    // Each nav link switches the visible page
    // ============================================

    /**
     * switchPage - Shows the target page and hides all others.
     * Also updates the active state on nav links.
     * 
     * @param {string} pageName - The data-page value (e.g., "dashboard", "prediction")
     */
    function switchPage(pageName) {
        // Hide all pages
        pages.forEach(function (page) {
            page.classList.remove('page-active');
        });

        // Show the target page
        const targetPage = document.getElementById('page-' + pageName);
        if (targetPage) {
            targetPage.classList.add('page-active');
        }

        // Update active state on nav links
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        navLinksContainer.classList.remove('open');
        hamburger.classList.remove('active');

        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Add click event to each nav link
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target page name from data-page attribute
            const pageName = this.getAttribute('data-page');

            // Add click animation (scale-down effect)
            this.classList.add('clicking');
            
            // Remove clicking class after animation completes
            setTimeout(function () {
                link.classList.remove('clicking');
            }, 150);

            // Switch to the selected page
            switchPage(pageName);
        });
    });

    // Hero CTA button navigates to Prediction page
    if (heroCTA) {
        heroCTA.addEventListener('click', function () {
            const targetPage = this.getAttribute('data-navigate');
            if (targetPage) {
                switchPage(targetPage);
            }
        });
    }


    // ============================================
    // 2. MOBILE HAMBURGER MENU
    // Toggle the mobile navigation drawer
    // ============================================
    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
        }
    });


    // ============================================
    // 3. NAVBAR SCROLL EFFECT
    // Add shadow to navbar when user scrolls down
    // ============================================
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ============================================
    // 4. STEPPER CONTROLS (Minus / Plus buttons)
    // Handle increment/decrement for numeric inputs
    // ============================================

    // Select all stepper buttons
    const stepperButtons = document.querySelectorAll('.stepper-btn');

    stepperButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Get the target input's ID and step size from data attributes
            const targetId = this.getAttribute('data-target');
            const stepSize = parseFloat(this.getAttribute('data-step')) || 1;
            const input = document.getElementById(targetId);

            if (!input) return;

            // Get current value and min/max bounds
            let currentValue = parseFloat(input.value) || 0;
            const minValue = parseFloat(input.min);
            const maxValue = parseFloat(input.max);

            // Determine direction: minus or plus
            if (this.classList.contains('stepper-minus')) {
                currentValue -= stepSize;
            } else if (this.classList.contains('stepper-plus')) {
                currentValue += stepSize;
            }

            // Clamp value within min/max if they exist
            if (!isNaN(minValue) && currentValue < minValue) {
                currentValue = minValue;
            }
            if (!isNaN(maxValue) && currentValue > maxValue) {
                currentValue = maxValue;
            }

            // Update the input value
            input.value = currentValue;
        });
    });


    // ============================================
    // 5. SLIDER - OVERALL QUALITY
    // Update the displayed value and slider track
    // ============================================

    /**
     * updateSlider - Updates the slider's visual display
     * and the percentage-fill of the track.
     */
    function updateSlider() {
        const value = slider.value;
        const min = slider.min || 1;
        const max = slider.max || 10;

        // Update the displayed number
        sliderValueDisplay.textContent = value;

        // Calculate percentage for the filled portion of the track
        const percentage = ((value - min) / (max - min)) * 100;

        // Update the slider background gradient (filled vs unfilled)
        slider.style.background =
            'linear-gradient(to right, #2563eb 0%, #2563eb ' +
            percentage + '%, #e2e8f0 ' + percentage + '%, #e2e8f0 100%)';
    }

    // Listen for slider changes
    slider.addEventListener('input', updateSlider);

    // Initialize slider display on page load
    updateSlider();


    // ============================================
    // 6. FORM SUBMISSION & PREDICTION
    // Collects all 12 input values and calls the
    // prediction function
    // ============================================
    predictionForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect all 12 property values from the form
        const propertyData = {
            OverallQual: parseInt(document.getElementById('overallQual').value),
            GrLivArea: parseInt(document.getElementById('grLivArea').value),
            FullBath: parseInt(document.getElementById('fullBath').value),
            YearBuilt: parseInt(document.getElementById('yearBuilt').value),
            FirstFloorArea: parseInt(document.getElementById('firstFloorArea').value),
            HalfBath: parseInt(document.getElementById('halfBath').value),
            YearRemodAdd: parseInt(document.getElementById('yearRemodAdd').value),
            GarageArea: parseInt(document.getElementById('garageArea').value),
            BedroomAbvGr: parseInt(document.getElementById('bedroomAbvGr').value),
            TotalBsmtSF: parseInt(document.getElementById('totalBsmtSF').value),
            GarageCars: parseInt(document.getElementById('garageCars').value),
            TotRmsAbvGrd: parseInt(document.getElementById('totRmsAbvGrd').value)
        };

        // Call the prediction function
        predictHousePrice(propertyData);
    });


    // ============================================
    // 7. PREDICT HOUSE PRICE FUNCTION
    // 
    // This function will eventually send the 12 
    // property values to the FastAPI backend.
    // For now, it shows a placeholder result.
    //
    // API Endpoint: POST /predict
    // Expected JSON format:
    // {
    //     "OverallQual": 5,
    //     "GrLivArea": 1500,
    //     "FullBath": 2,
    //     "YearBuilt": 2000,
    //     "FirstFloorArea": 1000,
    //     "HalfBath": 1,
    //     "YearRemodAdd": 2000,
    //     "GarageArea": 400,
    //     "BedroomAbvGr": 3,
    //     "TotalBsmtSF": 1000,
    //     "GarageCars": 2,
    //     "TotRmsAbvGrd": 6
    // }
    // ============================================

    /**
     * predictHousePrice - Sends property data to the ML model
     * and displays the predicted price.
     * 
     * @param {Object} data - Object containing the 12 property feature values
     */
    async function predictHousePrice(data) {
    console.log("Sending data to ML backend:", data);

    const API_URL = "http://127.0.0.1:8000/predict";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Prediction received:", result);

        if (result.success) {
            displayPrediction(result.predicted_price);
        } else {
            throw new Error("Prediction failed");
        }

    } catch (error) {
        console.error("Prediction error:", error);

        resultPrice.textContent = "Error";

        document.querySelector(".result-note").textContent =
            "Unable to connect to the prediction server.";

        predictionResult.classList.add("visible");
    }
}

    /**
     * displayPrediction - Updates the result card with the predicted price.
     * 
     * @param {number|null} price - The predicted price, or null for placeholder
     */
    function displayPrediction(price) {
        if (price !== null && price !== undefined) {
            // Format the price as currency (e.g., $182,500)
            resultPrice.textContent = '$' + price.toLocaleString('en-US');
        } else {
            // Placeholder text when API is not connected
            resultPrice.textContent = '$---,---';
            document.querySelector('.result-note').textContent =
                'ML model not connected yet. Connect via FastAPI to see real predictions.';
        }

        // Show the result card with a smooth animation
        predictionResult.classList.add('visible');

        // Scroll to the result so the user can see it
        predictionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }


    // ============================================
    // 8. URL HASH ROUTING
    // Check URL hash on page load to show the correct page
    // (e.g., if user navigates to index.html#prediction)
    // ============================================
    function handleHashRoute() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            switchPage(hash);
        }
    }

    // Handle initial hash route
    handleHashRoute();

    // Listen for hash changes (back/forward buttons)
    window.addEventListener('hashchange', handleHashRoute);

});
