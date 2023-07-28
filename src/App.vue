<template>
  <v-card class="mx-auto rounded-0 d-flex flex-column" width="600" :min-height="400">
    <app-toolbar />

    <v-window v-model="popupMode" class="flex-grow-1">
      <!-- COLLECTIONS -->
      <v-window-item :value="PopupMode.COLLECTIONS">
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

    <v-overlay v-model="loadingBookmarksState" contained class="align-center justify-center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="purple"
        indeterminate
      ></v-progress-circular>
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
import { useBookmarkStore } from "./stores/bookmarks";

const collectionStore = useCollectionStore();
const { popupMode } = storeToRefs(collectionStore);

const bookmarkStore = useBookmarkStore();
const { loadingBookmarksState } = storeToRefs(bookmarkStore);

</script>

<style scoped></style>
