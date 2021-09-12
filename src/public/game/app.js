import { Player } from "./player.js";
import { Ball } from "./ball.js";
import { Pos } from "./dto/pos.js";
import { PlayerDto } from "./dto/player.dto.js";

export class App {
  constructor(dataChannel, order) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    this.dataChannel = dataChannel;
    this.resize();

    this.player1 = new Player(this.stageWidth, this.stageHeight, 100, 10, 10);
    this.player2 = new Player(this.stageWidth, 10, 100, 10, 10);
    // get playerInfo
    let pos;
    let direction;
    if (order === "1p") {
      pos = new Pos(this.player1.x, this.player1.y);
      direction = 1;
    } else {
      pos = new Pos(this.player2.x, this.player2.y);
      direction = -1;
    }
    const playerInfo = new PlayerDto(pos, this.player1.rectWidth);
    this.ball = new Ball(playerInfo, 10, 15, direction);
    this.playerMove();

    window.requestAnimationFrame(this.animate);
    this.dataChannel.addEventListener("message", (message) => {
      this.handlePeerData(message.data);
    });
  }

  resize() {
    this.stageWidth = this.canvas.clientWidth;
    this.stageHeight = this.canvas.clientHeight;
    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player1.draw(this.ctx);
    this.player2.draw(this.ctx);
    const currentPlayer1Pos = this.player1.getPos();
    const currentPlayer2Pos = this.player2.getPos();
    let inGame = this.ball.draw(
      this.ctx,
      new Pos(this.stageWidth, this.stageHeight),
      currentPlayer1Pos,
      currentPlayer2Pos
    );

    // if (!inGame) {
    //   alert("Game over!!!");
    //   return;
    // }
    // game rerender
    window.requestAnimationFrame(this.animate);
  };

  handlePeerData(data) {
    this.player2.setX(data);
  }

  playerMove = () => {
    this.canvas.addEventListener("mousemove", (event) => {
      const postionX = event.clientX - this.canvas.offsetLeft;
      this.player1.setX(postionX);
      this.dataChannel.send(postionX);
    });
  };
}
