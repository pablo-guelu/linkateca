<template>
    <div class="w-100">
        <v-expansion-panels :readonly="readOnly">
            <v-expansion-panel bg-color="transparent">
                <v-expansion-panel-title ref="expandTitle" color="transparent" hide-actions class="d-flex align-top px-0"
                    :style="{ 'cursor': readOnly ? 'default' : 'pointer' }">
                    <template v-slot:default="{ expanded }">
                        <div :style="{ 'align-self': !expanded ? 'center' : 'start' }">
                            <slot name="icon"></slot>
                        </div>
                        <div class="w-100 overflow-hidden text-body-1 expand-title"
                            :style="{ 'white-space': !expanded ? 'nowrap' : 'normal', 'text-overflow': 'ellipsis',  'align-self': !expanded ? 'center' : 'start'}">
                            {{ title }}
                        </div>
                        <slot name="title-actions"></slot>
                    </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text v-if="description">
                    <span v-if="description" class="d-inline-block text-truncate w-100 ">
                        {{ description }}
                    </span>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps<{
    title: string,
    description?: string
}>();

// readOnly controls if the expand title can be clicked. You shoulnd't be able to click if there's no description to show and if the title does not overflows its card container.
const readOnly = ref(true);

console.log();

// checks if there's a title overflow to be able to expand title
onMounted(() => {
    // setTimeOut due to the time it takes to render the ExpansionTitle component. Then you can select it using querySelector.
    setTimeout(() => {
        // select the element temporarily to check its width and if it overflows. If it does, the readOnly variable will be set to FALSE (since scrollWith will be greater than clientWidth). 
        const titleDiv = document.querySelector('.expand-title')

        if (props.description) {
            readOnly.value = false
        } else if (titleDiv) {
            readOnly.value = titleDiv.scrollWidth <= titleDiv.clientWidth
        } else {
            readOnly.value = true
        }

        console.log(titleDiv?.scrollWidth, titleDiv?.clientWidth)
        // remove the class to avoid incorrect selection of elements if there's more than one ExpandTitle component (it's almost sure there will be).
        titleDiv?.classList.remove('expand-title')
    }, 500)
})

</script>

<style lang="scss" scoped>
:deep(.v-expansion-panel__shadow) {
    box-shadow: none;
}

.v-expansion-panel-text__wrapper {
    padding: 0px 0px;
}

:deep(.v-expansion-panel-title__overlay) {
    background-color: transparent;
}

:deep(.v-expansion-panel-title) {
    padding: 0px 0px;
}

button :deep(.v-expansion-panel-title),
:deep(.v-expansion-panel--active > .v-expansion-panel-title) {
    min-height: 48px;
}

.title__overflow {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>