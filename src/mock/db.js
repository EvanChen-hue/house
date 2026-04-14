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
  orders: [
    {
      id: "o1",
      orderNo: "HK202603300001",
      username: "李雨桐",
      phone: "13822118899",
      fullAddress: "浦东新区景和花园 3 栋 1202",
      serviceStartDate: "2026-03-31 09:00:00",
      totalAmount: 268,
      payStatus: 1,
      status: 2,
      payType: 2,
      createTime: "2026-03-30 10:20:00",
      remark: "上门前请提前 10 分钟联系。",
    },
    {
      id: "o2",
      orderNo: "HK202603300002",
      username: "陈子墨",
      phone: "13900887766",
      fullAddress: "徐汇区滨江湾 18 号楼 1802",
      serviceStartDate: "2026-04-01 14:00:00",
      totalAmount: 399,
      payStatus: 0,
      status: 1,
      payType: 3,
      createTime: "2026-03-30 11:05:00",
      remark: "家中有宠物，注意关门。",
    },
    {
      id: "o3",
      orderNo: "HK202603300003",
      username: "赵清欢",
      phone: "13755661122",
      fullAddress: "静安区中央广场 A 座 1608",
      serviceStartDate: "2026-03-29 08:30:00",
      totalAmount: 520,
      payStatus: 1,
      status: 4,
      payType: 1,
      createTime: "2026-03-28 16:48:00",
      remark: "客户要求重点清洁厨房和卫生间。",
    },
    {
      id: "o4",
      orderNo: "HK202603300004",
      username: "周以宁",
      phone: "13688776655",
      fullAddress: "长宁区虹桥路 998 弄 6 号 902",
      serviceStartDate: "2026-03-30 13:00:00",
      totalAmount: 188,
      payStatus: 6,
      status: 6,
      payType: 2,
      createTime: "2026-03-27 09:12:00",
      remark: "退款审核中。",
    },
    {
      id: "o5",
      orderNo: "HK202603300005",
      username: "沈书瑶",
      phone: "13566778899",
      fullAddress: "闵行区万源城朗郡 12 号楼 1501",
      serviceStartDate: "2026-03-26 10:00:00",
      totalAmount: 299,
      payStatus: 2,
      status: 5,
      payType: 3,
      createTime: "2026-03-25 18:20:00",
      remark: "已退款，用户临时取消。",
    },
  ],
  contents: [
    {
      id: "c1",
      category: "热门推荐",
      name: "深度清洁",
      sales: 328,
      intro: "全屋深度清洁，包含厨房油污和卫生间死角处理。",
      posterImage:
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=500&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",
      comments: [
        { star: 5, content: "阿姨很专业，清洁特别仔细。" },
        { star: 4, content: "上门准时，整体体验不错。" },
      ],
      regions: ["顺庆区", "高坪区"],
      originalPrice: 199,
      discountPrice: 149,
      specs: [
        { name: "4小时", price: 149 },
        { name: "6小时", price: 219 },
      ],
      createdAt: "2026-04-10 10:00:00",
    },
    {
      id: "c2",
      category: "家庭清洁",
      name: "厨房整理",
      sales: 164,
      intro: "厨房收纳整理+台面深度清洁，适合日常维护。",
      posterImage:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=500&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?auto=format&fit=crop&w=500&q=80",
      comments: [{ star: 5, content: "整理完看着太舒服了。" }],
      regions: ["嘉陵区", "南部县"],
      originalPrice: 129,
      discountPrice: 99,
      specs: [{ name: "2小时", price: 99 }],
      createdAt: "2026-04-11 13:20:00",
    },
  ],
};

function withDefaults(current) {
  return {
    ...seed,
    ...current,
    users: current?.users ?? seed.users,
    aunties: current?.aunties ?? seed.aunties,
    orders: current?.orders ?? seed.orders,
    contents: current?.contents ?? seed.contents,
  };
}

export function dbLoad() {
  const current = storageGet(KEY);
  if (current) {
    const next = withDefaults(current);
    storageSet(KEY, next);
    return next;
  }
  storageSet(KEY, seed);
  return seed;
}

export function dbSave(next) {
  storageSet(KEY, next);
  return next;
}

