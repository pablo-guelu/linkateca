// import { storeToRefs } from "pinia";
// import { useCollectionStore } from "./stores/collections";
// import { useSettingsStore } from "./stores/settings";

// const collectionStore = useCollectionStore();
// const { currentCollection, collections } = storeToRefs(collectionStore);

// const settingsStore = useSettingsStore();
// const { defaultTheme } = storeToRefs(settingsStore);

// chrome.storage.local.get(['linkaTecaSettings']).then(result => {
//     console.log(result);
//     currentCollection.value = result.defaultCollection || collections.value[0];
//     defaultTheme.value = result.defaultTheme || 'light';
//   });