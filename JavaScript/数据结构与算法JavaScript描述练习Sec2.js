console.log('1. ---------------------------')
let recordGrade = {
  grade: [],
  newGrade (name, grade) {
    this.grade.push({ name, grade })
  },
  showAverage () {
    var total = 0
    for (var i = 0; i < this.grade.length; i++) {
      total += this.grade[i].grade
    }
    console.log(total / this.grade.length)
  }
}
recordGrade.newGrade('Mike', 25)
recordGrade.showAverage()
recordGrade.newGrade('Lily', 92)
recordGrade.showAverage()
console.log('2. ---------------------------')
let words = ['eat', 'cat', 'fat', 'bat']
console.log(words.sort())
console.log(words.sort().reverse())
console.log('3. ---------------------------')
function weekTemps () {
  this.dataStore = []
  this.add = function (temp) {
    this.dataStore.push(temp)
  }
  this.average = function () {
    var total = 0
    for (var i = 0; i < this.dataStore.length; i++) {
      total += this.dataStore[i]
    }
    return total / this.dataStore.length
  }
}
class WeekTemps {
  constructor () {
    this.dataStore = []
    for (let i = 0; i < 12; i++) {
      var col = []
      for (let j = 0; j < 4; j++) {
        col[j] = parseInt(Math.random() * 60)
      }
      this.dataStore[i] = col
    }
  }
  // x：月，y：周
  add (x, y, val) { this.dataStore[x][y] = val }
  monthAverage (month) {
    var total = 0
    for (let i = 0; i < 4; i++) {
      total += this.dataStore[month][i]
    }
    return total / 4
  }
  weekAverage (week) {
    var total = 0
    for (let i = 0; i < 12; i++) {
      total += this.dataStore[i][week]
    }
    return total / 12
  }
  totalAverage () {
    var total = 0
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 4; j++) {
        total += this.dataStore[i][j]
      }
    }
    return total / 48
  }
}
var temp = new WeekTemps()
console.log(temp.dataStore)
console.log(temp.monthAverage(1))
console.log(temp.weekAverage(2))
console.log(temp.totalAverage())
console.log('4. ---------------------------')
var createWord = {
  letters: ['f', 'u', 'c', 'k'],
  joinLetters () {
    console.log(this.letters.join(''))
  }
}
createWord.joinLetters()
