document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const start_btn = document.querySelector(".start_btn button");
    const info_box = document.querySelector(".info_box");
    const exit_btn = info_box.querySelector(".buttons .quit");
    const continue_btn = info_box.querySelector(".buttons .restart");
    const quiz_box = document.querySelector(".quiz_box");
    const result_box = document.querySelector(".result_box");
    const option_list = document.querySelector(".option_list");
    const time_line = document.querySelector("header .time_line");
    const timeText = document.querySelector(".timer .time_left_txt");
    const timeCount = document.querySelector(".timer .timer_sec");
    const next_btn = document.querySelector("footer .next_btn");
    const bottom_ques_counter = document.querySelector("footer .total_que");

    let questions = [];
    let timeValue = 15;
    let que_count = 0;
    let que_numb = 1;
    let userScore = 0;
    let counter;
    let counterLine;
    let widthValue = 0;

    start_btn.onclick = () => {
        info_box.classList.add("activeInfo"); //show info box
    };

    exit_btn.onclick = () => {
        info_box.classList.remove("activeInfo"); //hide info box
        window.reload()
    };
 
    continue_btn.onclick = async () => {
        info_box.classList.remove("activeInfo"); //hide info box
        quiz_box.classList.add("activeQuiz"); //show quiz box
        questions = await fetchQuizData(); // Fetch and set quiz questions
        showQuetions(0); // Show first question
        queCounter(1); // Initialize question counter
        startTimer(timeValue); // Start timer for first question
        startTimerLine(widthValue); // Start timer line
    };

    next_btn.onclick = () => {
        if (que_count < questions.length - 1) {
            que_count++;
            que_numb++;
            showQuetions(que_count);
            queCounter(que_numb);
            clearInterval(counter);
            clearInterval(counterLine);
            startTimer(timeValue);
            startTimerLine(widthValue);
            next_btn.classList.remove("show");
        } else {
            clearInterval(counter);
            clearInterval(counterLine);
            showResult();
        }
    };

    async function fetchQuizData() {
        try {
            const response = await fetch('quiz_output.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.questions; // Assuming the JSON structure you provided
        } catch (error) {
            console.error('Could not fetch quiz data:', error);
        }
    }

    function showQuetions(index) {
        const que_text = document.querySelector(".que_text");

        let que_tag = `<span>${questions[index].question}</span>`;
        let option_tag = questions[index].options.map(option =>
            `<div class="option"><span>${option}</span></div>`
        ).join('');

        que_text.innerHTML = que_tag;
        option_list.innerHTML = option_tag;

        const options = option_list.querySelectorAll(".option");
        options.forEach(option => {
            option.setAttribute("onclick", "optionSelected(this)");
        });
    }

    window.optionSelected = function (option) {
        clearInterval(counter);
        clearInterval(counterLine);
        let userAns = option.textContent;
        let correcAns = questions[que_count].correct_answer;
        const allOptions = option_list.children.length;

        if (userAns === correcAns) {
            userScore++;
            option.classList.add("correct");
            console.log("Correct Answer");
            console.log("Your correct answers = " + userScore);
        } else {
            option.classList.add("incorrect");
            console.log("Wrong Answer");
        }

        for (let i = 0; i < allOptions; i++) {
            option_list.children[i].classList.add("disabled");
            if (option_list.children[i].textContent === correcAns) {
                option_list.children[i].classList.add("correct");
            }
        }
        next_btn.classList.add("show");
    };

    function showResult() {
        info_box.classList.remove("activeInfo");
        quiz_box.classList.remove("activeQuiz");
        result_box.classList.add("activeResult");
        const scoreText = result_box.querySelector(".score_text");
        let scoreTag = `<span> You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
        scoreText.innerHTML = scoreTag;
    }

    function startTimer(time) {
        counter = setInterval(timer, 1000);
        function timer() {
            timeCount.textContent = time < 10 ? `0${time}` : time;
            time--;
            if (time < 0) {
                clearInterval(counter);
                timeText.textContent = "Time Off";
                showCorrectAnswer();
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

    function showCorrectAnswer() {
        const allOptions = option_list.children.length;
        let correcAns = questions[que_count].correct_answer;
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent === correcAns) {
                option_list.children[i].classList.add("correct");
            }
            option_list.children[i].classList.add("disabled");
        }
        next_btn.classList.add("show");
    }

    function queCounter(index) {
        let totalQueCounTag = `<span><p>${index}</p> of <p>${questions.length}</p> Questions</span>`;
        bottom_ques_counter.innerHTML = totalQueCounTag;
    }
});
