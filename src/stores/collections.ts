import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { Collection, PopupMode, CollectionEditMode } from '../types';
import { uuid } from 'vue-uuid';

export const useCollectionStore = defineStore('collection', () => {

    const popupMode = ref();

    const emptyCollection: Collection = {
        id: uuid.v4(),
        title: '',
        notes: '',
        links: [],
        parentId: '',
        subCollections: [],
        active: false
    }

    const collections: Ref<Collection[]> = ref([]);
    const currentCollection: Ref<Collection> = ref({ ...emptyCollection });
    const currentSubcollection: Ref<Collection> = ref({ ...emptyCollection });

    const convertSubcollectionsToArray = (collection: Collection) => {
        if (typeof collection.subCollections !== 'undefined' && !Array.isArray(collection.subCollections)) {
            collection.subCollections = Object.keys(collection.subCollections).length === 0 ? [] : Object.values(collection.subCollections);
            collection.subCollections.forEach((subcol) => {
                convertSubcollectionsToArray(subcol)
            })
        }

        if (typeof collection.links !== 'undefined' && !Array.isArray(collection.links)) {
            collection.links = Object.keys(collection.links).length === 0 ? [] : Object.values(collection.links)
        }
    }

    chrome.storage.local.get(['linkaTeca']).then(result => {
        console.log(result);
        collections.value = result.linkaTeca ? result.linkaTeca : [];

        if (!Array.isArray(collections.value)) {
            collections.value = Object.keys(collections.value).length === 0 ? [] : Object.values(collections.value)
        }

        if (collections.value.length > 0) {
            collections.value.forEach((collection) => {
                console.log('converting');
                convertSubcollectionsToArray(collection);
            });
        }

        currentCollection.value = collections.value[0] ? collections.value[0] : { ...emptyCollection };

        console.log(collections.value, currentCollection.value, currentCollectionIndex.value);

    });

    const currentCollectionIndex = ref(0);

    const currentSubCollectionIndex = ref(0);

    const collectionEditMode = ref('');

    const addCollection = () => {
        collectionEditMode.value = CollectionEditMode.NEW;
        // const parentId = currentCollection.value.id;
        currentCollection.value = { ...emptyCollection };
        // currentCollection.value.parentId = parentId;
        popupMode.value = PopupMode.EDIT_COLLECTION;
    };

    let parentCollection: Ref<Collection> = ref({ ...emptyCollection });

    const editCollection = () => {
        collectionEditMode.value = CollectionEditMode.EDIT;
        popupMode.value = PopupMode.EDIT_COLLECTION;
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

    const deleteCollection = (collections: Collection[], targetId: string) => {
        let updatedCollections: Collection[] = collections.filter(collection => {
            if (collection.id !== targetId) {
                if (collection.subCollections.length > 0) {
                    let updatedSubCollections = deleteCollection(collection.subCollections, targetId);
                    collection.subCollections = updatedSubCollections; // Update the subcollections
                }
                return true; // Keep this collection in the filtered array
            }
            return false; // Exclude this collection from the filtered array
        });

        chrome.storage.local.set({ 'linkaTeca': updatedCollections }).then(() => {
            console.log('collections: ', updatedCollections);
            currentCollection.value = updatedCollections[0];
        });
        
        return updatedCollections;
    }


    const jsonUploadOverlayActive = ref(false);
    const loadingOverlayState = ref(false);

    const collectionsJSON = ref('');

    const importCollections = () => {

        jsonUploadOverlayActive.value = false;
        loadingOverlayState.value = true;

        console.log(typeof (collectionsJSON.value), collectionsJSON.value)

        try {
            const jsObject = JSON.parse(collectionsJSON.value);
            console.log(jsObject);

            let updatedCollections = [...collections.value, ...jsObject.Collections];

            collections.value = updatedCollections;

            chrome.storage.local.set({ 'linkaTeca': updatedCollections })
                .then(() => {
                    popupMode.value = PopupMode.COLLECTIONS;
                    loadingOverlayState.value = false;
                    collectionsJSON.value = ''
                });

        } catch (error) {
            console.error('Error parsing the JSON file:', error);
            loadingOverlayState.value = false;
        }
    };

    const addSubcollection = () => {
        collectionEditMode.value = CollectionEditMode.NEW;
        parentCollection.value = currentCollection.value;
        currentCollection.value = {
            id: uuid.v4(),
            title: '',
            notes: '',
            links: [],
            parentId: parentCollection.value.id,
            subCollections: [],
            active: false
        };
        popupMode.value = PopupMode.EDIT_COLLECTION;
    }

    const editSubcollection = () => {
        collectionEditMode.value = CollectionEditMode.EDIT;
        currentSubcollection.value = currentCollection.value;
        popupMode.value = PopupMode.EDIT_SUBCOLLECTION; // Change the mode to EDIT
    }

    const saveSubcollection = async () => {

        console.log('subcollection edit')

        let updatedCollections = [...collections.value];

        const { valid } = await collectionForm.value?.validate();

        if (valid) {

            if (collectionEditMode.value == CollectionEditMode.EDIT && popupMode.value === PopupMode.EDIT_SUBCOLLECTION) {
                currentCollection.value.subCollections[currentSubCollectionIndex.value] = currentSubcollection.value;
                updatedCollections[currentCollectionIndex.value] = currentCollection.value;
            } else {
                currentCollection.value.subCollections.push(currentSubcollection.value);
                updatedCollections[currentCollectionIndex.value] = currentCollection.value;
            }

            console.log(updatedCollections);

            collections.value = updatedCollections;

            chrome.storage.local.set({ 'linkaTeca': updatedCollections })
                .then(() => {
                    popupMode.value = PopupMode.COLLECTIONS;
                });
        }
    }

    const switchCollection = (value: Collection) => {
        currentSubCollectionIndex.value = currentCollection.value.subCollections.findIndex(coll => coll.id === value.id);

        if (typeof currentSubcollection.value.links !== 'undefined' && !Array.isArray(currentSubcollection.value.links)) {
            currentSubcollection.value.links = Object.keys(currentSubcollection.value.links).length === 0 ? [] : Object.values(currentSubcollection.value.links)
        }

        if (typeof currentSubcollection.value.subCollections !== 'undefined' && !Array.isArray(currentSubcollection.value.subCollections)) {
            currentSubcollection.value.subCollections = Object.keys(currentSubcollection.value.subCollections).length === 0 ? [] : Object.values(currentSubcollection.value.subCollections)
        }

        currentCollection.value = { ...currentSubcollection.value };

        currentSubcollection.value = { ...emptyCollection };

        console.log(currentCollection.value);
    }

    const switchToParent = (collections: Collection[], parentId: string): void => {

        for (const collection of collections) {
            if (collection.id === parentId) {
                currentCollection.value = collection;
            } else if (collection.subCollections.length > 0) {
                const parentCol = switchToParent(collection.subCollections, parentId);
                return parentCol; // Return the parent collection once found
            }
        }
    }

    const modifyCollection = async (collections: Collection[], subCollectionId: string, modificationCallback: Function, args: any[]) => {
        console.log('working modify');

        const modifiedCollections = [...collections]; // Create a shallow copy of the original array

        for (const collection of modifiedCollections) {
            if (collection.parentId === '' || collection.subCollections.some(sub => sub.id === subCollectionId)) {
                modificationCallback(...args);
            } else if (collection.subCollections.length > 0) {
                await modifyCollection(collection.subCollections, subCollectionId, modificationCallback, args);
            }
        }
    }

    const replaceCollection = (collections: Collection[], targetId: string, newCollection: Collection): Collection[] => {
        const updatedCollections = collections.map(collection => {
            if (collection.id === targetId) {
                return newCollection; // Replace the target collection with the new collection
            } else if (collection.subCollections.length > 0) {
                const updatedSubCollections = replaceCollection(collection.subCollections, targetId, newCollection);
                return { ...collection, subCollections: updatedSubCollections };
            } else {
                return collection;
            }
        });

        chrome.storage.local.set({ 'linkaTeca': updatedCollections })
            .then(() => {
                console.log('collections updated');
                popupMode.value = PopupMode.COLLECTIONS;
            });

        return updatedCollections;
    }

    const updateCollections = (collections: Collection[], targetId: string, newCollection: Collection, deleteCol?: boolean): Collection[] => {

        let updatedCollections: Collection[] = []

        console.log(collectionEditMode.value, newCollection.parentId);

        if (collectionEditMode.value == CollectionEditMode.EDIT) {
            updatedCollections = collections.map(collection => {
                if (collection.id === targetId) {
                    return newCollection; // Replace the target collection with the new collection
                } else if (collection.subCollections.length > 0) {
                    let updatedSubCollections = updateCollections(collection.subCollections, targetId, newCollection);
                    return { ...collection, subCollections: updatedSubCollections };
                } else {
                    return collection;
                }
            });
        } else if (newCollection.parentId !== '') {
            updatedCollections = collections.map(collection => {
                if (collection.id === newCollection.parentId) {
                    return {
                        ...collection,
                        subCollections: [...collection.subCollections, newCollection]
                    } // Replace the target collection with the new collection
                } else if (collection.subCollections.length > 0) {
                    let updatedSubCollections = updateCollections(collection.subCollections, targetId, newCollection);
                    return { ...collection, subCollections: updatedSubCollections };
                } else {
                    return collection;
                }
            });
        }
        else {
            updatedCollections = [...collections, newCollection]
        }

        chrome.storage.local.set({ 'linkaTeca': updatedCollections })
            .then(() => {
                console.log('collections updated');
                popupMode.value = PopupMode.COLLECTIONS;
            });

        return updatedCollections;
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
        updateCollections,
        importCollections,
        collectionsJSON,
        parentCollection,
        collectionSelectKey,
        addSubcollection,
        editSubcollection,
        saveSubcollection,
        currentSubcollection,
        currentSubCollectionIndex,
        switchCollection,
        switchToParent,
        modifyCollection,
        replaceCollection,
        collectionEditMode,
        deleteCollection
    }
})