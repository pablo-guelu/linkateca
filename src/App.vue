<template>
  <v-card class="mx-auto rounded-0 d-flex flex-column" width="550" :min-height="550">
    <app-toolbar />

    <v-window v-model="popupMode" class="flex-grow-1 h-100">
      <!-- COLLECTIONS -->
      <v-window-item :value="PopupMode.COLLECTIONS" class="h-100">
        <collections-window></collections-window>
      </v-window-item>

      <!-- EDIT LINKS -->
      <v-window-item :value="PopupMode.EDIT_LINK">
        <edit-links-window />
      </v-window-item>

      <!-- EDIT COLLECTION -->
      <v-window-item :value="PopupMode.EDIT_COLLECTION">
        <edit-collection-window></edit-collection-window>
      </v-window-item>
      
    </v-window>

    <!-- LOADING OVERLAY -->
    <v-overlay v-model="loadingOverlayState" contained class="align-center justify-center">
      <v-progress-circular :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
    </v-overlay>

    <!-- IMPORT OVERLAY -->
    <v-overlay v-model="jsonUploadOverlayActive" contained class="align-center justify-center" :content-class="'overlay__display'">
      <v-card class="pa-5" min-width="500" min-height="500">
          <v-textarea variant="solo-filled" label="Paste your collections  in JSON format here" rows="15" v-model="collectionsJSON">

          </v-textarea>
        <v-card-actions class="d-flex justify-center w-100">
          <v-btn variant="elevated" color="purple" @click="jsonUploadOverlayActive = false">
            cancel
          </v-btn>
          <v-btn variant="elevated" color="purple" @click="importCollections">
            import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>


    <!-- SETTINGS OVERLAY -->
    <v-overlay v-model="settingsOverlayActive" contained class="align-center justify-center">
      <v-card class="pa-5 h-100" width="500" height="300">
        <div class="d-flex flex-column align-center">
          <div class="d-flex align-center w-100">
            <v-select class="px-3 mt-3 w-100" label="Default Theme" :items="['light', 'dark']" variant="solo-filled"
              v-model="defaultTheme" append-icon="mdi-theme-light-dark" @update:model-value="toggleTheme"></v-select>
          </div>
          <v-select class="px-3 mt-3 w-100" label="Default Collection" :items="collections" variant="solo-filled"
            v-model="currentCollection" return-object></v-select>
        </div>

        <v-card-actions class="d-flex justify-center w-100 mt-auto">
          <v-btn variant="elevated" color="purple" @click="settingsOverlayActive = false">
            cancel
          </v-btn>
          <v-btn variant="elevated" color="purple" :loading="loadingSaveSettingsState" @click="saveSettings">
            save
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-overlay>

  </v-card>
</template>

<script setup lang="ts">
import { PopupMode } from "./types";
import editLinksWindow from "./components/editLinksWindow.vue";
import { storeToRefs } from "pinia";
import AppToolbar from "./components/appToolbar.vue";
import CollectionsWindow from "./components/collectionsWindow.vue";
import EditCollectionWindow from "./components/editCollectionWindow.vue";
import { useCollectionStore } from "./stores/collections";
import { useSettingsStore } from "./stores/settings";

const collectionStore = useCollectionStore();
const { popupMode, jsonUploadOverlayActive, loadingOverlayState, collections, currentCollection, collectionsJSON } = storeToRefs(collectionStore);
const { importCollections } = collectionStore;

const settingsStore = useSettingsStore();
const { settingsOverlayActive, loadingSaveSettingsState, defaultTheme } = storeToRefs(settingsStore);
const { toggleTheme, saveSettings } = settingsStore;

</script>

<style scoped>

.overlay__display {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 16px;
}

</style>
