const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // getContext會回傳一個canvas的drawing context，用來在canvas裡畫圖
const unit = 20; // 蛇的身體每一單位有多長
const row = canvas.height / unit; //用高除才能知道有幾個row(橫行)
const column = canvas.width / unit; // 同上，要知道有幾個col(直行)要用寬除unit

let snake = []; // 物件的array，每個物件內含用來儲存蛇的每一個身體的xy座標。(座標越往右，x越大；越往下時，y越大)

function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  newFruit() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
          return;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定(蛇、果實、分數)
createSnake();
let myFruit = new Fruit();
let score = 0;
let highestScore;
checkHighestScore();
document.getElementById("myScore").innerHTML = "目前分數：" + score;
document.getElementById("highestScore").innerHTML = "最高分數：" + highestScore;

addEventListener("keydown", changeDirection);

let dir = "Right";
function changeDirection(e) {
  if (e.key == "ArrowUp" && dir != "Down") {
    // 更新方向的同時也要確認新方向不是180度大迴轉
    dir = "Up";
  } else if (e.key == "ArrowRight" && dir != "Left") {
    dir = "Right";
  } else if (e.key == "ArrowDown" && dir != "Up") {
    dir = "Down";
  } else if (e.key == "ArrowLeft" && dir != "Right") {
    dir = "Left";
  }
  removeEventListener("keydown", changeDirection);
  //在畫完圖之前取消一切按鍵監聽輸入，避免來不及畫圖，造成蛇看起來沒咬到身體但遊戲卻結束了
}

function draw() {
  for (let j = 1; j < snake.length; j++) {
    if (snake[0].x == snake[j].x && snake[0].y == snake[j].y) {
      //每次畫圖前都先確認蛇頭是否有咬到身體
      alert("Game over~!");
      clearInterval(myGame);
      return; // 跳過執行下方所有程式碼，否則會導致遊戲結束後再畫一格
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.drawFruit();
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen"; // 用來畫蛇頭
    } else {
      ctx.fillStyle = "lightblue"; // 用來畫格子的顏色
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      // 判斷當x軸或y軸超出邊界時要從另一測出現
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }

    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 用來畫長方形，傳入參數為(x座標，y座標，寬，高)
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  let snakeX = snake[0].x; // 先拿到目前蛇頭的x,y座標後，再進行下列的方向判斷與計算
  let snakeY = snake[0].y;

  if (dir == "Up") {
    snakeY -= unit;
  } else if (dir == "Right") {
    snakeX += unit;
  } else if (dir == "Down") {
    snakeY += unit;
  } else if (dir == "Left") {
    snakeX -= unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //若蛇頭座標與果實重疊表示吃到了
    myFruit.newFruit(); //隨機產生新果實
    score++; //更新分數
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "目前分數：" + score;
    document.getElementById("highestScore").innerHTML = "最高分數：" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  addEventListener("keydown", changeDirection); //畫完圖之後再重新開始監聽事件
}

let myGame = setInterval(draw, 100);

function checkHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
