import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { useTheme } from "vuetify";
import { Collection } from "../types";

export const useSettingsStore = defineStore('settings', () => {

    const settingsOverlayActive = ref(false);

    const theme = useTheme();
    const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'

    const loadingSaveSettingsState = ref(false);

    const defaultTheme = ref('light');
    const defaultCollection: Ref<Collection> = ref({
        title: '',
        notes: '',
        links: [],
        active: false
    });

    const saveSettings = () => {

        console.log('ok settings');

        loadingSaveSettingsState.value = true;

        const selectedTheme = defaultTheme.value;
        const selectedCollection = defaultCollection.value;

        chrome.storage.local.set({
            'linkaTecaSettings': {
                defaultCollection: selectedCollection,
                defaultTheme: selectedTheme
            }
        }).catch(error => {
            console.log(error);
        });

        loadingSaveSettingsState.value = false;
        settingsOverlayActive.value = false;

    }

    return {
        toggleTheme,
        settingsOverlayActive,
        loadingSaveSettingsState,
        defaultTheme,
        defaultCollection,
        saveSettings,
    }

})