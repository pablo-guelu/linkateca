<template>
    <v-card-text>
        <v-form ref="collectionForm">
            <v-text-field :rules="validationRules" label="Title*" variant="solo-filled"
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

const collectionStore = useCollectionStore();
const { currentCollection, collectionForm } = storeToRefs(collectionStore);
const { saveCollection, closeEdit, validationRules } = collectionStore;

const saveButtonLoading: Ref<boolean> = ref(false);

</script>