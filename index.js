class BoardGame {
  constructor () {
    this.boardstr = "";
    this.currentgird = null;
    this.timer = 120;
    this.lastx = 0;
    this.lasty = 0;
    this.score = 0;
    this.changeSelectedGame = this.changeSelectedGame.bind(this);
    this.runGame = this.runGame.bind(this);
    this.doGreen = this.doGreen.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.isLocked = false;
    this.lastClickedX = 0;
    this.lastClickedY = 0;
    this.highScore = 0;
    this.type = null;
  }

  updateScore(e) {
    if (this.isLocked) return;
    this.isLocked = true;
    let i = e.target.getAttribute("row");

    let j = e.target.getAttribute("column");

    if (document.getElementById("board").rows[i].cells[j].style.backgroundColor === "green") {
      this.score++;
    } else {
      this.lastClickedX = i;
      this.lastClickedY = j;
      document.getElementById("board").rows[i].cells[j].style.backgroundColor = "red";
      this.score--;
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      window.localStorage.setItem(this.type, this.highScore);
    }

    document.getElementById("score").innerHTML = `Score: ${this.score} HighScore: ${this.highScore}`;
  }

  changeSelectedGame (n, type) {
    this.currentgird = n;
    let x = 0;
    let y = 0;
    this.boardstr = "";
    this.type = type;

    if (window.localStorage.getItem(type)) {
      this.highScore = parseInt(localStorage.getItem(type), 10);
    }

    document.getElementById("score").innerHTML = `Score: ${this.score} HighScore: ${this.highScore}`;

    while(x < n) {
      this.boardstr += "<tr>";
      while (y < n) {
        this.boardstr += `<td row="${x}" column="${y}" onclick=updateScore(event) class="game-cell"></td>`;
        y++;
      }
      this.boardstr += "</tr>";
      y = 0;
      x++;
    }
  
    document.getElementById("board").innerHTML = this.boardstr;
  
    this.runGame();
  }

  runGame() {
    document.getElementById("board").rows[this.lastx].cells[this.lasty].style.backgroundColor = "lightgray";
    document.getElementById("board").rows[this.lastClickedX].cells[this.lastClickedY].style.backgroundColor = "lightgray";
  
    if (this.timer === 0) {
      alert("Game Over");
      this.timer = 120;
      this.runGame();
      return;
    }
  
    let i = Math.floor(Math.random() * this.currentgird);
    let j = Math.floor(Math.random() * this.currentgird);
  
    setTimeout(() => {
      this.doGreen(i, j);
    }, 100);
  }

  doGreen (i, j) {
    this.isLocked = false;
    document.getElementById("board").rows[i].cells[j].style.backgroundColor = "green";
    this.lastx = i;
    this.lasty = j;

    setTimeout(() => {
      this.timer--;
      this.runGame();
    }, 1000);
  }
}


window.changeSelectedGame = (n, type) => {
  if (document.getElementById("score")) {
    document.getElementById("score").innerHTML = `Score: ${'0'} HighScore: ${'0'}`
  }
  const game = new BoardGame();

  let id = setTimeout(() => {}, 0);

  while(id--) {
    clearInterval(id);
  }

  game.changeSelectedGame(n, type);

  this.updateScore = game.updateScore;
};