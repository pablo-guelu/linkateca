import { defineStore } from 'pinia';
import { Ref, computed, ref } from 'vue';
import { Collection, PopupMode, CollectionEditMode } from '../types';

export const useCollectionStore = defineStore('collection', () => {

    const popupMode = ref();

    const defaultCollection: Collection = {
        title: '',
        notes: '',
        links: [],
        active: false
    }

    const collections: Ref<Collection[]> = ref([]);
    const currentCollection: Ref<Collection> = ref({ ...defaultCollection });

    chrome.storage.local.get(['linkaTeca']).then(result => {
        console.log(result);
        collections.value = result.linkaTeca ? result.linkaTeca : [];


        collections.value.forEach((collection) => {
            if (typeof collection.links !== 'undefined' && !Array.isArray(collection.links)) {
                collection.links = Object.keys(collection.links).length === 0 ? [] : Object.values(collection.links)
            }
        });

        currentCollection.value = collections.value[0] || { ...defaultCollection };
        console.log(collections.value)
    });

    const currentCollectionIndex = computed(() => collections.value.indexOf(currentCollection.value));

    const collectionEditMode = ref('');

    const addCollection = () => {
        collectionEditMode.value = CollectionEditMode.NEW;
        currentCollection.value = { ...defaultCollection };
        popupMode.value = PopupMode.EDIT_COLLECTION;
    };

    const editCollection = () => {
        collectionEditMode.value = CollectionEditMode.EDIT;
        popupMode.value = PopupMode.EDIT_COLLECTION; // Change the mode to EDIT
    }

    const collectionForm = ref<HTMLFormElement>();

    const saveCollection = async () => {

        let updatedCollections = [...collections.value];

        const { valid } = await collectionForm.value?.validate()

        if (valid) {
            if (collectionEditMode.value == CollectionEditMode.EDIT) {
                updatedCollections[currentCollectionIndex.value] = currentCollection.value; // edit collection ALL
            } else {
                updatedCollections.push(currentCollection.value); // Add a new collection
            }

            console.log(updatedCollections);

            collections.value = updatedCollections;

            chrome.storage.local.set({ 'linkaTeca': updatedCollections })
                .then(() => {
                    popupMode.value = PopupMode.COLLECTIONS;
                });
        }
    }

    const closeEdit = () => {
        popupMode.value = PopupMode.COLLECTIONS;
    }

    const collectionSelectKey = ref(0);

    const deleteCollection = () => {
        let updatedCollections = [...collections.value.slice(0, currentCollectionIndex.value), ...collections.value.slice(currentCollectionIndex.value + 1)]
        // create a new array without the deleted link
        collections.value = updatedCollections;

        chrome.storage.local.set({ 'linkaTeca': updatedCollections }).then(() => {
            console.log('collections: ', collections.value);
            currentCollection.value = { ...defaultCollection };
        });
    }

    const validationRules = [
        (value: string) => {
            if (value) return true
            return 'Required field.'
        }
    ];

    return {
        popupMode,
        collections,
        currentCollection,
        currentCollectionIndex,
        defaultCollection,
        collectionForm,
        addCollection,
        editCollection,
        closeEdit,
        saveCollection,
        deleteCollection,
        collectionSelectKey,
        validationRules
    }
})