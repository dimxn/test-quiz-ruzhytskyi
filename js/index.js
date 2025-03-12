document.addEventListener("DOMContentLoaded", () => {
  let questions = [],
    answers = [],
    currentQuestionIndex = 0;
  const quizQuestion = document.getElementById("question");
  const answersContainer = document.getElementById("answers");
  const footer = document.querySelector(".footer");

  fetch("../data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions;
      displayQuestion();
    });

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    quizQuestion.innerText = question.question;
    answersContainer.innerHTML = "";

    question.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.classList.add("quiz__answer");
      button.innerText = answer;
      button.addEventListener("click", () => handleAnswer(answer));
      answersContainer.appendChild(button);
    });

    footer.innerText = `${currentQuestionIndex + 1}/${questions.length}`;
  }

  function handleAnswer(answer) {
    answers.push(answer);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      console.log("Всі запитання пройдено", answers);
    }
  }
});
