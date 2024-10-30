// Helper function to format numbers in Indian format
function formatIndianNumber(number) {
  if (!number) return "0"; // Handle empty or undefined values
  return Number(number).toLocaleString("en-IN", {
    maximumFractionDigits: 2, // Limit to two decimal places
  });
}

// Function to update values and recalculate EMI, Loan Amount, and Down Payment
function updateValues() {
  const propertyValue =
    parseFloat(
      document.getElementById("PropertyValue").value.replace(/,/g, "")
    ) || 0;
  const downPaymentPercent =
    parseFloat(
      document.getElementById("DownPayment").value.replace(/,/g, "")
    ) || 0;
  const emiRate =
    parseFloat(document.getElementById("EMIRate").value.replace(/,/g, "")) || 0;
  const tenure =
    parseFloat(document.getElementById("Tenure").value.replace(/,/g, "")) || 0;

  // Calculate Down Payment
  const downPayment = (downPaymentPercent / 100) * propertyValue;
  document.getElementById("downPaymentValue").innerText = formatIndianNumber(
    downPayment.toFixed(2)
  );

  // Calculate Loan Amount
  const loanAmount = propertyValue - downPayment;
  document.getElementById("loanAmount").innerText = formatIndianNumber(
    loanAmount.toFixed(2)
  );

  // Calculate EMI
  const emi = calculateEMI(emiRate, tenure, loanAmount);
  document.getElementById("emi").innerText = formatIndianNumber(emi.toFixed(2));

  // Update savings based on EMI and rent
  updateSavings(emi);
}

// Function to calculate EMI using loan amount, rate, and tenure
function calculateEMI(loanRate, tenureYears, loanAmount) {
  const monthlyRate = loanRate / 12 / 100; // Convert annual rate to monthly rate
  const tenureMonths = tenureYears * 12; // Convert years to months

  // EMI formula
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi || 0;
}

// Function to update savings based on EMI and monthly rent
function updateSavings(emi) {
  const monthlyRent =
    parseFloat(document.getElementById("rent").value.replace(/,/g, "")) || 0;

  // Calculate savings (difference between EMI and rent), ensuring non-negative value
  const savings = Math.max(emi - monthlyRent, 0);
  document.getElementById("savings").innerText = formatIndianNumber(
    savings.toFixed(2)
  );

  // Recalculate future values based on updated savings
  updateFutureValues(savings);
}
window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY; // How far the user has scrolled
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight; // Total scrollable height
  const scrollPercentage = scrollPosition / documentHeight; // Scroll percentage

  // Calculate new height for the beige section based on scroll percentage
  // We start from 25% black and gradually decrease it.
  const blackHeight = Math.max(15 - scrollPercentage * 25, 0); // Black starts at 25% and reduces with scroll
  const beigeHeight = 100 - blackHeight; // The remaining height will be beige

  document.body.style.background = `linear-gradient(to bottom, black ${blackHeight}%, beige ${blackHeight}%)`;
});
// Function to update future values of savings and property
function updateFutureValues(savings) {
  const tenure =
    parseFloat(document.getElementById("Tenure").value.replace(/,/g, "")) || 0;
  const expectedReturn =
    parseFloat(
      document.getElementById("expectedReturn").value.replace(/,/g, "")
    ) / 100 || 0;
  const downPayment =
    parseFloat(
      document.getElementById("downPaymentValue").innerText.replace(/,/g, "")
    ) || 0;

  // Calculate future values
  const futureValues = calculateFutureValue(
    tenure,
    savings,
    downPayment,
    expectedReturn
  );

  // Update UI with future values
  document.getElementById("FutureValue").innerText = formatIndianNumber(
    futureValues.futureValueSavings.toFixed(2)
  );
  document.getElementById("FutureValueOfProperty").innerText =
    formatIndianNumber(futureValues.futureValueProperty.toFixed(2));

  // Check outcome and update final result
  updateOutcome(futureValues);
}

// Function to calculate future values of savings and property
function calculateFutureValue(tenure, savings, downPayment, expectedReturn) {
  const months = 12;
  const totalMonths = tenure * months;

  // Future value of savings (compound interest formula for monthly contributions)
  const compoundFactor = Math.pow(1 + expectedReturn / months, totalMonths);
  const futureValueSavings =
    downPayment * compoundFactor +
    savings * ((compoundFactor - 1) / (expectedReturn / months));

  // Future value of property
  const appreciationRate =
    parseFloat(
      document.getElementById("rateOfAppreciation").value.replace(/,/g, "")
    ) / 100 || 0;
  const propertyValue =
    parseFloat(
      document.getElementById("PropertyValue").value.replace(/,/g, "")
    ) || 0;
  const futureValueProperty =
    propertyValue * Math.pow(1 + appreciationRate, tenure);

  return { futureValueSavings, futureValueProperty };
}

// Function to update outcome based on future values
function updateOutcome({ futureValueSavings, futureValueProperty }) {
  const finalResultElement = document.getElementById("finalResult");
  if (futureValueSavings > futureValueProperty) {
    finalResultElement.innerText = "Rent the house";
  } else {
    finalResultElement.innerText = "Buy the property";
  }
}

// Event listeners for input fields
document
  .getElementById("PropertyValue")
  .addEventListener("input", updateValues);
document.getElementById("DownPayment").addEventListener("input", updateValues);
document.getElementById("EMIRate").addEventListener("input", updateValues);
document.getElementById("Tenure").addEventListener("input", updateValues);
document.getElementById("rent").addEventListener("input", updateValues);
document
  .getElementById("expectedReturn")
  .addEventListener("input", updateValues);
document
  .getElementById("rateOfAppreciation")
  .addEventListener("input", updateValues);

// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Feedback Modal Functionality
document.getElementById("feedback-btn").addEventListener("click", function () {
  document.getElementById("feedback-modal").style.display = "flex";
  console.log("clicked");
});

// Function to open Contact Modal
// document.getElementById("contact-btn").addEventListener("click", function () {
//   document.getElementById("contact-modal").style.display = "flex";
// });

// Function to close Feedback Modal when clicking '×'
document
  .getElementById("close-feedback")
  .addEventListener("click", function () {
    document.getElementById("feedback-modal").style.display = "none";
  });

// Function to close Contact Modal when clicking '×'
// document.getElementById("close-contact").addEventListener("click", function () {
//   document.getElementById("contact-modal").style.display = "none";
// });

// Close modals if user clicks outside the modal content
window.onclick = function (event) {
  if (event.target === document.getElementById("feedback-modal")) {
    document.getElementById("feedback-modal").style.display = "none";
  } else if (event.target === document.getElementById("contact-modal")) {
    document.getElementById("contact-modal").style.display = "none";
  }
};
// document.getElementById("contact-btn").addEventListener("click", function () {
//   document.getElementById("contact-modal").style.display = "flex";
// });

// Close the contact form modal
document.getElementById("close-contact").addEventListener("click", function () {
  document.getElementById("contact-modal").style.display = "none";
});

// Close the modal when clicking outside the popup content
window.addEventListener("click", function (event) {
  if (event.target == document.getElementById("contact-modal")) {
    document.getElementById("contact-modal").style.display = "none";
  }
});
// document.getElementById("contactForm").addEventListener("submit", function (e) {
//   e.preventDefault(); // Prevent the default form submission

//   const name = document.getElementById("name").value;
//   const email = document.getElementById("email").value;
//   const message = document.getElementById("message").value;

//   console.log("Sending data:", { name, email, message }); // Debug log

//   fetch(
//     "https://script.google.com/macros/s/AKfycbwwULxTv4d-BI4mhGXYHQK5cfJLLAGMRCPxA7WzzDutCKWXKHI0dmuwME1K2GPyVZ4zOg/exec", // Ensure the URL starts with "https://script.google.com/macros/s/"
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, message }),
//     }
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.status === "success") {
//         alert("Message sent successfully!");
//       } else {
//         alert("Error sending message: " + data.message);
//       }
//     })
//     .catch((error) => console.error("Error:", error));
// });

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzX5FDoKDNZufigHrQzV7b0KrfFJHgonWTK3tPpTQ2WIztMHrbMnQh5LJKuqDVBqniqdw/exec";
const form = document.forms["contact-form"];

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the default form submission

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("Thank you! Your form has been submitted successfully."); // Show success message
      form.reset(); // Clear the form fields
    })
    .catch((error) => {
      console.error("Error!", error.message); // Log the error message
      alert("Thank you for submitting"); // Show error message
    });
});
