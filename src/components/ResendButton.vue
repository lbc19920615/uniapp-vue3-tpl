<style lang="scss">
.resend-button {
    font-size: 24rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;

    min-width: 160rpx;
}
</style>

<template>
    <LockButton class="resend-button" @submit="onSubmit">
        <view>{{ text }}</view>
    </LockButton>
</template>

<script setup lang="ts">
let text = ref('')
function reset() {
    text.value = '重新发送'
}

function renderText(time) {
    text.value = `${time}s后重新发送`
}

let timeout;
function timer(time,onDone) {
    if (time > 0) {
        timeout = setTimeout(function() {
            renderText(time)
            timer(time - 1, onDone)
        }, 1000)
    } else {
        console.log('done');
        if (onDone) {
            onDone()
        }
    }
}

function onSubmit(e) {
    clearTimeout(timeout);
    renderText(60)
    timer(59, function() {
        reset();
        e.unLock()
    })
}

reset()
</script>