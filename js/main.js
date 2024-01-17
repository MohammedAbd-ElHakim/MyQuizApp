//select element
let countSpan = document.querySelector('.count span');
let bulletsSpanCountainer = document.querySelector('.bullets .spans');
let quiz_area = document.querySelector('.quiz_area');
let answers_area = document.querySelector('.answers_area');
let submit_btn = document.querySelector('.submit_button');
let bullets2 = document.querySelector('.bullets');
let results = document.querySelector('.results');
let count_down = document.querySelector('.count_down');


//set options
let currentIndex = 0;
let right_ansr = 0;
let coutDownInterval;


//get json dada
function getQuestions() {

    let request = new XMLHttpRequest();


    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            let question_object = JSON.parse(this.responseText);
            let questions_count = question_object.length;

            console.log(questions_count);
            console.log(question_object);
            console.log(this.readyState);

            //create bullets + set questions count
            createBullets(questions_count);

            //add question data
            addquestiondata(question_object[currentIndex], questions_count);

            //Start CountDown
            countDown(5, questions_count);



            //click on submit
            submit_btn.onclick = function () {
                //get right answer
                let right_answer = question_object[currentIndex].right_answer;

                //increase index
                currentIndex++;

                //check the answer
                checkAnswer(right_answer, questions_count);

                //remove previous questions
                quiz_area.innerHTML = '';
                answers_area.innerHTML = '';

                //add next question
                addquestiondata(question_object[currentIndex], questions_count);


                //handle bullets class
                hundleBullets();

                //Start CountDown
                clearInterval(coutDownInterval);
                countDown(5, questions_count);

                //show results
                showResults(questions_count);
            };

        }
        else {
            // console.log(this.readyState);
            // console.log(this.status);
            // console.log(this);



            console.log('field');
        }
    };

    request.open('GET', '../questions/questions.json', true);
    request.send();

}

getQuestions();

//count bullets
function createBullets(num) {

    countSpan.innerHTML = num;

    //create spans
    for (let i = 0; i < num; i++) {

        //create span
        let theBullet = document.createElement('span');

        //check first span
        if (i == 0) {
            theBullet.className = 'on';
        }
        //append bullets to main bullet container
        bulletsSpanCountainer.appendChild(theBullet);
    }
}

function addquestiondata(obj, count) {
    if (currentIndex < count) {
        // console.log(obj['title']);
        // console.log(count);

        //create h2 
        let questionTitle = document.createElement('h2');

        //create question text
        let text_question = document.createTextNode(obj['title']);

        //append
        questionTitle.appendChild(text_question);

        //add h2 to quiz area
        quiz_area.appendChild(questionTitle);

        //create the answers
        for (let index = 1; index < 4 + 1; index++) {

            //create main answer div
            let main_div = document.createElement('div');

            //add class to main div
            main_div.className = 'answer';

            //create radio inout
            let radioInput = document.createElement('input');

            //add type + Name + id + data=attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${index}`;
            radioInput.dataset.answer = obj[`answer_${index}`];

            // console.log(`answer_${index}`);

            //make first option selected
            if (index == 1) {
                radioInput.checked = true;
            }

            // create label
            let label = document.createElement('label');

            //add for attribute
            label.htmlFor = `answer_${index}`;
            // console.log(label.htmlFor);

            //create label text
            let labelText = document.createTextNode(obj[`answer_${index}`]);
            // console.log(labelText);

            //add the text to label
            label.appendChild(labelText);

            //add input + label to main div
            //  add input + label to main div
            main_div.appendChild(radioInput);
            main_div.appendChild(label);

            //append all div to answers_area
            answers_area.appendChild(main_div);
            // console.log(main_div);

            // console.log('index [0]:');
            // console.log(obj[0]);

        }

    }

}


function checkAnswer(Ranswer, count) {
    let answers = document.getElementsByName('question');
    let choosen_answer;
    // console.log('index .lngth');
    // console.log(answers);

    for (let index = 0; index < answers.length; index++) {
        // console.log(index);
        if (answers[index].checked) {
            // console.log('inside');
            choosen_answer = answers[index].dataset.answer;
        }
    }

    console.log('right answer is : ' + Ranswer);
    console.log('choosen answer is : ' + choosen_answer);

    if (Ranswer === choosen_answer) {
        right_ansr++;
        console.log('Good Answer');
    } else {
        console.log('bad answer');
    }
}

function hundleBullets() {
    let bulletSpans = document.querySelectorAll('.bullets .spans span');
    console.log(bulletSpans);
    let arrayOfSpans = Array.from(bulletSpans);

    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    });
}

function showResults(count) {
    let the_results;
    if (currentIndex === count) {
        quiz_area.remove();
        answers_area.remove();
        submit_btn.remove();
        bullets2.remove();

        if (right_ansr > (count / 2) && right_ansr < count) {
            the_results = `<span class="good">Good</span>,${right_ansr} From ${count} is Good `;
        } else if (right_ansr == count) {
            the_results = `<span class="perfect">perfect</span>, All Answer is Good `;
        } else {
            the_results = `<span class="bad">Bad</span>, ${right_ansr} From ${count} is Good `;
        }
        console.log(`right_ansr`);
        console.log(right_ansr);
        console.log(`count`);
        console.log(count);

        results.innerHTML = the_results;
        results.style.padding = '10px';
        results.style.backgroundColor = "white";
        results.style.margintop = "10px";

    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        coutDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            count_down.innerHTML = `${minutes} : ${seconds}`;

            if (--duration < 0) {
                clearInterval(coutDownInterval);
                submit_btn.click();
                console.log("Finsished");
            }



        }, 1000);
    }
}
