<template>
    <v-toolbar :color="appColor">

        <v-menu :close-on-content-click="false" v-model="toolbarMenuOnen">
            <template v-slot:activator="{ props: menu }">
                <v-btn density="comfortable" icon="mdi-bookshelf" size="large" v-bind="menu"></v-btn>
            </template>

            <v-card>
                <!-- EXPORT -->
                <v-list density="compact" v-model:opened="open">
                    <v-list-item v-for="(item, index) in items" :key="index" :title="item.title"
                        @click="item.action"></v-list-item>
                    <v-list-group value="Import">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" title="Import"></v-list-item>
                        </template>
                        <v-list-item prepend-icon="mdi-code-braces" value="json" title="JSON" @click="() => {
                            toolbarMenuOnen = false;
                            jsonUploadOverlayActive = true;
                            }">
                        </v-list-item>
                        <!-- <v-list-item value="linkedin" prepend-icon="mdi-linkedin" title="LinkedIn items" @click="() => {
                            toolbarMenuOnen = false;
                        }"></v-list-item> -->
                    </v-list-group>
                </v-list>
            </v-card>
        </v-menu>
        <v-btn plain @click="() => {
            currentCollection = collections[0];
            popupMode = PopupMode.COLLECTIONS
        }" class="px-0" size="small">
            <v-badge :model-value="gptActive" size="x-small" color="teal-lighten-1" :content="'gpt'" class="me-auto">
                <v-toolbar-title class="ms-1">linkaTeca</v-toolbar-title>
            </v-badge>
        </v-btn>

        <div v-if="popupMode == PopupMode.COLLECTIONS" class="d-flex justify-end align-center ms-auto">
            <v-btn v-if="!searchActive" prepend-icon="mdi-plus" size="x-small" class="mx-1" variant="outlined"
                @click="addCollection">collection</v-btn>
            <v-btn v-if="!searchActive && collections.length > 0" prepend-icon="mdi-plus" size="x-small" class="mx-1"
                variant="outlined" @click="addLink">link</v-btn>
            <v-btn v-if="!searchActive" size="x-small" class="mx-1" variant="outlined"
                @click="popupMode = PopupMode.PROMPTS">prompts</v-btn>
        </div>

        <div v-if="!searchActive && popupMode == PopupMode.PROMPTS" class="d-flex justify-end align-center ms-auto">
            <v-btn size="x-small" class="mx-1" variant="outlined"
                @click="popupMode = PopupMode.COLLECTIONS">back</v-btn>
            <v-btn size="x-small" class="mx-1" variant="outlined" @click="addPrompt">new prompt</v-btn>
        </div>

        <v-btn v-else-if="popupMode == PopupMode.PROMPTS && !searchActive" size="x-small" class="mx-1 ms-auto"
            variant="outlined" @click="popupMode = PopupMode.COLLECTIONS">back</v-btn>

        <div v-if="popupMode == PopupMode.COLLECTIONS || popupMode == PopupMode.PROMPTS" class="d-flex justify-end"
            :class="[{ 'flex-grow-1 flex-shrink-0': searchActive }]">
            <v-tooltip text="Search" location="bottom" offset="2">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-magnify" class="mx-1"
                        @click="searchActive ? searchActive = false : searchActive = true"
                        :active="searchActive"></v-btn>
                </template>
            </v-tooltip>
            <v-slide-x-reverse-transition>
                <v-text-field v-if="searchActive" :hide-details="true" autofocus variant="solo-filled"
                    bg-color="transparent" density="compact" v-model="search" class="px-2"></v-text-field>
            </v-slide-x-reverse-transition>
        </div>

    </v-toolbar>
</template>

<script lang="ts" setup>

import { PopupMode } from '../types'
import { useLinkStore } from '../stores/links.ts'
import { storeToRefs } from 'pinia';
import { useCollectionStore } from '../stores/collections';
import { useSettingsStore } from '../stores/settings';
import { usePromptStore } from '../stores/prompts';
import { useUtilsStore } from '../stores/utils';
import { ref } from 'vue';

const linkStore = useLinkStore();
const { searchActive, search } = storeToRefs(linkStore);
const { addLink } = linkStore;

const collectionStore = useCollectionStore();
const { collections, jsonUploadOverlayActive, exportOverlayActive, currentCollection } = storeToRefs(collectionStore);
const { addCollection } = collectionStore;

const settingsStore = useSettingsStore();
const { settingsOverlayActive, appColor } = storeToRefs(settingsStore);

const utilsStore = useUtilsStore();
const { popupMode } = storeToRefs(utilsStore);

const promptStore = usePromptStore();
const { addPrompt, checkForGPT } = promptStore;
const { gptActive } = storeToRefs(promptStore);
checkForGPT();

const toolbarMenuOnen = ref(false);

const open = ref(['Import']);

const items = [
    {
        title: 'Settings',
        action: () => {
            toolbarMenuOnen.value = false;
            settingsOverlayActive.value = true;
        }
    },
    {
        title: 'Export',
        action: () => {
            toolbarMenuOnen.value = false;
            exportOverlayActive.value = true;
        }
    },
    // {
    //     title: 'Import',
    //     action: () => {
    //         jsonUploadOverlayActive.value = true;
    //     }
    // },
]

</script>

<style scoped>

:deep(.v-list-item__prepend > .v-icon ~ .v-list-item__spacer){
    width: 5px;
}

:deep(.v-list-group) {
    --prepend-width: 20px;
}
</style>