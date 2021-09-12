import { Pos } from "./dto/pos.js";

export class Player {
  constructor(stageWidth, stageHeight, rectWidth, rectHeight, speed) {
    this.rectWidth = rectWidth;
    this.rectHeight = rectHeight;
    this.vx = speed;
    this.color = "#fdd700";

    this.x = stageWidth / 2;
    this.y = stageHeight - 10;
  }

  setX(postionX) {
    this.x = postionX;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // 가운데로 하기 위해서 width의 반만큼 뺀다.
    ctx.fillRect(this.x - this.rectWidth / 2, this.y, this.rectWidth, this.rectHeight);
  }

  getPos() {
    return new Pos(this.x - this.rectWidth / 2, this.y);
  }
}
