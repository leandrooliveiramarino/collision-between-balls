export default class Circle {
  constructor(context, props, events) {
    this.context = context;
    this.innerWidth = props.innerWidth;
    this.innerHeight = props.innerHeight;
    this.x = props.x;
    this.y = props.y;
    this.radius = props.radius;

    this._init();
  }

  _init() {
    this.dx = 0;
    this.dy = 0;
    this.environmentCircles = [];
    this._setOriginalColor();
    this._originalColor = this.color;
  }

  _draw(x, y) {
    this.context.beginPath();
    this.context.arc(x, y, this.radius, 0, Math.PI * 2, false);
    this.context.lineWidth = 1;
    this.context.strokeStyle = `rgba(${this.color})`;
    this.context.fillStyle = `rgba(${this.color}, 0.6)`;
    this.context.fill();
    this.context.stroke();
  }

  getDistance(anotherCircle) {
    let xDistance = anotherCircle.x - this.x;
    let yDistance = anotherCircle.y - this.y;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }

  setEnvironmentCircles(environmentCircles = []) {
    this.environmentCircles = environmentCircles;
  }

  update(circles) {
    this._draw(this.x, this.y);
    this._setBehavior();
  }

  _actionConditions() {
    const actions = [];

    actions.push('DETECT_COLLISION');
    actions.push('MOVE');

    return actions;
  }

  _setBehavior() {
    const actions = this._actionConditions();

    actions.forEach((action) => {
      this._actions(action)();
    });
  }

  _setOriginalColor() {
    this.COLORS_AVAILABLE = [
      '83, 58, 113',
      '97, 132, 216',
      '80, 197, 183',
      '156, 236, 91',
      '240, 244, 101',
    ];

    const chosenColor = this.COLORS_AVAILABLE[
      Math.floor(Math.random() * this.COLORS_AVAILABLE.length)
    ];

    this.color = chosenColor;
  }

  _actions(action) {
    const _actions = {
      MOVE: () => {
        this.x += this.dx;
        this.y += this.dy;
      },
      DETECT_COLLISION: () => {
        this.environmentCircles.forEach((otherCircle) => {
          const distance = this.getDistance(otherCircle);

          // Colision detected
          if (otherCircle.radius + this.radius > distance) {
            this.color = '0,0,0';
            return;
          }

          this.color = this._originalColor;
        });
      },
    };

    if (!_actions[action]) {
      throw new Error('Action not available: ' + action);
    }

    return _actions[action];
  }
}
