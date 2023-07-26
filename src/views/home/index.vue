<template>
    <div class="container">
        <el-row :gutter="6">
            <el-col :span="12">
                <el-input v-model="dyUrl" placeholder="直播链接" />
            </el-col>
            <el-col :span="12">
                <el-button type="primary" @click="onUrl" :disabled="disabled">链接</el-button>
                <el-button type="primary" @click="onPopMusic">弹出音乐面板</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="right">
                    <chat />
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import chat from "../chat/index.vue";
import { ElButton, ElRow, ElCol, ElInput } from "element-plus";

const dyUrl = ref("https://live.douyin.com/942732027639");
const disabled = ref(false);
const onUrl = () => (window as W).electronAPI.openDyRoom(dyUrl.value);

onMounted(() => {
    (window as W).electronAPI?.status((event: any, status: boolean) => {
        console.log(status);

        disabled.value = status;
    });
});

const onPopMusic = () => {
    // window.open("http://localhost:8080/#/music");
    window.open(location.href + "music");
};
</script>
<style>
.container {
    width: 100%;
    height: 100%;
    padding: 50px;
}
.right {
    height: calc(100vh - 150px);
    margin-top: 20px;
}
</style>
