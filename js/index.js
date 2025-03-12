document.addEventListener("DOMContentLoaded", () => {
  let questions = [],
    answers = [],
    currentQuestionIndex = 0;
  const quizQuestion = document.getElementById("question");
  const answersContainer = document.getElementById("answers");
  const footer = document.querySelector(".footer");
  const modal = document.getElementById("modal");
  const registrationForm = document.getElementById("registrationForm");
  const phoneInput = document.getElementById("phone");
  const successMessage = document.getElementById("successMessage");

  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "ua",
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

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
      modal.style.display = "block";
    }
  }

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: iti.getNumber(),
      answers: answers,
    };

    fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Успішно відправлено:", data);
        successMessage.style.display = "block";
      })
      .catch((error) => {
        console.error("Помилка відправки:", error);
      });
  });
});
