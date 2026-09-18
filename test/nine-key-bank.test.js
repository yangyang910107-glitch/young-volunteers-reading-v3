const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {KEYS,KEY_OPTION_IDS,GROUP_KEY_IDS}=require('../public/content'),{MODEL_OPTIONS}=require('../public/article');
test('one numbered nine-option bank is shared by demo and group references',()=>{
 assert.equal(KEYS.length,9);assert.equal(KEY_OPTION_IDS.length,9);assert.equal(new Set(KEY_OPTION_IDS).size,9);
 assert.deepEqual(KEY_OPTION_IDS.map(k=>KEYS[k]),MODEL_OPTIONS);
 const source=fs.readFileSync(require.resolve('../public/shared.js'),'utf8');const fn=source.match(/function keyLabel[^\n]+/)[0];const ctx={KEYS,KEY_OPTION_IDS};vm.createContext(ctx);vm.runInContext(fn,ctx);
 assert.deepEqual(KEY_OPTION_IDS.map(k=>ctx.keyLabel(k).split('.')[0]),['1','2','3','4','5','6','7','8','9']);
 assert.ok(ctx.keyLabel(8).startsWith('3.'));assert.ok(ctx.keyLabel(0).startsWith('9.'));assert.equal(GROUP_KEY_IDS.length,6);
});
