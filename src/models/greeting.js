import { register, ValueChangedEvent } from '@lwc/wire-service';
import firebase from '../firebase.js';
const db = firebase.firestore();



export function getGreetings(config) {
console.log('This never fires... 🤷🏼‍♂️');
console.log('Also, where does getObservable and makeReadOnlyMembrane come from???');
    return getObservable(config)
        .map(makeReadOnlyMembrane)
        .toPromise();
}



register(getGreetings, function getGreetingsWireAdapterFactory(eventTarget) {
    let subscription;
    let config;
    let greetings;
console.log('this never fires either... 🤷🏼‍♂️');
    // Invoked when config is updated.
    eventTarget.addListener('config', newConfig => {
        // Capture config for use during subscription.
        config = newConfig;
    });

    // Invoked when component connected.
    eventTarget.addListener('connect', () => {
        // Subscribe to stream.
        subscription = getObservable(config)
            .map(makeReadOnlyMembrane)
            .subscribe({
                next: data => 
                    eventTarget.dispatchEvent(
                        new ValueChangedEvent({ data: greetings, error: undefined })
                    ),
                error: error =>
                    eventTarget.dispatchEvent(
                        new ValueChangedEvent({ data: undefined, error })
                    ),
            });

        // Get the data from Firestore:
        db.collection("greetings")
            .get()
            .then(function(querySnapshot) {    
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let data = doc.data();
                    if (data.greeting != undefined) {
                        greetings.push(data.greeting);
                    }
                });

                eventTarget.dispatchEvent(
                    new ValueChangedEvent({ data: greetings, error: undefined })
                );
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    });

    // Invoked when component disconnected.
    eventTarget.addListener('disconnect', () => {
        // Release all resources.
        subscription.unsubscribe();
    });
});