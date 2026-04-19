/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2026-04-19 15:39:12
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2026-04-19 17:52:39
 * @FilePath: \house\src\api\content.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request } from "@/api/http.js";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export const contentApi = {
  listCategories({ current = 1, size = 10 } = {}) {
    const page = Number(current) || 1;
    const pageSize = Number(size) || 10;

    return request({
      url: "/house/category/list",
      method: "GET",
    }).then((data) => {
      const all = ensureArray(data).map((item) => ({
        id: item?.id,
        sort: Number(item?.sort) || 0,
        createTime: item?.createTime || "",
        updateTime: item?.updateTime || "",
        category: item?.name || "",
        name: item?.name || "",
      }));
      const start = (page - 1) * pageSize;

      return {
        records: all.slice(start, start + pageSize),
        total: all.length,
        current: page,
        size: pageSize,
      };
    });
  },

  listPackages({ categoryId, page = 1, pageSize = 10 } = {}) {
    return request({
      url: "/house/package/page",
      method: "GET",
      params: {
        categoryId,
        page,
        pageSize,
      },
    }).then((data) => ({
      records: ensureArray(data?.records),
      total: Number(data?.total) || 0,
      current: Number(data?.current) || Number(page) || 1,
      size: Number(data?.size) || Number(pageSize) || 10,
      pages: Number(data?.pages) || 0,
    }));
  },

  addCategory(name) {
    return request({
      url: "/house/admin/category/add",
      method: "POST",
      data: { name },
    });
  },

  updateCategory({ id, name }) {
    return request({
      url: "/house/admin/category/update",
      method: "put",
      data: { id, name },
    });
  },

  removeCategory(id) {
    return request({
      url: `/house/admin/category/${id}`,
      method: "DELETE",
    });
  },

  listPackageSpecs(packageId) {
    return request({
      url: `/house/package/spec/list/${packageId}`,
      method: "GET",
    }).then((data) => ensureArray(data));
  },

  listReviews({ packageId, page = 1, pageSize = 10 }) {
    return request({
      url: "/house/review/page",
      method: "GET",
      params: {
        packageId,
        page,
        pageSize,
      },
    }).then((data) => ({
      records: ensureArray(data?.records),
      total: Number(data?.total) || 0,
      current: Number(data?.current) || Number(page) || 1,
      size: Number(data?.size) || Number(pageSize) || 10,
      pages: Number(data?.pages) || 0,
    }));
  },

  addPackage(payload) {
    const form = new FormData();

    if (payload.posterFile) {
      form.append("posterFile", payload.posterFile);
    }
    if (payload.detailFiles) {
      form.append("detailFiles", payload.detailFiles);
    }

    if (payload.categoryId !== undefined && payload.categoryId !== null) {
      form.append("categoryId", payload.categoryId);
    }

    form.append("name", payload.name);
    form.append("description", payload.description);
    form.append("originalPrice", payload.originalPrice);
    form.append("price", payload.price);
    form.append("salesVolume", payload.salesVolume);
    form.append("serviceArea", payload.serviceArea);
    form.append("status", payload.status);

    return request({
      url: "/house/package/admin/add",
      method: "POST",
      data: form,
      headers: {
        accept: "*/*",
      },
    });
  },

  savePackageSpec({ packageId, specName, price }) {
    return request({
      url: "/house/admin/package/spec/save",
      method: "POST",
      data: {
        packageId,
        specName,
        price,
      },
    });
  },

  removePackageSpec(id) {
    return request({
      url: `/house/admin/package/spec/${id}`,
      method: "DELETE",
    });
  },
};
