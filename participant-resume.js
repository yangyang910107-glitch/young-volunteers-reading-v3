function nameKey(name){return String(name||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();}
function findByName(records,name,group){
  const key=nameKey(name);
  if(!key)return null;
  const matches=[...records.values()].filter(p=>nameKey(p.name)===key);
  if(matches.length<=1)return matches[0]||null;
  const inGroup=matches.filter(p=>p.group===Number(group));
  if(inGroup.length===1)return inGroup[0];
  throw Error('More than one record uses this name. Choose your original group or ask your teacher.');
}
module.exports={nameKey,findByName};
