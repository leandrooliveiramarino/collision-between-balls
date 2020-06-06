export const randomIntBetween = (min, max) => {
  return min + Math.floor((max - min) * Math.random());
};

export const getDistance = (circle1, circle2) => {
  let xDistance = circle1.x - circle2.x;
  let yDistance = circle1.y - circle2.y;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

export const isCollided = (circle1, circle2) => {
  const distance = getDistance(circle1, circle2);
  return circle1.radius + circle2.radius - distance > 0;
};

export const generateRandomPosition = (
  radius,
  innerHeight,
  innerWidth,
  availablePositions
) => {
  let _position = {};
  let _isCollided = false;
  let collisionAmount = 0;
  do {
    _isCollided = false;
    _position = {
      x: randomIntBetween(radius, innerWidth - radius),
      y: randomIntBetween(radius, innerHeight - radius),
    };

    if (collisionAmount > 8) {
      throw new Error('Collision amount exceeded');
    }
    availablePositions.forEach((position) => {
      if (isCollided({ ..._position, radius }, { ...position, radius })) {
        _isCollided = true;
        collisionAmount++;
        return;
      }
    });
  } while (_isCollided);
  return _position;
};
