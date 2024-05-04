<template>
  <v-card class="mx-auto rounded-0 d-flex flex-column" width="550" :min-height="550">

    <app-toolbar />

    <v-window v-model="popupMode" class="d-flex flex-grow-1">

      <!-- COLLECTIONS -->
      <v-window-item :value="PopupMode.COLLECTIONS" class="h-100 w-100">
        <collections-window></collections-window>
      </v-window-item>

      <!-- PROMPTS -->
      <v-window-item :value="PopupMode.PROMPTS" class="h-100 w-100">
        <prompts-window />
      </v-window-item>


      <!-- EDIT LINKS -->
      <v-window-item :value="PopupMode.EDIT_LINK" class="h-100 w-100">
        <edit-links-window />
      </v-window-item>
      <!-- EDIT COLLECTION -->
      <v-window-item :value="PopupMode.EDIT_COLLECTION" class="h-100 w-100">
        <edit-collection-window />
      </v-window-item>
      <!-- EDIT PROMPT -->
      <v-window-item :value="PopupMode.EDIT_PROMPT" class="h-100 w-100">
        <edit-prompt-window :prompt="currentPrompt" />
      </v-window-item>


    </v-window>

    <!-- LOADING OVERLAY -->
    <v-overlay v-model="loadingOverlayState" contained class="align-center justify-center">
      <v-progress-circular :size="70" :width="7" :color="appColor" indeterminate></v-progress-circular>
    </v-overlay>

    <!-- IMPORT OVERLAY -->
    <v-overlay v-model="jsonUploadOverlayActive" contained class="align-center justify-center"
      :content-class="'overlay__display'">
      <v-card class="pa-5" min-width="500" min-height="500">
        <v-textarea variant="solo-filled" label="Paste your collections  in JSON format here" rows="15"
          v-model="collectionsJSON">

        </v-textarea>
        <v-card-actions class="d-flex justify-center w-100">
          <v-btn variant="elevated" :color="appColor" @click="jsonUploadOverlayActive = false">
            cancel
          </v-btn>
          <v-btn variant="elevated" :color="appColor" @click="importCollections">
            import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <!-- EXPORT OVERLAY -->
    <v-overlay v-model="exportOverlayActive" contained class="align-center justify-center"
      :content-class="'overlay__display'">
      <v-card class="pa-5" min-width="400" max-height="300">
        <v-autocomplete single-line density="compact" class="w-100" label="Collection" :items="collections"
          variant="outlined" v-model="currentCollection" return-object @update:model-value="(value) => {
            currentCollectionIndex = collections.findIndex(coll => coll.id === value.id);
          }"/>
          <v-text-field label="Collection Name" density="compact" v-model="exportCollectionName" variant="outlined" />
          <v-card-actions class="d-flex justify-center w-100">
            <v-btn variant="elevated" :color="appColor" @click="exportOverlayActive = false">
              cancel
            </v-btn>
            <v-btn variant="elevated" :color="appColor" @click="exportCollection">
              export
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-overlay>

    <!-- SETTINGS OVERLAY -->
    <v-overlay v-model="settingsOverlayActive" contained class="align-center justify-center">
      <settings-popup />
    </v-overlay>

  </v-card>
</template>

<script setup lang="ts">
import { PopupMode } from "./types";
import { storeToRefs } from "pinia";
import editLinksWindow from "./components/editLinksWindow.vue";
import CollectionsWindow from "./components/collectionsWindow.vue";
import EditCollectionWindow from "./components/editCollectionWindow.vue";
import EditPromptWindow from "./components/editPromptWindow.vue";
import PromptsWindow from "./components/promptsWindow.vue";
import AppToolbar from "./components/appToolbar.vue";
import SettingsPopup from "./components/settingsPopup.vue";
import { useCollectionStore } from "./stores/collections";
import { useSettingsStore } from "./stores/settings";
import { usePromptStore } from "./stores/prompts";
import { useUtilsStore } from "./stores/utils";

const collectionStore = useCollectionStore();
const { jsonUploadOverlayActive, exportOverlayActive, exportCollectionName, loadingOverlayState, collectionsJSON, collections, currentCollection, currentCollectionIndex } = storeToRefs(collectionStore);
const { importCollections, exportCollection } = collectionStore;

const settingsStore = useSettingsStore();
const { settingsOverlayActive, appColor } = storeToRefs(settingsStore);

const utilsStore = useUtilsStore();
const { popupMode } = storeToRefs(utilsStore);

const promptStore = usePromptStore();
const { currentPrompt } = storeToRefs(promptStore);

</script>

<style scoped>
.overlay__display {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 16px;
}

:deep(.v-window__container) {
  width: 100%;
}
</style>
