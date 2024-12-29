import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePlane = defineStore('plane', () => {
  let curr = ref(undefined)
  function setCurr(v) {
    curr.value = v
  }

  return { curr, setCurr }
})
