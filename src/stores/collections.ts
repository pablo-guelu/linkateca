import { defineStore, storeToRefs } from 'pinia';
import { Ref, computed, ref } from 'vue';
import { Collection, PopupMode, CollectionEditMode } from '../types';
import { useSettingsStore } from './settings';
import { useTheme } from 'vuetify';

export const useCollectionStore = defineStore('collection', () => {

    const settingsStore = useSettingsStore();
    const { defaultCollection, defaultTheme } = storeToRefs(settingsStore);
    const { saveSettings } = settingsStore;

    const theme = useTheme();

    const popupMode = ref();

    const emptyCollection: Collection = {
        title: '',
        notes: '',
        links: [],
        active: false
    }

    const collections: Ref<Collection[]> = ref([]);
    const currentCollection: Ref<Collection> = ref({ ...emptyCollection });

    chrome.storage.local.get(['linkaTeca']).then(result => {
        console.log(result);
        collections.value = result.linkaTeca ? result.linkaTeca : [];

        collections.value.forEach((collection) => {
            if (typeof collection.links !== 'undefined' && !Array.isArray(collection.links)) {
                collection.links = Object.keys(collection.links).length === 0 ? [] : Object.values(collection.links)
            }
        });

        console.log(collections.value);
    });

    chrome.storage.local.get(['linkaTecaSettings']).then(result => {
        console.log(result);

        if (result.linkaTecaSettings) {

            if (collections.value.length > 0) {
                defaultCollection.value = result.linkaTecaSettings.defaultCollection;
                currentCollection.value = result.linkaTecaSettings.defaultCollection;

                if (typeof currentCollection.value.links !== 'undefined' && !Array.isArray(currentCollection.value.links)) {
                    currentCollection.value.links = Object.keys(currentCollection.value.links).length === 0 ? [] : Object.values(currentCollection.value.links)
                }
            }

            theme.global.name.value = result.linkaTecaSettings.defaultTheme;
            defaultTheme.value = result.linkaTecaSettings.defaultTheme;
        }
    });

    const currentCollectionIndex = computed(() => {
        return collections.value.findIndex((collection) => {
            return collection.title === currentCollection.value.title
        });
    });

    const collectionEditMode = ref('');

    const addCollection = () => {
        collectionEditMode.value = CollectionEditMode.NEW;
        currentCollection.value = { ...emptyCollection };
        popupMode.value = PopupMode.EDIT_COLLECTION;
    };

    const parentCollection = ref();

    // const addSubCollection = () => {
    //     collectionEditMode.value = CollectionEditMode.NEW;
    //     parentCollection.value = currentCollection.value;
    //     currentCollection.value = { ...emptyCollection };
    //     popupMode.value = PopupMode.EDIT_SUBCOLLECTION;
    // }

    const editCollection = () => {
        collectionEditMode.value = CollectionEditMode.EDIT;
        popupMode.value = PopupMode.EDIT_COLLECTION; // Change the mode to EDIT
    }

    const collectionForm = ref<HTMLFormElement>();

    const checkCurrentAndDefault = () => {
        if (defaultCollection.value.title === currentCollection.value.title) {
            saveSettings();
        }
    }

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

            checkCurrentAndDefault();
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
            currentCollection.value = { ...emptyCollection };
        });


    }

    const jsonUploadOverlayActive = ref(false);
    const loadingOverlayState = ref(false);

    const convertJsonToJsObject = (jsonString: any) => {
        return JSON.parse(jsonString);
    }

    const importCollections = () => {
        const fileInput = document.getElementById('jsonFileInput');
        if (fileInput instanceof HTMLInputElement) {
            const file = fileInput.files![0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {

                    jsonUploadOverlayActive.value = false;
                    loadingOverlayState.value = true;

                    try {

                        const jsonString = event.target?.result;
                        const jsObject = convertJsonToJsObject(jsonString);
                        console.log(jsObject);

                        let updatedCollections = [...collections.value, ...jsObject.Collections];

                        collections.value = updatedCollections;

                        chrome.storage.local.set({ 'linkaTeca': updatedCollections })
                            .then(() => {
                                popupMode.value = PopupMode.COLLECTIONS;
                                loadingOverlayState.value = false;
                            });

                    } catch (error) {
                        console.error('Error parsing the JSON file:', error);
                        loadingOverlayState.value = false;
                    }
                };
                reader.readAsText(file);
            } else {
                console.error('No file selected.');
            }
        }
    }

    return {
        popupMode,
        collections,
        currentCollection,
        currentCollectionIndex,
        emptyCollection,
        collectionForm,
        jsonUploadOverlayActive,
        loadingOverlayState,
        addCollection,
        editCollection,
        closeEdit,
        saveCollection,
        deleteCollection,
        importCollections,
        parentCollection,
        collectionSelectKey,
    }
})