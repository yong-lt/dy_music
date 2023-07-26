<template>
    <router-view></router-view>
</template>
<script setup lang="ts"></script>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html,
body,
#app {
    height: 100%;
    -webkit-app-region: drag;
}

section {
    -webkit-app-region: no-drag;
}
</style>
