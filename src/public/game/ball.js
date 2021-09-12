export class Ball {
  constructor(playerInfo, radius, speed, direction) {
    this.x = playerInfo.pos.x;
    this.y = playerInfo.pos.y - direction * radius;
    this.radius = radius;
    this.vx = speed;
    this.vy = direction * speed;
    this.color = "red";
    this.playerWidth = playerInfo.width;
  }

  drawBall(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx, canvasPos, currentPlayer1Pos, currentPlayer2Pos) {
    this.drawBall(ctx);

    this.x += this.vx;
    this.y -= this.vy;
    if (this.isOverBaseLine(canvasPos)) {
      return false;
    }
    if (this.isTouchedStick(currentPlayer1Pos, currentPlayer2Pos)) {
      this.vy = -this.vy;
    } else {
      if (this.isTouchedSideWall(canvasPos)) {
        this.vx = -this.vx;
      }
    }

    return true;
  }

  isOverBaseLine(canvasPos) {
    return this.y > canvasPos.y + this.radius || this.y < this.radius;
  }
  isTouchedStick(player1, player2) {
    return (
      (this.x >= player1.x - this.radius &&
        this.x <= player1.x + this.playerWidth + this.radius &&
        this.y >= player1.y - this.radius &&
        this.y <= player1.y) ||
      (this.x >= player2.x - this.radius &&
        this.x <= player2.x + this.playerWidth + this.radius &&
        this.y <= player2.y + this.radius &&
        this.y >= player2.y)
    );
  }
  isTouchedSideWall(canvasPos) {
    return this.x > canvasPos.x - this.radius || this.x < this.radius;
  }
  isTouchedUpperWall() {
    return this.y < this.radius;
  }
}
