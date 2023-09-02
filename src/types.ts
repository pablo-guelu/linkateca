export interface Link {
    url: string,
    title: string,
    notes: string
    favicon: string,
    active: boolean
}

export interface Collection {
    id: string,
    title: string,
    notes: string
    links: Link[],
    parentId: string, 
    subCollections: Collection[],
    active: boolean
}

export const PopupMode = {
    LINKS: 'linksMode',
    COLLECTIONS: 'collectionsMode',
    EDIT_LINK: 'editLinkMode',
    EDIT_COLLECTION: 'editCollectionMode',
    EDIT_SUBCOLLECTION: 'editSubCollection'
} as const;

export const CollectionEditMode = {
    NEW: 'new',
    EDIT: 'edit'
} as const;

export const LinkEditMode = {
    NEW: 'new',
    EDIT: 'edit'
} as const

