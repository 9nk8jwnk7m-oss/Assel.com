const CONFIG = {
    targetName: "Асель",         
    age: 16,                    
    
    loveLetter: "Дорогая Асель\n\nПоздравляю тебя с днём рождения! Тебе уже 16, и я искренне желаю тебе всего самого лучшего. Ты моя самая близкая подруга, и мне до сих пор не верится, что мы дружим ещё с 6 класса.\n\nСейчас я пишу это письмо и думаю о том, как же мне с тобой повезло. Ты стала мне не просто подругой, а настоящей сестрой. Ты человек, которому я могу доверить всё. Честно, я даже удивлена, что мы обе дожили до этого возраста, учитывая всё, что пережили в детстве.\n\nЖиви ярко, не бойся делать глупости и ошибаться. И помни: если ты упадёшь, я сначала посмеюсь над тобой, а потом обязательно помогу подняться. Что бы ни случилось и куда бы нас ни завела жизнь, я всегда буду рада помочь тебе и поддержать.\n\nМне очень хочется, чтобы мы проводили больше времени вместе, пока не поступили в университет. Иногда я боюсь, что однажды мы перестанем общаться, но я точно знаю одно — ты навсегда займёшь особое место в моём сердце.\n\nКогда мне хочется всё бросить и ничего не делать, я вспоминаю тебя и твой голос: «Всё будет, хуйня это, справимся». Ты моя семья, пусть и не по крови.\n\nЗнаешь, о чём я жалею? О том, что мы не сможем жить вечно. Что однажды я не смогу написать тебе в час ночи: «Блять, я снова влюбилась, спасай». Но пока это время не пришло, я хочу смеяться, жить и создавать воспоминания вместе с тобой.\n\nЕщё раз поздравляю тебя с днюхой! Люблю тебя, Читос ❤️\n\n P.S. Это письмо я писала целых две недели :)",
    
    photoUrl: "assel.jpg", 
    
    // ВПИШИ СЮДА ТОЧНОЕ НАЗВАНИЕ ФАЙЛА ИЗ ПАПКИ (например: "music.mp3")
    musicUrl: "duvet.MP3", 
    
    // --- ДИНАМИЧЕСКИЕ ГИФКИ ДЛЯ СОСТОЯНИЙ ---
    gifDefault: "cat.gif",  
    gifSuccess: "catwin.gif",  
    gifError: "sadcat.gif",     

    // Вопросы викторины
    questions: [
        {
            question: "На кого похожа наша химичка?",
            options: ["Бабаушка с семейки крудс", "Бабушка с три богатыря"],
            correctIndex: 0, 
            successReply: "Правильно! Держи заслуженную звездочку! ⭐"
        },
        {
            question: "Кто такой зига?",
            options: ["Типочек", "Одноклассник"],
            correctIndex: 1,
            successReply: "В точку! Лови еще одну звезду ⭐ "
        },
        {
            question: "Кто такой акмурын?",
            options: ["Саня", "Вадя"],
            correctIndex: 0,
            successReply: "Уровень пройден! Получай еще звезду ⭐"
        }
    ]
};

/* ==========================================================================
   ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ИНИЦИАЛИЗАЦИЯ
   ========================================================================== */
let currentQuestionIndex = 0;
let hp = 5;

// Привязка данных из CONFIG
document.getElementById('level-unlocked-text').innerText = `LEVEL ${CONFIG.age} UNLOCKED!`;
document.getElementById('couple-photo').src = CONFIG.photoUrl;
document.getElementById('congrats-letter-text').innerText = CONFIG.loveLetter;
document.getElementById('quest-gif').src = CONFIG.gifDefault;

// Загружаем аудио заранее
const audio = document.getElementById('bg-music');
audio.src = CONFIG.musicUrl;
audio.volume = 0.8;
audio.load();

function switchScene(sceneNumber) {
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    document.getElementById(`scene-${sceneNumber}`).classList.add('active');
}

function typeWriter(text, elementId, speed = 40, callback = null) {
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

/* ==========================================================================
   УПРАВЛЕНИЕ СЦЕНАМИ И ТРИГГЕРЫ
   ========================================================================== */

// Клик по START — Включает музыку и открывает двери
document.getElementById('start-btn').addEventListener('click', () => {
    // Включение музыки СРАЗУ на клике (разрешено браузерами)
    audio.play()
        .then(() => {
            document.getElementById('player-status').style.display = 'block';
        })
        .catch(e => console.log("Ошибка воспроизведения. Проверь имя файла:", e));

    const scene1 = document.getElementById('scene-1');
    scene1.classList.add('doors-open');
    document.getElementById('start-btn').style.display = 'none';
    
    setTimeout(() => {
        switchScene(2);
    }, 800);
});

document.getElementById('continue-btn').addEventListener('click', () => {
    switchScene(3);
    startQuestIntro();
});

/* ==========================================================================
   ЛОГИКА КВЕСТА
   ========================================================================== */

function startQuestIntro() {
    const introText1 = `Привет, ${CONFIG.targetName}! Чтобы забрать свой подарок, тебе нужно пройти проверку на знание вопросов...`;
    
    typeWriter(introText1, 'dialogue-output', 40, () => {
        setTimeout(() => {
            typeWriter("Удачи дура и повеселись! Нажми кнопку внизу, чтобы начать.", 'dialogue-output', 40, () => {
                showNextQuestionButton();
            });
        }, 2000);
    });
}

function showNextQuestionButton() {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const startQuizBtn = document.createElement('button');
    startQuizBtn.className = 'pixel-btn';
    startQuizBtn.innerText = 'НАЧАТЬ КВЕСТ';
    startQuizBtn.onclick = loadQuestion;
    optionsContainer.appendChild(startQuizBtn);
}

function loadQuestion() {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    if (currentQuestionIndex >= CONFIG.questions.length) {
        endQuest();
        return;
    }

    document.getElementById('quest-gif').src = CONFIG.gifDefault;
    const currentData = CONFIG.questions[currentQuestionIndex];

    typeWriter(currentData.question, 'dialogue-output', 30, () => {
        currentData.options.forEach((optionText, index) => {
            const btn = document.createElement('button');
            btn.className = 'pixel-btn';
            btn.innerText = optionText;
            btn.onclick = () => handleAnswer(index, currentData.correctIndex);
            optionsContainer.appendChild(btn);
        });
    });
}

function handleAnswer(selectedIndex, correctIndex) {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; 

    const currentData = CONFIG.questions[currentQuestionIndex];

    if (selectedIndex === correctIndex) {
        document.getElementById('quest-gif').src = CONFIG.gifSuccess;
        document.getElementById('quest-score').innerText = `STARS: ⭐${currentQuestionIndex + 1}`;
        
        typeWriter(currentData.successReply, 'dialogue-output', 30, () => {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pixel-btn';
            nextBtn.innerText = 'ДАЛЬШЕ';
            currentQuestionIndex++;
            nextBtn.onclick = loadQuestion;
            optionsContainer.appendChild(nextBtn);
        });
    } else {
        document.getElementById('quest-gif').src = CONFIG.gifError;
        reduceHP();
        
        typeWriter("ТУПАЯ! Ответ неверный... Попробуешь еще раз?", 'dialogue-output', 30, () => {
            const retryBtn = document.createElement('button');
            retryBtn.className = 'pixel-btn';
            retryBtn.innerText = 'TRY AGAIN!';
            retryBtn.onclick = loadQuestion;
            optionsContainer.appendChild(retryBtn);
        });
    }
}

function reduceHP() {
    hp--;
    const heartStrings = "♥".repeat(Math.max(0, hp));
    document.getElementById('hud-hearts').innerHTML = heartStrings || "💀 GAME OVER";
    document.getElementById('quest-hearts').innerHTML = heartStrings || "💀 GAME OVER";
    
    if (hp <= 0) {
        hp = 5; 
    }
}

function endQuest() {
    switchScene(4);
    const finalIntro = "Кажется, все испытания позади. Поздравляю котакбаска! Вот твой главный подарок на сегодня...";
    
    typeWriter(finalIntro, 'final-char-text', 40, () => {
        setTimeout(() => {
            document.getElementById('photo-frame').style.opacity = '1';
        }, 500);
    });
}