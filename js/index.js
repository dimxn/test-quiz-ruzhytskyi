document.addEventListener("DOMContentLoaded", () => {
  let questions = [],
    answers = [],
    currentQuestionIndex = 0;
  const quizQuestion = document.getElementById("question");
  const answersContainer = document.getElementById("answers");
  const footer = document.querySelector(".footer");

  const modal = document.createElement("div");
  modal.id = "modal";
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Реєстрація</h2>
      <p>Дякуємо що пройшли наше опитування, заповніть цю форму аби з вами звʼязалися.</p>
      <form id="registrationForm">
        <input type="text" class="registrationForm__input" id="name" name="name" placeholder="Імʼя" required />
        <input type="email" class="registrationForm__input" id="email" name="email" placeholder="Email" required />
        <input type="tel" class="registrationForm__input" id="phone" name="phone" required />
        <span id="successMessage" style="display: none; color: green">Дякуємо за участь! 😊</span>
        <button type="submit" class="quiz__answer">Відправити</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const registrationForm = modal.querySelector("#registrationForm");
  const phoneInput = modal.querySelector("#phone");
  const successMessage = modal.querySelector("#successMessage");

  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "ua",
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  fetch("data/questions.json")
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
        setTimeout(() => {
          alert("Для перегляду результатів відкрийте консоль");
        }, 3000);
      })
      .catch((error) => {
        console.error("Помилка відправки:", error);
      });
  });
});
