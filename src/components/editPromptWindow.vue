<template>
    <v-card-text>
        <v-form ref="promptForm">
            <v-text-field :rules="validationRules" label="Title" variant="solo-filled"
                v-model="prompt.title"></v-text-field>
            <v-textarea :rules="validationRules" label="Prompt" variant="solo-filled" v-model="prompt.prompt"></v-textarea>
        </v-form>
    </v-card-text>

    <v-card-actions class="pt-6 me-2 d-flex justify-end">
        <v-btn variant="elevated" :color="appColor" @click="closeEdit">
            CANCEL
        </v-btn>
        <v-btn variant="elevated" :color="appColor" :loading="saveButtonLoading" @click="savePrompt">
            SAVE
        </v-btn>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { Prompt } from '../types';
import { Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePromptStore } from '../stores/prompts';
import { useSettingsStore } from '../stores/settings';

const promptStore = usePromptStore();
const {promptForm} = storeToRefs(promptStore);
const { savePrompt, closeEdit, validationRules } = promptStore;

const settingsStore = useSettingsStore();
const { appColor } = storeToRefs(settingsStore);

const saveButtonLoading: Ref<boolean> = ref(false);

const props = defineProps<{
    prompt: Prompt
}>()

console.log(props.prompt);

</script>