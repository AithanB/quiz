"use strict";

const questions = [
	{
		question: "В каком военном звании состоит Тарас Бульба?",
		answers: ["Хорунжий", "Сотник", "Есаул", "Полковник"],
		correct: 4
	},
	{
		question: "Сколько сыновей у Тараса Бульбы?",
		answers: ["1", "2", "3", "5"],
		correct: 2
	},
	{
		question: "Как Тарас Бульба относится к образованию?",

		answers: [
		"Нейтрально", 
		"Пренебрежительно", 
		"Одобрительно", 
		"Тарас и его дети безграмотны"],

		correct: 2
	},
	{
		question: "Куда Бульба решает отправить сыновей сразу по их возвращении домой?",
		answers: ["Польша", "Османская империя", "Запорожская Сечь", "Московия"],
		correct: 3
	},
];

const headerContainer = document.querySelector("#header");
const listContainer = document.querySelector("#list");
const submitButton = document.querySelector("#submit");

let score = 0;
let currentQuestion = 0;
let selectedAnswerIndex = null;
let processingAnswer = false;

clearQuiz();
showQuestion();

submitButton.onclick = checkAnswer;

function clearQuiz() {
	headerContainer.innerHTML = '';
	listContainer.innerHTML = '';
	selectedAnswerIndex = null;
}

function showQuestion() {

	const titleHTML = 
	`<span class="quiz-progress">${currentQuestion + 1}/${questions.length}</span>
	<h2 class="title">${questions[currentQuestion]['question']}</h2>`;

	headerContainer.innerHTML = titleHTML;

	for (let [answerIndex, answerText] of questions[currentQuestion]['answers'].entries()) {

		let answerHTML = 
		`<li data-index='${+answerIndex + 1}'>
			<label>
				<span class='answer-text'>${answerText}</span>
			</label>
		</li>`

		listContainer.insertAdjacentHTML('beforeend', answerHTML);

		const answerElements = listContainer.querySelectorAll('li');

  	answerElements.forEach(element => {
    	element.addEventListener('click', handleAnswerClick);
  	});

	}
}

function handleAnswerClick(event) {
  const answerElements = listContainer.querySelectorAll('li');

  answerElements.forEach(element => {
    element.classList.remove('selected');
  });

  const selectedElement = event.target.closest('li');
  selectedElement.classList.add('selected');

  selectedAnswerIndex = selectedElement.dataset.index;
}

function checkAnswer() {

    if (processingAnswer) {
        return;
    }

    processingAnswer = true;

    const answerElements = listContainer.querySelectorAll('li');

    answerElements.forEach(element => {
        element.style.pointerEvents = 'none';
    });

    if (selectedAnswerIndex === null) {
        answerElements.forEach(element => {
            element.style.pointerEvents = 'auto';
        });

        processingAnswer = false;

        return;
    }

    answerElements.forEach(element => {
        element.classList.remove('selected');
    });

    const correctIndex = questions[currentQuestion]['correct'];
    const userSelectedIndex = parseInt(selectedAnswerIndex);

    if (userSelectedIndex === correctIndex) {
        score++;

        answerElements[userSelectedIndex - 1].classList.add('correct');

    } else {
        answerElements[userSelectedIndex - 1].classList.add('incorrect');

        answerElements[correctIndex - 1].classList.add('correct');
    }

    setTimeout(() => {
        if (currentQuestion !== questions.length - 1) {
            currentQuestion++;
            clearQuiz();
            showQuestion();
            selectedAnswerIndex = null;

            answerElements.forEach(element => {
                element.style.pointerEvents = 'auto';
            });

        } else {
            clearQuiz();
            showResults();
        }

        processingAnswer = false;

    }, 1000);
}



// function checkAnswer() {

// 	if (selectedAnswerIndex === null) {
// 		return;
// 	} else if (selectedAnswerIndex == questions[currentQuestion]['correct']) {
// 		score++;
// 	}
	
// 	if (currentQuestion !== questions.length - 1) {
// 		currentQuestion++;
// 		clearQuiz();
// 		showQuestion();
// 		return;
// 	}

// 	clearQuiz();
// 	showResults();

// }


function showResults() {

	let title, message;

	if (score === questions.length) {

		title = 'Поздравляем!';
		message = 'Вы правильно ответили на все вопросы!';

	} else if ((score * 100) / questions.length >= 50) {

		title = 'Неплохо!';
		message = 'Ваш результат был хорошим, но есть место для роста.';

	} else {

		title = 'Стоит постараться!';
		message = 'Ваш результат ниже ожидаемого. Продолжайте учиться и в следующий раз будет лучше!';

	}

	let result = `${score} из ${questions.length} правильных ответов`

	const resultsHTML = `
		<h2 class="final-title">${title}</h2>
		<h3 class="summary">${message}</h3>
		<p class="result">${result}</p>
	`;

	headerContainer.innerHTML = resultsHTML;

	submitButton.innerText = 'Начать заново';
	submitButton.onclick = () => {
		location.reload();
	};

}
