import { useEffect, useState } from "react";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Moon,
  Sun,
  Lightbulb,
  Code,
  Globe,
  Database,
  Award,
} from "lucide-react";
import "./App.css";

const questionBank = {
  "Web Development": [
    {
      question: "Which language is mainly used to structure a web page?",
      type: "single",
      options: ["CSS", "HTML", "JavaScript", "Python"],
      answer: "HTML",
      difficulty: "Easy",
      explanation: "HTML is used to create the structure of web pages.",
    },
    {
      question: "Which technology is used to make a webpage interactive?",
      type: "single",
      options: ["HTML", "CSS", "JavaScript", "SQL"],
      answer: "JavaScript",
      difficulty: "Easy",
      explanation: "JavaScript adds logic and interactivity to web pages.",
    },
    {
      question: "Which of these are valid CSS properties?",
      type: "multi",
      options: ["color", "margin", "font-size", "print()"],
      answer: ["color", "margin", "font-size"],
      difficulty: "Medium",
      explanation:
        "Color, margin and font-size are valid CSS properties.",
    },
    {
      question: "CSS is used to style web pages.",
      type: "truefalse",
      options: ["True", "False"],
      answer: "True",
      difficulty: "Easy",
      explanation:
        "CSS controls the appearance and layout of web pages.",
    },
    {
      question: "Which HTML tag is used to create a hyperlink?",
      type: "single",
      options: ["<p>", "<a>", "<img>", "<link>"],
      answer: "<a>",
      difficulty: "Easy",
      explanation:
        "The <a> tag is used to create hyperlinks in HTML.",
    },
    {
      question: "Which of these can be used to add styles to HTML?",
      type: "multi",
      options: ["Inline CSS", "Internal CSS", "External CSS", "SQL"],
      answer: ["Inline CSS", "Internal CSS", "External CSS"],
      difficulty: "Medium",
      explanation:
        "CSS can be added using inline, internal or external CSS.",
    },
  ],

  JavaScript: [
    {
      question:
        "Which keyword is used to declare a variable that cannot be reassigned?",
      type: "single",
      options: ["var", "let", "const", "static"],
      answer: "const",
      difficulty: "Easy",
      explanation:
        "The const keyword creates a variable that cannot be reassigned.",
    },
    {
      question:
        "Which symbol is used for a single-line comment in JavaScript?",
      type: "single",
      options: ["//", "/*", "#", "<!--"],
      answer: "//",
      difficulty: "Easy",
      explanation:
        "JavaScript uses // for single-line comments.",
    },
    {
      question: "Which of these are JavaScript data types?",
      type: "multi",
      options: ["String", "Number", "Boolean", "HTML"],
      answer: ["String", "Number", "Boolean"],
      difficulty: "Medium",
      explanation:
        "String, Number and Boolean are JavaScript data types.",
    },
    {
      question: "Complete the sentence: React is a JavaScript ______.",
      type: "fill",
      answer: "library",
      difficulty: "Medium",
      explanation:
        "React is a JavaScript library for building user interfaces.",
    },
    {
      question: "Which method converts JSON text into a JavaScript object?",
      type: "single",
      options: [
        "JSON.parse()",
        "JSON.stringify()",
        "JSON.convert()",
        "JSON.object()",
      ],
      answer: "JSON.parse()",
      difficulty: "Medium",
      explanation:
        "JSON.parse() converts JSON text into a JavaScript object.",
    },
    {
      question: "JavaScript is a case-sensitive language.",
      type: "truefalse",
      options: ["True", "False"],
      answer: "True",
      difficulty: "Easy",
      explanation:
        "JavaScript treats uppercase and lowercase letters differently.",
    },
  ],

  "Programming Basics": [
    {
      question: "Which data structure follows FIFO?",
      type: "single",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: "Queue",
      difficulty: "Easy",
      explanation:
        "A queue follows First In, First Out (FIFO).",
    },
    {
      question: "Which data structure follows LIFO?",
      type: "single",
      options: ["Queue", "Array", "Stack", "Graph"],
      answer: "Stack",
      difficulty: "Easy",
      explanation:
        "A stack follows Last In, First Out (LIFO).",
    },
    {
      question: "Which of these are common programming languages?",
      type: "multi",
      options: ["C", "Java", "Python", "HTML"],
      answer: ["C", "Java", "Python"],
      difficulty: "Easy",
      explanation:
        "C, Java and Python are programming languages. HTML is a markup language.",
    },
    {
      question:
        "An algorithm is a step-by-step procedure for solving a problem.",
      type: "truefalse",
      options: ["True", "False"],
      answer: "True",
      difficulty: "Easy",
      explanation:
        "An algorithm is a finite sequence of steps used to solve a problem.",
    },
    {
      question: "Which symbol is commonly used for assignment in programming?",
      type: "single",
      options: ["=", "==", "!=", "==="],
      answer: "=",
      difficulty: "Easy",
      explanation:
        "The = operator is commonly used to assign a value to a variable.",
    },
    {
      question: "Which of these are data structures?",
      type: "multi",
      options: ["Array", "Stack", "Queue", "Compiler"],
      answer: ["Array", "Stack", "Queue"],
      difficulty: "Medium",
      explanation:
        "Array, Stack and Queue are common data structures.",
    },
  ],
};

const categoryIcons = {
  "Web Development": <Globe size={30} />,
  JavaScript: <Code size={30} />,
  "Programming Basics": <Database size={30} />,
};

function App() {
  const [screen, setScreen] = useState("home");

  const [playerName, setPlayerName] = useState("");

  const [category, setCategory] = useState("");

  const [difficulty, setDifficulty] = useState("All");

  const [questions, setQuestions] = useState([]);

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const [darkMode, setDarkMode] = useState(false);

  const [showHint, setShowHint] = useState(false);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("quizHighScore")) || 0
  );

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("quizLeaderboard")
      ) || [];
    } catch {
      return [];
    }
  });

  const question = questions[current];

  /* TIMER */

  useEffect(() => {
    if (screen !== "quiz") return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  /* START QUIZ */

  const startQuiz = () => {
    if (!category || !playerName.trim()) return;

    let selectedQuestions = questionBank[category];

    if (difficulty !== "All") {
      selectedQuestions = selectedQuestions.filter(
        (q) => q.difficulty === difficulty
      );
    }

    if (selectedQuestions.length === 0) {
      selectedQuestions = questionBank[category];
    }

    selectedQuestions = [...selectedQuestions].sort(
      () => Math.random() - 0.5
    );

    setQuestions(selectedQuestions);
    setCurrent(0);
    setAnswers({});
    setScore(0);
    setTimeLeft(30);
    setShowHint(false);
    setScreen("quiz");
  };

  /* SELECT ANSWER */

  const selectAnswer = (option) => {
    if (!question) return;

    if (question.type === "multi") {
      const existing = answers[current] || [];

      if (existing.includes(option)) {
        setAnswers({
          ...answers,
          [current]: existing.filter(
            (item) => item !== option
          ),
        });
      } else {
        setAnswers({
          ...answers,
          [current]: [...existing, option],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [current]: option,
      });
    }
  };

  /* CHECK ANSWER */

  const isCorrect = (index) => {
    if (!questions[index]) return false;

    const userAnswer = answers[index];

    const correctAnswer = questions[index].answer;

    if (
      userAnswer === undefined ||
      userAnswer === null ||
      userAnswer === ""
    ) {
      return false;
    }

    if (questions[index].type === "multi") {
      if (!Array.isArray(userAnswer)) return false;

      return (
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((item) =>
          correctAnswer.includes(item)
        )
      );
    }

    return (
      String(userAnswer).trim().toLowerCase() ===
      String(correctAnswer).trim().toLowerCase()
    );
  };

  /* NEXT QUESTION */

  const handleNext = () => {
    const currentCorrect = isCorrect(current);

    const newScore = currentCorrect ? score + 10 : score;

    if (currentCorrect) {
      setScore((previous) => previous + 10);
    }

    if (current === questions.length - 1) {
      finishQuiz(newScore);
    } else {
      setCurrent((previous) => previous + 1);
      setTimeLeft(30);
      setShowHint(false);
    }
  };

  /* FINISH QUIZ */

  const finishQuiz = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);

      localStorage.setItem(
        "quizHighScore",
        finalScore
      );
    }

    const newEntry = {
      name: playerName.trim(),
      score: finalScore,
      category: category,
    };

    const updatedLeaderboard = [
      ...leaderboard,
      newEntry,
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setLeaderboard(updatedLeaderboard);

    localStorage.setItem(
      "quizLeaderboard",
      JSON.stringify(updatedLeaderboard)
    );

    setScreen("result");
  };

  /* PREVIOUS */

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent((previous) => previous - 1);
      setTimeLeft(30);
      setShowHint(false);
    }
  };

  /* RESET */

  const resetQuiz = () => {
    setScreen("home");
    setCategory("");
    setDifficulty("All");
    setQuestions([]);
    setCurrent(0);
    setAnswers({});
    setScore(0);
    setTimeLeft(30);
    setShowHint(false);
  };

  /* SCORE */

  const percentage =
    questions.length > 0
      ? Math.round(
          (score / (questions.length * 10)) * 100
        )
      : 0;

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* NAVBAR */}

      <header className="navbar">

        <div className="logo">
          <Trophy size={26} />
          <span>QuizMaster</span>
        </div>

        <div className="nav-right">

          <div className="nav-highscore">
            <Trophy size={17} />
            Best: {highScore}
          </div>

          <button
            className="theme-btn"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

        </div>

      </header>

      {/* ================= HOME ================= */}

      {screen === "home" && (

        <main className="home">

          <div className="hero">

            <div className="hero-icon">
              <Trophy size={45} />
            </div>

            <h1>Test Your Knowledge</h1>

            <p>
              Challenge yourself with interactive
              questions, multiple categories and
              different difficulty levels.
            </p>

            <div className="features">

              <div>
                <strong>3</strong>
                <span>Categories</span>
              </div>

              <div>
                <strong>4</strong>
                <span>Question Types</span>
              </div>

              <div>
                <strong>{highScore}</strong>
                <span>High Score</span>
              </div>

            </div>

            <div className="home-buttons">

              <button
                className="primary-btn"
                onClick={() =>
                  setScreen("setup")
                }
              >
                Choose Quiz
                <ArrowRight size={20} />
              </button>

              <button
                className="leaderboard-btn"
                onClick={() =>
                  setScreen("leaderboard")
                }
              >
                <Trophy size={18} />
                View Leaderboard
              </button>

            </div>

          </div>

        </main>

      )}

      {/* ================= SETUP ================= */}

      {screen === "setup" && (

        <main className="setup-container">

          <div className="setup-card">

            <button
              className="back-link"
              onClick={() =>
                setScreen("home")
              }
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1>Set Up Your Quiz</h1>

            <p>
              Choose your name, category and
              difficulty.
            </p>

            {/* NAME */}

            <h3>Enter Your Name</h3>

            <input
              className="name-input"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) =>
                setPlayerName(e.target.value)
              }
              maxLength={20}
            />

            {/* CATEGORY */}

            <h3>Select Category</h3>

            <div className="category-grid">

              {Object.keys(questionBank).map(
                (item) => (

                  <button
                    key={item}
                    className={`category-card ${
                      category === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCategory(item)
                    }
                  >
                    {categoryIcons[item]}

                    <span>{item}</span>

                  </button>

                )
              )}

            </div>

            {/* DIFFICULTY */}

            <h3>Select Difficulty</h3>

            <div className="difficulty-grid">

              {[
                "All",
                "Easy",
                "Medium",
                "Hard",
              ].map((item) => (

                <button
                  key={item}
                  className={
                    difficulty === item
                      ? "difficulty active"
                      : "difficulty"
                  }
                  onClick={() =>
                    setDifficulty(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>

            <button
              className="primary-btn start-btn"
              disabled={
                !category ||
                !playerName.trim()
              }
              onClick={startQuiz}
            >
              Start Quiz
              <ArrowRight size={20} />
            </button>

          </div>

        </main>

      )}

      {/* ================= QUIZ ================= */}

      {screen === "quiz" && question && (

        <main className="quiz-container">

          <div className="quiz-top">

            <span>
              Question {current + 1} of{" "}
              {questions.length}
            </span>

            <div
              className={`timer ${
                timeLeft <= 10
                  ? "timer-warning"
                  : ""
              }`}
            >
              <Clock size={18} />
              {timeLeft}s
            </div>

          </div>

          <div className="progress">

            <div
              className="progress-bar"
              style={{
                width: `${
                  ((current + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />

          </div>

          <section className="question-card">

            <div className="question-labels">

              <div className="question-type">

                {question.type === "multi"
                  ? "MULTI SELECT"
                  : question.type ===
                    "truefalse"
                  ? "TRUE / FALSE"
                  : question.type === "fill"
                  ? "FILL IN THE BLANK"
                  : "SINGLE SELECT"}

              </div>

              <span className="difficulty-label">
                {question.difficulty}
              </span>

            </div>

            <h2>{question.question}</h2>

            {/* FILL IN BLANK */}

            {question.type === "fill" ? (

              <input
                className="fill-input"
                type="text"
                placeholder="Type your answer..."
                value={answers[current] || ""}
                onChange={(e) =>
                  selectAnswer(
                    e.target.value
                  )
                }
              />

            ) : (

              <div className="options">

                {question.options.map(
                  (option) => {

                    const selected =
                      Array.isArray(
                        answers[current]
                      )
                        ? answers[
                            current
                          ].includes(option)
                        : answers[current] ===
                          option;

                    return (

                      <button
                        key={option}
                        className={`option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectAnswer(option)
                        }
                      >

                        <span className="option-circle">

                          {selected && (
                            <CheckCircle
                              size={19}
                            />
                          )}

                        </span>

                        {option}

                      </button>

                    );

                  }
                )}

              </div>

            )}

            {/* HINT */}

            {showHint && (

              <div className="hint">

                <Lightbulb size={20} />

                <span>
                  Think carefully and
                  eliminate the options
                  that don't match the
                  question.
                </span>

              </div>

            )}

            <button
              className="hint-btn"
              onClick={() =>
                setShowHint(!showHint)
              }
            >
              <Lightbulb size={18} />

              {showHint
                ? "Hide Hint"
                : "Show Hint"}

            </button>

          </section>

          {/* ACTIONS */}

          <div className="quiz-actions">

            <button
              className="secondary-btn"
              onClick={handlePrevious}
              disabled={current === 0}
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            <button
              className="primary-btn"
              onClick={handleNext}
            >
              {current ===
              questions.length - 1
                ? "Finish Quiz"
                : "Next"}

              <ArrowRight size={18} />

            </button>

          </div>

        </main>

      )}

      {/* ================= RESULT ================= */}

      {screen === "result" && (

        <main className="result-container">

          <div className="result-card">

            <div className="result-icon">

              {percentage >= 70 ? (
                <Trophy size={50} />
              ) : (
                <XCircle size={50} />
              )}

            </div>

            <h1>Quiz Completed!</h1>

            <p className="result-player">
              Well done,{" "}
              <strong>{playerName}</strong>!
            </p>

            <p className="result-message">

              {percentage >= 80
                ? "Excellent work! 🎉"
                : percentage >= 60
                ? "Good job! Keep improving! 👍"
                : "Keep practicing and try again! 💪"}

            </p>

            <div className="score-circle">

              <strong>{percentage}%</strong>

              <span>Score</span>

            </div>

            <div className="result-stats">

              <div>

                <CheckCircle size={22} />

                <strong>
                  {score / 10}
                </strong>

                <span>Correct</span>

              </div>

              <div>

                <XCircle size={22} />

                <strong>
                  {questions.length -
                    score / 10}
                </strong>

                <span>Incorrect</span>

              </div>

              <div>

                <Trophy size={22} />

                <strong>{score}</strong>

                <span>Points</span>

              </div>

            </div>

            {score >= highScore &&
              score > 0 && (

                <div className="new-highscore">

                  <Award size={22} />

                  🎉 New High Score!

                </div>

              )}

            <div className="result-buttons">

              <button
                className="primary-btn"
                onClick={() =>
                  setScreen("review")
                }
              >
                <CheckCircle size={19} />
                Review Answers
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  setScreen("leaderboard")
                }
              >
                <Trophy size={19} />
                Leaderboard
              </button>

              <button
                className="secondary-btn"
                onClick={resetQuiz}
              >
                <RotateCcw size={19} />
                Home
              </button>

            </div>

          </div>

        </main>

      )}

      {/* ================= REVIEW ================= */}

      {screen === "review" && (

        <main className="review-container">

          <div className="review-header">

            <div>

              <h1>Answer Review</h1>

              <p>
                {playerName}'s score:{" "}
                <strong>
                  {score}
                </strong>{" "}
                /{" "}
                {questions.length * 10}
              </p>

            </div>

            <button
              className="secondary-btn"
              onClick={() =>
                setScreen("result")
              }
            >
              <ArrowLeft size={18} />
              Result
            </button>

          </div>

          <div className="review-list">

            {questions.map((q, index) => {

              const correct =
                isCorrect(index);

              const userAnswer =
                answers[index];

              return (

                <div
                  className={`review-card ${
                    correct
                      ? "review-correct"
                      : "review-wrong"
                  }`}
                  key={index}
                >

                  <div className="review-number">

                    {correct ? (
                      <CheckCircle size={22} />
                    ) : (
                      <XCircle size={22} />
                    )}

                    <span>
                      Question {index + 1}
                    </span>

                  </div>

                  <h3>{q.question}</h3>

                  <div className="review-answer">

                    <strong>
                      Your answer:
                    </strong>

                    <span>

                      {Array.isArray(
                        userAnswer
                      )
                        ? userAnswer.join(", ")
                        : userAnswer ||
                          "Not answered"}

                    </span>

                  </div>

                  <div className="review-answer correct-answer">

                    <strong>
                      Correct answer:
                    </strong>

                    <span>

                      {Array.isArray(
                        q.answer
                      )
                        ? q.answer.join(", ")
                        : q.answer}

                    </span>

                  </div>

                  <div className="explanation">

                    <strong>
                      Explanation:
                    </strong>

                    <p>
                      {q.explanation}
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

          <div className="review-bottom">

            <button
              className="primary-btn"
              onClick={startQuiz}
            >
              <RotateCcw size={19} />
              Try Again
            </button>

          </div>

        </main>

      )}

      {/* ================= LEADERBOARD ================= */}

      {screen === "leaderboard" && (

        <main className="leaderboard-container">

          <div className="leaderboard-card">

            <div className="leaderboard-title">

              <Trophy size={45} />

              <h1>Leaderboard</h1>

              <p>
                Top 5 Scores
              </p>

            </div>

            {leaderboard.length === 0 ? (

              <p className="empty-leaderboard">
                No scores yet.
                <br />
                Be the first champion!
              </p>

            ) : (

              <div className="leaderboard-list">

                {leaderboard.map(
                  (entry, index) => (

                    <div
                      className={`leaderboard-row ${
                        index === 0
                          ? "champion"
                          : ""
                      }`}
                      key={index}
                    >

                      <div className="rank">

                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `#${index + 1}`}

                      </div>

                      <div className="player-info">

                        <strong>
                          {entry.name}
                        </strong>

                        <span>
                          {entry.category}
                        </span>

                      </div>

                      <strong className="leaderboard-score">
                        {entry.score}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )}

            <div className="leaderboard-actions">

              <button
                className="primary-btn"
                onClick={() =>
                  setScreen("home")
                }
              >
                <ArrowLeft size={18} />
                Back to Home
              </button>

              {leaderboard.length > 0 && (

                <button
                  className="secondary-btn"
                  onClick={() => {

                    localStorage.removeItem(
                      "quizLeaderboard"
                    );

                    setLeaderboard([]);

                  }}
                >
                  Clear Scores
                </button>

              )}

            </div>

          </div>

        </main>

      )}

    </div>
  );
}

export default App;