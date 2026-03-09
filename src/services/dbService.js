import { db } from "./firebase";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    deleteDoc
} from "firebase/firestore";

// Save/Update user skill stats
export const saveUserStats = async (userId, stats) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { skillStats: stats }, { merge: true });
    } catch (error) {
        console.warn(`dbService: saveUserStats deferred. Code: ${error.code}, Msg: ${error.message}`);
    }
};

// [SCALE OPTIMIZATION] Consolidated Write Batch
export const syncSessionData = async (userId, { skillStats, usageStats, globalStats }) => {
    try {
        const userRef = doc(db, "users", userId);
        const updates = { skillStats, usageStats };
        if (globalStats) updates.globalStats = globalStats;

        await updateDoc(userRef, updates);
    } catch (error) {
        console.warn(`dbService: syncSessionData deferred (offline mode).`);
    }
};

// Retrieve user stats
export const getUserStats = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return {
                skillStats: userSnap.data().skillStats,
                globalStats: userSnap.data().globalStats || { totalQuizzes: 0, averageScore: 0 }
            };
        }
    } catch (error) {
        console.warn(`dbService: getUserStats fallback. Code: ${error.code}, Msg: ${error.message}`);
    }
    return null;
};

// Save a completed quiz to history
export const saveQuizToHistory = async (userId, quizData) => {
    try {
        const historyRef = collection(db, "users", userId, "history");
        await addDoc(historyRef, {
            ...quizData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.warn("dbService: saveQuizToHistory deferred (offline mode)");
    }
};

// Fetch user quiz history
export const getUserHistory = async (userId) => {
    try {
        const historyRef = collection(db, "users", userId, "history");
        const q = query(historyRef, orderBy("timestamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn(`dbService: getUserHistory fallback to local (offline mode)`);
        return [];
    }
};

// Save/Update user roadmap progress
export const saveRoadmapProgress = async (userId, progress) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { roadmapProgress: progress }, { merge: true });
    } catch (error) {
        console.warn(`dbService: saveRoadmapProgress deferred. Code: ${error.code}, Msg: ${error.message}`);
    }
};

// Retrieve user roadmap progress
export const getRoadmapProgress = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data().roadmapProgress;
        }
    } catch (error) {
        console.warn(`dbService: getRoadmapProgress failed. Code: ${error.code}, Msg: ${error.message}`);
    }
    return null;
};
// Knowledge Vault: Save a generated quiz for future reuse
export const saveQuizToVault = async (topic, difficulty, questions) => {
    try {
        const vaultRef = doc(db, "vault", `${topic.toLowerCase()}_${difficulty.toLowerCase()}`);
        await setDoc(vaultRef, {
            topic,
            difficulty,
            questions,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.warn("dbService: saveQuizToVault deferred");
    }
};

// Knowledge Vault: Retrieve a cached quiz
export const getQuizFromVault = async (topic, difficulty) => {
    try {
        const vaultRef = doc(db, "vault", `${topic.toLowerCase()}_${difficulty.toLowerCase()}`);
        const vaultSnap = await getDoc(vaultRef);
        if (vaultSnap.exists()) {
            return vaultSnap.data().questions;
        }
    } catch (error) {
        console.warn("dbService: getQuizFromVault failed");
    }
    return null;
};

// Knowledge Vault: Save a generated roadmap
export const saveRoadmapToVault = async (topic, roadmapData) => {
    try {
        const roadmapRef = doc(db, "generated_roadmaps", topic.toLowerCase());
        await setDoc(roadmapRef, {
            topic,
            data: roadmapData,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.warn("dbService: saveRoadmapToVault deferred");
    }
};

// Knowledge Vault: Retrieve a cached roadmap
export const getRoadmapFromVault = async (id) => {
    try {
        const vaultRef = doc(db, "vault", `roadmap_${id}`);
        const vaultSnap = await getDoc(vaultRef);
        if (vaultSnap.exists()) {
            return vaultSnap.data();
        }
    } catch (error) {
        console.warn("dbService: getRoadmapFromVault failed");
    }
    return null;
};

export const saveUsageStats = async (userId, stats) => {
    try {
        const userRef = doc(db, "users", userId);
        // If stats contains isPremium, save it at top level, otherwise save to usageStats
        if (stats.hasOwnProperty('isPremium')) {
            await updateDoc(userRef, { isPremium: stats.isPremium });
        } else {
            await updateDoc(userRef, { usageStats: stats });
        }
    } catch (error) {
        console.warn("dbService: saveUsageStats deferred");
    }
};

export const getUsageStats = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            return {
                usageStats: data.usageStats || null,
                isPremium: data.isPremium || false,
                role: data.role || 'learner'
            };
        }
    } catch (error) {
        console.warn("dbService: getUsageStats failed");
    }
    return null;
};

// Guarantee user document existence with default state
export const ensureUserInitialized = async (user) => {
    if (!user) return null;
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const defaultData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Learner',
                role: 'learner',
                isPremium: false,
                skillStats: { Syntax: 0, Architecture: 0, Logic: 0, Theory: 0, Security: 0 },
                globalStats: { totalQuizzes: 0, averageScore: 0 },
                usageStats: {
                    roadmapsGenerated: 0,
                    quizzesGeneratedToday: 0,
                    lastQuizDate: new Date().toDateString()
                },
                createdAt: new Date().toISOString()
            };
            await setDoc(userRef, defaultData);
            return defaultData;
        }
        return userSnap.data();
    } catch (error) {
        console.error("dbService: ensureUserInitialized failed", error);
        return null;
    }
};

// GDPR: Deep Deletion (The "Right to be Forgotten")
export const deleteUserCloudData = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);

        // 1. Delete History Subcollection
        const historyRef = collection(db, "users", userId, "history");
        const historySnap = await getDocs(historyRef);
        const deletePromises = historySnap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // 2. Delete Main Profile
        await deleteDoc(userRef);

        console.log(`[GDPR] Purge complete for: ${userId}`);
        return true;
    } catch (error) {
        console.error("GDPR: Deletion Failed", error);
        throw error;
    }
};

// --- SAVED QUIZZES (VAULT) ---

export const saveQuizToUserVault = async (userId, quizData) => {
    try {
        const vaultRef = collection(db, "users", userId, "savedQuizzes");
        await addDoc(vaultRef, quizData);
    } catch (error) {
        console.error("dbService: saveQuizToUserVault failed", error);
        throw error;
    }
};

export const getSavedQuizzes = async (userId) => {
    try {
        const vaultRef = collection(db, "users", userId, "savedQuizzes");
        const q = query(vaultRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("dbService: getSavedQuizzes failed", error);
        return [];
    }
};
