<template>
  <div>
    asadasdasda
     {{ fn2('key') }}
     {{ fn2Com }}

    <p>{{ someRef }}</p>
    <button @click="updateSomeRef">Update SomeRef</button> 
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const someRef = ref('initial value');

function fn2(key) {
  // 假设这个函数内部不依赖于 someRef
  console.log('fn2 called with:', key);
  return `Result for ${key}`;
}
const fn2Com = computed(() => {
  someRef.value
  return fn2('key1')
})
let index  = 1
function updateSomeRef() {
  someRef.value = 1
}
</script>
<style lang="less" scoped></style>
