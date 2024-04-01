<template>
    <v-card class="pa-5 h-100" width="500" height="300">
        <div class="d-flex flex-column align-center">
            <div class="d-flex align-center w-100">
                <v-select class="px-3 mt-3 w-100" density="compact" label="Default Theme" :items="['light', 'dark']"
                    variant="outlined" v-model="defaultTheme" append-icon="mdi-theme-light-dark"
                    @update:model-value="toggleTheme">
                </v-select>
            </div>
            <v-select class="px-3 mt-3 w-100" density="compact" label="Default Collection" :items="collections"
                variant="outlined" v-model="currentCollection" return-object @update:model-value="(value) => {
                    currentCollectionIndex = collections.findIndex(coll => coll.id === value.id)
                }">
            </v-select>
            <div class="w-100 px-3">
                <div class="text-body-2 mb-2">App Color:</div>
                <v-color-picker v-model="appColor" hide-inputs elevation="0"></v-color-picker>
            </div>
        </div>

        <v-card-actions class="d-flex justify-center w-100 mt-auto">
            <v-btn variant="elevated" size="small" :color="appColor" @click="settingsOverlayActive = false">
                cancel
            </v-btn>
            <v-btn variant="elevated" size="small" :color="appColor" :loading="loadingSaveSettingsState"
                @click="saveSettings">
                save
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useCollectionStore } from '../stores/collections';
import { useSettingsStore } from '../stores/settings';

const collectionStore = useCollectionStore();
const { collections, currentCollection, currentCollectionIndex } = storeToRefs(collectionStore);

const settingsStore = useSettingsStore();
const { settingsOverlayActive, loadingSaveSettingsState, defaultTheme, appColor } = storeToRefs(settingsStore);
const { toggleTheme, saveSettings } = settingsStore;

</script>