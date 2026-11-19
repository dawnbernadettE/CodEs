import tkinter as tk
from tkinter import messagebox

BG = "#e7dfdf"
BLUE = "#232831"
GRAY = "#818080"


class Student:
    def __init__(self, name, grades, year_level):
        self.name = name
        self.grades = grades 
        self.year_level= year_level

    def get_average(self):
        return sum(self.grades.values()) / len(self.grades)

    def get_letter_grade(self):
        avg = self.get_average()
        if avg >= 90:
            return "A"
        elif avg >= 80:
            return "B"
        elif avg >= 70:
            return "C"
        elif avg >= 60:
            return "D"
        return "F"

    def get_result(self):
        return "Passed" if self.get_average() >= 90 else "Failed"

    def get_YearLevel(self):
        return "1st, 2nd, 3rd, 4th"


class GradeCalculatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Grade Calculator")
        self.root.geometry("440x620")
        self.root.config(bg=BG, padx=20, pady=10)

        self.rows = []  

    
        tk.Label(
            root, text="GRADE CALCULATOR", font=("Arial", 16, "bold"), bg=BG
        ).pack(pady=(10, 15))

        tk.Label(root, text="Student Name", font=("Arial", 10, "bold"), bg=BG).pack(
            anchor="w"
        )
        
        self.name_entry = tk.Entry(root, font=("Arial", 11))
        self.name_entry.pack(fill="x", pady=(2, 12), ipady=4)
        
        
        self.table = tk.Frame(root, bg=BG)
        self.table.pack(fill="x")
        self.table.columnconfigure(0, weight=3)
        self.table.columnconfigure(1, weight=1)

        tk.Label(root, text="YearLevel", font=("Arial", 10, "bold"), bg=BG).pack(
           anchor="w"
        )
        self.name_entry = tk.Entry(root, font=("Arial", 11))
        self.name_entry.pack(fill="x", pady=(2, 12), ipady=4)
        
        
        self.table = tk.Frame(root, bg=BG)
        self.table.pack(fill="x")
        self.table.columnconfigure(0, weight=3)
        self.table.columnconfigure(1, weight=1)

        tk.Label(self.table, text="Subject", font=("Arial", 10, "bold"), bg=BG).grid(
            row=0, column=0, sticky="w"
        )
        tk.Label(
            self.table, text="Grade (0-100)", font=("Arial", 10, "bold"), bg=BG
        ).grid(row=0, column=1, sticky="w", padx=(8, 0))

        for subject in ("GE ELEC", "CS301", "CS303",):
            self.add_row(subject)

        tk.Button(
            root,
            text="+ Add Subject",
            font=("Arial", 10, "bold"),
            bg=GRAY,
            fg="white",
            command=self.add_row,
        ).pack(fill="x", pady=(12, 5), ipady=4)

        tk.Button(
            root,
            text="Calculate",
            font=("Arial", 11, "bold"),
            bg=BLUE,
            fg="white",
            command=self.calculate,
        ).pack(fill="x", pady=5, ipady=6)

        tk.Button(
            root,
            text="Clear",
            font=("Arial", 10, "bold"),
            bg="#c62828",
            fg="white",
            command=self.clear,
        ).pack(fill="x", pady=5, ipady=4)

        self.result_label = tk.Label(
            root, text="", font=("Arial", 12), bg=BG, justify="left"
        )
        self.result_label.pack(pady=15, anchor="w")

    def add_row(self, subject=""):
        row_index = len(self.rows) + 1  # row 0 is the header
        subject_entry = tk.Entry(self.table, font=("Arial", 11))
        grade_entry = tk.Entry(self.table, font=("Arial", 11), width=8)
        subject_entry.grid(row=row_index, column=0, sticky="ew", pady=3, ipady=3)
        grade_entry.grid(row=row_index, column=1, sticky="ew", pady=3, padx=(8, 0), ipady=3)
        if subject:
            subject_entry.insert(0, subject)
        self.rows.append((subject_entry, grade_entry))

    def calculate(self):
        name = self.name_entry.get().strip()
        if not name:
            messagebox.showerror("Error", "Please enter the student's name.")
            return

        grades = {}
        for subject_entry, grade_entry in self.rows:
            subject = subject_entry.get().strip()
            grade_text = grade_entry.get().strip()

            if not subject and not grade_text:
                continue  # skip empty rows

            if not subject:
                messagebox.showerror("Error", "Please enter a subject name.")
                return

            try:
                grade = float(grade_text)
            except ValueError:
                messagebox.showerror("Error", "Grade for {subject} must be a number.")
                return

            if grade < 0 or grade > 100:
                messagebox.showerror(
                    "Error", f"Grade for {subject} must be between 0 and 100."
                )
                return

            grades[subject] = grade

        if not grades:
            messagebox.showerror("Error", "please enter at least one subject and grade.")
            return

        student = Student(name, grades)
        result = student.get_result()

        self.result_label.config(
            text=(
                f"Name: {student.name}\n"
                f"Average: {student.get_average():.2f}\n"
                f"LetterGrade: {student.get_letter_grade()}\n"
                f"Result: {result}"
            ),
            fg="#2e7d32" if result == "Passed" else "#c62828",
        )

    def clear(self):
        self.name_entry.delete(0, tk.END)
        for subject_entry, grade_entry in self.rows:
            grade_entry.delete(0, tk.END)
        self.result_label.config(text="")


if __name__ == "__main__":
    root = tk.Tk()
    app = GradeCalculatorApp(root)
    root.mainloop()