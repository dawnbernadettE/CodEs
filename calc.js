/**
 * calc.js
 * Functional Paradigm — pure functions for all grade calculations.
 * No side effects; each function takes data and returns a value.
 */

'use strict';

const PASSING_GRADE = 75;

/**
 * Arithmetic mean of an array of numbers.
 * @param {number[]} grades
 * @returns {number}
 */
function calcGWA(grades) {
    if (!grades || grades.length === 0) return 0;
    return grades.reduce((sum, g) => sum + g, 0) / grades.length;
}

/**
 * Mean GWA across all student records.
 * @param {import('./StudentDB').Student[]} records
 * @returns {number}
 */
function classAverage(records) {
    if (records.length === 0) return 0;
    return records.reduce((sum, s) => sum + s.gwa, 0) / records.length;
}

/**
 * Student with the highest GWA, or null if the list is empty.
 * @param {import('./StudentDB').Student[]} records
 * @returns {import('./StudentDB').Student | null}
 */
function highestGWA(records) {
    if (records.length === 0) return null;
    return records.reduce((best, s) => s.gwa > best.gwa ? s : best);
}

/**
 * Student with the lowest GWA, or null if the list is empty.
 * @param {import('./StudentDB').Student[]} records
 * @returns {import('./StudentDB').Student | null}
 */
function lowestGWA(records) {
    if (records.length === 0) return null;
    return records.reduce((worst, s) => s.gwa < worst.gwa ? s : worst);
}

/**
 * Per-subject averages.
 * @param {import('./StudentDB').Student[]} records
 * @param {number} numSubjects
 * @returns {number[]}
 */
function subjectAverages(records, numSubjects) {
    if (records.length === 0) return Array(numSubjects).fill(0);
    return Array.from({ length: numSubjects }, (_, i) =>
        records.reduce((sum, s) => sum + s.grades[i], 0) / records.length
    );
}

/**
 * Count of passing students (GWA >= PASSING_GRADE).
 * @param {import('./StudentDB').Student[]} records
 * @returns {number}
 */
function passingCount(records) {
    return records.filter(s => s.gwa >= PASSING_GRADE).length;
}

/**
 * Count of failing students.
 * @param {import('./StudentDB').Student[]} records
 * @returns {number}
 */
function failingCount(records) {
    return records.filter(s => s.gwa < PASSING_GRADE).length;
}

module.exports = {
    calcGWA,
    classAverage,
    highestGWA,
    lowestGWA,
    subjectAverages,
    passingCount,
    failingCount
};
