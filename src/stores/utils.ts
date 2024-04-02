import { defineStore } from "pinia";
import { Collection, PopupMode } from "../types";
import { ref } from "vue";

export const useUtilsStore = defineStore('utils', () => {

    const popupMode = ref();
    popupMode.value = PopupMode.COLLECTIONS;

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
        popupMode,
        validationRuleRequiredCollection,
        validationRuleRequiredField,
    }
})