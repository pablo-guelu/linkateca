<template>
    <v-card-text>
        <v-form ref="collectionForm">
            <h2  class="py-4" v-if="popupMode === PopupMode.EDIT_SUBCOLLECTION">
               {{`Subcollection of ${parentCollection.title}` }}
            </h2>
            <v-text-field :rules="validationRuleRequiredField" label="Title*" variant="solo-filled"
                v-model="currentCollection.title"></v-text-field>
            <v-textarea label="Notes" variant="solo-filled" v-model="currentCollection.notes"></v-textarea>
        </v-form>
    </v-card-text>

    <v-card-actions class="pt-6 me-2 d-flex justify-end">
        <v-btn variant="elevated" color="blue-darken-3" @click="closeEdit">
            CANCEL
        </v-btn>
        <v-btn variant="elevated" color="blue-darken-3" :loading="saveButtonLoading" @click="saveCollection">
            SAVE
        </v-btn>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { useCollectionStore } from '../stores/collections';
import { storeToRefs } from 'pinia';
import { PopupMode } from '../types';
import { useUtilsStore } from '../stores/utils';

const collectionStore = useCollectionStore();
const { currentCollection, collectionForm, popupMode, parentCollection } = storeToRefs(collectionStore);
const { saveCollection, closeEdit } = collectionStore;

const utilsStore = useUtilsStore();
const { validationRuleRequiredField } = utilsStore;

const saveButtonLoading: Ref<boolean> = ref(false);

console.log(currentCollection);

</script>