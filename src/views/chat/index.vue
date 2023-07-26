<template>
    <div class="chat-msg" ref="chatMsgRef">
        <div class="msg-item" v-for="item in chatMsg.list" :key="item.userID">
            <span class="admin">{{ item.isAdmin ? "[管]" : "" }}</span>
            <span class="nick-name">{{ item.nickName }}</span>
            ：{{ item.msg_content }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from "vue";

const chatMsg = reactive<{ list: Message[] }>({
    list: [],
});

const chatMsgRef = ref<HTMLDivElement>();

onMounted(() => {
    (window as W).electronAPI?.message((event: any, message: Message) => {
        chatMsg.list.push(message);
        if (chatMsgRef.value?.scrollHeight! > chatMsgRef.value?.clientHeight!) {
            chatMsgRef.value?.scrollTo(0, chatMsgRef.value?.scrollHeight + 10);
        }
    });
});
</script>

<style scoped>
.chat-msg {
    width: 100%;
    height: 100%;
    background: rgba(37, 38, 50, 0.6);
    color: #fff;
    overflow-x: hidden;
}
.msg-item {
    margin: 20px 0 20px 20px;
}
.admin {
    color: #f91d50;
}
.nick-name {
    color: #bbbdc9;
}
</style>
