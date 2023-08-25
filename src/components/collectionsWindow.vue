<template>
    <div class="d-flex align-center">
        <v-select class="px-3 mt-3" label="Collection" :items="collections" variant="solo-filled"
            v-model="currentCollection" return-object @update:model-value="(value) => {
                currentCollectionIndex = collections.findIndex(coll => coll.id === value.id)
                console.log(currentCollectionIndex, currentCollection)
            }">
        </v-select>
        <div class="d-flex pe-3" v-if="collections.length > 0">
            <v-btn v-if="currentCollection && currentCollection.parentId !== ''" class="ma-1" size="small" color="deep-purple-darken-2"
                icon="mdi-folder-arrow-up" @click="switchToParent(collections, currentCollection.parentId)"></v-btn>
            <v-btn class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-folder-plus" @click="addSubcollection"></v-btn>
            <v-btn class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-pencil" @click="editCollection"></v-btn>
            <v-btn class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-delete" @click="() => {
                collections = deleteCollection(collections, currentCollection.id)
            }"></v-btn>
        </div>
    </div>

    <div class="d-flex align-center" v-if="currentCollection && currentCollection.subCollections.length > 0">
        <v-select class="px-3 mt-3" label="Subcollections" :items="currentCollection.subCollections" variant="solo-filled"
            v-model="currentSubcollection" return-object @update:model-value="(val) => switchCollection(val)">
        </v-select>
    </div>


    <v-data-table class="h-100" :headers="headers" :items="currentCollection.links" items-per-page="6" :search="search">
        <!-- link display -->
        <template v-slot:item="{ item }">
            <v-list class="pa-0">
                <v-list-item :height="item.raw.active ? 130 : 65">

                    <v-list-item-title class="d-flex" @click="expandNotes(item.raw)">
                        <v-icon v-if="item.raw.favicon" class="me-1">
                            <v-img :src="item.raw.favicon" :alt="`${item.raw.title} icon`"></v-img>
                        </v-icon>
                        <span class="d-inline-block text-truncate" style="max-width: 425px;">{{ item.raw.title }}</span>
                    </v-list-item-title>


                    <v-fade-transition>
                        <v-list-item-subtitle v-show="item.raw.active" class="mt-2">
                            <div class="ps-7"> {{ item.raw.notes }} </div>
                        </v-list-item-subtitle>
                    </v-fade-transition>

                    <template v-slot:append>
                        <!-- go to -->
                        <v-btn class="ma-1" flat icon="mdi-link-variant" size="32" :href="item.raw.url"
                            target="_blank"></v-btn>
                        <!-- edit -->
                        <v-btn class="ma-1" flat icon="mdi-pencil" size="32" @click="editLink(item.index)"></v-btn>
                        <!-- delete -->
                        <v-btn class="ma-1" flat icon="mdi-delete" size="32" @click="() => {
                            console.log('clicking delete')
                            modifyCollection(collections, currentCollection.id, deleteLink, [item.index, currentCollection])
                        }
                            "></v-btn>
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
import { Link } from '../types';

const collectionStore = useCollectionStore();
const { collections, currentCollection, currentCollectionIndex, currentSubcollection } = storeToRefs(collectionStore);
const { editCollection, deleteCollection, switchCollection, switchToParent, modifyCollection, addSubcollection } = collectionStore;

const linkStore = useLinkStore();
const { search } = storeToRefs(linkStore);
const { editLink, deleteLink } = linkStore;

const headers = ref([
    { title: 'Title', key: 'title' },
    { title: 'Notes', key: 'notes' }
]);

const expandNotes = (link: Link) => {
    link.active = link.active ? false : true
}


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