<template>
    <div>
        <RouterView v-slot="{ Component }">
            <Transition name="fade">
                <component :is="Component" />
            </Transition>
        </RouterView>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: all .3s;
}

.fade-enter-to {
    opacity: 1;
}
</style>