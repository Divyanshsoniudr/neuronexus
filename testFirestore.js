import { db } from './src/services/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

async function testConnection() {
    console.log("Starting Firestore Connectivity Test...");
    try {
        const testRef = doc(db, "_connectivity_test_", "ping");
        console.log("Attempting to fetch test document...");
        await getDoc(testRef);
        console.log("✅ Firestore Reachable!");
    } catch (error) {
        console.error("❌ Firestore Connectivity Error:");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        if (error.code === 'unavailable') {
            console.log("TIP: This usually means firestore.googleapis.com is blocked by a firewall or your Firebase Rules match nothing.");
        }
    }
}

testConnection();
