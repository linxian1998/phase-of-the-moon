<script setup lang="ts">
function onEnter(el: Element, done: any) {
    console.log(el)
}

function onLeave() {}
</script>

<template>
  <!-- 包装内置的 Transition 组件 -->
  <Transition name="my-transition" @enter="onEnter" @leave="onLeave">
    <slot></slot>
    <!-- 向内传递插槽内容 -->
  </Transition>
</template>

<style>
/*
    必要的 CSS...
    注意：避免在这里使用 <style scoped>
    因为那不会应用到插槽内容上
  */
</style>
