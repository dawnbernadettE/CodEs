const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Student {
  constructor(name, CS301, GEELEC, CS303) {
    this.name    = name;
    this.CS301    = CS301;
    this.GEELEC = GEELEC;
    this.CS303 = CS303;
  }
  getAverage() {
    return (this.CS301 + this.GEELEC + this.CS303) / 3;
  }

  getLetterGrade() {
    var average = this.getAverage();
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
  }
  getResult() {
    if (this.getAverage() >= 60) {
      return "Passed";
    } else {
      return "Failed";
    }
  }

}

function drawTop() {
  console.log("╔════════════════════════════════════════╗");
}
function drawRow(text) {
  while (text.length < 40) {
    text = text + " ";
  }
  console.log("║" + text + "║");
}

function drawBottom() {
  console.log("╚════════════════════════════════════════╝");
}
function showReport(student) {
  var average = student.getAverage();
  var letter  = student.getLetterGrade();
  var result  = student.getResult();

  console.log("");
  drawTop();
  drawRow("  Student Grade Report");
  drawRow("  ──────────────────────────────────────");
  drawRow("  Name       : " + student.name);
  drawRow("  CS301: " + student.CS301);
  drawRow("  GEELEC    : " + student.GEELEC);
  drawRow("  CS303    : " + student.CS303); 
  drawRow("  ──────────────────────────────────────");
  drawRow("  Average    : " + average.toFixed(2));
  drawRow("  Grade      : " + letter);
  drawRow("  Result     : " + result);
  drawBottom();
  console.log("");
}

function ask(question, callback) {
  rl.question("  > " + question, callback);
}

console.log("");
drawTop();
drawRow("        Student Grade Calculator");
drawBottom();
console.log("");

ask("Student name    : ", function (name) {
  ask("CS301 grade: ", function (CS301) {
    ask("GEELEC grade    : ", function (GEELEC) {
      ask("CS303 grade    : ", function (CS303) {

        var student = new Student(name, Number(CS301), Number(GEELEC), Number(CS303));

        showReport(student);

        rl.close();
      });
    });
  });
});