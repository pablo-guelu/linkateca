import { defineStore } from "pinia";
import { Collection } from "../types";

export const useUtilsStore = defineStore('utils', () => {

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
    }
})