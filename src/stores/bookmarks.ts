import { defineStore, storeToRefs } from "pinia";
import { useCollectionStore } from "./collections";
import { Collection } from "../types";
import { ref } from "vue";

export const useBookmarkStore = defineStore('bookmarks', () => {

    const collectionStore = useCollectionStore();
    const { collections } = storeToRefs(collectionStore);

    // Function to recursively get bookmarks
    const getBookmarks = async (bookmarkNode: chrome.bookmarks.BookmarkTreeNode): Promise<any> => {

        const links = [];

        if (bookmarkNode.children && bookmarkNode.children.length > 0) {

            for (const child of bookmarkNode.children) {
                if (child.url) {
                    let favicon = '';
                    try {
                        favicon = await fetchFaviconAndConvertToBase64(child.url);
                        links.push({
                            active: false,
                            favicon: favicon,
                            notes: "",
                            title: child.title,
                            url: child.url,
                        });
                    } catch (error) {
                        continue
                    }
                } else if (child.children && child.children.length > 0) {
                    const subCollection = await getBookmarks(child);
                    links.push(subCollection);
                }
            }
        }

        return {
            active: false,
            links,
            notes: "",
            title: bookmarkNode.title,
        };

    }

    async function fetchFaviconAndConvertToBase64(faviconUrl: string): Promise<string> {
        try {
            const response = await fetch(faviconUrl);
            console.log(response);
            const blob = await response.blob();

            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result?.toString()?.split(',')[1] || ''; // Extract the base64 string from the data URL
                    resolve(base64String);
                };
                reader.onerror = () => {
                    reject(new Error('Error while reading the image.'));
                };
                reader.readAsDataURL(blob);
            });
        } catch (error: any) {
            throw new Error('Error fetching or converting the favicon: ' + error.message);
        }
    }

    const addCollectionsFromBookmarks = async () => {
        
        try {
            const bookmarkTree = await new Promise((resolve) => {
                chrome.bookmarks.getTree((tree) => {
                    resolve(tree);
                });
            });
    
            console.log(bookmarkTree);
    
            const bookmarks = bookmarkTree[0].children || [];
            let bookmarkPromises = [];
    
            for (const bookmarkNode of bookmarks) {
                if (bookmarkNode.url) {
                    // If a bookmark node is not inside any folder, skip it
                    continue;
                }
    
                // Collect the promises returned by getBookmarks function.
                bookmarkPromises.push(getBookmarks(bookmarkNode));
            }
    
            // Wait for all the bookmark promises to resolve.
            const bookmarkCollections = await Promise.all(bookmarkPromises);
    
            console.log(bookmarkCollections);
    
            let updatedCollections = [...collections.value, ...bookmarkCollections];
    
            console.log(updatedCollections);
    
            collections.value = updatedCollections;
    
            console.log(collections.value);
    
            await chrome.storage.local.set({ 'linkaTeca': updatedCollections });

        } catch (error: any) {
            throw new Error('Error while converting bookmarks to links ' + error.message);
        }

    };

    const loadingBookmarksState = ref(false);
    
    return {
        addCollectionsFromBookmarks,
        loadingBookmarksState
    }

})