import { defineStore, storeToRefs } from "pinia";
import { useCollectionStore } from "./collections";
import { useSettingsStore } from "./settings";
import { Collection } from "../types";

export const useUtilsStore = defineStore('utils', () => {

    const collectionStore = useCollectionStore();
    const { currentCollection } = storeToRefs(collectionStore);

    const settingsStore = useSettingsStore();
    const { defaultCollection } = storeToRefs(settingsStore);
    const { saveSettings } = settingsStore;

    const checkCurrentAndDefault = () => {
        if (defaultCollection.value.title === currentCollection.value.title) {
            saveSettings();
        }
    }

    const validationRuleRequiredField = [
        (value: string) => {
            if (value) return true
            return 'Required field.'
        }
    ];

    const validationRuleRequiredCollection = [
        (value: Collection) => {
            if (value.title) return true
            return 'Please select a collection or create one'
        }
    ]

    return {
        validationRuleRequiredCollection,
        validationRuleRequiredField,
        checkCurrentAndDefault
    }

})