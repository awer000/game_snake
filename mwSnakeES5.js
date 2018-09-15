//snake
var canvasSize = 400; // canvas 변의 길이

var snakeXa = [3]; //뱀시작좌표
var snakeYa = [5]; //뱀시작좌표

var xwidth = 20; //뱀한칸 길이
var yheight = 20; //뱀한칸 길이

//play
var direction = "d"; // 방향 u,d,l,r
var nextDirection = "d"; //다음방향 u,d,l,r

var score = 0; //획득점수
var bodyIncreaseCount = 0; //먹이 먹은 후 몸통 늘어날 횟수

var foodX = 10; //먹이 좌표
var foodY = 10; //먹이 좌표

var boomX = 20; //폭탄 좌표
var boomY = 20;
var randomBoom = false;

var moveInterval = 300; //움직이는 시간 간격
var alive = true; //게임 가능여부. 몸통이나 벽이 부딛히면 false.

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

window.onload = function() {
  init();

  document.addEventListener("keydown", e => {
    const keyCode = e.keyCode;
    if (keyCode === 37) {
      if (direction !== "r")
        //반대방향일경우 무시
        nextDirection = "l";
    } else if (keyCode === 38) {
      if (direction !== "d") nextDirection = "u";
    } else if (keyCode === 39) {
      if (direction !== "l") nextDirection = "r";
    } else if (keyCode === 40) {
      if (direction !== "u") nextDirection = "d";
    }
  });
};

function init() {
  alive = true;
  foodX = Math.floor(Math.random() * xwidth);
  foodY = Math.floor(Math.random() * xwidth);
  snakeXa = [Math.floor(Math.random() * xwidth)]; //뱀시작좌표
  snakeYa = [2]; //뱀시작좌표
  score = 0; //획득점수
  bodyIncreaseCount = 0; //먹이 먹은 후 몸통 늘어날 횟수
  direction = nextDirection = "d";
  moveInterval = 300;
  animate();
}
function animate() {
  move(); //뱀좌표이동
  checkFood(); //먹이 먹었으면 먹이 새좌표제공
  checkCollision(); //몸통, 벽과 충돌검사
  draw(); //현 상황 그리기
  if (alive) {
    //충돌안했으면 간격주고 다시 동작
    timer = setTimeout(animate, moveInterval);
  } else {
    if (confirm(`획득점수: ${score}\nTry Again?`))
      window.location.href = window.location.href;
  }
}

function move() {
  direction = nextDirection;
  //debug("방향: "+direction);

  if (bodyIncreaseCount >= 0) {
    bodyIncreaseCount--;
  } else {
    snakeXa.pop(); //꼬리x좌표삭제
    snakeYa.pop(); //꼬리y좌표삭제
  }
  var lx = snakeXa[0];
  var ly = snakeYa[0];

  switch (direction) {
    case "d":
      ly = snakeYa[0] + 1; //아래쪽
      break;
    case "u":
      ly = snakeYa[0] - 1; //윗쪽
      break;
    case "l":
      lx = snakeXa[0] - 1; //왼쪽
      break;
    case "r":
      lx = snakeXa[0] + 1; //오른쪽
      break;
  }
  snakeXa.unshift(lx); //머리x좌표추가
  snakeYa.unshift(ly); //머리y좌표추가
}

function checkFood() {
  if (snakeXa[0] === foodX && snakeYa[0] === foodY) {
    score += 10; //점수올림.
    bodyIncreaseCount += 1; //몸통 늘어날 횟수
    if (moveInterval > 100) moveInterval -= 25; //움직이는 속도 높이기
    randomBoom = Math.random() > 0.5 ? true : false;
    if (randomBoom) {
      newBoom();
    }
    newFood();
  }
}

function newBoom() {
  var mycollision = false; //겹치는지 여부
  while (true) {
    boomY = Math.floor(Math.random() * xwidth);
    boomX = Math.floor(Math.random() * xwidth);

    var snakeLength = snakeXa.length;
    if (mycollision) return;
    for (var i = 0; i < snakeLength; i++) {
      //새로운 먹이와 뱀영역이 겹쳐지나?
      if (boomX === snakeXa[i] && boomY === snakeYa[i]) {
        mycollision = true;
        break;
      }
    } //end for

    if (!mycollision) {
      return; //새로운 먹이 죄표와 뱀영역이 겹치지 않으면 탈출.
    }
  } //end while
}

function checkCollision() {
  //머리좌표추출
  var x0 = snakeXa[0];
  var y0 = snakeYa[0];
  for (var i = 1; i < snakeXa.length; i++) {
    //머리와 몸통이 겹쳐지나?
    if (x0 === snakeXa[i] && y0 === snakeYa[i]) {
      alive = false;
      return;
    }
  }
  if (x0 === boomX && y0 === boomY) {
    alive = false;
    return;
  }
  //벽과 충돌했나?
  if (
    x0 < 0 ||
    x0 * xwidth >= canvasSize ||
    y0 < 0 ||
    y0 * yheight >= canvasSize
  ) {
    alive = false;
    clearTimeout(timer);
  }
}

function newFood() {
  var mycollision = false; //겹치는지 여부
  randomBoom = false;
  while (true) {
    foodX = Math.floor(Math.random() * xwidth);
    foodY = Math.floor(Math.random() * xwidth);

    var snakeLength = snakeXa.length;
    if (mycollision) return;
    for (var i = 0; i < snakeLength; i++) {
      //새로운 먹이와 뱀영역이 겹쳐지나?
      if (foodX == snakeXa[i] && foodY == snakeYa[i]) {
        mycollision = true;
        break;
      }
    } //end for

    if (!mycollision) {
      return; //새로운 먹이 죄표와 뱀영역이 겹치지 않으면 탈출.
    }
  } //end while
}

function draw() {
  context.clearRect(0, 0, canvasSize, canvasSize);

  if (alive) {
    context.fillStyle = "green";
  } else {
    context.fillStyle = "gray";
  }
  context.strokeStyle = "gold";

  for (let i = 0; i < snakeXa.length; i++) {
    var sx = snakeXa[i];
    var sy = snakeYa[i];
    var dx = sx * xwidth;
    var dy = sy * yheight;

    context.fillRect(dx, dy, xwidth, yheight);
    //외곽테두리그리기
    context.strokeRect(dx, dy, xwidth, yheight);
  }
  //draw FOOD
  context.strokeStyle = "pink";
  context.fillStyle = "pink";
  context.fillRect(foodX * xwidth, foodY * yheight, xwidth, yheight);

  //draw Bomb
  context.strokeStyle = "pink";
  context.fillStyle = "yellow";
  context.fillRect(boomX * xwidth, boomY * yheight, xwidth, yheight);
}
