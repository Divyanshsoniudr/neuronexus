import { auth, googleProvider } from "./firebase";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updatePassword,
    deleteUser,
    updateProfile
} from "firebase/auth";
import { deleteUserCloudData } from "./dbService";

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Auth: Google Login Failed", error);
        throw error;
    }
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const updateUserPassword = (newPassword) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return updatePassword(auth.currentUser, newPassword);
};

export const updateUserProfile = (data) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return updateProfile(auth.currentUser, data);
};

export const deleteUserAccount = async () => {
    if (!auth.currentUser) throw new Error("No user logged in");
    const uid = auth.currentUser.uid;

    // 1. Purge Cloud Data (GDPR)
    await deleteUserCloudData(uid);

    // 2. Delete Auth record
    return deleteUser(auth.currentUser);
};
