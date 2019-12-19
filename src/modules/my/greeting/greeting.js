import { LightningElement, track, api } from 'lwc';
import firebase from '../../../firebase.js';

const db = firebase.firestore();

const SPEED_CLASS_MAP = {
    slow: 'fade-slow',
    fast: 'fade-fast',
    medium: 'fade-medium'
};
const DEFAULT_SPEED = 'medium';

export default class Greeting extends LightningElement {
    @track animationSpeed = DEFAULT_SPEED;
    @track index = 0;
    @track isAnimating = true;
    @track greetings = ['Loading...'];

    @api
    set speed(value) {
        if (SPEED_CLASS_MAP[value]) {
            this.animationSpeed = value;
        } else {
            this.animationSpeed = DEFAULT_SPEED;
        }
        this.isAnimating = true;
    }

    // Return the internal speed property
    get speed() {
        return this.animationSpeed;
    }

    // Get the current greeting
    get greeting() {
        return this.greetings[this.index];
    }

    // Map slow, medium, fast to CSS Animations
    get animationClass() {
        if (this.isAnimating) {
            return SPEED_CLASS_MAP[this.speed];
        }
        return 'hide';
    }

    //Handle the animation ending, update to next hello
    handleAnimationEnd() {
        this.isAnimating = false;
        this.index = (this.index + 1) % this.greetings.length;

        setTimeout(() => this.updateGreeting(), 500);
    }

    // Update to the next greeting and start animating
    updateGreeting() {
        this.isAnimating = true;
    }

    // When component is inserted into the DOM:
    connectedCallback() {
        this.getGreetings();
    }

    getGreetings() {
        const that = this;

        db.collection("greetings")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let data = doc.data();
                    if (data.greeting != undefined) {
                        that.greetings.push(data.greeting);
                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
}
