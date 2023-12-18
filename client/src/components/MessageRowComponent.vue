<template>
  <div :class="isActive ? 'bg-gray-200' : ''">
    <div class="flex w-full px-4 py-3 items-center cursor-pointer">
      <img
        class="rounded-full mr-4 w-10"
        :src="chat.user.picture || 'https://random.imagecdn.app/100/100'"
      />
      <div class="w-full">
        <div class="flex justify-between items-center">
          <div class="text-[15px] text-gray-600">{{ chat.user.firstName }}</div>
          <div class="text-[12px] text-gray-600">{{ lastCreatedAt(chat) }}</div>
        </div>
        <div class="flex items-center">
          <CheckAllIcon :fillColor="tickColor(chat)" :size="18" class="mr-1" />
          <div
            class="text-[15px] w-full items-center justify-between text-gray-500"
          >
            {{ lastChatMessage(chat) }}...
          </div>
        </div>
      </div>
    </div>
    <div class="border-b float-right"></div>
  </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import CheckAllIcon from "vue-material-design-icons/CheckAll.vue";
import moment from "moment";
import { useUserStore } from "../store/user-store";

const props = defineProps({ chat: Object });
const { chat } = toRefs(props);

const { userInfo, userDataForChat } = toRefs(useUserStore());

const isActive = computed(() => {
  if (userDataForChat.value.length) {
    if (userDataForChat.value[0].sub1 === chat.value.user.sub) {
      return true;
    }
    if (userDataForChat.value[0].sub2 === chat.value.user.sub) {
      return true;
    }
    return false;
  }
});

const tickColor = (chat) => {
  let color = "";
  if (chat.sub1 === userInfo.value.sub) {
    if (chat.sub1HasViewed) color = "#7DF9FF";
    else color = "#B5B5B5";
  }

  if (chat.sub2 === userInfo.value.sub) {
    if (chat.sub1HasViewed) color = "#7DF9FF";
    else color = "#B5B5B5";
  }

  return color;
};

const lastChatMessage = (chat) => {
  return chat.messages[chat.messages.length - 1].message.substring(0, 20);
};

const lastCreatedAt = (chat) => {
  if (chat.messages.length) {
    return moment(chat.messages[chat.messages.length - 1].createdAt).format(
      "MMM D YY | HH:MM A"
    );
  }
};
</script>
