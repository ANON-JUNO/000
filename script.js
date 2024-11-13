async function askAI() {
  const query = document.getElementById("aiInput").value;
  if (!query.trim()) {
    displayResponse("Please enter a question.");
    return;
  }

  try {
    displayResponse("Asking AI...");

    const start = new Date().getTime();  // Start time to calculate ping

    const response = await fetch(`https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(query)}`);
    const data = await response.json();

    const end = new Date().getTime();  // End time to calculate ping
    const ping = end - start;  // Calculate the ping

    document.getElementById('pingValue').textContent = `${ping} ms`;  // Update the ping in the UI

    if (response.ok && data.message) {
      displayResponse(data.message);
    } else {
      displayResponse("Error: Unable to get AI response.");
    }
  } catch (error) {
    console.error("Error:", error);
    displayResponse("An error occurred. Please try again later.");
  }
}

async function generateCode() {
  const query = document.getElementById("codeInput").value;
  if (!query.trim()) {
    displayResponse("Please enter a code-related query.");
    return;
  }

  try {
    displayResponse("Generating code...");

    const response = await fetch(`https://joshweb.click/api/codegpt?type=code&lang=nodejs&q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (response.ok && data.result) {
      displayResponse(data.result);
    } else {
      displayResponse("Error: Unable to generate code.");
    }
  } catch (error) {
    console.error("Error:", error);
    displayResponse("An error occurred while generating the code. Please try again later.");
  }
}

async function recognizeImage() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  const question = document.getElementById("imageQuestionInput").value.trim();  // Get the question from the user input

  if (!file) {
    displayResponse("Please upload an image.");
    return;
  }

  if (!question) {
    displayResponse("Please enter a question about the image.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("question", question);  // Append the question along with the image

  try {
    displayResponse("Recognizing image...");

    const response = await fetch("https://joshweb.click/gemini", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.gemini) {
      displayResponse(data.gemini);
    } else {
      displayResponse("Error: Unable to recognize the image.");
    }
  } catch (error) {
    console.error("Error:", error);
    displayResponse("An error occurred while recognizing the image. Please try again later.");
  }
}

function displayResponse(message) {
  const responseDiv = document.getElementById("response");
  responseDiv.innerHTML = message;
}

// Display current time and update every second
function updateTime() {
  const time = new Date().toLocaleTimeString();
  document.getElementById("timeValue").textContent = time;
}

setInterval(updateTime, 1000);  // Update time every second
