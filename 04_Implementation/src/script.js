document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Auth Elements
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const mainHeader = document.querySelector('.main-header');
    
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    const userDisplay = document.getElementById('user-display');
    const authError = document.getElementById('auth-error');
    
    // App Elements
    const screens = document.querySelectorAll('.screen');
    const historyScreen = document.getElementById('history-screen');
    const levelModeBtn = document.getElementById('level-mode-btn');
    const customModeBtn = document.getElementById('custom-mode-btn');
    const historyBtn = document.getElementById('history-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    // Custom Mode Elements
    const customWordInput = document.getElementById('custom-word-input');
    const addWordBtn = document.getElementById('add-word-btn');
    const customListContainer = document.getElementById('custom-list-container');
    const saveCustomLevelBtn = document.getElementById('save-custom-level-btn');
    const customLevelNameInput = document.getElementById('custom-level-name-input');
    const goToCreateLevelBtn = document.getElementById('go-to-create-level-btn');
    const myLevelsContainer = document.getElementById('my-levels-container');
    const backToMyLevelsBtn = document.getElementById('back-to-my-levels-btn');

    // Quiz Options Elements
    const quizOptionsTitle = document.getElementById('quiz-options-title');
    const totalWordsCount = document.getElementById('total-words-count');
    const numQuestionsInput = document.getElementById('num-questions-input');
    const allWordsBtn = document.getElementById('all-words-btn');
    const startQuizFromOptionsBtn = document.getElementById('start-quiz-from-options-btn');
    const backFromOptionsBtn = document.getElementById('back-from-options-btn');

    // Quiz Screen Elements
    const questionTitle = document.getElementById('question-title');
    const questionWord = document.getElementById('question-word');
    const choicesContainer = document.getElementById('choices-container');
    const feedback = document.getElementById('feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const progressBar = document.getElementById('progress-bar');

    // Result Screen Elements
    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');
    
    // History Elements
    const fullHistoryContainer = document.getElementById('full-history-container');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    const levelButtonsContainer = document.getElementById('level-buttons');

    // Wheel Mode Elements
    const wheelModeBtn = document.getElementById('wheel-mode-btn');
    const wheelScreen = document.getElementById('wheel-screen');
    const wheelCanvas = document.getElementById('wheel-canvas');
    const spinBtn = document.getElementById('spin-btn');
    const wheelResult = document.getElementById('wheel-result');
    const wheelTextInput = document.getElementById('wheel-text-input');
    const wheelFileDropzone = document.getElementById('wheel-file-dropzone');
    const wheelFileInput = document.getElementById('wheel-file-input');
    const wheelWordList = document.getElementById('wheel-word-list');
    const wheelWordListContainer = document.getElementById('wheel-word-list-container');
    const guestWheelModeBtn = document.getElementById('guest-wheel-mode-btn');
    
    // --- State ---
    let currentUser = null;
    let vocabulary = [];
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentMode = '';
    let answeredQuestions = [];
    let customVocabularyList = [];
    let editingLevelId = null;
    let pendingQuizData = null;
    let wheelWords = [];

    // --- Auth UI Functions ---
    function handleLoggedIn(user) {
        currentUser = user;
        document.body.classList.add('logged-in');
        loginScreen.classList.remove('active');
        mainHeader.style.display = 'flex';
        appContainer.style.display = 'flex';
        
        userDisplay.textContent = user.displayName || user.email;
        logoutBtn.style.display = 'inline-block';

        showScreen('mode-screen');
        populateLevels();
        setupWheelListeners(); // Initialize wheel mode listeners
    }

    function handleLoggedOut() {
        currentUser = null;
        document.body.classList.remove('logged-in');
        loginScreen.classList.add('active');
        mainHeader.style.display = 'none';
        appContainer.style.display = 'none';
        
        userDisplay.textContent = '';
        logoutBtn.style.display = 'none';
        
        document.querySelectorAll('#app-container .screen').forEach(s => s.classList.remove('active'));
    }
    
    function getFriendlyAuthError(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'ไม่พบผู้ใช้งานนี้ กรุณาตรวจสอบอีเมลหรือสมัครสมาชิก';
            case 'auth/wrong-password':
            case 'auth/operation-not-allowed':
                return 'รหัสผ่านไม่ถูกต้อง';
            case 'auth/missing-password':
                return 'โปรดกรอกรหัสผ่าน';
            case 'auth/missing-email':
                return 'โปรดระบุอีเมล';
            case 'auth/invalid-email':
                return 'รูปแบบอีเมลไม่ถูกต้อง';
            case 'auth/email-already-in-use':
                return 'อีเมลนี้มีผู้ใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น';
            case 'auth/weak-password':
                return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
            default:
                return 'เกิดข้อผิดพลาดในการยืนยันตัวตน: ' + error.message;
        }
    }

    function showAuthError(error) {
        authError.textContent = getFriendlyAuthError(error);
        authError.style.display = 'block';
    }

    function clearAuthError() {
        authError.textContent = '';
        authError.style.display = 'none';
    }

    // --- Core App Functions ---
    
    function showScreen(screenId) {
        const nextScreen = document.getElementById(screenId);
        if (!nextScreen) return;

        const currentScreen = document.querySelector('#app-container .screen.active');

        if (currentScreen) {
            if (currentScreen === nextScreen) return; // Don't animate if it's the same screen

            currentScreen.classList.add('slide-out');
            
            const onAnimationEnd = () => {
                currentScreen.classList.remove('active');
                currentScreen.classList.remove('slide-out');
                currentScreen.removeEventListener('animationend', onAnimationEnd);
            };
            currentScreen.addEventListener('animationend', onAnimationEnd);
        }
        
        nextScreen.classList.add('active'); // This makes it display: flex
        nextScreen.classList.add('slide-in');

        const onNextAnimationEnd = () => {
            nextScreen.classList.remove('slide-in');
            nextScreen.removeEventListener('animationend', onNextAnimationEnd);
        };
        nextScreen.addEventListener('animationend', onNextAnimationEnd);

        if (screenId === 'wheel-screen') {
            updateAndRenderWords(); // Initial draw when screen is shown
        }
    }

    function showHistoryModal() {
        displayHistory();
        historyScreen.classList.add('active');
    }

    function hideHistoryModal() {
        historyScreen.classList.remove('active');
    }

    function initializeAndStartQuiz(vocabList, mode, numQuestions) {
        if (vocabList.length < 4) {
            alert('Please provide at least 4 vocabulary words to start the quiz.');
            // Go back to the options screen if there's an issue
            showScreen('quiz-options-screen'); 
            return;
        }
        vocabulary = vocabList;
        let shuffled = [...vocabulary].sort(() => 0.5 - Math.random());

        // Slice the questions based on user's choice
        let num = parseInt(numQuestions, 10);
        if (num && num > 0 && num <= shuffled.length) {
            currentQuestions = shuffled.slice(0, num);
        } else {
            currentQuestions = shuffled; // All words
        }
        
        currentQuestionIndex = 0;
        score = 0;
        currentMode = mode;
        answeredQuestions = [];

        updateProgressBar();
        showScreen('quiz-screen');
        displayQuestion();
    }
    
    function updateProgressBar() {
        if(currentQuestions.length === 0) {
            progressBar.style.width = '0%';
            return;
        }
        const progress = (currentQuestionIndex / currentQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function displayQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            showResults();
            return;
        }
        updateProgressBar();
        feedback.textContent = '';
        feedback.className = 'feedback';
        nextQuestionBtn.style.display = 'none';
        
        const question = currentQuestions[currentQuestionIndex];
        const correctAnswer = question.definition;

        const wrongAnswers = vocabulary.filter(item => item.definition !== correctAnswer).sort(() => 0.5 - Math.random()).slice(0, 3).map(item => item.definition);
        const choices = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

        questionTitle.textContent = `คำถามที่ ${currentQuestionIndex + 1}/${currentQuestions.length}`;
        questionWord.textContent = question.word;

        choicesContainer.innerHTML = '';
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'btn';
            button.textContent = choice;
            button.addEventListener('click', () => handleChoice(choice, correctAnswer, button));
            choicesContainer.appendChild(button);
        });
    }

    function handleChoice(selectedChoice, correctChoice, button) {
        const choiceButtons = choicesContainer.querySelectorAll('.btn');
        choiceButtons.forEach(btn => btn.disabled = true);

        const quizScreen = document.getElementById('quiz-screen');

        const isCorrect = selectedChoice === correctChoice;
        if (isCorrect) {
            score++;
            feedback.textContent = 'ถูกต้อง!';
            feedback.className = 'feedback correct';
            button.style.backgroundColor = 'var(--success-color)';
            button.style.borderColor = 'var(--success-color)';
            if (quizScreen) quizScreen.classList.add('correct-flash');
        } else {
            feedback.textContent = 'คำตอบผิด!';
            feedback.className = 'feedback incorrect';
            button.style.backgroundColor = 'var(--error-color)';
            button.style.borderColor = 'var(--error-color)';
            choiceButtons.forEach(btn => {
                if (btn.textContent === correctChoice) {
                    btn.style.backgroundColor = 'var(--success-color)';
                    btn.style.borderColor = 'var(--success-color)';
                }
            });
            if (quizScreen) quizScreen.classList.add('incorrect-flash');
        }
        
        answeredQuestions.push({
            word: currentQuestions[currentQuestionIndex].word,
            choices: Array.from(choiceButtons).map(b => b.textContent),
            selectedAnswer: selectedChoice,
            correctAnswer: correctChoice
        });

        nextQuestionBtn.style.display = 'flex';

        setTimeout(() => {
            if (quizScreen) {
                quizScreen.classList.remove('correct-flash', 'incorrect-flash');
            }
        }, 500);
    }

    function showResults() {
        progressBar.style.width = '100%';
        const totalQuestions = currentQuestions.length;
        resultTitle.textContent = `สิ้นสุดแบบทดสอบ!`;
        resultScore.textContent = `คุณได้ ${score} จาก ${totalQuestions} คะแนน`;

        const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        const newHistoryEntry = {
            mode: currentMode,
            score: `${score}/${totalQuestions}`,
            date: new Date().toISOString(),
            answeredQuestions: answeredQuestions
        };
        history.push(newHistoryEntry);
        localStorage.setItem('quizHistory', JSON.stringify(history));
        showScreen('result-screen');
    }

    function resetQuizState() {
        currentQuestions = [];
        currentQuestionIndex = 0;
        score = 0;
        updateProgressBar();
    }

    function saveAndExit() {
        if (currentQuestions.length > 0 && currentQuestionIndex > 0) {
            const totalQuestions = currentQuestions.length;
            const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
            const newHistoryEntry = { mode: currentMode, score: `${score}/${currentQuestionIndex} (ยังไม่จบ)`, date: new Date().toISOString(), answeredQuestions };
            history.push(newHistoryEntry);
            localStorage.setItem('quizHistory', JSON.stringify(history));
        }
        resetQuizState();
        showScreen('mode-screen');
    }

    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        if (history.length === 0) {
            fullHistoryContainer.innerHTML = '<p style="text-align: center; margin-top: 2rem;">ยังไม่มีประวัติการเล่น ลองเล่นสักเกมสิ!</p>';
            return;
        }
        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>วันที่</th><th>โหมด</th><th>คะแนน</th></tr></thead>
            <tbody>
                ${history.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
                    <tr><td>${new Date(entry.date).toLocaleString()}</td><td>${entry.mode}</td><td>${entry.score}</td></tr>`).join('')}
            </tbody>`;
        fullHistoryContainer.innerHTML = '';
        fullHistoryContainer.appendChild(table);
    }
    
    function populateLevels() {
        if (!levelButtonsContainer) return;
        levelButtonsContainer.innerHTML = '';

        // Only show the built-in levels. Custom levels are now in their own screen.
        quizLevels.forEach(levelData => {
            const button = document.createElement('button');
            button.className = 'btn';
            button.textContent = levelData.name;
            button.addEventListener('click', () => { 
                pendingQuizData = { vocab: levelData.vocab, name: levelData.name };
                quizOptionsTitle.textContent = `Level: ${levelData.name}`;
                totalWordsCount.textContent = levelData.vocab.length;
                numQuestionsInput.max = levelData.vocab.length;
                numQuestionsInput.value = '';
                showScreen('quiz-options-screen');
            });
            levelButtonsContainer.appendChild(button);
        });
    }

    // --- Wheel Mode Functions ---
    function processWords(text) {
        // Split by newline and filter out any empty lines
        return text.split('\n').filter(word => word.trim().length > 0);
    }

    function updateAndRenderWords() {
        wheelWords = processWords(wheelTextInput.value);
        renderWheelWordList();
        drawWheel();
    }

    function renderWheelWordList() {
        wheelWordList.innerHTML = '';
        if (wheelWords.length === 0) {
            wheelWordListContainer.innerHTML = '<p>Imported words will appear here.</p>';
            return;
        }
        wheelWordListContainer.innerHTML = ''; // Clear placeholder
        const list = document.createElement('ul');
        list.id = 'wheel-word-list';
        wheelWords.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            list.appendChild(li);
        });
        wheelWordListContainer.appendChild(list);
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            readFile(file);
        }
    }

    function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        wheelFileDropzone.classList.remove('dragging');
        const file = e.dataTransfer.files[0];
        if (file && file.type === "text/plain") {
            readFile(file);
        } else {
            alert('Please drop a .txt file.');
        }
    }

    function readFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            const fileWords = processWords(fileContent);
            
            // Combine words from textarea and file, ensuring no duplicates
            const textWords = processWords(wheelTextInput.value);
            const combinedWords = [...new Set([...textWords, ...fileWords])];
            
            wheelTextInput.value = combinedWords.join('\n');
            
            // Now that the textarea is updated, let the main function handle the rest
            updateAndRenderWords();
        };
        reader.readAsText(file);
    }

    let isSpinning = false;
    let currentRotation = 0;
    const wheelColors = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#EF4444"];

    function drawWheel() {
        const ctx = wheelCanvas.getContext('2d');
        const numSegments = wheelWords.length;
        const arcSize = 2 * Math.PI / (numSegments || 1);
        const centerX = wheelCanvas.width / 2;
        const centerY = wheelCanvas.height / 2;
        const radius = wheelCanvas.width / 2 - 10;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation);
        ctx.translate(-centerX, -centerY);


        if (numSegments === 0) {
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '20px ' + getComputedStyle(document.body).fontFamily;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Add words to begin', centerX, centerY);
            return;
        }

        for (let i = 0; i < numSegments; i++) {
            const startAngle = i * arcSize;
            const endAngle = startAngle + arcSize;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = wheelColors[i % wheelColors.length];
            ctx.fill();
            
            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + arcSize / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = '16px ' + getComputedStyle(document.body).fontFamily;
            ctx.fillText(wheelWords[i], radius - 15, 0);
            ctx.restore();
        }

        ctx.restore(); // Restore the main context

        // Draw the pointer
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(centerX + radius - 5, centerY - 15);
        ctx.lineTo(centerX + radius + 15, centerY);
        ctx.lineTo(centerX + radius - 5, centerY + 15);
        ctx.closePath();
        ctx.fill();
    }
    
    function spinWheel() {
        if (isSpinning || wheelWords.length < 2) return;

        isSpinning = true;
        spinBtn.disabled = true;
        wheelResult.textContent = '';
        
        const spinDuration = 5000; // 5 seconds
        const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 9 full spins
        const randomStopIndex = Math.floor(Math.random() * wheelWords.length);
        const arcSize = (2 * Math.PI) / wheelWords.length;
        const randomStopAngle = randomStopIndex * arcSize + arcSize / 2;

        const targetRotation = (randomSpins * 2 * Math.PI) - randomStopAngle;

        currentRotation += targetRotation;
        
        wheelCanvas.style.transition = `transform ${spinDuration / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        wheelCanvas.style.transform = `rotate(${currentRotation}rad)`;

        setTimeout(() => {
            isSpinning = false;
            spinBtn.disabled = false;
            
            const winningWord = wheelWords[randomStopIndex];
            wheelResult.textContent = `Winner: ${winningWord}!`;

            // Keep the wheel at its final position for the next spin
            wheelCanvas.style.transition = 'none';
            const finalRotation = currentRotation % (2 * Math.PI);
            wheelCanvas.style.transform = `rotate(${finalRotation}rad)`;
            currentRotation = finalRotation;

        }, spinDuration);
    }

    function setupWheelListeners() {
        wheelTextInput.addEventListener('input', updateAndRenderWords);
        
        // File Dropzone
        wheelFileDropzone.addEventListener('click', () => wheelFileInput.click());
        wheelFileInput.addEventListener('change', handleFileSelect);
        
        wheelFileDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wheelFileDropzone.classList.add('dragging');
        });

        wheelFileDropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wheelFileDropzone.classList.remove('dragging');
        });

        wheelFileDropzone.addEventListener('drop', handleFileDrop);

        spinBtn.addEventListener('click', spinWheel);
    }


    // --- New Custom Mode Functions ---
    function renderCustomList() {
        customListContainer.innerHTML = '';
        if (customVocabularyList.length === 0) {
            customListContainer.innerHTML = `<p id="custom-list-placeholder">คำศัพท์ของคุณจะปรากฏที่นี่ เพิ่มอย่างน้อย 4 คำเพื่อเริ่ม</p>`;
        } else {
            customVocabularyList.forEach((item, index) => {
                const listItem = document.createElement('div');
                listItem.className = 'custom-list-item';
                listItem.innerHTML = `
                    <div class="custom-list-item-text">
                        <span class="word">${item.word}:</span>
                        <span class="def">${item.definition}</span>
                    </div>
                    <button class="remove-word-btn" data-index="${index}">&times;</button>
                `;
                customListContainer.appendChild(listItem);
            });
        }
        updateSaveButtonState();
    }


    async function translateAndAddWord() {
        const word = customWordInput.value.trim();
        if (!word) return;

        addWordBtn.disabled = true;
        addWordBtn.textContent = 'กำลังแปล...';

        const isInputThai = /[\u0E00-\u0E7F]/.test(word);
        const langpair = isInputThai ? 'th|en' : 'en|th';

        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${langpair}`);
            const data = await response.json();
            
            if (data.responseStatus !== 200) throw new Error(data.responseDetails);

            const translatedText = data.responseData.translatedText;
            const quizWord = isInputThai ? translatedText : word;
            const quizDefinition = isInputThai ? word : translatedText;

            customVocabularyList.push({ word: quizWord, definition: quizDefinition });
            customWordInput.value = '';
            customWordInput.focus();
            renderCustomList();
        } catch (error) {
            console.error('Translation error:', error);
            alert('ไม่สามารถแปลคำศัพท์ได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            addWordBtn.disabled = false;
            addWordBtn.textContent = 'แปลและเพิ่มคำศัพท์';
        }
    }

    function handleRemoveWord(e) {
        if (e.target.classList.contains('remove-word-btn')) {
            const indexToRemove = parseInt(e.target.dataset.index, 10);
            customVocabularyList.splice(indexToRemove, 1);
            renderCustomList();
        }
    }

    function updateSaveButtonState() {
        const levelName = customLevelNameInput.value.trim();
        saveCustomLevelBtn.disabled = customVocabularyList.length < 4 || !levelName;
    }

    async function saveCustomLevel() {
        const levelName = customLevelNameInput.value.trim();
        if (customVocabularyList.length < 4) return alert('กรุณาเพิ่มคำศัพท์อย่างน้อย 4 คำ');
        if (!levelName) return alert('กรุณาตั้งชื่อด่านของคุณ');
        if (!currentUser) return alert('กรุณาเข้าสู่ระบบเพื่อบันทึกด่าน');

        const levelData = { 
            name: levelName, 
            vocab: customVocabularyList,
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const saveBtnOriginalText = saveCustomLevelBtn.textContent;
        saveCustomLevelBtn.disabled = true;
        saveCustomLevelBtn.textContent = 'กำลังบันทึก...';

        try {
            const userLevelsRef = db.collection('users').doc(currentUser.uid).collection('customLevels');

            if (editingLevelId) {
                // Update existing level
                await userLevelsRef.doc(editingLevelId).update(levelData);
                alert(`อัปเดตด่าน "${levelName}" เรียบร้อยแล้ว!`);
            } else {
                // Add new level (and include createdAt)
                levelData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await userLevelsRef.add(levelData);
                alert(`บันทึกด่าน "${levelName}" เรียบร้อยแล้ว!`);
            }
            
            editingLevelId = null; // Reset editing state
            
            showScreen('my-levels-screen');
            loadAndDisplayMyLevels(); // Refresh the list

        } catch (error) {
            console.error("Error saving level: ", error);
            alert("เกิดข้อผิดพลาดในการบันทึกด่าน กรุณาลองใหม่อีกครั้ง");
        } finally {
            saveCustomLevelBtn.disabled = false;
            saveCustomLevelBtn.textContent = saveBtnOriginalText;
        }
    }

    async function loadAndDisplayMyLevels() {
        if (!currentUser) {
            myLevelsContainer.innerHTML = '<p>Please log in to see your levels.</p>';
            return;
        }

        myLevelsContainer.innerHTML = '<p style="text-align: center; margin-top: 2rem;">Loading your levels...</p>';

        try {
            const snapshot = await db.collection('users').doc(currentUser.uid).collection('customLevels').orderBy('createdAt', 'desc').get();
            
            if (snapshot.empty) {
                myLevelsContainer.innerHTML = '<p style="text-align: center; margin-top: 2rem;">You haven\'t created any custom levels yet. Click "Create New Level" to start!</p>';
                return;
            }

            myLevelsContainer.innerHTML = ''; // Clear loading message
            snapshot.forEach(doc => {
                const level = doc.data();
                const levelId = doc.id;

                const levelEl = document.createElement('div');
                levelEl.className = 'my-level-item';
                levelEl.dataset.id = levelId;
                // Store vocab in a data attribute to retrieve easily for 'play' and 'edit'
                levelEl.dataset.vocab = JSON.stringify(level.vocab); 

                levelEl.innerHTML = `
                    <span class="my-level-item-name">${level.name}</span>
                    <div class="my-level-item-actions">
                        <button class="btn play-level-btn">Play</button>
                        <button class="btn btn-secondary edit-level-btn">Edit</button>
                        <button class="btn btn-danger delete-level-btn">Delete</button>
                    </div>
                `;
                myLevelsContainer.appendChild(levelEl);
            });

        } catch (error) {
            console.error("Error loading custom levels: ", error);
            myLevelsContainer.innerHTML = '<p>There was an error loading your levels.</p>';
        }
    }

    // --- Event Listeners ---
    myLevelsContainer.addEventListener('click', e => {
        const target = e.target;
        const levelItem = target.closest('.my-level-item');
        if (!levelItem) return;

        const levelId = levelItem.dataset.id;
        
        if (target.classList.contains('play-level-btn')) {
            const levelName = levelItem.querySelector('.my-level-item-name').textContent;
            const vocab = JSON.parse(levelItem.dataset.vocab);
            
            pendingQuizData = { vocab: vocab, name: levelName };
            quizOptionsTitle.textContent = `Level: ${levelName}`;
            totalWordsCount.textContent = vocab.length;
            numQuestionsInput.max = vocab.length;
            numQuestionsInput.value = '';
            showScreen('quiz-options-screen');
        } else if (target.classList.contains('edit-level-btn')) {
            const levelName = levelItem.querySelector('.my-level-item-name').textContent;
            const vocab = JSON.parse(levelItem.dataset.vocab);
            
            // Set state for editing
            editingLevelId = levelId;
            customLevelNameInput.value = levelName;
            customVocabularyList = vocab;

            // Show and populate the creation screen
            renderCustomList();
            showScreen('custom-screen');
        } else if (target.classList.contains('delete-level-btn')) {
            const levelName = levelItem.querySelector('.my-level-item-name').textContent;
            if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบด่าน "${levelName}"? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
                deleteCustomLevel(levelId);
            }
        }
    });

    async function deleteCustomLevel(levelId) {
        if (!currentUser) return;
        try {
            await db.collection('users').doc(currentUser.uid).collection('customLevels').doc(levelId).delete();
            // Refresh the list to show the level has been removed
            await loadAndDisplayMyLevels(); 
        } catch (error) {
            console.error("Error deleting level: ", error);
            alert("There was an error deleting the level. Please try again.");
        }
    }

    levelModeBtn.addEventListener('click', () => showScreen('level-screen'));
    customModeBtn.addEventListener('click', () => {
        // This is the new entry point for all custom level activities
        showScreen('my-levels-screen');
        loadAndDisplayMyLevels();
    });
    wheelModeBtn.addEventListener('click', () => showScreen('wheel-screen'));
    goToCreateLevelBtn.addEventListener('click', () => {
        // Clear form for new level creation
        editingLevelId = null; // Clear editing state
        customVocabularyList = [];
        customLevelNameInput.value = '';
        renderCustomList();
        showScreen('custom-screen');
    });

    historyBtn.addEventListener('click', showHistoryModal);
    addWordBtn.addEventListener('click', translateAndAddWord);
    customListContainer.addEventListener('click', handleRemoveWord);
    customWordInput.addEventListener('keydown', (e) => e.key === 'Enter' && translateAndAddWord());
    customLevelNameInput.addEventListener('input', updateSaveButtonState);
    saveCustomLevelBtn.addEventListener('click', saveCustomLevel);
    backToMyLevelsBtn.addEventListener('click', () => showScreen('my-levels-screen'));

    // Quiz Options Listeners
    allWordsBtn.addEventListener('click', () => {
        if (pendingQuizData) {
            numQuestionsInput.value = pendingQuizData.vocab.length;
        }
    });

    startQuizFromOptionsBtn.addEventListener('click', () => {
        if (pendingQuizData) {
            const num = numQuestionsInput.value;
            // Validate the number of questions
            if (num && (num < 4 || num > pendingQuizData.vocab.length)) {
                alert(`Please enter a number between 4 and ${pendingQuizData.vocab.length}.`);
                return;
            }
            initializeAndStartQuiz(pendingQuizData.vocab, pendingQuizData.name, num);
        }
    });

    backFromOptionsBtn.addEventListener('click', () => {
        // For simplicity, always return to the main mode selection
        showScreen('mode-screen');
    });

    // Auth Listeners
    signupBtn.addEventListener('click', async () => {
        clearAuthError();
        const email = emailInput.value;
        const password = passwordInput.value;
        const { error } = await signUpWithEmail(email, password);
        if (error) showAuthError(error);
    });

    loginBtn.addEventListener('click', async () => {
        clearAuthError();
        const email = emailInput.value;
        const password = passwordInput.value;
        const { error } = await loginWithEmail(email, password);
        if (error) showAuthError(error);
    });
    
    googleLoginBtn.addEventListener('click', async () => {
        clearAuthError();
        const { error } = await loginWithGoogle();
        if (error) showAuthError(error);
    });

    logoutBtn.addEventListener('click', () => logoutUser());

    guestWheelModeBtn.addEventListener('click', () => {
        loginScreen.classList.remove('active');
        appContainer.style.display = 'flex';
        showScreen('wheel-screen');
        // Initialize wheel listeners if they haven't been already (e.g., for guests)
        // We can add a check if needed, but calling it should be safe.
        setupWheelListeners();
    });

    // Quiz Navigation Listeners
    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    backBtns.forEach(btn => btn.addEventListener('click', (e) => {
        // If the back button is inside the wheel screen AND the user is a guest
        if (e.target.closest('#wheel-screen') && !currentUser) {
            appContainer.style.display = 'none';
            loginScreen.classList.add('active');
        } else if (currentUser) {
            // Default behavior for logged-in users
            if (!btn.closest('#mode-screen')) {
                 showScreen('mode-screen');
            }
        }
        // If !currentUser and not in wheel-screen, do nothing (shouldn't happen)
    }));
    
    const historyBackBtn = historyScreen.querySelector('.back-btn-modal');
    if(historyBackBtn) historyBackBtn.addEventListener('click', (e) => { e.stopPropagation(); hideHistoryModal(); });

    restartBtn.addEventListener('click', () => {
        resetQuizState();
        showScreen('mode-screen');
    });

    backToHomeBtn.addEventListener('click', saveAndExit);
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
            localStorage.removeItem('quizHistory');
            displayHistory();
        }
    });

    // --- Initial Setup ---
    onAuthStateChanged(user => {
        if (user) {
            handleLoggedIn(user);
        } else {
            handleLoggedOut();
        }
    });

    // --- Version Display ---
    async function displayVersion() {
        try {
            const response = await fetch('../../CHANGELOG.md');
            if (!response.ok) {
                throw new Error('Changelog not found');
            }
            const text = await response.text();
            const match = text.match(/## \[(.*?)\]/);
            if (match && match[1]) {
                const version = match[1];
                const versionDisplay = document.getElementById('footer-version-display');
                if (versionDisplay) {
                    versionDisplay.textContent = `v${version}`;
                }
            }
        } catch (error) {
            console.error('Error fetching or parsing version:', error);
        }
    }

    displayVersion();
});
