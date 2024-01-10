const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const time_line = document.querySelector(".time .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const question1= document.getElementById('question1');

var soundCorrect = new Audio("sounds/correctAns.mp3");
var soundIncorrect = new Audio("sounds/wrongAns.mp3");
var myMusic = new Audio("sounds/gametheme.mp3");

let timeValue = 15;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let counter;
let counterLine;
let widthValue = 0;

let questions = [];


fetch(
    'https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    myMusic.play();
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    next_btn.classList.remove("show"); 
};

const next_btn = document.querySelector("footer .next_btn");

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    question1.innerText = `Question  ${questionCounter}`;//update question number
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
    clearInterval(counter); 
    clearInterval(counterLine); 
    startTimer(timeValue); 
    startTimerLine(widthValue); 
    timeText.textContent = "Time Left"; 
};

next_btn.onclick = ()=>{
    getNewQuestion();
}

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        clearInterval(counter); 
        clearInterval(counterLine); 

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
            soundCorrect.play();
        } else {
            soundIncorrect.play();
            display(currentQuestion.answer);
        }
        setInterval(displaynone,4000);
       

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
    next_btn.classList.add("show"); 
});

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;         time--; 
        if (time < 9) { 
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; 
        }
        if (time <= 0) { 
            clearInterval(counter); 
            getNewQuestion();
            timeText.textContent = "Time Off"; 
            const allOptions = choices.children.length; 
            let correcAns = questions[questionCounter].answer; 
            for (i = 0; i < allOptions; i++) {
                if (choices.children[i].textContent == correcAns) { 
                    choices.children[i].setAttribute("class", "option correct"); 
                    choices.children[i].insertAdjacentHTML("beforeend", tickIconTag); 
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for (i = 0; i < allOptions; i++) {
                choices.children[i].classList.add("disabled"); 
            }
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1; 
        time_line.style.width = time + "px"; 
        if (time > 549) { 
            clearInterval(counterLine); 
        }
    }
}
let string;
function display(string) {
    let display = document.getElementById('display');
    if (string == 1) { 
    display.innerText = `Correct option : A`;
    }
    if (string == 2) { 
        display.innerText = `Correct option : B`;
    }
    if (string == 3) { 
        display.innerText = `Correct option : C`;
    }
    if (string == 4) { 
        display.innerText = `Correct option : D`;
        }

}
function displaynone() {
    let display = document.getElementById('display');
    display.innerText = `Correct option : `;
}
incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
