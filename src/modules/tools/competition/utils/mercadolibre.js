import config from './config';
import FFetch from './ff';

function* chunk(array, size) {
  for (let i = 0; i < array.length; i += size)
    yield array.slice(i, i + size);
}

var ml = {
  async init(hook) {
    this.ff = new FFetch('https://api.mercadolibre.com', hook);
    this.user_id = config.user_id;
  },

  async get(path, params = undefined) {
    return this.ff.get(path, params);
  },

  async put(path, body) {
    return this.ff.put(path, body);
  },
};

var GROUP_FULL = 0b100, GROUP_PREM = 0b010, GROUP_FREE = 0b001;

ml.publications = {
  attributes: [
    'id', 'title', 'status', 'price', 'available_quantity', 'sold_quantity', 'health',
    'permalink', 'listing_type_id', 'shipping.logistic_type', 'shipping.free_shipping',
    'attributes.id', 'attributes.value_name',
    'variations.id', 'variations.attributes.id', 'variations.attributes.value_name',
    'sale_terms.id', 'sale_terms.value_name',
    'category_id', 'catalog_listing',
    'item_relations', 'variations.item_relations', 'inventory_id', 'variations.inventory_id',
  ],
  groups: {
    full: GROUP_FULL,
    prem: GROUP_PREM,
    free: GROUP_FREE,
  },
  group_names: {
    0b000: 'DCC',
    0b001: 'DCG',
    0b010: 'DPC',
    0b011: 'DPG',
    0b100: 'FCC',
    0b101: 'FCG',
    0b110: 'FPC',
    0b111: 'FPG',
  },

  map: e => {
    function get_value(attributes, id) {
      const attribute = attributes && attributes.find(a => a.id == id);
      return attribute && attribute.value_name;
    }

    const v = e.variations.length ? e.variations[0] : e;

    const group = ((e.shipping.logistic_type == 'fulfillment') && GROUP_FULL) |
      ((e.listing_type_id == 'gold_pro') && GROUP_PREM) |
      ((e.shipping.free_shipping) && GROUP_FREE);

    return {
      id: e.id,
      title: e.title,
      status: e.status,
      price: e.price,
      stock: e.available_quantity,
      sold: e.sold_quantity,
      sku: get_value(v.attributes, 'SELLER_SKU'),
      link: e.permalink,
      group: group,
      health: e.health,
      variations: e.variations.length,
      manufacturing_time: get_value(e.sale_terms, 'MANUFACTURING_TIME'),
      brand: get_value(e.attributes, 'BRAND'),
      category: e.category_id,
      catalog: e.catalog_listing,
      relations: v.item_relations.map(e => e.id),
      inventory: v.inventory_id,
    };
  },

  async get(id) {
    const params = {
      include_attributes: 'all',
      attributes: this.attributes.join(','),
    };
    const data = await ml.get('/items/' + id, params);
    return this.map(data);
  },

  async put(id, body) {
    let data;

    function getError(message) {
      return { ok: false, id: id, message: message };
    }

    const attributes = [ 'variations.id' ];
    data = await ml.get('/items/' + id, { attributes: attributes.join(',') } );
    if (data.variations.length > 1) return getError('Multiple variations');

    let v, ml_body;
    v = ml_body = {};

    if (data.variations.length) {
      v.variations = data.variations.map(e => ({ id: e.id }));
      v = v.variations[0];
    }

    if ('sku' in body) v.attributes = [ { id: 'SELLER_SKU', value_name: body.sku } ];
    if ('stock' in body) v.available_quantity = body.stock;
    if ('status' in body) ml_body.status = body.status;
    if ('manufacturing_time' in body) ml_body.sale_terms = [ { id: 'MANUFACTURING_TIME', value_name: body.manufacturing_time } ];
    if ('price' in body) v.price = body.price;

    if (!Object.keys(ml_body).length) return getError('Nothing to put');

    data = await ml.put('/items/' + id, ml_body);
    if (!data) return { ok: false, id: id, message: 'Server error' };
    return { ok: true, id: id, message: 'Success' };
  },

  async *user_search(filter_params) {
    let count = 0, total;

    const params = {
      search_type: 'scan',
      limit: 100,
      attributes: 'results,paging.total,scroll_id',
      ...filter_params,
    };

    do {
      const data = await ml.get(`/users/${ml.user_id}/items/search`, params);
      if (!data) continue;

      params.scroll_id = data.scroll_id;
      total ||= data.paging.total;
      count += data.results.length;

      for (const c of chunk(data.results, 20)) {
        const item_params = {
          ids: c.join(','),
          include_attributes: 'all',
          attributes: this.attributes.join(','),
        };
        const item_data = await ml.get('/items', item_params);

        for (const e of item_data) {
          if (e.code != 200) continue;
          yield this.map(e.body);
        }
      }
    } while (count < total);
  },

  async get_profit(item) {
    let params, data;

    item.cur_price = item.price;

    const type = (item.group & GROUP_PREM) ? 'gold_pro' : 'gold_special';
    params = { price: item.price,
      category_id: item.category,
      listing_type_id: type,
      attributes: 'sale_fee_amount',
    };
    data = await ml.get('/sites/MLM/listing_prices', params);

    if (data) {
      item.commission_extra = item.price < 149 ? 28 : item.price < 299 ? 33 : 0;
      item.commission = (data.sale_fee_amount - item.commission_extra) / item.price;
    }

    if (!(item.group & GROUP_FREE)) {
      /* client pays (not free) */
      item.delivery_fee = 0;
    } else {
      params = { item_id: item.id, attributes: 'coverage.all_country.list_cost' };
      data = await ml.get(`/users/${ml.user_id}/shipping_options/free`, params);

      if (!data || !data.coverage || !data.coverage.all_country) item.delivery_fee = NaN;
      else item.delivery_fee = data.coverage.all_country.list_cost;
    }

    const r = item.price - item.price * item.commission - item.commission_extra - item.delivery_fee - item.cost;
    const i = {
      price: item.price,
      commission: item.commission,
      commission_extra: item.commission_extra,
      delivery_free: item.delivery_free,
      cost: item.cost,
    };
    return r;
  },
};

export default ml;
