
        // Quiz questions data
        const quizData = [
            {
                question: "Which of the following is NOT a JavaScript data type?",
                options: ["String", "Boolean", "Float", "Symbol"],
                correct: 2,
                explanation: "Float is not a JavaScript data type. JavaScript has Number which represents both integer and floating-point numbers."
            },
            {
                question: "What will be the output of: console.log(typeof null)?",
                options: ["null", "undefined", "object", "string"],
                correct: 2,
                explanation: "This is a known quirk in JavaScript - typeof null returns 'object' due to a historical bug in the language."
            },
            {
                question: "Which method is used to add one or more elements to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correct: 0,
                explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array."
            },
            {
                question: "What does the '===' operator do in JavaScript?",
                options: [
                    "Assigns a value to a variable",
                    "Compares both value and type",
                    "Compares only value",
                    "Checks if a variable is defined"
                ],
                correct: 1,
                explanation: "The '===' operator is the strict equality operator that compares both value and type without performing type coercion."
            },
            {
                question: "Which keyword is used to declare a variable in JavaScript that cannot be reassigned?",
                options: ["var", "let", "const", "static"],
                correct: 2,
                explanation: "The 'const' keyword is used to declare variables that cannot be reassigned. However, note that objects and arrays declared with const can still be mutated."
            }
        ];

        // DOM elements
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const currentQuestionElement = document.getElementById('current-question');
        const totalQuestionsElement = document.getElementById('total-questions');
        const progressBar = document.getElementById('progress-bar');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const questionContainer = document.getElementById('question-container');
        const resultsContainer = document.getElementById('results-container');
        const scoreCircle = document.getElementById('score-circle');
        const scoreText = document.getElementById('score-text');
        const scoreMessage = document.getElementById('score-message');
        const scoreDetails = document.getElementById('score-details');
        const answersContainer = document.getElementById('answers-container');
        const restartBtn = document.getElementById('restart-btn');
        const timerElement = document.getElementById('timer');

        // Quiz state
        let currentQuestion = 0;
        let userAnswers = new Array(quizData.length).fill(null);
        let score = 0;
        let timeLeft = 60;
        let timerInterval;

        // Initialize quiz
        function initQuiz() {
            totalQuestionsElement.textContent = quizData.length;
            updateQuestion();
            startTimer();
        }

        // Update question and options
        function updateQuestion() {
            const question = quizData[currentQuestion];
            questionText.textContent = question.question;
            currentQuestionElement.textContent = currentQuestion + 1;
            
            // Update progress bar
            progressBar.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
            
            // Clear previous options
            optionsContainer.innerHTML = '';
            
            // Add new options
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                
                if (userAnswers[currentQuestion] === index) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.innerHTML = `
                    <div class="option-label">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${option}</div>
                `;
                
                optionElement.addEventListener('click', () => selectOption(index));
                optionsContainer.appendChild(optionElement);
            });
            
            // Update button states
            prevBtn.disabled = currentQuestion === 0;
            
            if (currentQuestion === quizData.length - 1) {
                nextBtn.textContent = 'Submit Quiz';
            } else {
                nextBtn.textContent = 'Next';
            }
        }

        // Select an option
        function selectOption(optionIndex) {
            userAnswers[currentQuestion] = optionIndex;
            
            // Update UI to show selected option
            const options = document.querySelectorAll('.option');
            options.forEach((option, index) => {
                if (index === optionIndex) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        }

        // Navigate to next question
        function nextQuestion() {
            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                updateQuestion();
            } else {
                submitQuiz();
            }
        }

        // Navigate to previous question
        function prevQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                updateQuestion();
            }
        }

        // Submit quiz and show results
        function submitQuiz() {
            clearInterval(timerInterval);
            
            // Calculate score
            score = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === quizData[index].correct) {
                    score++;
                }
            });
            
            // Calculate percentage
            const percentage = (score / quizData.length) * 100;
            
            // Update results UI
            scoreText.textContent = `${percentage}%`;
            scoreDetails.textContent = `You scored ${score} out of ${quizData.length} questions correctly.`;
            
            // Set score message based on performance
            if (percentage >= 80) {
                scoreMessage.textContent = "Excellent! 🎉";
                scoreMessage.style.color = "var(--correct)";
            } else if (percentage >= 60) {
                scoreMessage.textContent = "Good job! 👍";
                scoreMessage.style.color = "var(--secondary)";
            } else {
                scoreMessage.textContent = "Keep practicing! 💪";
                scoreMessage.style.color = "var(--incorrect)";
            }
            
            // Animate score circle
            setTimeout(() => {
                scoreCircle.style.background = `conic-gradient(var(--primary) ${percentage}%, transparent ${percentage}%)`;
            }, 100);
            
            // Display answers
            displayAnswers();
            
            // Show results and hide question container
            questionContainer.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
        }

        // Display all questions with user answers and correct answers
        function displayAnswers() {
            answersContainer.innerHTML = '';
            
            quizData.forEach((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correct;
                
                const answerItem = document.createElement('div');
                answerItem.classList.add('answer-item');
                answerItem.classList.add(isCorrect ? 'correct' : 'incorrect');
                
                let userAnswerText = "Not answered";
                if (userAnswer !== null) {
                    userAnswerText = `${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}`;
                }
                
                const correctAnswerText = `${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}`;
                
                answerItem.innerHTML = `
                    <div class="answer-question">${index + 1}. ${question.question}</div>
                    <div class="answer-user ${isCorrect ? 'correct' : 'incorrect'}">Your answer: ${userAnswerText}</div>
                    <div class="answer-correct">Correct answer: ${correctAnswerText}</div>
                    <div class="answer-explanation">${question.explanation}</div>
                `;
                
                answersContainer.appendChild(answerItem);
            });
        }

        // Restart quiz
        function restartQuiz() {
            currentQuestion = 0;
            userAnswers = new Array(quizData.length).fill(null);
            score = 0;
            timeLeft = 60;
            
            // Reset UI
            questionContainer.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            timerElement.textContent = `Time: ${timeLeft}s`;
            timerElement.classList.remove('warning');
            
            updateQuestion();
            startTimer();
        }

        // Timer functionality
        function startTimer() {
            clearInterval(timerInterval);
            timeLeft = 60;
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 10) {
                    timerElement.classList.add('warning');
                }
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    submitQuiz();
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            timerElement.textContent = `Time: ${timeLeft}s`;
        }

        // Event listeners
        nextBtn.addEventListener('click', nextQuestion);
        prevBtn.addEventListener('click', prevQuestion);
        restartBtn.addEventListener('click', restartQuiz);

        // Initialize the quiz
        initQuiz();
  