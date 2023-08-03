<template>
  <button :disabled="lock" @click="onClick"><slot></slot></button>
</template>

<script setup lang="ts">
let lock = ref(false)

defineEmits(['submit'])

let { proxy } = getCurrentInstance()

function onClick() {
 if (!lock.value) {
   lock.value = true
   proxy.$emit('submit', {
     unLock() {
       lock.value = false
     }
   })
 }
}
</script>
