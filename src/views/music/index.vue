<template>
    <div class="box">
        <div class="controls">
            <audio controls autoplay :src="state.musicSrc" ref="audioRef"></audio>
            <div class="controls-item" @click="onNext">
                <el-icon><ArrowRightBold /></el-icon>
            </div>
        </div>

        <div class="curr-music">正在播放 {{ state.currMusic?.song }} - {{ state.currMusic?.nickName }}</div>

        <div class="music">
            <div class="music-item" v-for="(item, key) in state.list" :key="key">
                <div class="index">{{ key + 1 }}</div>
                <div class="music-item-info">{{ item.song }} - {{ item.nickName }}</div>
                <div class="music-controls">
                    <div class="music-icon" @click="onTop(item)">
                        <el-icon><Upload /></el-icon>
                    </div>
                    <div class="music-icon" @click="onCurrMusic(item)">
                        <el-icon><CaretRight /></el-icon>
                    </div>
                    <div class="music-icon" @click="onDelete(item)">
                        <el-icon><CloseBold /></el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElIcon } from "element-plus";
import { CaretRight, ArrowRightBold, Upload, CloseBold, Sort } from "@element-plus/icons-vue";

const state = reactive<{
    list: Info[];
    musicSrc: string;
    currMusic: Info | undefined;
    isPaused: boolean;
}>({
    list: [],
    musicSrc: "",
    currMusic: undefined,
    isPaused: true,
});

const audioRef = ref<HTMLAudioElement>();

onMounted(() => {
    ws();
    isEnded();

    const timer = setInterval(() => {
        if (state.isPaused && state.list.length) {
            onNext();

            clearInterval(timer);
        }
    }, 100);
});

const ws = () => {
    const ws = new WebSocket("ws://127.0.0.1:4000");
    ws.addEventListener("open", () => console.log("success"));
    ws.addEventListener("message", e => {
        const info = JSON.parse(e.data) as Info;
        console.log(info);

        if (info.song && info.musicSrc) {
            const flag = state.list.every((item: Info) => item.song !== info.song);
            if (flag) {
                fetch(info.musicSrc).then(res => {
                    res.blob().then(res => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            state.list.push({ ...info, musicSrc: reader.result as string });
                        };
                        reader.readAsDataURL(res);
                    });
                });
            }
        }

        if (info.isFans && info.isAdmin && info.msg_content === "切歌") {
            onNext();
        }

        if (info.userID == state.currMusic?.userID && info.msg_content == "切歌") {
            onNext();
        }

        if (info.isFans && info.isAdmin && info.msg_content === "置顶") {
            const music = state.list.find(item => item.nickName === info.nickName) as Info;
            onTop(music);
        }
    });
};

const isEnded = () => {
    audioRef.value?.addEventListener("ended", () => onNext());
};
const onNext = () => {
    if (!state.list.length) {
        return;
    }
    state.currMusic = { ...state.list[0] };
    state.musicSrc = state.list[0].musicSrc;
    state.isPaused = false;
    state.list.shift();
};

const onPlay = () => {
    if (state.isPaused) {
        audioRef.value?.play();
    } else {
        audioRef.value?.pause();
    }

    state.isPaused = !state.isPaused;
};

const onDelete = (music: Info) => (state.list = state.list.filter(item => item.song !== music.song));

const onCurrMusic = (music: Info) => {
    onTop(music);
    onNext();
};
const onTop = (music: Info) => {
    const index = state.list.findIndex(item => item.song === music.song);
    state.list.splice(index, 1);
    state.list.unshift({ ...music });
};
</script>

<style scoped>
.box {
    width: 100%;
    padding: 10px;
}
.controls {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #f1f3f4;
    border-radius: 40px 40px;
}

.controls .controls-item {
    text-align: center;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px 20px;
}
.controls .controls-item:hover {
    background-color: #e5e7e8;
}
.music {
    width: 100%;
    height: 400px;
    background: #f1f3f4;
    border-radius: 20px 20px;
    padding: 20px;
    overflow-x: hidden;
}

.music .music-item {
    width: 100%;
    height: 30px;
    display: flex;
    background-color: #e5e7e8;
    line-height: 30px;
    border-radius: 15px 15px;
    padding: 0 20px;
    margin: 10px 0;
    font-size: 14px;
}
.curr-music {
    width: 100%;
    height: 30px;
    background-color: #f1f3f4;
    border-radius: 15px 15px;
    line-height: 30px;
    font-size: 14px;
    padding: 0 20px;
    margin: 10px 0;
}
.music .music-item .index {
    margin-right: 20px;
}
.music .music-item .music-item-info {
    flex: 1;
}

.music .music-item .music-controls {
    width: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.music-icon {
    width: 20px;
    height: 20px;
    line-height: 23px;
    text-align: center;
    border-radius: 10px 10px;
}
.music-icon:hover {
    background-color: #f1f3f4;
    cursor: pointer;
}
</style>
