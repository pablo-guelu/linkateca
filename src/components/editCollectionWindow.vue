<template>
    <v-card-text>
        <v-form ref="collectionForm">
            <v-text-field :rules="validationRuleRequiredField" label="Title*" variant="solo-filled"
                v-model="currentCollection.title"></v-text-field>
            <v-textarea label="Notes" variant="solo-filled" v-model="currentCollection.notes"></v-textarea>
            <v-card-actions class="pt-6 me-2 d-flex justify-end">
                <v-btn variant="elevated" color="blue-darken-3" @click="closeEdit">
                    CANCEL
                </v-btn>
                <v-btn variant="elevated" color="blue-darken-3" :loading="saveButtonLoading" @click="() => {
                    collections = updateCollections(collections, currentCollection.id, currentCollection)
                }">
                    SAVE
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card-text>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { useCollectionStore } from '../stores/collections';
import { storeToRefs } from 'pinia';
import { useUtilsStore } from '../stores/utils';

const collectionStore = useCollectionStore();
const { currentCollection, collectionForm, collections } = storeToRefs(collectionStore);
const { closeEdit, updateCollections } = collectionStore;

const utilsStore = useUtilsStore();
const { validationRuleRequiredField } = utilsStore;

const saveButtonLoading: Ref<boolean> = ref(false);

console.log(currentCollection);

</script>