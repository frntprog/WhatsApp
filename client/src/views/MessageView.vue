<template>
  <div class="ml-[420px] w-full">
    <div class="w-full">
      <div id="BG"></div>
      <div class="border-l border-green-500 w-full">
        <div
          class="bg-[#F0F0F0] fixed z-10 min-w-[calc(100vw-420px)] flex justify-between items-center px-2 py-2"
        >
          <div class="flex items-center">
            <img
              v-if="userDataForChat[0] && userDataForChat[0].picture"
              class="rounded-full mx-1 w-10"
              :src="userDataForChat[0].picture"
            />
            <div
              v-if="userDataForChat[0] && userDataForChat[0].firstName"
              class="text-gray-900 ml-1 font-semibold"
            >
              {{ userDataForChat[0].firstName }}
            </div>
          </div>
          <DotsVerticalIcon fillColor="#515151" />
        </div>
      </div>
      <div
        id="MessagesSection"
        class="pt-20 pb-9 z-[1] h-[calc(100vh-65px)] w-[calc(100vw-420px)] overflow-auto fixed touch-auto"
      >
        <div v-if="currentChat && currentChat.length" class="px-20 text-sm">
          <div v-for="msg in currentChat[0].messages" :key="msg">
            <div
              v-if="msg.sub == userInfo.sub"
              class="flex w-[calc(100%-20vw)]"
            >
              <div class="inline-block bg-white p-2 rounded-md my-1">
                {{ msg.message }}
              </div>
            </div>
            <div
              v-else
              class="flex justify-end space-x-1 w-[calc(100%-20vw)] float-right"
            >
              <div class="inline-block bg-green-200 p-2 rounded-md my-1">
                {{ msg.message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[calc(100vw-420px)] p-2.5 z-10 bg-[#F0F0F0] fixed bottom-0">
        <div class="flex items-center justify-center">
          <EmoticonExcitedOutlineIcon
            :size="27"
            fillColor="#515151"
            class="mx-1.5"
          />
          <PaperclipIcon :size="27" fillColor="#515151" class="mx-1.5 mr-3" />

          <input
            v-model="message"
            class="mr-1 shadow rounded-lg appearance-none w-full py-3 px-4 text-gray-700 leading-light focus:outline-none"
            autocomplete="off"
            placeholder="Message"
            type="text"
          />
          <button
            :disabled="disableBtn"
            @click="send"
            type="ml-3 p-2 w-12 flex items-center justify-center"
          >
            <SendIcon fillColor="#515151" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import DotsVerticalIcon from "vue-material-design-icons/DotsVertical.vue";
import EmoticonExcitedOutlineIcon from "vue-material-design-icons/EmoticonExcitedOutline.vue";
import PaperclipIcon from "vue-material-design-icons/Paperclip.vue";
import SendIcon from "vue-material-design-icons/Send.vue";
import { useUserStore } from "../store/user-store";

let message = ref("");
let disableBtn = ref(false);

const { sendMessage, userInfo, hasReadMessage } = useUserStore();

const { userDataForChat, currentChat } = toRefs(useUserStore());

watch(
  () => currentChat.value,
  (chat) => {
    if (chat.length) {
      setTimeout(() => {
        let objDiv = document.getElementById("MessagesSection");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 50);
    }
  },
  { deep: true }
);

const send = async () => {
  if (message.value === "") return;
  disableBtn.value = true;
  await sendMessage({
    message: message.value,
    sub2: userDataForChat.value[0].sub2,
    chatId: userDataForChat.value[0].id,
  });

  message.value = "";
  const userData = userDataForChat.value[0];

  let data = {
    id: userData.id,
    key1: "sub1HasViewed",
    val1: false,
    key2: "sub2HasViewed",
    val2: false,
  };
  console.log(userData.sub1, userInfo.sub);
  if (userData.sub1 === userInfo.sub) {
    data.val1 = true;
    data.val2 = false;
  } else if (userData.sub2 === userInfo.sub) {
    data.val1 = false;
    data.val2 = true;
  }

  await hasReadMessage(data);

  let objDiv = document.getElementById("MessagesSection");
  objDiv.scrollTop = objDiv.scrollHeight;

  disableBtn.value = false;
};
</script>

<style>
#BG {
  background: url("/message-bg.png") no-repeat;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
}
</style>
