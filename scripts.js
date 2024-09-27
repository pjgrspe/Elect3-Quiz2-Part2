$(document).ready(function() {
    //toastr options
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    let questions = [
        {
            question: "What does HTML stand for?",
            answers: [
                { text: "Hyperlinks and Text Markup Language", correct: false },
                { text: "Home Tool Markup Language", correct: false },
                { text: "Hyper Text Markup Language", correct: true },
                { text: "Hyper Tool Markup Language", correct: false }
            ]
        },
        {
            question: "What is the correct way to link an external CSS file?",
            answers: [
                { text: '<style src="style.css">', correct: false },
                { text: '<link rel="stylesheet" href="style.css">', correct: true },
                { text: '<stylesheet link="style.css">', correct: false },
                { text: '<css link="style.css">', correct: false }
            ]
        },
        {
            question: "Which JavaScript keyword declares a variable?",
            answers: [
                { text: "var", correct: true },
                { text: "define", correct: false },
                { text: "letvar", correct: false },
                { text: "constant", correct: false }
            ]
        },
        {
            question: "Which tag is used to create a hyperlink in HTML?",
            answers: [
                { text: "<link>", correct: false },
                { text: "<href>", correct: false },
                { text: "<anchor>", correct: false },
                { text: "<a>", correct: true }
            ]
        },
        {
            question: "Which CSS property controls the text size?",
            answers: [
                { text: "text-style", correct: false },
                { text: "font-size", correct: true },
                { text: "font-weight", correct: false },
                { text: "size", correct: false }
            ]
        }
        //more questions here
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    //Start quiz function
    $("#start-btn").click(function() {
        $("#landing-page").hide();
        $("#quiz-page").fadeIn();
        showQuestion();
        updateProgress();
    });
    
    //handle submit function
    function handleSubmit(event) {
        event.preventDefault();

        const selectedAnswer = $("input[name='answer_" + currentQuestionIndex + "']:checked");

        if (selectedAnswer.length === 0) {
            //no answer selected
            toastr.warning("Please select an answer before submitting!");
            return;
        }
        $("#submit-btn").prop("disabled", true);

        const isCorrect = selectedAnswer.val() === "true";
        if (isCorrect) {
            score++;
            showFeedback("Correct!", "success");
            selectedAnswer.closest("label").addClass("correct");
        } else {
            showFeedback("Incorrect!", "error");
            selectedAnswer.closest("label").addClass("wrong");
        }

        //next question or show result
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            setTimeout(function() {
                showQuestion();
                $("#submit-btn").prop("disabled", false);
            }, 300);
        } else {
            setTimeout(showResults, 300); //show result
        }

        updateProgress();
    }

    $("#submit-btn").click(handleSubmit);

    //restart quiz
    $("#restart-btn").click(function() {
        score = 0;
        currentQuestionIndex = 0;

        //shuffle questions and answers
        shuffle(questions);
        questions.forEach(question => shuffle(question.answers));

        //reset
        $("#feedback").hide();  //Hide feedback section
        $("#quiz-form").show();  //Show the quiz form again
        $("#quiz-page").fadeIn();  //Show quiz page again

        showQuestion();
        updateProgress();
        $("#submit-btn").prop("disabled", false);
    });

    //update progress bar
    function updateProgress() {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        $("#progress").css("width", progressPercentage + "%");
    }

    function showResults() {
        //calculation if user passed or failed
        const percentage = (score / questions.length) * 100;
    
        let feedbackMessage;
        if (percentage >= 70) {
            feedbackMessage = `Congratulations! You scored ${score} out of ${questions.length}.`;
        } else {
            feedbackMessage = `Better luck next time. You scored ${score} out of ${questions.length}.`;
        }
    
        //feedback message
        $("#quiz-form").hide();
        $("#feedback").fadeIn();
        $("#feedback-message").text(feedbackMessage);
    }

    //Show feedback (Correct or Incorrect)
    function showFeedback(message, type) {
        toastr[type](message);
    }

    //Show current question
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        const questionContainer = $("#question-container");
    
        questionContainer.fadeOut(300, function() { 
            questionContainer.empty();
    
            //Display question text with numbering
            const questionElement = $("<p>").text((currentQuestionIndex + 1) + ". " + question.question);
            questionContainer.append(questionElement);
    
            //Display answers
            question.answers.forEach((answer, index) => {
                const label = $("<label>").addClass("answers");
                
                //unique ID for each answer
                const inputId = "answer_" + currentQuestionIndex + "_" + index;
                
                const input = $("<input>")
                    .attr("type", "radio")
                    .attr("name", "answer_" + currentQuestionIndex)  //unique name for each question
                    .attr("id", inputId)
                    .attr("value", answer.correct);  //store if answer is correct or not
    
                const answerText = $("<span>").text(answer.text);  //answer text
    
                //append input and answer text to label
                label.append(input).append(answerText);
                label.hide();
                
                //append label to question container
                questionContainer.append(label);
                label.fadeIn(200 * (index + 1));
            });
    
            //fade in question container
            questionContainer.fadeIn(200);
        });
    }
});