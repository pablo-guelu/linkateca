import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useTheme } from "vuetify";
import { useCollectionStore } from "./collections";

export const useSettingsStore = defineStore('settings', () => {

    const collectionStore = useCollectionStore();
    const { collections, currentCollectionIndex } = storeToRefs(collectionStore);

    const settingsOverlayActive = ref(false);

    const theme = useTheme();
    const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'

    const loadingSaveSettingsState = ref(false);

    const defaultTheme = ref('light');
    const defaultCollectionCurrentIndex = ref(0);

    chrome.storage.local.get(['linkaTecaSettings']).then(result => {

        if (result.linkaTecaSettings) {
            theme.global.name.value = result.linkaTecaSettings.defaultTheme;
            defaultTheme.value = result.linkaTecaSettings.defaultTheme;
        }
    });

    const saveSettings = () => {
        loadingSaveSettingsState.value = true;
    
        const selectedTheme = defaultTheme.value;
    
        if (collections.value.length > 0) {
            
            if (currentCollectionIndex.value >= 0 && currentCollectionIndex.value < collections.value.length) {
                [collections.value[0], collections.value[currentCollectionIndex.value]] = [
                    collections.value[currentCollectionIndex.value],
                    collections.value[0],
                ];
            } else {
                console.error("Invalid collection index:", currentCollectionIndex.value);
            }
        }
    
        let updatedCollections = [...collections.value];
        chrome.storage.local.set({ 'linkaTeca': updatedCollections }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving collections:", chrome.runtime.lastError);
            } else {
                console.log("Collections saved successfully.");
            }
        });
    
        chrome.storage.local.set({
            'linkaTecaSettings': {
                defaultTheme: selectedTheme
            }
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving settings:", chrome.runtime.lastError);
            } else {
                console.log("Settings saved successfully.");
            }
        });
    
        loadingSaveSettingsState.value = false;
        settingsOverlayActive.value = false;
    };
    
    return {
        toggleTheme,
        settingsOverlayActive,
        loadingSaveSettingsState,
        defaultTheme,
        defaultCollectionCurrentIndex,
        saveSettings,
    }

})