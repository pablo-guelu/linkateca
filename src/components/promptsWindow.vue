<template>
    <v-data-table class="d-flex flex-column flex-grow-1 w-100" height="300" :headers="headers" :items="prompts" items-per-page="4" :search="search">

        <!-- prompt display -->
        <template v-slot:item="{ item }">
            <v-list lines="two" class="pa-0">
                <v-list-item height="75">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ item.prompt }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                        <!-- edit -->
                        <v-btn class="ma-1" flat icon="mdi-pencil" size="32" @click="editPrompt(item.id as number)"></v-btn>
                        <!-- copy -->
                        <v-tooltip location="top" :model-value="item.active" :open-on-hover="false" offset="0">
                            <template v-slot:activator="{ props }">
                                <v-btn class="ma-1" flat icon="mdi-content-copy" size="32"
                                    @click="copyPrompt(item)" v-bind="props" ></v-btn>
                            </template>
                            <span>Copied to clipboard!</span>
                        </v-tooltip>
                        <!-- delete -->
                        <v-btn class="ma-1" flat icon="mdi-delete" size="32" @click="deletePrompt(item.id as number)"></v-btn>
                    </template>
                </v-list-item>
                <v-divider></v-divider>
            </v-list>
        </template>

    </v-data-table>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePromptStore } from '../stores/prompts';
import { ref } from 'vue';

const promptStore = usePromptStore();
const { prompts, search } = storeToRefs(promptStore);
const { editPrompt, deletePrompt, copyPrompt } = promptStore;

const headers = ref([
    { title: 'Title', key: 'title' },
    { title: 'Prompt', key: 'prompt' }
]);
</script>

<style scoped>
:deep(.v-btn--icon .v-icon) {
    --v-icon-size-multiplier: 1.1;
}

:deep(.v-list-item--three-line .v-list-item__append) {
    align-self: center;
}

:deep(thead) {
    display: none;
}

:deep(.v-data-table-footer__items-per-page) {
    display: none;
}

:deep(.v-data-table-footer) {
    justify-content: center;
}

:deep(.v-input__details) {
    display: none;
}

:deep(.v-data-table-footer) {
    margin-top: auto;
}

:deep(.v-table) > .v-table__wrapper>table {
    table-layout: fixed !important;
}
</style>