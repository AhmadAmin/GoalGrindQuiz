// Listen for the form submission
document.getElementById('quiz-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form from reloading the page on submit

  // Disable the submit button immediately to prevent spamming.
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  // Helper function to retrieve the answer for a given question name
  function getAnswer(questionName) {
    const answerElem = document.querySelector('input[name="' + questionName + '"]:checked');
    return answerElem ? answerElem.value : null;
  }

  // Define the scoring mappings for each category based on the provided scoring system
  const imposterMapping = {
    imposter1: { A: 0, B: 1, C: 2, D: 2 },
    imposter2: { A: 0, B: 2, C: 2, D: 0 },
    imposter3: { A: 0, B: 1, C: 2, D: 0 },
    imposter4: { A: 0, B: 1, C: 2, D: 0 },
    imposter5: { A: 0, B: 1, C: 2, D: 0 },
    imposter6: { A: 0, B: 1, C: 2, D: 0 }
  };

  const stressMapping = {
    stress1: { A: 2, B: 2, C: 1, D: 0 },
    stress2: { A: 0, B: 1, C: 2, D: 1 },
    stress3: { A: 0, B: 1, C: 2, D: 0 },
    stress4: { A: 0, B: 1, C: 2, D: 1 },
    stress5: { A: 0, B: 1, C: 2, D: 1 },
    stress6: { A: 0, B: 1, C: 2, D: 1 }
  };

  const planningMapping = {
    planning1: { A: 0, B: 2, C: 1, D: 2 },
    planning2: { A: 0, B: 1, C: 2, D: 2 },
    planning3: { A: 0, B: 1, C: 2, D: 0 },
    planning4: { A: 0, B: 1, C: 2, D: 1 },
    planning5: { A: 0, B: 1, C: 2, D: 2 },
    planning6: { A: 0, B: 1, C: 2, D: 0 }
  };

  const taskMapping = {
    task1: { A: 0, B: 1, C: 2, D: 2 },
    task2: { A: 0, B: 1, C: 2, D: 2 },
    task3: { A: 0, B: 1, C: 2, D: 2 },
    task4: { A: 0, B: 1, C: 2, D: 2 },
    task5: { A: 0, B: 1, C: 2, D: 1 },
    task6: { A: 0, B: 1, C: 2, D: 2 }
  };

  const hardMapping = {
    hard1: { A: 0, B: 1, C: 2, D: 0 },
    hard2: { A: 0, B: 1, C: 2, D: 1 },
    hard3: { A: 0, B: 1, C: 2, D: 2 },
    hard4: { A: 0, B: 1, C: 2, D: 1 },
    hard5: { A: 0, B: 1, C: 2, D: 0 },
    hard6: { A: 0, B: 1, C: 2, D: 1 }
  };

  // List of all question identifiers for validation purposes
  const allQuestions = [
    // Imposter Syndrome
    "imposter1", "imposter2", "imposter3", "imposter4", "imposter5", "imposter6",
    // Stress
    "stress1", "stress2", "stress3", "stress4", "stress5", "stress6",
    // Planning Issues
    "planning1", "planning2", "planning3", "planning4", "planning5", "planning6",
    // Task Management
    "task1", "task2", "task3", "task4", "task5", "task6",
    // Hard Targets
    "hard1", "hard2", "hard3", "hard4", "hard5", "hard6"
  ];

  // Validate that all questions have been answered
  for (let q of allQuestions) {
    if (!getAnswer(q)) {
      alert("Please answer all questions.");
      submitButton.disabled = false;
      return;
    }
  }

  // Calculate total score for a given category mapping
  function calculateScore(mapping) {
    let total = 0;
    for (let key in mapping) {
      const answer = getAnswer(key);
      total += mapping[key][answer];
    }
    return total;
  }

  // Calculate scores for each category
  const imposterScore = calculateScore(imposterMapping);
  const stressScore = calculateScore(stressMapping);
  const planningScore = calculateScore(planningMapping);
  const taskScore = calculateScore(taskMapping);
  const hardScore = calculateScore(hardMapping);

  // Determine levels based on thresholds: Low (0-4), Medium (5-8), High (9-12)
  function getLevel(score) {
    if (score <= 4) return "Low";
    else if (score <= 8) return "Medium";
    else return "High";
  }

  const imposterLevel = getLevel(imposterScore);
  const stressLevel   = getLevel(stressScore);
  const planningLevel = getLevel(planningScore);
  const taskLevel     = getLevel(taskScore);
  const hardLevel     = getLevel(hardScore);

  // Compile results per category in an array
  const categories = [
    { name: "Imposter Syndrome", score: imposterScore, level: imposterLevel },
    { name: "Stress", score: stressScore, level: stressLevel },
    { name: "Planning Issues", score: planningScore, level: planningLevel },
    { name: "Task Management", score: taskScore, level: taskLevel },
    { name: "Hard Targets", score: hardScore, level: hardLevel }
  ];

  // Determine the primary pain point (the category with the highest score)
  let primaryCategory = categories[0];
  categories.forEach(cat => {
    if (cat.score > primaryCategory.score) primaryCategory = cat;
  });

  // Build a result report message
  let resultMessage = "Quiz Results:\n";
  categories.forEach(cat => {
    resultMessage += `${cat.name}: ${cat.score} (${cat.level})\n`;
  });
  resultMessage += `\nPrimary Pain Point: ${primaryCategory.name}`;

  // Save the results in localStorage so the thank-you page can display them.
  localStorage.setItem("quizResults", resultMessage);

  // (Optional) Hide any existing results display on the quiz page.
  const resultsDiv = document.getElementById('results');
  if (resultsDiv) {
    resultsDiv.style.display = "none";
  }

  // Show a loading spinner until redirection.
  const loadingSpinner = document.createElement("div");
  loadingSpinner.id = "loading-spinner";
  loadingSpinner.innerHTML = `
    <div class="spinner"></div>
    <p>Hold tight while our wizards brew up your results!</p>
  `;
  document.body.appendChild(loadingSpinner);

  // Grab the optional email from the "Join the Movement" section.
  const joinEmail = document.querySelector('input[name="joinEmail"]').value.trim();

  // Send the submission including the email (if provided) to the Google Spreadsheet.
  // Note: We return the fetch promise and wait for it to complete before redirecting.
  sendSubmissionToSheet({
    imposterScore: imposterScore,
    stressScore: stressScore,
    planningScore: planningScore,
    taskScore: taskScore,
    hardScore: hardScore,
    primaryPainPoint: primaryCategory.name,
    email: joinEmail  // Will be an empty string if no email is provided.
  }).finally(() => {
    // Optionally, add a short delay so the loading animation is visible.
    setTimeout(() => {
      // Reset the form so that if the user clicks "Back", they see a blank quiz.
      document.getElementById('quiz-form').reset();

      // Redirect to the thank-you page.
      window.location.href = "../thankyou.html";
    }, 1000); // 1 second delay
  });
});

// Stub function to send an email notification with the quiz results
function sendEmailNotification(resultText) {
  console.log("Sending email with the following result:\n" + resultText);
  // TODO: Integrate with an email service provider (e.g., EmailJS or a backend API)
}

// Function to send the submission data to Google Spreadsheet
function sendSubmissionToSheet(results) {
  const submissionData = {
    imposterScore: results.imposterScore,
    stressScore: results.stressScore,
    planningScore: results.planningScore,
    taskScore: results.taskScore,
    hardScore: results.hardScore,
    primaryPainPoint: results.primaryPainPoint,
    email: results.email
  };

  // Return the fetch promise so we can wait for it before redirecting.
  return fetch("https://script.google.com/macros/s/AKfycbzInIw6NyP9DZJnNWO1WtaJyICf3_AVeNhSGAuAgnMiq-PHZaDmtDN4hkKQUZaRP5IoWw/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(submissionData)
  })
  .then(response => {
    console.log("Submission sent!", response);
  })
  .catch(error => {
    console.error("Error sending submission", error);
  });
}

// --- Progress Bar and Motivational Messages Code ---

// Function to update the progress bar and motivational message.
function updateProgress() {
  // Count answered questions (radio button is checked) among elements with the class "question"
  const answeredQuestions = document.querySelectorAll('.question input[type="radio"]:checked').length;
  const totalQuestions = document.querySelectorAll('.question').length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  
  // Update the progress bar width.
  document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
  
  // Update the motivational message based on milestones.
  let message = "";
  // For example, if the first section has 3 questions, show a message after answering 3 questions:
  if (answeredQuestions === 3) {
    message = "Great job! Now let's tackle the next challenge!";
  } else if (answeredQuestions === 6) {
    message = "You're on fire – the next round awaits!";
  }
  // You can continue adding conditions for further milestones if needed.
  document.getElementById('motivational-message').innerText = message;
}

// Attach event listeners on all radio inputs inside ".question" elements.
document.querySelectorAll('.question input[type="radio"]').forEach(input => {
  input.addEventListener('change', updateProgress);
});

// Optionally, initialize the progress bar on page load.
updateProgress();