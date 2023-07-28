<template>
    <v-card-text>
        <v-form ref="linkForm">
            <v-text-field :rules="validationRules" label="Link*" variant="solo-filled" v-model="currentLink.url"></v-text-field>
            <v-text-field :rules="validationRules" label="Title*" variant="solo-filled" v-model="currentLink.title"></v-text-field>
            <v-textarea label="Notes" variant="solo-filled" v-model="currentLink.notes"></v-textarea>
            <v-select label="Collection" :items="collections"
                variant="solo-filled" v-model="currentCollection" item-title="title" return-object>
            <!-- <template v-slot:selection="{item}">
                <v-list-item :title="item.title">
                </v-list-item>
            </template> -->
            </v-select>    
        </v-form>
    </v-card-text>

    <v-card-actions class="pt-2 me-2 d-flex justify-end">
        <v-btn variant="elevated" color="blue-darken-3" @click="closeEdit">
            CANCEL
        </v-btn>
        <v-btn variant="elevated" color="blue-darken-3" :loading="saveButtonLoading" @click="saveLink">
            SAVE
        </v-btn>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { useLinkStore } from '../stores/links.ts'
import { Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCollectionStore } from '../stores/collections';

const linkStore = useLinkStore();
const { linkForm, currentLink} = storeToRefs(linkStore);
const { saveLink, closeEdit, validationRules} = linkStore;

const collectionStore = useCollectionStore();
const { collections, currentCollection } = storeToRefs(collectionStore); 

const saveButtonLoading: Ref<boolean> = ref(false);

</script>