import { storageGet, storageSet } from "@/utils/storage.js";

const KEY = "hk_admin_db_v1";

const seed = {
  users: [
    {
      id: "u1",
      name: "李雨桐",
      phone: "138-2211-8899",
      address: "浦东新区·景和花园 3 栋 1202",
      orders: 12,
      level: "VIP",
      lastVisit: "2026-03-12",
    },
    {
      id: "u2",
      name: "陈子墨",
      phone: "139-0088-7766",
      address: "徐汇区·滨江湾 18 号楼 1802",
      orders: 6,
      level: "普通",
      lastVisit: "2026-03-09",
    },
    {
      id: "u3",
      name: "赵清欢",
      phone: "137-5566-1122",
      address: "静安区·中央广场 A 座 1608",
      orders: 19,
      level: "VIP",
      lastVisit: "2026-03-14",
    },
  ],
  aunties: [
    {
      id: "a1",
      name: "王阿姨",
      type: "domestic",
      intro: "10 年经验，深度保洁，收纳整理。",
      active: true,
      photo: "",
    },
    {
      id: "a2",
      name: "刘月嫂",
      type: "maternity",
      intro: "母婴护理证书，营养搭配，夜间陪护。",
      active: false,
      photo: "",
    },
  ],
};

export function dbLoad() {
  const current = storageGet(KEY);
  if (current) return current;
  storageSet(KEY, seed);
  return seed;
}

export function dbSave(next) {
  storageSet(KEY, next);
  return next;
}

