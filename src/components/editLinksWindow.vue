<template>
    <v-card-text class="pb-0">
        <v-form ref="linkForm">
            <v-text-field :rules="validationRuleRequiredField" label="Link*" variant="solo-filled" v-model="currentLink.url"></v-text-field>
            <v-text-field :rules="validationRuleRequiredField" label="Title*" variant="solo-filled" v-model="currentLink.title"></v-text-field>
            <v-textarea label="Notes" variant="solo-filled" v-model="currentLink.notes"></v-textarea>
            <v-select class="select_padding__bottom" label="Collection" :items="collections"
                variant="solo-filled" v-model="currentCollection" item-title="title" return-object :rules="validationRuleRequiredCollection">
            </v-select>    
        </v-form>
    </v-card-text>

    <v-card-actions class="mt-2 me-2 d-flex justify-end">
        <v-btn variant="elevated" color="blue-darken-3" @click="closeEdit">
            CANCEL
        </v-btn>
        <v-btn variant="elevated" color="blue-darken-3" :loading="saveButtonLoading" @click="saveLink(currentCollection)">
            SAVE
        </v-btn>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { useLinkStore } from '../stores/links.ts'
import { Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCollectionStore } from '../stores/collections';
import { useUtilsStore } from '../stores/utils';

const linkStore = useLinkStore();
const { linkForm, currentLink} = storeToRefs(linkStore);
const { saveLink, closeEdit } = linkStore;

const collectionStore = useCollectionStore();
const { collections, currentCollection } = storeToRefs(collectionStore);

const utilsStore = useUtilsStore();
const { validationRuleRequiredField, validationRuleRequiredCollection } = utilsStore;

const saveButtonLoading: Ref<boolean> = ref(false);

</script>

<style scoped>
.select_padding__bottom > :deep(.v-input__details) {
    display: none;
}
</style>