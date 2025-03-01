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

// Function to update the progress bar and gamification elements
function updateProgress() {
  // Count answered questions (radio button is checked) among elements with the class "question"
  const answeredQuestions = document.querySelectorAll('.question input[type="radio"]:checked').length;
  const totalQuestions = document.querySelectorAll('.question').length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  
  // Update the progress bar width.
  document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
  
  // Update progress percentage text
  document.getElementById('progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
  
  // Update the achievement badges based on milestones
  updateAchievements(answeredQuestions, totalQuestions);
}

// Function to handle achievement badges and animations
function updateAchievements(answered, total) {
  const achievements = [
    { threshold: Math.floor(total * 0.2), id: 'achievement-starter', title: 'Getting Started', message: 'You\'ve begun your journey!' },
    { threshold: Math.floor(total * 0.4), id: 'achievement-explorer', title: 'Explorer', message: 'You\'re making great progress!' },
    { threshold: Math.floor(total * 0.6), id: 'achievement-committed', title: 'Committed', message: 'Over halfway there! Keep going!' },
    { threshold: Math.floor(total * 0.8), id: 'achievement-determined', title: 'Determined', message: 'Almost there! You can do it!' },
    { threshold: total, id: 'achievement-completer', title: 'Completer', message: 'Congratulations on finishing the quiz!' }
  ];
  
  // Check for newly unlocked achievements
  for (const achievement of achievements) {
    const achievementElement = document.getElementById(achievement.id);
    
    if (answered >= achievement.threshold) {
      if (achievementElement && !achievementElement.classList.contains('unlocked')) {
        // Unlock the achievement with animation
        achievementElement.classList.add('unlocked');
        
        // Show achievement notification
        showAchievementNotification(achievement.title, achievement.message);
      }
    }
  }
}

// Function to show achievement notification
function showAchievementNotification(title, message) {
  // Create notification element if it doesn't exist
  if (!document.getElementById('achievement-notification')) {
    const notification = document.createElement('div');
    notification.id = 'achievement-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🏆</div>
        <div class="notification-text">
          <h3>Achievement Unlocked!</h3>
          <h4 id="achievement-title"></h4>
          <p id="achievement-message"></p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Add click event to dismiss notification
    notification.addEventListener('click', function() {
      this.classList.remove('show');
    });
  }
  
  // Update notification content
  document.getElementById('achievement-title').textContent = title;
  document.getElementById('achievement-message').textContent = message;
  
  // Show notification with animation
  const notification = document.getElementById('achievement-notification');
  notification.classList.add('show');
  
  // Auto-hide notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// Function to initialize gamification elements
function initializeGamification() {
  // Create gamification container if it doesn't exist
  if (!document.getElementById('gamification-container')) {
    const container = document.createElement('div');
    container.id = 'gamification-container';
    
    // Create progress indicator with percentage
    const progressIndicator = document.createElement('div');
    progressIndicator.id = 'progress-indicator';
    progressIndicator.innerHTML = `
      <div class="progress-circle">
        <span id="progress-percentage">0%</span>
      </div>
      <span class="progress-label">Completed</span>
    `;
    
    // Create achievements section
    const achievementsSection = document.createElement('div');
    achievementsSection.id = 'achievements-section';
    achievementsSection.innerHTML = `
      <h3>Your Progress</h3>
      <div class="achievements-list">
        <div id="achievement-starter" class="achievement">
          <div class="achievement-icon">🌱</div>
          <div class="achievement-info">
            <span class="achievement-name">Getting Started</span>
          </div>
        </div>
        <div id="achievement-explorer" class="achievement">
          <div class="achievement-icon">🔍</div>
          <div class="achievement-info">
            <span class="achievement-name">Explorer</span>
          </div>
        </div>
        <div id="achievement-committed" class="achievement">
          <div class="achievement-icon">🔄</div>
          <div class="achievement-info">
            <span class="achievement-name">Committed</span>
          </div>
        </div>
        <div id="achievement-determined" class="achievement">
          <div class="achievement-icon">💪</div>
          <div class="achievement-info">
            <span class="achievement-name">Determined</span>
          </div>
        </div>
        <div id="achievement-completer" class="achievement">
          <div class="achievement-icon">🏆</div>
          <div class="achievement-info">
            <span class="achievement-name">Completer</span>
          </div>
        </div>
      </div>
    `;
    
    // Append elements to container
    container.appendChild(progressIndicator);
    container.appendChild(achievementsSection);
    
    // Add container to the page (after the progress wrapper)
    const progressWrapper = document.getElementById('progress-wrapper');
    progressWrapper.parentNode.insertBefore(container, progressWrapper.nextSibling);
  }
  
  // Initialize progress
  updateProgress();
}

// Attach event listeners on all radio inputs inside ".question" elements.
document.querySelectorAll('.question input[type="radio"]').forEach(input => {
  input.addEventListener('change', updateProgress);
});

// Initialize gamification on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeGamification();
  
  // Next page buttons
  document.querySelectorAll('.next-page-btn').forEach(button => {
    button.addEventListener('click', function() {
      const currentPage = this.closest('.quiz-page');
      const currentPageNum = parseInt(currentPage.id.split('-')[1]);
      const nextPageNum = currentPageNum + 1;
      const nextPage = document.getElementById(`page-${nextPageNum}`);
      
      // Validate that all questions on current page are answered
      const questions = currentPage.querySelectorAll('.question');
      let allAnswered = true;
      
      questions.forEach(question => {
        const questionName = question.querySelector('input[type="radio"]').name;
        const answered = !!document.querySelector(`input[name="${questionName}"]:checked`);
        if (!answered) {
          allAnswered = false;
        }
      });
      
      if (!allAnswered) {
        alert('Please answer all questions on this page before continuing.');
        return;
      }
      
      // Hide current page, show next page
      currentPage.classList.remove('active');
      nextPage.classList.add('active');
      
      // Update page indicators
      document.querySelector(`.page-indicator[data-page="${currentPageNum}"]`).classList.remove('active');
      document.querySelector(`.page-indicator[data-page="${nextPageNum}"]`).classList.add('active');
      
      // Scroll to top of the page
      window.scrollTo(0, 0);
      
      // Update progress bar
      updateProgress();
    });
  });
  
  // Previous page buttons
  document.querySelectorAll('.prev-page-btn').forEach(button => {
    button.addEventListener('click', function() {
      const currentPage = this.closest('.quiz-page');
      const currentPageNum = parseInt(currentPage.id.split('-')[1]);
      const prevPageNum = currentPageNum - 1;
      const prevPage = document.getElementById(`page-${prevPageNum}`);
      
      // Hide current page, show previous page
      currentPage.classList.remove('active');
      prevPage.classList.add('active');
      
      // Update page indicators
      document.querySelector(`.page-indicator[data-page="${currentPageNum}"]`).classList.remove('active');
      document.querySelector(`.page-indicator[data-page="${prevPageNum}"]`).classList.add('active');
      
      // Scroll to top of the page
      window.scrollTo(0, 0);
    });
  });
  
  // Make page indicators clickable (but only if previous pages are completed)
  document.querySelectorAll('.page-indicator').forEach(indicator => {
    indicator.addEventListener('click', function() {
      const targetPageNum = parseInt(this.getAttribute('data-page'));
      const currentPageNum = parseInt(document.querySelector('.quiz-page.active').id.split('-')[1]);
      
      // Only allow navigation to previous pages or the next page if all questions are answered
      if (targetPageNum < currentPageNum) {
        // Navigate to a previous page
        document.querySelector('.quiz-page.active').classList.remove('active');
        document.getElementById(`page-${targetPageNum}`).classList.add('active');
        
        document.querySelector('.page-indicator.active').classList.remove('active');
        this.classList.add('active');
        
        window.scrollTo(0, 0);
      } else if (targetPageNum === currentPageNum + 1) {
        // Try to navigate to the next page (will validate answers)
        document.querySelector(`#page-${currentPageNum} .next-page-btn`).click();
      }
    });
  });
  
  // Update the progress calculation to account for pagination
  window.updateProgress = function() {
    const answeredQuestions = document.querySelectorAll('.question input[type="radio"]:checked').length;
    const totalQuestions = document.querySelectorAll('.question').length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    
    // Update motivational message based on progress
    let message = "";
    if (progressPercentage < 20) {
      message = "Keep going! You're doing great!";
    } else if (progressPercentage < 40) {
      message = "You're halfway there! Keep pushing!";
    } else if (progressPercentage < 60) {
      message = "You're making progress! Keep up the good work!";
    } else if (progressPercentage < 80) {
      message = "Almost there! Keep pushing!";
    } else {
      message = "You've completed the quiz! Great job!";
    }
    document.getElementById('motivational-message').innerText = message;
  };
});