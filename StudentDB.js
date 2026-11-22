/**
 * StudentDB.js
 * OOP Paradigm — encapsulates all student records and CRUD operations.
 */

'use strict';

const { calcGWA } = require('./calc');

const NUM_SUBJECTS = 5;
const SUBJECT_NAMES = ['Math', 'Science', 'English', 'Filipino', 'MAPEH'];
const PASSING_GRADE = 75;

class Student {
    /**
     * @param {string} id
     * @param {string} name
     * @param {number[]} grades  - array of NUM_SUBJECTS numbers (0–100)
     */
    constructor(id, name, grades) {
        this.id     = id.trim();
        this.name   = name.trim();
        this.grades = grades.map(Number);
        this.gwa    = calcGWA(this.grades);
    }

    isPassing() {
        return this.gwa >= PASSING_GRADE;
    }

    /** Return a plain object safe for JSON serialisation. */
    toJSON() {
        return {
            id:     this.id,
            name:   this.name,
            grades: this.grades,
            gwa:    this.gwa
        };
    }

    /** Reconstruct a Student instance from a plain JSON object. */
    static fromJSON(obj) {
        return new Student(obj.id, obj.name, obj.grades);
    }
}

class StudentDB {
    constructor() {
        /** @type {Student[]} */
        this.records = [];
    }

    // ── Queries ────────────────────────────────────────────────────────────

    /** Returns the Student object with the given ID, or null. */
    find(id) {
        return this.records.find(s => s.id === id.trim()) ?? null;
    }

    /** Returns the array index for the given ID, or -1. */
    indexOf(id) {
        return this.records.findIndex(s => s.id === id.trim());
    }

    get count() {
        return this.records.length;
    }

    // ── CRUD ───────────────────────────────────────────────────────────────

    /**
     * Add a new student.
     * @returns {{ ok: boolean, message: string }}
     */
    add(id, name, grades) {
        if (this.find(id)) {
            return { ok: false, message: `ID "${id}" already exists. Use update instead.` };
        }
        this.records.push(new Student(id, name, grades));
        return { ok: true, message: `Student "${name}" added successfully.` };
    }

    /**
     * Update an existing student by their current ID.
     * Any of newId / newName / newGrades can be omitted to keep the current value.
     * @returns {{ ok: boolean, message: string }}
     */
    update(currentId, { newId, newName, newGrades } = {}) {
        const idx = this.indexOf(currentId);
        if (idx === -1) {
            return { ok: false, message: `ID "${currentId}" not found.` };
        }

        const student = this.records[idx];

        // If the ID is changing, make sure the new one is free
        if (newId && newId.trim() !== currentId) {
            if (this.find(newId)) {
                return { ok: false, message: `ID "${newId}" already belongs to another student.` };
            }
            student.id = newId.trim();
        }

        if (newName)   student.name   = newName.trim();
        if (newGrades) {
            student.grades = newGrades.map(Number);
            student.gwa    = calcGWA(student.grades);
        }

        return { ok: true, message: `Record for "${student.name}" updated.` };
    }

    /**
     * Delete a student by ID.
     * @returns {{ ok: boolean, message: string }}
     */
    delete(id) {
        const idx = this.indexOf(id);
        if (idx === -1) {
            return { ok: false, message: `ID "${id}" not found.` };
        }
        const [removed] = this.records.splice(idx, 1);
        return { ok: true, message: `Student "${removed.name}" deleted.` };
    }
}

module.exports = { StudentDB, Student, SUBJECT_NAMES, NUM_SUBJECTS, PASSING_GRADE };
