
function showSpinner() {
    var spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.style.display = "block";
    }
  }
  
  // Function to hide the spinner
  function hideSpinner() {
    var spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.style.display = "none";
    }
  }
  showSpinner();
  setTimeout(hideSpinner, 3000);
  