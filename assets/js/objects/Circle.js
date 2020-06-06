import { resolveCollision } from '../helpers';
export default class Circle {
  constructor(context, props, events) {
    this.context = context;
    this.innerWidth = props.innerWidth;
    this.innerHeight = props.innerHeight;
    this.mouseMove = events.mouseMove;
    this.x = props.x;
    this.y = props.y;
    this.radius = props.radius;

    this._init();
  }

  _init() {
    this.circles = [];
    this.mass = 1;
    this.velocity = {
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3,
    };
    this._setOriginalColor();
    this._originalColor = this.color;
    this.opacity = 0;
  }

  _draw(x, y) {
    this.context.beginPath();
    this.context.arc(x, y, this.radius, 0, Math.PI * 2, false);
    this.context.lineWidth = 1;
    this.context.strokeStyle = `rgba(${this.color})`;
    this.context.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    this.context.fill();
    this.context.stroke();
  }

  getDistance(anotherCircle) {
    let xDistance = anotherCircle.x - this.x;
    let yDistance = anotherCircle.y - this.y;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }

  update(circles) {
    this._draw(this.x, this.y);
    this.circles = circles;
    this._setBehavior();
  }

  _actionConditions() {
    const actions = [];

    if (this.x + this.radius > this.innerWidth) {
      actions.push('INVERT_X_DIRECTION');
    }

    if (this.x - this.radius < 0) {
      actions.push('INVERT_X_DIRECTION');
    }

    if (this.y + this.radius > this.innerHeight) {
      actions.push('INVERT_Y_DIRECTION');
    }

    if (this.y - this.radius < 0) {
      actions.push('INVERT_Y_DIRECTION');
    }

    if (
      this.mouseMove.x - this.x < 200 &&
      this.mouseMove.x - this.x > -200 &&
      this.mouseMove.y - this.y < 200 &&
      this.mouseMove.y - this.y > -200
    ) {
      actions.push('INCREASE_OPACITY');
    }

    if (!actions.includes('INCREASE_OPACITY') && this.opacity > 0) {
      actions.push('DECREASE_OPACITY');
    }

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
      INVERT_X_DIRECTION: () => {
        this.velocity.x = this.velocity.x * -1;
      },
      INVERT_Y_DIRECTION: () => {
        this.velocity.y = this.velocity.y * -1;
      },
      SET_OPACITY: () => {
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.strokeStyle = this.color;
        this.context.stroke();
      },
      MOVE: () => {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      },
      INCREASE_OPACITY: () => {
        if (this.opacity <= 1) {
          this.opacity += 0.02;
        }
      },
      DECREASE_OPACITY: () => {
        if (this.opacity > 0) {
          this.opacity -= 0.02;
        }
      },
      DETECT_COLLISION: () => {
        this.circles.forEach((otherCircle) => {
          if (this === otherCircle) {
            return;
          }
          const distance = this.getDistance(otherCircle);

          // Colision detected
          if (otherCircle.radius + this.radius > distance) {
            resolveCollision(this, otherCircle);
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
