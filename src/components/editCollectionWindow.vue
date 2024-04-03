<template>
    <v-card-text>
        <v-form ref="collectionForm">
            <v-text-field :rules="validationRuleRequiredField" label="Title*" variant="solo-filled"
                v-model="currentCollection.title"></v-text-field>
            <v-textarea label="Notes" variant="solo-filled" v-model="currentCollection.notes"></v-textarea>
            <v-card-actions class="pt-6 me-2 d-flex justify-end">
                <v-btn variant="elevated" :color="appColor" @click="closeEdit">
                    CANCEL
                </v-btn>
                <v-btn variant="elevated" :color="appColor" :loading="saveButtonLoading" @click="() => {
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
import { useSettingsStore } from '../stores/settings';

const collectionStore = useCollectionStore();
const { currentCollection, collectionForm, collections } = storeToRefs(collectionStore);
const { closeEdit, updateCollections } = collectionStore;

const utilsStore = useUtilsStore();
const { validationRuleRequiredField } = utilsStore;

const settingsStore = useSettingsStore();
const { appColor } = storeToRefs(settingsStore);

const saveButtonLoading: Ref<boolean> = ref(false);

</script>