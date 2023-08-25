import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import { Collection, Link, LinkEditMode, PopupMode } from '../types';
import { useCollectionStore } from './collections';

export const useLinkStore = defineStore('link', () => {

    const collectionStore = useCollectionStore();
    const { popupMode, collections, currentCollection, currentCollectionIndex } = storeToRefs(collectionStore);
    const { replaceCollection } = collectionStore;

    const links: Ref<Link[]> = ref([]);

    const defaultLink: Link = {
        url: '',
        title: '',
        notes: '',
        favicon: '',
        active: false,
    }

    const currentLink: Ref<Link> = ref({ ...defaultLink });

    const linkEditMode = ref('');

    const addLink = async () => {
        linkEditMode.value = LinkEditMode.NEW;
        currentLink.value = { ...defaultLink };

        getCurrentTab().then(async (response) => {
            currentLink.value.url = response.url;
            currentLink.value.title = response.title;
            const icon = await chrome.tabs.sendMessage(response.id, { getFavicon: "favicon" });

            if (icon) {
                currentLink.value.favicon = icon.favicon;
            }

        }).catch((error) => {
            console.log(error)
        });
        popupMode.value = PopupMode.EDIT_LINK;
    }

    const currentLinkIndex = ref(0);

    const editLink = (index: number) => {
        currentLinkIndex.value = index;
        currentLink.value = { ...currentCollection.value.links[index] }; // Make a copy of the link to edit
        linkEditMode.value = LinkEditMode.EDIT;
        popupMode.value = PopupMode.EDIT_LINK; // Change the mode to EDIT
    }

    const saveLink = async (collection: Collection) => {

        let updatedLinks = collection.links;
        console.log(updatedLinks);

        const { valid } = await linkForm.value?.validate();

        if (valid) {

            let linkUpdated = { ...currentLink.value };

            if (linkEditMode.value == LinkEditMode.NEW) {
                updatedLinks.push(linkUpdated);
            } else {
                updatedLinks[currentLinkIndex.value] = linkUpdated; // Replace the link at currentLinkIndex
            }

            collections.value = replaceCollection(collections.value, collection.id, collection);
        }
    }

    const closeEdit = () => {
        currentLink.value = { ...defaultLink };
        popupMode.value = PopupMode.COLLECTIONS;
    }

    const deleteLink = (index: number, collection: Collection) => {

        let updatedLinks = collection.links;
        // create a new array without the deleted link

        updatedLinks = [...updatedLinks.slice(0, index), ...updatedLinks.slice(index + 1)];

        collection.links = updatedLinks;

        console.log(collection);

        collections.value = replaceCollection(collections.value, collection.id, collection);

        console.log(collections.value);
    }

    const copyLink = async (link: Link) => {
        try {
            await navigator.clipboard.writeText(link.url);
            link.active = true;
            setTimeout(() => {
                link.active = false;
            }, 500);
            console.log('Link copied to clipboard');
        } catch (err) {
            console.log('Failed to copy link: ', err);
        }
    }

    const linkForm = ref<HTMLFormElement>();
    const searchActive: Ref<boolean> = ref(false);
    const search: Ref<string> = ref('');
    const showCopied: Ref<boolean> = ref(false);


    const getCurrentTab = async () => {
        let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab.url && tab.title && tab.id) {
            return { url: tab.url, title: tab.title, id: tab.id }
        } else return { url: '', title: '', id: '' || 0 };
    }

    const validationRules = [
        (value: string) => {
            if (value) return true
            return 'Required field.'
        }
    ];

    return {
        links,
        defaultLink,
        currentLink,
        linkForm,
        addLink,
        editLink,
        saveLink,
        closeEdit,
        deleteLink,
        copyLink,
        getCurrentTab,
        search,
        searchActive,
        showCopied,
        validationRules
    }
})