/**
 * display.js
 * Procedural Paradigm — all console rendering functions.
 */

'use strict';

const {
    classAverage, highestGWA, lowestGWA,
    subjectAverages, passingCount, failingCount
} = require('./calc');
const { SUBJECT_NAMES, NUM_SUBJECTS } = require('./StudentDB');

const LINE  = '─'.repeat(72);
const DLINE = '═'.repeat(72);

function sep()  { console.log(LINE);  }
function dsep() { console.log(DLINE); }

/** Right-pad a string to width. */
function pad(str, width) {
    return String(str).padEnd(width);
}

/** Right-align a string to width. */
function rpad(str, width) {
    return String(str).padStart(width);
}

/**
 * Print one student's full detail card.
 * @param {import('./StudentDB').Student} student
 */
function displayOne(student) {
    sep();
    console.log(`  ID     : ${student.id}`);
    console.log(`  Name   : ${student.name}`);
    SUBJECT_NAMES.forEach((subj, i) => {
        console.log(`  ${pad(subj, 10)}: ${student.grades[i].toFixed(2)}`);
    });
    console.log(`  GWA    : ${student.gwa.toFixed(2)}  [${student.isPassing() ? 'PASS' : 'FAIL'}]`);
    sep();
}

/**
 * Print a tabular list of all students.
 * @param {import('./StudentDB').Student[]} records  - already-sorted array
 */
function displayAll(records) {
    if (records.length === 0) {
        console.log('  (No records found.)');
        return;
    }

    // Header
    const subjHeader = SUBJECT_NAMES.map(s => pad(s, 9)).join(' ');
    console.log(`\n  ${pad('ID', 14)} ${pad('Name', 28)} ${subjHeader} ${rpad('GWA', 7)}  Status`);
    sep();

    records.forEach(s => {
        const subjCols = s.grades.map(g => pad(g.toFixed(2), 9)).join(' ');
        console.log(
            `  ${pad(s.id, 14)} ${pad(s.name, 28)} ${subjCols} ${rpad(s.gwa.toFixed(2), 7)}  ${s.isPassing() ? 'PASS' : 'FAIL'}`
        );
    });

    sep();
    console.log(`  Total records: ${records.length}\n`);
}

/**
 * Print class-wide statistics.
 * @param {import('./StudentDB').StudentDB} db
 */
function displaySummary(db) {
    if (db.count === 0) {
        console.log('  (No records — summary unavailable.)');
        return;
    }

    const records  = db.records;
    const best     = highestGWA(records);
    const worst    = lowestGWA(records);
    const subjAvgs = subjectAverages(records, NUM_SUBJECTS);

    console.log('\n');
    dsep();
    console.log('  CLASS SUMMARY');
    dsep();
    console.log(`  Total students : ${db.count}`);
    console.log(`  Class average  : ${classAverage(records).toFixed(2)}`);
    console.log(`  Passing        : ${passingCount(records)}`);
    console.log(`  Failing        : ${failingCount(records)}`);

    if (best)  console.log(`  Highest GWA    : ${best.id}  ${best.name}  (${best.gwa.toFixed(2)})`);
    if (worst) console.log(`  Lowest GWA     : ${worst.id}  ${worst.name}  (${worst.gwa.toFixed(2)})`);

    console.log('\n  Subject averages:');
    SUBJECT_NAMES.forEach((subj, i) => {
        console.log(`    ${pad(subj, 12)}: ${subjAvgs[i].toFixed(2)}`);
    });

    dsep();
    console.log();
}

module.exports = { displayOne, displayAll, displaySummary };
