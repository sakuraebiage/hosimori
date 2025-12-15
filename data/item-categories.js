// data/items/item-categories.js

export const ITEM_CATEGORIES = {
  consumable: {
    label: "消耗品",
    stackLimit: 20,
    sendToStorageOver: true
  },
  material: {
    label: "素材",
    stackLimit: 99,
    sendToStorageOver: true
  },
  storage: {
    label: "倉庫",
    stackLimit: Infinity,
    sendToStorageOver: false
  }
};
