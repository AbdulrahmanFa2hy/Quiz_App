let countNum = document.querySelector(".count span");
let parentBullets = document.querySelector(".bullets");
let bulletSpan = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let myBtn = document.querySelector("button");
let countdownElement = document.querySelector(".countdown");
let counter = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qLength = questionsObject.length;
      // Add Count Num to Questions Number
      addCountNum(qLength);
      addQuestionData(questionsObject[counter], qLength);
      // Start countdown
      countdown(20, qLength);
      // Button click
      myBtn.addEventListener("click", () => {
        let rightAnswer = questionsObject[counter].right_answer;
        checkAnswer(rightAnswer, qLength);
        answersArea.innerHTML = "";
        quizArea.innerHTML = "";
        counter++;
        if (counter < qLength) {
          addQuestionData(questionsObject[counter], qLength);
          handelBullets();
        }
        // Start Countdown
        clearInterval(countdownInterval);
        countdown(20, qLength);
        if (counter == qLength) {
          showResults();
        }
      });
    }
  };

  myRequest.open("GET", "HTML_Question.json", true);
  myRequest.send();
}
getQuestions();

// Create Count Num Function
function addCountNum(num) {
  countNum.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    bulletSpan.appendChild(span);
    if (i == 0) {
      span.className = "on";
    }
  }
}

function addQuestionData(ques, num) {
  // Create h2
  let h2 = document.createElement("h2");
  h2.textContent = ques.title;
  quizArea.appendChild(h2);
  for (let i = 1; i <= 4; i++) {
    // Create Ansewrs
    let div = document.createElement("div");
    div.classList.add("answer", "p-2");
    // Create Input
    let input = document.createElement("input");
    input.classList.add("form-check-input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "question");
    input.setAttribute("id", `answer_${i}`);
    input.dataset.answer = ques[`answer_${i}`];
    if (i === 1) {
      input.checked = true;
    }
    // Append input to Answers div
    div.appendChild(input);
    // Create Label
    let label = document.createElement("label");
    label.setAttribute("for", `answer_${i}`);
    label.classList.add("form-check-label", "ms-2");
    label.textContent = ques[`answer_${i}`];
    // Append label to div + append div to answers area
    div.appendChild(label);
    answersArea.appendChild(div);
  }
}

function checkAnswer(rAnswer, num) {
  console.log(rAnswer, num);
  let answers = document.getElementsByName("question");
  let chosenAnswer;
  for (let i = 0; i < 4; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (chosenAnswer == rAnswer) {
    rightAnswer++;
    console.log("good answer");
  }
}
function handelBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  bullets[counter].className = "on";
}

function showResults() {
  let theResults = document.querySelector(".results");
  quizArea.remove();
  myBtn.remove();
  answersArea.remove();
  parentBullets.remove();
  if (rightAnswer > 2 && rightAnswer < counter) {
    theResults.innerHTML = `<span class="good">Good</span>, ${rightAnswer} from ${counter}`;
  } else if (rightAnswer == counter) {
    theResults.innerHTML = `<span class="perfect">Perfect</span>, All Answer Is Right`;
  } else {
    theResults.innerHTML = `<span class="bad">Bad</span>, ${rightAnswer} from ${counter}`;
  }

  theResults.style.padding = "10px";
  theResults.style.marginTop = "10px";
  theResults.style.backgroundColor = "white";
}

function countdown(duration, count) {
  if (counter < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        myBtn.click();
      }
    }, 1000);
  }
}
