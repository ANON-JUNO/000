async function askAI() {
  const query = document.getElementById("aiInput").value.trim();
  if (!query) {
    displayResponse("Please enter a question.");
    return;
  }
  try {
    displayResponse("Asking AI...");
    const response = await fetch("http://localhost:5000/api/askAI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (response.ok && data.result) {
      displayResponse(`Ask AI Response:\n\n${data.result}`);
    } else {
      displayResponse("Error: Unable to retrieve a response from the AI.");
    }
  } catch (error) {
    displayResponse("An error occurred while fetching the AI response.");
  }
}

async function askHumanizer() {
  const text = document.getElementById("humanizerInput").value.trim();
  if (!text) {
    displayResponse("Please enter a text.");
    return;
  }
  try {
    displayResponse("Humanizing...");
    const response = await fetch("http://localhost:5000/api/humanizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (response.ok && data.result) {
      displayResponse(`Humanizer Response:\n\n${data.result}`);
    } else {
      displayResponse("Error: Unable to retrieve a response from Humanizer.");
    }
  } catch (error) {
    displayResponse("An error occurred while fetching the Humanizer response.");
  }
}

function displayResponse(responseText) {
  document.getElementById("response").textContent = responseText;
}
