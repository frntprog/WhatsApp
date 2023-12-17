import { defineStore } from "pinia";
import { ref, resolveTransitionHooks } from "vue";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { db } from "@/firebase-init.js";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  QuerySnapshot,
} from "firebase/firestore";

export const useUserStore = defineStore(
  "user",
  () => {
    const userInfo = ref({
      sub: "",
      email: "",
      picture: "",
      firstName: "",
      lastName: "",
      allUsers: [],
    });

    const getAllUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      let results = [];
      querySnapshot.forEach((doc) => results.push(doc.data()));

      if (results.length) {
        userInfo.value.allUsers = [];
        results.forEach((res) => {
          userInfo.value.allUsers.push(res);
        });
      }
      console.log(userInfo.value.allUsers);
    };

    const getUserDetailsFromGoogle = async (data) => {
      try {
        let res = await axios.post("api/google-login", {
          token: data.credential,
        });

        let userExists = await checkIfUserExists(res.data.sub);
        console.log(userExists);
        if (!userExists) await saveUserDetails(res);

        userInfo.value.sub = res.data.sub;
        userInfo.value.email = res.data.email;
        userInfo.value.picture = res.data.picture;
        userInfo.value.firstName = res.data.given_name;
        userInfo.value.lastName = res.data.family_name;
      } catch (error) {
        console.log(error);
      }
    };

    const checkIfUserExists = async (id) => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    };

    const saveUserDetails = async (res) => {
      try {
        await setDoc(doc(db, "users", res.data.sub), {
          sub: res.data.sub,
          email: res.data.email,
          picture: res.data.picture,
          firstName: res.data.given_name,
          lastName: res.data.family_name,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const logout = async () => {
      userInfo.value.sub = "";
      userInfo.value.email = "";
      userInfo.value.picture = "";
      userInfo.value.firstName = "";
      userInfo.value.lastName = "";
    };

    return {
      getUserDetailsFromGoogle,
      logout,
      userInfo,
      getAllUsers,
    };
  },
  {
    persist: true,
  }
);
