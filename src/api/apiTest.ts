import http from "@/utils/request";
import { sleep } from "@/utils/time";
import Nid from "nid";

const apiTest: Record<any, any> = {
  getTest: (params: GetTest.params) => http.get<GetTest.data>("/test", params),
  postTest: (params: PostTest.params) =>
    http.post<PostTest.data>("/test", params)
};

/**
 * 获取商店skus
 */
apiTest.getShopSkus = async function () {
  let data = {
    "skus": [
      {
        "id": Nid(),
        "sku_id": "p000001",
        "sku_name": "产品1",
        "sku_num": 30,
        "sku_price": 1000,
        sku_price_display: "10",
        "shop_id": "shop000001",
        "create_time": "2023-06-30 16:36:47",
        "update_time": "2023-06-30 16:52:40"
      },
      {
        "id": Nid(),
        "sku_id": "p000002",
        "sku_name": "产品2",
        "sku_num": 10,
        "sku_price": 1000,
        sku_price_display: "10",
        "shop_id": "shop000001",
        "create_time": "2023-06-30 16:37:21",
        "update_time": "2023-06-30 16:52:40"
      },
      {
        "id": Nid(),
        "sku_id": "p000003",
        "sku_name": "产品3",
        "sku_num": 10,
        "sku_price": 1000,
        sku_price_display: "10",
        "shop_id": "shop000001",
        "create_time": "2023-06-30 16:37:21",
        "update_time": "2023-06-30 16:52:40"
      },
      {
        "id": Nid(),
        "sku_id": "p000004",
        "sku_name": "产品3",
        "sku_num": 10,
        "sku_price": 1000,
        sku_price_display: "10",
        "shop_id": "shop000001",
        "create_time": "2023-06-30 16:37:21",
        "update_time": "2023-06-30 16:52:40"
      },
      {
        "id": Nid(),
        "sku_id": "p000005",
        "sku_name": "产品3",
        "sku_num": 10,
        "sku_price": 1000,
        sku_price_display: "10",
        "shop_id": "shop000001",
        "create_time": "2023-06-30 16:37:21",
        "update_time": "2023-06-30 16:52:40"
      },
      {
        "id": Nid(),
        "sku_id": "p000006",
        "sku_name": "产品3",
        "sku_num": 10,
        "sku_price": 1000,
        sku_price_display: "10",
        "shop_id": "shop000001",
        "create_time": "2023-06-30 16:37:21",
        "update_time": "2023-06-30 16:52:40"
      }
    ],
    "shop": {
      "id": 1,
      "shopId": "shop000001",
      "shopUserId": null,
      "shopCategorys": "ca000001,ca000002",
      "create_time": "2023-06-30",
      "udpate_time": null,
      "state": "online"
    },
    "categories": [
      {
        "id": 1,
        "category_id": "ca000001",
        "category_name": "种类1",
        "category_skus": "p000001,p000002,p000006",
        "create_time": "2023-06-30 16:34:36",
        "update_time": null
      },
      {
        "id": 2,
        "category_id": "ca000002",
        "category_name": "种类2",
        "category_skus": "p000003,p000004,p000005",
        "create_time": "2023-06-30 16:34:54",
        "update_time": null
      }
    ],
    "categoryIds": ["ca000001", "ca000002"]
  };
  await sleep(100);
  return data;
};

function transformSeverData(obj = {}) {
  let str = JSON.stringify(obj);
  return JSON.parse(str, function(key, value) {
    // console.log(key);
    // console.log(key, value, this);
    if (key === 'create_time') {
      return new Date(value);
    }
    if (key === 'update_time') {
      return new Date(value);
    }
    if (key == 'category_skus') {
      return value.split(',')
    }
    if (key.startsWith("sku_price")) {
      // console.log('sssssssssssssssssssss', value);
      if (!value || value === 'null') {
        return 0
      }
      return parseFloat(value)
    }
    return value
  })
}

apiTest.fetchShopItems = async function(): Promise<any> {
  let data = await apiTest.getShopSkus();
  let newData: Record<any, any> = transformSeverData(data)
  let skus = newData.skus

  // console.log('newData', newData);

  let items = []
  newData.categories.forEach(category => {
    category.category_skus.forEach((skuId, skuIdIndex) => {
      let sku = skus.find(item => item.sku_id === skuId);
      sku.category_id = category.category_id
      if (skuIdIndex === 0) {
        sku.needShowCategory = true
        category.APP_SKU_INDEX = items.length
      }
      items.push(sku)
    })
  })

  // items = items.concat(mockListData())

  return {items, newData}
}

export default apiTest;
