// data/items/items-master.js

export const ITEMS = {
  // 消耗品
  potion_small: {
    id: "potion_small",
    name: "小回復薬",
    category: "consumable",
    rarity: "common",
    desc: "わずかな傷を癒す回復薬。"
  },

  ether_drop: {
    id: "ether_drop",
    name: "エーテル雫",
    category: "consumable",
    rarity: "uncommon",
    desc: "精神力を微量に回復する神秘の雫。"
  },

  // 素材
  iron_frag: {
    id: "iron_frag",
    name: "鉄の欠片",
    category: "material",
    rarity: "common",
    desc: "加工途中で砕けた鉄片。"
  },

  beast_hide: {
    id: "beast_hide",
    name: "獣皮",
    category: "material",
    rarity: "common",
    desc: "丈夫で加工しやすい皮。"
  },

  star_dust: {
    id: "star_dust",
    name: "星屑粉",
    category: "material",
    rarity: "rare",
    desc: "微かに光る未知の粉末。"
  },

  // 倉庫送り専用（大量系）
  scrap_box: {
    id: "scrap_box",
    name: "廃材箱",
    category: "storage",
    rarity: "common",
    desc: "雑多な素材が詰め込まれた箱。"
  }
};
