import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBH9Z095XjI53CSNpUtCtzsWVFRrTBIxB0",
    authDomain: "neuroquiz-5e0d4.firebaseapp.com",
    projectId: "neuroquiz-5e0d4",
    storageBucket: "neuroquiz-5e0d4.firebasestorage.app",
    messagingSenderId: "919913410292",
    appId: "1:919913410292:web:b2fea2510bbdeb2b7af8a1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const assignRole = async (uid, role) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            await updateDoc(userRef, { role: role });
            console.log(`✅ Success: Updated UID ${uid} to role '${role}'`);
        } else {
            await setDoc(userRef, { role: role }, { merge: true });
            console.log(`✅ Success: Created new profile for UID ${uid} with role '${role}'`);
        }
    } catch (error) {
        console.error(`❌ Error assigning role to ${uid}:`, error.message);
    }
};

const run = async () => {
    console.log("Starting Neural Role Assignment Query...");

    // Admin assignment
    await assignRole("6qxkPvA2V2hBJtqpvkFXclCKR3l1", "admin");

    // Moderator assignment
    await assignRole("PxFGBFDRdVenBebC5rIBMffNubW2", "moderator");

    console.log("Query Cycle Complete.");
    process.exit(0);
};

run();
