import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { db } from "@/firebase-init.js";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  onSnapshot,
  query,
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
    });

    const showFindFiends = ref(false);

    const allUsers = ref([]);

    const userDataForChat = ref([]);

    const currentChat = ref([]);

    const removeUsersFromFindFriends = ref([]);

    const chats = ref([]);

    const getAllUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      if (results.length) {
        allUsers.value = [];
        results.forEach((res) => {
          allUsers.value.push(res);
        });
      }
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

    const getChatById = async (id) => {
      onSnapshot(doc(db, "chat", id), (doc) => {
        let res = [];
        res.push(doc.data());
        currentChat.value = res;
      });
    };

    const getAllChatsByUser = () => {
      const q = query(collection(db, "chat"));

      onSnapshot(q, (querySnapshot) => {
        let chatArray = [];
        querySnapshot.forEach((doc) => {
          let data = {
            id: doc.id,
            sub1: doc.data().sub1,
            sub2: doc.data().sub2,
            sub1HasViewed: doc.data().sub1HasViewed,
            sub2HasViewed: doc.data().sub2HasViewed,
            messages: doc.data().messages,
          };

          if (doc.data().sub1 === userInfo.value.sub) chatArray.push(data);
          if (doc.data().sub2 === userInfo.value.sub) chatArray.push(data);

          removeUsersFromFindFriends.value = [];

          chatArray.forEach((chat) => {
            if (userInfo.value.sub === chat.sub1) {
              allUsers.value.forEach((user) => {
                if (user.sub == chat.sub2) {
                  chat.user = user;
                  removeUsersFromFindFriends.value.push(user.sub);
                }
              });
            }

            if (userInfo.value.sub === chat.sub2) {
              allUsers.value.forEach((user) => {
                if (user.sub == chat.sub1) {
                  chat.user = user;
                  removeUsersFromFindFriends.value.push(user.sub);
                }
              });
            }
          });

          chats.value = [];
          chatArray.forEach((chat) => {
            chats.value.push(chat);
          });
        });
      });
    };

    const sendMessage = async (data) => {
      try {
        if (data.chatId) {
          await updateDoc(doc(db, `chat/${data.chatId}`), {
            sub1HasViewed: false,
            sub2HasViewed: false,
            messages: arrayUnion({
              sub: userInfo.value.sub,
              message: data.message,
              createdAt: Date.now(),
            }),
          });
        } else {
          let id = uuid();
          await setDoc(doc(db, `chat/${id}`), {
            sub1: userInfo.value.sub,
            sub2: data.sub2,
            sub1HasViewed: false,
            sub2HasViewed: false,
            messages: [
              {
                sub: userInfo.value.sub,
                message: data.message,
                createdAt: Date.now(),
              },
            ],
          });
          userDataForChat.value[0].id = id;
          showFindFiends.value = false;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const hasReadMessage = async (data) => {
      await updateDoc(
        doc(db, `chat/${data.id}`),
        {
          [data.key1]: data.val1,
          [data.key2]: data.val2,
        },
        { merge: true }
      );
    };

    const logout = async () => {
      userInfo.value.sub = "";
      userInfo.value.email = "";
      userInfo.value.picture = "";
      userInfo.value.firstName = "";
      userInfo.value.lastName = "";
      allUsers.value = [];
      userDataForChat.value = [];
      removeUsersFromFindFriends.value = [];
      showFindFiends.value = false;
      currentChat.value = false;
    };

    return {
      getUserDetailsFromGoogle,
      logout,
      userInfo,
      getAllUsers,
      userDataForChat,
      allUsers,
      showFindFiends,
      sendMessage,
      getChatById,
      getAllChatsByUser,
      currentChat,
      removeUsersFromFindFriends,
      chats,
      hasReadMessage,
    };
  },
  { persist: true }
);
