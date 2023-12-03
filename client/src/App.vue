<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from "@/store/user-store.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const { userInfo } = useUserStore();
const router = useRouter();

onMounted(() => {
  if (!userInfo.sub) router.push("/login");
});
</script>
