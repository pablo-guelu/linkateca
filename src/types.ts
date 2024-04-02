export interface Link {
    url: string,
    title: string,
    notes: string,
    favicon: string,
    active: boolean
}

export interface Collection {
    id: string,
    title: string,
    notes: string,
    links: Link[],
    parentId: string, 
    subCollections: Collection[],
    active: boolean
}

export const PopupMode = {
    LINKS: 'linksMode',
    COLLECTIONS: 'collectionsMode',
    PROMPTS: 'promptsMode',
    EDIT_LINK: 'editLinkMode',
    EDIT_COLLECTION: 'editCollectionMode',
    EDIT_SUBCOLLECTION: 'editSubCollection',
    EDIT_PROMPT: 'editPromptMode'
} as const;

export const CollectionEditMode = {
    NEW: 'new',
    EDIT: 'edit'
} as const;

export const LinkEditMode = {
    NEW: 'new',
    EDIT: 'edit'
} as const

export interface Prompt {
    id: string | number,
    title: string,
    prompt: string
    active: boolean
}

