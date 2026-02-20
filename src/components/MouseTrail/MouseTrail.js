import React, { Component } from 'react';
import './MouseTrail.scss';

export default class MouseTrail extends Component {
    constructor(props) {
        super(props);
        this.start = new Date().getTime();
        this.last = {
            starTimestamp: this.start,
            starPosition: { x: 0, y: 0 },
            mousePosition: { x: 0, y: 0 }
        };
        this.count = 0;
        this.config = {
            starAnimationDuration: 1500,
            minimumTimeBetweenStars: 250,
            minimumDistanceBetweenStars: 75,
            glowDuration: 75,
            maximumGlowPointSpacing: 10,
            colors: ["249 146 253", "252 254 255"],
            sizes: ["1.4rem", "1rem", "0.6rem"],
            animations: ["fall-1", "fall-2", "fall-3"]
        };
    }

    componentDidMount() {
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('mouseleave', this.handleMouseLeave);
    }

    componentWillUnmount() {
        window.removeEventListener('pointermove', this.handlePointerMove);
        window.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    selectRandom = (items) => items[this.rand(0, items.length - 1)];
    withUnit = (value, unit) => `${value}${unit}`;
    px = (value) => this.withUnit(value, 'px');
    ms = (value) => this.withUnit(value, 'ms');
    calcDistance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    calcElapsedTime = (start, end) => end - start;

    appendElement = (element) => document.body.appendChild(element);
    removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);

    createStar = (position) => {
        const star = document.createElement("span");
        const color = this.selectRandom(this.config.colors);

        star.className = "star fa-solid fa-sparkle";
        star.style.left = this.px(position.x);
        star.style.top = this.px(position.y);
        star.style.fontSize = this.selectRandom(this.config.sizes);
        star.style.color = `rgb${color})`;
        star.style.textShadow = `0px 0px 1.5rem rgba(${color}, 0.5)`;
        star.style.animationName = this.config.animations[this.count++ % 3];
        star.style.animationDuration = this.ms(this.config.starAnimationDuration);

        console.log(star.style.animationName);

        this.appendElement(star);
        this.removeElement(star, this.config.starAnimationDuration);
    };

    createGlowPoint = (position) => {

        const glow = document.createElement("div");
        glow.className = "glow-point";
        glow.style.left = this.px(position.x);
        glow.style.top = this.px(position.y);

        this.appendElement(glow);
        this.removeElement(glow, this.config.glowDuration);
    };

    determinePointQuantity = (distance) => Math.max(Math.floor(distance / this.config.maximumGlowPointSpacing), 1);

    createGlow = (last, current) => {

        const distance = this.calcDistance(last, current);
        const quantity = this.determinePointQuantity(distance);

        for (let index = 0; index < quantity; index++) {
            const x = last.x + (current.x - last.x) / quantity * index;
            const y = last.y + (current.y - last.y) / quantity * index;

            this.createGlowPoint({ x, y });
        }
    };

    updateLastStar = (position) => {
        this.last.starTimestamp = new Date().getTime();
        this.last.starPosition = position;
    };

    updateLastMousePosition = (position) => {
        this.last.mousePosition = position;
    };

    adjustLastMousePosition = (position) => {
        if (this.last.mousePosition.x === 0 && this.last.mousePosition.y === 0) {
            this.last.mousePosition = position;
        }
    };

    handlePointerMove = (e) => {
        const mousePosition = { x: e.clientX, y: e.clientY };
        this.adjustLastMousePosition(mousePosition);

        const now = new Date().getTime();
        const hasMovedFarEnough = this.calcDistance(this.last.starPosition, mousePosition) >= this.config.minimumDistanceBetweenStars;
        const hasBeenLongEnough = this.calcElapsedTime(this.last.starTimestamp, now) > this.config.minimumTimeBetweenStars;

        if (hasMovedFarEnough || hasBeenLongEnough) {
            this.createStar(mousePosition);
            this.updateLastStar(mousePosition);
        }

        this.createGlow(this.last.mousePosition, mousePosition);
        this.updateLastMousePosition(mousePosition);
    };

    handleMouseLeave = () => {
        this.updateLastMousePosition({ x: 0, y: 0 });
    };

    render() {
        return null; // This component does not render anything
    }


}
