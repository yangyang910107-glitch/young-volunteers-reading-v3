/* Peer-check reveal: selected evidence → reference answer → Key Idea. */
let reviewRoom='',reviewQuestion=0;
function reviewVerdict(a){
  const complete=a.reviewEvidenceCorrect&&a.reviewWhoCorrect;
  if(complete)return {kind:'complete',text:'✓ COMPLETE MATCH'};
  if(!a.reviewEvidenceCorrect&&!a.reviewWhoCorrect)return {kind:'revise',text:'REVISE EVIDENCE + WHO'};
  return {kind:'revise',text:a.reviewEvidenceCorrect?'REVISE WHO':'REVISE EVIDENCE'};
}
function evidenceForPart(a,index){
  const chosen=(a.reviewAnswer?.evidence||[]).map(sentenceText),terms=a.reference.matches?.[index]||[];
  const matching=chosen.filter(text=>terms.some(term=>text.toLowerCase().includes(term.toLowerCase())));
  return {texts:matching.length?matching:(chosen[index]?[chosen[index]]:index===0?chosen:[]),matched:matching.length>0};
}
function referenceSentencesForPart(a,index){
  const terms=a.reference.matches?.[index]||[],sentences=(a.evidence||[]).map(sentenceText);
  const matching=sentences.filter(text=>terms.some(term=>text.toLowerCase().includes(term.toLowerCase())));
  return matching.length?matching:sentences;
}
function reviewPartRow(a,index){
  const picked=evidenceForPart(a,index),row=el('div',undefined,'review-map-row'),own=el('section',undefined,'review-map-cell student-choice'+(picked.matched?'':' issue')),reference=el('section',undefined,'review-map-cell reference-answer'),key=el('section',undefined,'review-map-cell key-target');
  own.append(el('small','THEIR SELECTION · 该组选句'));
  if(picked.texts.length)picked.texts.forEach(text=>own.append(coloredText(text,[a.reference.matches[index]||[]])));
  else own.append(el('p','No evidence selected for this part.','review-missing'));
  reference.append(el('small','REFERENCE SENTENCE · 参考原句'));
  referenceSentencesForPart(a,index).forEach(text=>reference.append(coloredText(text,[a.reference.matches[index]||[]])));
  key.append(el('small','KEY IDEA · 对应含义'),el('strong',a.reference.keyParts[index]||'—'));
  row.append(own,el('span','→','review-map-arrow'),reference,el('span','→','review-map-arrow'),key);return row;
}
function renderReadingReview(root,s){
  root.replaceChildren();if(!s.revealed||!s.accuracy)return;
  const rows=s.accuracy,context=s.roomId+':'+s.round;if(context!==reviewRoom){reviewRoom=context;reviewQuestion=rows[0]?.q;}if(!rows.some(a=>a.q===reviewQuestion))reviewQuestion=rows[0]?.q;
  root.append(el('h2','CHECK THE WHOLE MATCH'));
  const nav=el('nav',undefined,'review-group-nav');rows.forEach(a=>{const verdict=reviewVerdict(a),b=el('button',undefined,'review-group-button '+verdict.kind+(a.q===reviewQuestion?' active':''));b.append(el('strong','G'+(a.q+1)+' · '+TASK_LABELS[a.q]),el('small',verdict.text));b.onclick=()=>{reviewQuestion=a.q;renderReadingReview(root,s);};nav.append(b);});root.append(nav);
  const a=rows.find(a=>a.q===reviewQuestion);if(!a)return;const verdict=reviewVerdict(a),card=el('section',undefined,'clear-review-card');
  const top=el('div',undefined,'review-question-key');
  const question=el('section',undefined,'clear-review-question');question.append(el('small','QUESTION '+TASK_LABELS[a.q]+' · GROUP '+(a.q+1)),coloredText(QUESTIONS[a.q],a.reference.parts.map(t=>[t])));
  const key=el('section',undefined,'clear-review-key');key.append(el('small','KEY IDEA'),coloredText(KEYS[a.key],a.reference.keyParts.map(t=>[t])));top.append(question,key);
  const proof=el('section',undefined,'clear-review-proof');proof.append(el('h3','TEXT BRIDGE · MATCH EACH PART'));
  proof.append(el('p','Their sentence → the reference sentence → the matching part of the Key Idea','review-map-guide'));
  (a.reference.keyParts||[]).forEach((_,i)=>proof.append(reviewPartRow(a,i)));
  const who=el('section',undefined,'clear-review-who '+(a.reviewWhoCorrect?'correct':'wrong'));
  who.append(el('small','WHO · 单独核对人物'),el('p','Their choice: '+personText(a.reviewAnswer?.who)),el('span','→'),el('p','Reference: '+personText(a.answer)),el('strong',a.reviewWhoCorrect?'✓ MATCH':'△ REVISE'));
  card.append(top,proof,who,el('div',verdict.text,'review-final '+verdict.kind));root.append(card);
}
