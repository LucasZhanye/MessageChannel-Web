<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    iconName: {
        type: String,
        require: true
    },
    className: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    }
});

const iconClassName = computed(() => {
    return `#${props.iconName}`;
})

const svgClass = computed(() => {
    if (props.className) {
        return `svg-icon el-icon ${props.className}`;
    }
    return 'svg-icon el-icon';
})

</script>

<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconClassName" :fill="color"/>
    </svg>
</template>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    position: relative;
    fill: currentColor;
    vertical-align: -2px;
}

</style>