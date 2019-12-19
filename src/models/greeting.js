import { register, ValueChangedEvent } from '@lwc/wire-service';
import firebase from '../firebase.js';
const db = firebase.firestore();



export function getGreetings(config) {
    return getObservable(config)
        .map(makeReadOnlyMembrane)
        .toPromise();
}



register(getGreetings, function getGreetingsWireAdapterFactory(eventTarget) {
    let subscription;
    let config;
    let greetings;

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
                    wiredEventTarget.dispatchEvent(
                        new ValueChangedEvent({ data, error: undefined })
                    ),
                error: error =>
                    wiredEventTarget.dispatchEvent(
                        new ValueChangedEvent({ data: undefined, error })
                    ),
            });

console.log('Connected...');
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
console.log(greetings);
                wiredEventTarget.dispatchEvent(
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