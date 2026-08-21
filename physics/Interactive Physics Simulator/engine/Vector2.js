export class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(
            this.x + v.x,
            this.y + v.y
        );
    }

    subtract(v) {
        return new Vector2(
            this.x - v.x,
            this.y - v.y
        );
    }

    multiply(scalar) {
        return new Vector2(
            this.x * scalar,
            this.y * scalar
        );
    }

    divide(scalar) {

        if (scalar === 0) {
            throw new Error("Cannot divide vector by zero.");
        }

        return new Vector2(
            this.x / scalar,
            this.y / scalar
        );
    }

    magnitude() {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y
        );
    }

    magnitudeSquared() {
        return (
            this.x * this.x +
            this.y * this.y
        );
    }

    normalize() {

        const magnitude =
            this.magnitude();

        if (magnitude === 0) {
            return new Vector2(0, 0);
        }

        return this.divide(magnitude);
    }

    dot(v) {
        return (
            this.x * v.x +
            this.y * v.y
        );
    }

    clone() {
        return new Vector2(
            this.x,
            this.y
        );
    }

}