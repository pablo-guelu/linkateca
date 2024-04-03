<template>
    <v-toolbar :color="appColor">

        <v-menu>
            <template v-slot:activator="{ props: menu }">
                <v-btn density="comfortable" icon="mdi-menu" v-bind="menu"></v-btn>
            </template>

            <v-card>
                <!-- EXPORT -->
                <v-list density="compact">
                    <v-list-item v-for="(item, index) in items" :key="index" :title="item.title"
                        @click="item.action"></v-list-item>
                </v-list>
            </v-card>
        </v-menu>
        <v-btn plain @click="() => {
                currentCollection = collections[0];
                popupMode = PopupMode.COLLECTIONS
            }" size="small">
            <v-badge :model-value="gptActive" size="x-small" color="teal-lighten-1" :content="'gpt'" class="me-auto">
                <v-toolbar-title class="ms-1 px-1">linkaTeca</v-toolbar-title>
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
            <v-btn size="x-small" class="mx-1" variant="outlined"
                @click="addPrompt">new prompt</v-btn>
        </div>

        <v-btn v-else-if="popupMode == PopupMode.PROMPTS && !searchActive" size="x-small" class="mx-1 ms-auto"
            variant="outlined" @click="popupMode = PopupMode.COLLECTIONS">back</v-btn>

        <div v-if="popupMode == PopupMode.COLLECTIONS || popupMode == PopupMode.PROMPTS" class="d-flex justify-end" :class="[{'flex-grow-1 flex-shrink-0': searchActive}]">
            <v-tooltip text="Search" location="bottom" offset="2">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-magnify" class="mx-1"
                        @click="searchActive ? searchActive = false : searchActive = true" :active="searchActive"></v-btn>
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

const linkStore = useLinkStore();
const { searchActive, search } = storeToRefs(linkStore);
const { addLink } = linkStore;

const collectionStore = useCollectionStore();
const { collections, jsonUploadOverlayActive, currentCollection } = storeToRefs(collectionStore);
const { addCollection } = collectionStore;

const settingsStore = useSettingsStore();
const { settingsOverlayActive, appColor } = storeToRefs(settingsStore);

const utilsStore = useUtilsStore();
const { popupMode } = storeToRefs(utilsStore);

const promptStore = usePromptStore();
const { addPrompt, checkForGPT } = promptStore;
const { gptActive, prompts } = storeToRefs(promptStore);
checkForGPT();

const items = [
    {
        title: 'Settings',
        action: () => {
            settingsOverlayActive.value = true;
        }
    },
    {
        title: 'Export',
        action: () => {
            // Convert JavaScript object to JSON string
            let jsonString = JSON.stringify({ 'Collections': collections.value, 'Prompts': prompts.value });

            // Create a Blob from the JSON string
            let blob = new Blob([jsonString], { type: 'application/json' });

            // Generate a URL for the Blob
            let url = URL.createObjectURL(blob);

            // Download the file
            chrome.downloads.download({
                url: url,
                filename: 'collections.json'  // Optional
            });
        }
    },
    {
        title: 'Import',
        action: () => {
            jsonUploadOverlayActive.value = true;
        }
    },
]

</script>