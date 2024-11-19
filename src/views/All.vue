<template>
    <div style="display: flex;">
        <div class="full-scene">
           <Three></Three> 
        </div>
        <div class="two-part">
            <div class="upp">
                <HalfView></HalfView>
            </div>
            <div class="down">
            </div>
        </div>
    </div>
</template>
<script setup>
import HalfView from './HalfView.vue';
import Three from './Three.vue';
</script>
<style scoped>
.full-scene{
    width: 60%;
}
.two-part{
    width: 0;
    flex: 1;
    .upp {
        height: 50vh;
    }
    .down {
        height: 50vh;
    }
}
</style>