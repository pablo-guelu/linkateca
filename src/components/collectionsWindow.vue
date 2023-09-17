<template>
    <div class="d-flex align-center">
        <v-select single-line class="px-3 mt-3" label="Collection" :items="collections" variant="solo-filled"
            v-model="currentCollection" return-object @update:model-value="(value) => {
                currentCollectionIndex = collections.findIndex(coll => coll.id === value.id);
            }">
        </v-select>
        <div class="d-flex pe-3" v-if="collections.length > 0">

            <v-tooltip text="Add link" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-plus"
                        @click="addLink"></v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Switch to parent" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-if="currentCollection && currentCollection.parentId !== ''" class="ma-1" size="small"
                        color="deep-purple-darken-2" icon="mdi-folder-arrow-up"
                        @click="switchToParent(collections, currentCollection.parentId)" v-bind="props"></v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Add Subcollection" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-folder-plus"
                        @click="addSubcollection"></v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Edit Collection" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-pencil"
                        @click="editCollection"></v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Delete Collection" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="ma-1" size="small" color="deep-purple-darken-2" icon="mdi-delete" @click="() => {
                        collections = deleteCollection(collections, currentCollection.id)
                    }"></v-btn>
                </template>
            </v-tooltip>

        </div>
    </div>

    <div class="d-flex align-center" v-if="currentCollection && currentCollection.subCollections.length > 0">
        <v-select class="px-3 mt-3" label="Subcollections" :items="currentCollection.subCollections" variant="solo-filled"
            v-model="currentSubcollection" return-object @update:model-value="(val) => switchCollection(val)">
        </v-select>
    </div>

    <v-data-table class="h-100" ref="linkTitleRefs" :headers="headers" :items="currentCollection.links" items-per-page="6"
        :search="search">
        <!-- link display -->
        <template v-slot:item="{ item }">

            <div class="w-100">
                <v-expansion-panels :readonly="item.raw.notes == ''">
                    <v-expansion-panel>
                        <v-expansion-panel-title class="px-4 py-2"
                            :style="{ 'cursor': item.raw.notes == '' ? 'default' : 'pointer' }">
                            <template v-slot:default>
                                <div class="d-inline-flex text-truncate" :style="{ 'width': '375px' }">
                                    <v-icon v-if="item.raw.favicon" class="me-2">
                                        <v-img :src="item.raw.favicon" :alt="`${item.raw.title} icon`"></v-img>
                                    </v-icon>
                                    <v-hover v-slot="{ props }">
                                        <v-card :id="`linkTitle-${item.index}`"
                                            class="w-100 d-inline-block pt-1 text-truncate" v-bind="props" variant="flat">
                                            {{ item.raw.title }}
                                        </v-card>
                                        <v-tooltip :text="item.raw.title" location="bottom" activator="parent"
                                            :disabled="linkTitleTooltipDisabled[item.index]"></v-tooltip>
                                    </v-hover>
                                </div>
                            </template>
                            <template v-slot:actions>
                                <div class="d-flex">

                                    <!-- go to -->
                                    <v-tooltip text="Go to link" location="bottom" offset="2">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" class="ma-1" flat icon="mdi-link-variant" size="36"
                                                :href="item.raw.url" target="_blank"></v-btn>
                                        </template>
                                    </v-tooltip>

                                    <!-- edit -->
                                    <v-tooltip text="Edit link" location="bottom" offset="2">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" class="ma-1" flat icon="mdi-pencil" size="36"
                                                @click="editLink(item.index)"></v-btn>
                                        </template>
                                    </v-tooltip>

                                    <!-- delete -->
                                    <v-tooltip text="Delete link" location="bottom" offset="2">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" class="ma-1" flat icon="mdi-delete" size="36" @click="() => {
                                                modifyCollection(collections, currentCollection.id, deleteLink, [item.index, currentCollection])
                                            }"></v-btn>
                                        </template>
                                    </v-tooltip>

                                </div>
                            </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <span class="font-weight-regular text-body-1 d-inline-block text-truncate w-100">
                                {{ item.raw.notes }}
                            </span>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>

            <v-divider></v-divider>

        </template>

    </v-data-table>
</template>

<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { storeToRefs } from 'pinia';
import { useLinkStore } from '../stores/links.ts';
import { ref } from 'vue';
import { useCollectionStore } from '../stores/collections';
import { onMounted } from 'vue';
import { watch } from 'vue';

const collectionStore = useCollectionStore();
const { collections, currentCollection, currentCollectionIndex, currentSubcollection, linkTitleTooltipDisabled } = storeToRefs(collectionStore);
const { editCollection, deleteCollection, switchCollection, switchToParent, modifyCollection, addSubcollection, checkLinkTitleWidths } = collectionStore;

const linkStore = useLinkStore();
const { search } = storeToRefs(linkStore);
const { editLink, deleteLink, addLink } = linkStore;

const headers = ref([
    { title: 'Title', key: 'title' },
    { title: 'Notes', key: 'notes' }
]);

onMounted(() => {
    setTimeout(checkLinkTitleWidths, 1000)
})

watch(currentCollection, checkLinkTitleWidths);

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