<template>
    <div class="d-flex flex-column h-100">
        <div class="d-flex flex-column align-center mt-3">
            <div class="d-flex align-center w-100">
                <!-- PREVIOUS COLLECTION -->
                <v-btn class="ma-1" size="small" icon="mdi-chevron-left" @click="previousCollection"></v-btn>
                <v-select single-line class="px-1 w-100" label="Collection" :items="collections" variant="solo-filled"
                    v-model="currentCollection" return-object @update:model-value="(value) => {
                    currentCollectionIndex = collections.findIndex(coll => coll.id === value.id);
                }">
                </v-select>
                <!-- NEXT COLLECTION -->
                <v-btn class="ma-1" size="small" icon="mdi-chevron-right" @click="nextCollection"></v-btn>
            </div>
            <div class="d-flex align-center w-100 px-10"
                v-if="currentCollection && currentCollection.subCollections.length > 0">
                <v-select class="px-3 mt-3" label="Subcollections" :items="currentCollection.subCollections"
                    variant="solo-filled" v-model="currentSubcollection" return-object
                    @update:model-value="(val) => switchCollection(val)">
                </v-select>
            </div>
            <div class="d-flex pa-2" v-if="collections.length > 0">
                <v-tooltip text="Add link" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" class="ma-1" size="small" color="blue-darken-2" icon="mdi-plus"
                            @click="addLink"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Switch to parent" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-if="currentCollection && currentCollection.parentId !== ''" class="ma-1" size="small"
                            color="blue-darken-2" icon="mdi-folder-arrow-up"
                            @click="switchToParent(collections, currentCollection.parentId)" v-bind="props"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Add Subcollection" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" class="ma-1" size="small" color="blue-darken-2" icon="mdi-folder-plus"
                            @click="addSubcollection"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Edit Collection" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" class="ma-1" size="small" color="blue-darken-2" icon="mdi-pencil"
                            @click="editCollection"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Delete Collection" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" class="ma-1" size="small" color="blue-darken-2" icon="mdi-delete" @click="() => {
                    collections = deleteCollection(collections, currentCollection.id)
                }"></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>

        <v-data-table class="d-flex flex-column flex-grow-1 w-100" ref="linkTitleRefs" :headers="headers"
            :items="currentCollection.links" items-per-page="6" :search="search">
            <!-- link display -->
            <template v-slot:item="{ item, index }">
                <v-list-item class="pa-0">
                    <div class="d-flex justify-space-between">
                        <div style="max-width: 420px;" class="ps-2 d-flex justify-start align-center flex-grow-0 flex-shrink-1">
                            <v-icon v-if="item.favicon" class="mx-2">
                                <v-img :src="item.favicon" :alt="`${item.title} icon`"></v-img>
                            </v-icon>
                            <v-icon v-else class="mx-2" icon="mdi-earth" />
                            <v-tooltip opacity="1" :disabled="!item.notes" :text="`${item.title} - ${item.notes}`" location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-list-item-title class="text-body-1 d-inline-block text-truncate" v-bind="props">{{ item.title }}</v-list-item-title>
                                </template>
                            </v-tooltip>
                        </div>

                        <div class="d-flex justify-end align-center flex-grow-1 flex-shrink-0">
                            <!-- go to -->
                            <v-tooltip text="Go to link" location="bottom" offset="2">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" class="ma-1" flat icon="mdi-link-variant" size="36"
                                        :href="item.url" target="_blank"></v-btn>
                                </template>
                            </v-tooltip>
                            <!-- edit -->
                            <v-tooltip text="Edit link" location="bottom" offset="2">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" class="ma-1" flat icon="mdi-pencil" size="36"
                                        @click="editLink(index)"></v-btn>
                                </template>
                            </v-tooltip>
                            <!-- delete -->
                            <v-tooltip text="Delete link" location="bottom" offset="2">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" class="ma-1" flat icon="mdi-delete" size="36" @click="() => {
                    modifyCollection(collections, currentCollection.id, deleteLink, [index, currentCollection])
                }"></v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </div>

                </v-list-item>
                <v-divider></v-divider>
            </template>
        </v-data-table>

    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useLinkStore } from '../stores/links.ts';
import { ref } from 'vue';
import { useCollectionStore } from '../stores/collections';
import { onMounted } from 'vue';
import { watch } from 'vue';

const collectionStore = useCollectionStore();
const { collections, currentCollection, currentCollectionIndex, currentSubcollection } = storeToRefs(collectionStore);
const { editCollection, deleteCollection, switchCollection, switchToParent, modifyCollection, addSubcollection, checkLinkTitleWidths } = collectionStore;

const linkStore = useLinkStore();
const { search } = storeToRefs(linkStore);
const { editLink, deleteLink, addLink } = linkStore;

const headers = ref([
    { title: 'Title', key: 'title' },
    { title: 'Notes', key: 'notes' }
]);

onMounted(() => {
    setTimeout(checkLinkTitleWidths, 500)
})

watch(currentCollection.value, () => setTimeout(checkLinkTitleWidths, 500));

const previousCollection = () => {
    currentCollectionIndex.value = currentCollectionIndex.value - 1 < 0 ? collections.value.length - 1 : currentCollectionIndex.value - 1
    currentCollection.value = collections.value[currentCollectionIndex.value]
}

const nextCollection = () => {
    currentCollectionIndex.value = currentCollectionIndex.value + 1 < collections.value.length ? currentCollectionIndex.value + 1 : 0
    currentCollection.value = collections.value[currentCollectionIndex.value]
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