import { requestOrMock } from "@/api/http.js";
import { dbLoad, dbSave } from "@/mock/db.js";

function nowString() {
  const d = new Date();
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function groupedCategories(contents) {
  const map = new Map();
  ensureArray(contents).forEach((item) => {
    const name = item?.category || "未分类";
    if (!map.has(name)) {
      map.set(name, {
        category: name,
        packageCount: 0,
        totalSales: 0,
      });
    }
    const entry = map.get(name);
    entry.packageCount += 1;
    entry.totalSales += Number(item?.sales) || 0;
  });
  return Array.from(map.values());
}

function normalizePackage(item, category) {
  return {
    ...item,
    category,
    id: item?.id || `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: item?.createdAt || nowString(),
    comments: ensureArray(item?.comments),
    regions: ensureArray(item?.regions),
    specs: ensureArray(item?.specs),
    sales: Number(item?.sales) || 0,
    originalPrice: Number(item?.originalPrice) || 0,
    discountPrice: Number(item?.discountPrice) || 0,
  };
}

export const contentApi = {
  listCategories({ current = 1, size = 10 } = {}) {
    const page = Number(current) || 1;
    const pageSize = Number(size) || 10;

    return requestOrMock(
      () => {
        const db = dbLoad();
        const all = groupedCategories(db.contents).sort((a, b) => a.category.localeCompare(b.category));
        const start = (page - 1) * pageSize;
        const records = all.slice(start, start + pageSize);
        return {
          records,
          total: all.length,
          current: page,
          size: pageSize,
        };
      },
      {
        url: "/house/content/category/list",
        method: "GET",
        params: { current: page, size: pageSize },
      }
    );
  },

  getCategoryDetail(category) {
    return requestOrMock(
      () => {
        const db = dbLoad();
        const list = ensureArray(db.contents).filter((item) => item.category === category);
        return {
          category,
          packages: list,
        };
      },
      {
        url: "/house/content/category/detail",
        method: "GET",
        params: { category },
      }
    );
  },

  saveCategory({ originalCategory = "", category, packages = [] } = {}) {
    return requestOrMock(
      () => {
        const db = dbLoad();
        const source = ensureArray(db.contents);
        const base = source.filter((item) => item.category !== originalCategory);
        const normalized = ensureArray(packages).map((item) => normalizePackage(item, category));
        dbSave({
          ...db,
          contents: [...normalized, ...base],
        });
        return {
          category,
          packageCount: normalized.length,
        };
      },
      {
        url: "/house/content/category/save",
        method: "POST",
        data: { originalCategory, category, packages },
      }
    );
  },

  removeCategory(category) {
    return requestOrMock(
      () => {
        const db = dbLoad();
        const list = ensureArray(db.contents).filter((item) => item.category !== category);
        dbSave({ ...db, contents: list });
        return true;
      },
      {
        url: "/house/content/category/remove",
        method: "DELETE",
        params: { category },
      }
    );
  },
};
