// Get DOM elements
const quizAvgInput = document.getElementById('quizAvg');
const examScoreInput = document.getElementById('examScore');
const mcoScoreInput = document.getElementById('mcoScore');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultContainer = document.getElementById('resultContainer');
const finalGradeDisplay = document.getElementById('finalGrade');
const gradeEquivalentDisplay = document.getElementById('gradeEquivalent');

// Validation function using arrow function
const validateInput = (value, errorElement) => {
    if (value === '' || value < 0 || value > 100) {
        errorElement.style.display = 'block';
        return false;
    }
    errorElement.style.display = 'none';
    return true;
};

// Calculate grade equivalent using arrow function
const getGradeEquivalent = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
};

// Calculate Grade Button Event Listener with Arrow Function
calculateBtn.addEventListener('click', () => {
    const quizAvg = parseFloat(quizAvgInput.value);
    const examScore = parseFloat(examScoreInput.value);
    const mcoScore = parseFloat(mcoScoreInput.value);

    // Validate all inputs
    const quizValid = validateInput(quizAvg, document.getElementById('quizError'));
    const examValid = validateInput(examScore, document.getElementById('examError'));
    const mcoValid = validateInput(mcoScore, document.getElementById('mcoError'));

    // If all inputs are valid, calculate grade
    if (quizValid && examValid && mcoValid) {
        // Calculate final grade: Quiz (20%) + Exam (30%) + MCO (50%)
        const finalGrade = (quizAvg * 0.20) + (examScore * 0.30) + (mcoScore * 0.50);
        const gradeEquivalent = getGradeEquivalent(finalGrade);

        // Display results
        finalGradeDisplay.textContent = finalGrade.toFixed(2);
        gradeEquivalentDisplay.textContent = gradeEquivalent;
        resultContainer.classList.add('show');
    } else {
        resultContainer.classList.remove('show');
    }
});

// Reset Button Event Listener with Arrow Function
resetBtn.addEventListener('click', () => {
    // Clear all input fields
    quizAvgInput.value = '';
    examScoreInput.value = '';
    mcoScoreInput.value = '';

    // Hide all error messages
    document.getElementById('quizError').style.display = 'none';
    document.getElementById('examError').style.display = 'none';
    document.getElementById('mcoError').style.display = 'none';

    // Hide result container
    resultContainer.classList.remove('show');

    // Reset result displays
    finalGradeDisplay.textContent = '--';
    gradeEquivalentDisplay.textContent = '--';
});

// Optional: Add Enter key support using arrow function
const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
        calculateBtn.click();
    }
};

quizAvgInput.addEventListener('keypress', handleEnterKey);
examScoreInput.addEventListener('keypress', handleEnterKey);
mcoScoreInput.addEventListener('keypress', handleEnterKey);