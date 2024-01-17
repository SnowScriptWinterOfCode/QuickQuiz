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

// CONSTANTS
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

        const timeRemaining = parseInt(timeCount.textContent);

        if (classToApply === 'correct') {
            let scoreToAdd = 0;
            if (timeRemaining > 10 && timeRemaining <= 15) {
                scoreToAdd = 10;
            } else if (timeRemaining > 5 && timeRemaining <= 10) {
                scoreToAdd = 5;
            } else if (timeRemaining > 0 && timeRemaining <= 5) {
                scoreToAdd = 2;
            }
            incrementScore(scoreToAdd);
            soundCorrect.play();
        } else {
            soundIncorrect.play();
        }

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
        timeCount.textContent = time;         
        time--; 
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
        if(time <5)
        {
            document.getElementById("timer").classList.add("alert");
        }
        else{
            document.getElementById("timer").classList.remove("alert");
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

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;

    const pointsDisplay = document.createElement('div');
    pointsDisplay.classList.add('points-display');
    pointsDisplay.innerText = `+${num}`;
    document.body.appendChild(pointsDisplay);

    setTimeout(() => {
        pointsDisplay.remove();
    }, 1000);
};

var count=0;
function muteMe(elem) {
    elem.muted = true;
    elem.pause();
}

var playPauseBTN = document.getElementById('playpauseBTN')
function playpause(){
    if(count==0){
        count==1;
        Audio.play();
    }else{
        count=0;
        audio.pause();
        [].slice.call(document.querySelectorAll('audio')).forEach(function(audio) {
            Audio.muted = true;
        });
    }
}
