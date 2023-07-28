<template>
    <div class="d-flex align-center">
        <v-select class="px-3 mt-3" label="Collection" :items="collections" variant="solo-filled"
            v-model="currentCollection" return-object @update:model-value="() => { console.log(currentCollection) }"
            :key="collectionSelectKey"></v-select>
        <div class="d-flex pe-3" v-if="collections.length > 0">
            <v-btn class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-pencil" @click="editCollection"></v-btn>
            <v-btn class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-delete"
                @click="deleteCollection"></v-btn>
        </div>
    </div>

    <v-data-table height="300" :headers="headers" :items="currentCollection.links" items-per-page="4" :search="search">
        <!-- link display -->
        <template v-slot:item="{ item }">
            <v-list lines="two" class="pa-0">
                <v-list-item height="65">

                    <v-list-item-title class="d-flex">
                        <v-icon v-if="item.raw.favicon" class="me-1">
                            <v-img :src="item.raw.favicon" :alt="`${item.raw.title} icon`"></v-img>
                        </v-icon>
                        <span class="d-inline-block text-truncate" style="max-width: 425px;">{{ item.raw.title }}</span>
                    </v-list-item-title>

                    <template v-slot:append>
                        <!-- go to -->
                        <v-btn class="ma-1" flat icon="mdi-link-variant" size="32" :href="item.raw.url"
                            target="_blank"></v-btn>
                        <!-- edit -->
                        <v-btn class="ma-1" flat icon="mdi-pencil" size="32" @click="editLink(item.index)"></v-btn>
                        <!-- delete -->
                        <v-btn class="ma-1" flat icon="mdi-delete" size="32" @click="deleteLink(item.index)"></v-btn>
                    </template>

                </v-list-item>
                <v-divider></v-divider>
            </v-list>
        </template>
    </v-data-table>
</template>

<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { storeToRefs } from 'pinia';
import { useLinkStore } from '../stores/links.ts';
import { ref } from 'vue';
import { useCollectionStore } from '../stores/collections';

const collectionStore = useCollectionStore();
const { collections, currentCollection, collectionSelectKey } = storeToRefs(collectionStore);
const { editCollection, deleteCollection } = collectionStore;

const linkStore = useLinkStore();
const { search } = storeToRefs(linkStore);
const { editLink, deleteLink } = linkStore;

const headers = ref([
    { title: 'Title', key: 'title' },
    { title: 'Notes', key: 'notes' }
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
</style>