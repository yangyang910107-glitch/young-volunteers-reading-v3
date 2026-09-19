const {test}=require('node:test'),assert=require('node:assert/strict');
const {SENTENCES,EVIDENCE_UNITS,MODEL_OPTIONS}=require('../public/article'),{KEYS}=require('../public/content'),{EVIDENCE,bridgeCorrect}=require('../curriculum');
test('whole-sentence evidence preserves reference grading and original key numbering',()=>{
 assert.equal(EVIDENCE_UNITS.length,SENTENCES.length);
 assert.ok(EVIDENCE_UNITS.every((unit,i)=>unit.id===SENTENCES[i].id&&unit.parent===unit.id&&unit.text===SENTENCES[i].text));
 for(let q=0;q<8;q++){
  const ids=EVIDENCE_UNITS.filter(u=>EVIDENCE[q].includes(u.parent)).map(u=>u.id);
  assert.equal(bridgeCorrect(q,ids),true,'full reference sentences q='+q);
  assert.equal(bridgeCorrect(q,[...ids,'A1']),false,'unrelated sentence q='+q);
 }
 assert.equal(MODEL_OPTIONS.indexOf('gets ready first + then leads a group')+1,3);
 assert.deepEqual(KEYS.slice(0,6).map(k=>MODEL_OPTIONS.indexOf(k)+1),[9,4,8,6,1,5]);
});
