<template>
    <v-toolbar color="blue-darken-4">

        <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props: menu }">
                <v-btn variant="text" icon="mdi-menu" color="white" v-bind="menu"></v-btn>
            </template>

            <v-card width="200">
                <!-- EXPORT -->
                <v-list density="compact">
                    <v-list-group>
                        <template v-slot:activator="{ props: list }">
                            <v-list-item v-bind="list" :title="items.export.title"></v-list-item>
                        </template>
                        <v-list-item v-for="option, index in items.export.exports" :key="index" :title="option.title"
                            @click="option.action"></v-list-item>
                    </v-list-group>
                </v-list>
                <!-- IMPORT -->
                <v-list density="compact">
                    <v-list-group>
                        <template v-slot:activator="{ props: list }">
                            <v-list-item v-bind="list" :title="items.import.title"></v-list-item>
                        </template>
                        <v-list-item v-for="option, index in items.import.imports" :key="index" :title="option.title"
                            @click="option.action"></v-list-item>
                    </v-list-group>
                </v-list>
            </v-card>
        </v-menu>

        <v-btn plain @click="popupMode = PopupMode.COLLECTIONS"><v-toolbar-title
                class="ms-1">linkaTeca</v-toolbar-title></v-btn>

        <div v-if="popupMode == PopupMode.COLLECTIONS" class="flex-grow-1 d-flex justify-end align-center">
            <v-slide-x-reverse-transition>
                <v-text-field v-if="searchActive" :hide-details="true" autofocus variant="solo-filled"
                    bg-color="transparent" density="compact" v-model="search"></v-text-field>
            </v-slide-x-reverse-transition>
            <v-btn v-if="!searchActive" prepend-icon="mdi-plus" class="mx-1" variant="outlined"
                @click="addCollection">collection</v-btn>
            <v-btn v-if="!searchActive" prepend-icon="mdi-plus" class="mx-1" variant="outlined"
                @click="addLink">link</v-btn>
            <v-btn icon="mdi-magnify" class="mx-1" @click="searchActive ? searchActive = false : searchActive = true"
                :active="searchActive"></v-btn>
        </div>

    </v-toolbar>
</template>

<script lang="ts" setup>

import { PopupMode } from '../types'
import { useLinkStore } from '../stores/links.ts'
import { storeToRefs } from 'pinia';
import { useCollectionStore } from '../stores/collections';
import { useBookmarkStore } from '../stores/bookmarks';

const linkStore = useLinkStore();
const { searchActive, search } = storeToRefs(linkStore);
const { addLink } = linkStore;

const collectionStore = useCollectionStore();
const { popupMode, collections } = storeToRefs(collectionStore);
const { addCollection } = collectionStore;

// const bookmarkStore = useBookmarkStore();
// const { loadingBookmarksState } = storeToRefs(bookmarkStore);
// const { addCollectionsFromBookmarks } = bookmarkStore;

const items = {
    export: {
        title: 'Export',
        exports: [
            {
                title: 'To JSON',
                action: () => {
                    // Convert JavaScript object to JSON string
                    let jsonString = JSON.stringify({ 'Collections': collections.value });

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
            // {
            //     title: 'To Bookmarks',
            //     action: () => {
            //         console.log('to bookmarks')
            //     }
            // }
        ]

    },
    import: {
        title: 'Import',
        imports: [
            {
                title: 'From JSON',
                action: () => {
                }
            },
            // {
            //     title: 'From Bookmarks',
            //     action: () => {
            //         loadingBookmarksState.value = true;
            //         addCollectionsFromBookmarks().then(() => {
            //             loadingBookmarksState.value = false;
            //         })
            //     }
            // }
        ]
    },
    settings: {
        title: 'Settings',
        action: () => {

        }
    }
}



</script>