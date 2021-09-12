export class Pos {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }

  set x(xPos) {
    this._x = xPos;
  }

  set y(yPos) {
    this._y = yPos;
  }
}
