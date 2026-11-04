import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, normalizeQuantity, readCart, totals, validPhone } from '../dist/commerce-core.mjs';
test('quantities cannot become negative, fractional or unbounded',()=>{
 for(const [input,expected] of [[-4,0],[3.8,3],[999,10],['2',2],[NaN,0],[Infinity,0],['x',0]])assert.equal(normalizeQuantity(input),expected);
});
test('unknown products and malformed saved baskets cannot enter the catalog',()=>{
 assert.equal(readCart(null).quantity,0);assert.equal(readCart({sku:'unknown',quantity:3}).quantity,0);
 assert.deepEqual(readCart({sku:catalog.sku,quantity:999,price:1}),{sku:catalog.sku,quantity:10});
});
test('totals are derived from catalog prices, including the empty cart',()=>{
 assert.deepEqual(totals(0),{quantity:0,subtotal:0,shipping:0,total:0});
 assert.deepEqual(totals(2),{quantity:2,subtotal:578000,shipping:30000,total:608000});
 assert.equal(Number.isInteger(totals(3).total),true);
});
test('phone validation accepts common VN formats and rejects incomplete values',()=>{
 for(const value of ['0900000000','090 000 0000','+84900000000'])assert.equal(validPhone(value),true,value);
 for(const value of ['123','090000000','abc','1900000000'])assert.equal(validPhone(value),false,value);
});
test('real orders remain explicitly disabled in sample mode',()=>{
 assert.equal(catalog.liveOrdersEnabled,false);assert.equal(catalog.samplePricing,true);
});
