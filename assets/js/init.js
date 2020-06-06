import Circle from './objects/Circle';
import { context, innerWidth, innerHeight } from './base';
import { mouseMove } from './events/mouseMove';
import { generateRandomPosition } from './helpers';

const initialPositions = [];
const radius = 20;

for (let i = 0; i < 80; i++) {
  const position = generateRandomPosition(
    radius,
    innerHeight,
    innerWidth,
    initialPositions
  );

  initialPositions.push(position);
}
const circles = initialPositions.map(
  (position) =>
    new Circle(
      context,
      { innerWidth, innerHeight, ...position, radius },
      { mouseMove }
    )
);

function animate() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  requestAnimationFrame(animate);

  circles.forEach((circle) => circle.update(circles));
}

animate();
