const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

window.onload = function() {
  class PlayGround {
    constructor() {
      this.snakeX = [3];
      this.snakeY = [5];
      this.width = 20;
      this.height = 20;

      this.direction = "d";
      this.nextDirection = "d";

      this.score = 0;
      this.bodyIncreaseCount = 0;

      this.foodX = 10;
      this.foodY = 10;

      this.boomX = 20;
      this.boomY = 20;

      this.randomBoom = false;

      this.sleepInterval = 300;
      this.alive = true;
    }
    init() {
      this.alive = true;
      this.foodX = Math.floor(Math.random(1) * 20);
      this.foodY = Math.floor(Math.random(1) * 20);
      this.snakeX = [3]; //뱀시작좌표
      this.snakeY = [5]; //뱀시작좌표
      this.score = 0; //획득점수
      this.bodyIncreaseCount = 0; //먹이 먹은 후 몸통 늘어날 횟수
      this.direction = this.nextDirection = "d";
      this.sleepInterval = 300;
      // this.animate();
    }

    animate() {
      this.move(); //뱀좌표이동
      this.checkFood(); //먹이 먹었으면 먹이 새좌표제공
      this.checkCollision(); //몸통, 벽과 충돌검사
      this.draw(); //현 상황 그리기
      if (this.alive) {
        //충돌안했으면 간격주고 다시 동작
        let timer = setTimeout(this.animate, this.sleepInterval);
      } else {
        if (confirm("Try Again?")) this.init();
      }
    }

    move() {
      this.direction = this.nextDirection;

      if (this.bodyIncreaseCount >= 0) {
        this.bodyIncreaseCount--;
      } else {
        // console.log(snakeXa);
        this.snakeX.pop(); //꼬리x좌표삭제
        this.snakeY.pop(); //꼬리y좌표삭제
      }
      var lx = this.snakeX[0];
      var ly = this.snakeY[0];

      switch (this.direction) {
        case "d":
          ly = this.snakeY[0] + 1; //아래쪽
          break;
        case "u":
          ly = this.snakeY[0] - 1; //윗쪽
          break;
        case "l":
          lx = this.snakeX[0] - 1; //왼쪽
          break;
        case "r":
          lx = this.snakeX[0] + 1; //오른쪽
          break;
      }
      this.snakeX.unshift(lx); //머리x좌표추가
      this.snakeY.unshift(ly); //머리y좌표추가
    }

    checkFood() {
      if (this.snakeX[0] == this.foodX && this.snakeY[0] == this.foodY) {
        this.score += 10; //점수올림.
        this.bodyIncreaseCount += 1; //몸통 늘어날 횟수
        if (this.sleepInterval > 100) this.sleepInterval -= 25; //움직이는 속도 높이기
        this.randomBoom = Math.random(1) > 0.5 ? true : false;
        if (this.randomBoom) {
          this.newBoom();
        }
        this.newFood();
      }
    }

    newBoom() {
      let mycollision = false; //겹치는지 여부
      while (true) {
        this.boomX = Math.floor(Math.random(1) * 20);
        this.boomY = Math.floor(Math.random(1) * 20);

        const snakeLength = this.snakeX.length;
        if (mycollision) return;
        for (let i = 0; i < snakeLength; i++) {
          //새로운 먹이와 뱀영역이 겹쳐지나?
          if (this.boomX == this.snakeX[i] && this.boomY == this.snakeY[i]) {
            mycollision = true;
            break;
          }
        } //end for

        if (!mycollision) {
          return; //새로운 먹이 죄표와 뱀영역이 겹치지 않으면 탈출.
        }
      } //end while
    }
    checkCollision() {
      //머리좌표추출
      const x0 = this.snakeX[0];
      const y0 = this.snakeY[0];
      for (let i = 1; i < this.snakeX.length; i++) {
        //머리와 몸통이 겹쳐지나?
        if (x0 == this.snakeX[i] && y0 == this.snakeY[i]) {
          this.alive = false;
          return;
        }
      }
      if (x0 == this.boomX && y0 == this.boomY) {
        this.alive = false;
        return;
      }
      //벽과 충돌했나?
      if (
        x0 < 0 ||
        x0 * this.width >= 400 ||
        y0 < 0 ||
        y0 * this.height >= 400
      ) {
        this.alive = false;
        clearTimeout(timer);
      }
    }

    newFood() {
      let mycollision = false; //겹치는지 여부
      this.randomBoom = false;
      while (true) {
        this.foodX = Math.floor(Math.random(1) * 20);
        this.foodY = Math.floor(Math.random(1) * 20);

        const snakeLength = this.snakeX.length;
        console.log("********** 몸 충돌 검사전 mycollision = " + mycollision);
        if (mycollision) return;
        for (let i = 0; i < snakeLength; i++) {
          //새로운 먹이와 뱀영역이 겹쳐지나?
          if (this.foodX == this.snakeX[i] && this.foodY == this.snakeY[i]) {
            mycollision = true;
            console.log("몸과 충돌 발견: index=" + i);
            break;
          }
        } //end for
        console.log("********** 몸 충돌 검사후 mycollision = " + mycollision);
        console.log(mycollision ? "### 새로운 먹이 죄표 몸과 충돌 했음" : "");
        if (!mycollision) {
          return; //새로운 먹이 죄표와 뱀영역이 겹치지 않으면 탈출.
        }
        console.log("snakeXa = " + snakeXa);
        console.log("snakeYa = " + snakeYa);
        console.log("==========================================");
      } //end while
    }

    draw() {
      context.clearRect(0, 0, 400, 400);
      //내부스타일
      if (playGround.alive) context.fillStyle = "black";
      else context.fillStyle = "gray";
      //테두리스타일
      context.strokeStyle = "pink";
      for (let i = 0; i < playGround.snakeX.length; i++) {
        var sx = playGround.snakeX[i];
        var sy = playGround.snakeY[i];
        var dx = sx * playGround.width;
        var dy = sy * playGround.height;
        //debug(dx+','+dy);
        //내부채우기
        context.fillRect(dx, dy, playGround.width, playGround.height);
        //외곽테두리그리기
        context.strokeRect(dx, dy, playGround.width, playGround.height);
      }
      //draw FOOD
      context.fillStyle = "red";
      context.fillRect(
        playGround.foodX * playGround.width,
        playGround.foodY * playGround.height,
        playGround.width,
        playGround.height
      );

      //draw Bomb
      context.fillStyle = "yellow";
      context.fillRect(
        playGround.boomX * playGround.width,
        playGround.boomY * playGround.height,
        playGround.width,
        playGround.height
      );
    }
  }

  const playGround = new PlayGround();

  playGround.init();

  function hi() {
    playGround.move(); //뱀좌표이동
    playGround.checkFood(); //먹이 먹었으면 먹이 새좌표제공
    playGround.checkCollision(); //몸통, 벽과 충돌검사
    playGround.draw(); //현 상황 그리기
  }

  if (playGround.alive) {
    //충돌안했으면 간격주고 다시 동작
    let timer = setTimeout(hi, playGround.sleepInterval);
  } else {
    if (confirm("Try Again?")) playGround.init();
  }

  document.addEventListener("keydown", e => {
    const keyCode = e.keyCode;
    if (keyCode === 37) {
      if (playGround.direction != "r")
        //반대방향일경우 무시
        playGround.nextDirection = "l";
    } else if (keyCode === 38) {
      if (playGround.direction != "d") playGround.nextDirection = "u";
    } else if (keyCode === 39) {
      if (playGround.direction != "l") playGround.nextDirection = "r";
    } else if (keyCode === 40) {
      if (playGround.direction != "u") playGround.nextDirection = "d";
    }
  });
};
