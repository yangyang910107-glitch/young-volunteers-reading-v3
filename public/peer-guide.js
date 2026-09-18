function renderPeerGuide(board,s){
 if(board.childElementCount)return;
 const heading=el('div',undefined,'peer-guide-heading'),play=el('button','▶ SHOW HOW TO CHECK','quiet');
 heading.append(el('h2','CHECK THE NEXT GROUP · 互查示范'),play);
 const ring=el('div',undefined,'peer-ring');
 s.groups.forEach((g,i)=>{const chip=el('span','GROUP '+g.id+' → '+(g.checkTarget||g.id%s.groups.length+1));chip.style.setProperty('--i',i);ring.append(chip);});
 const flow=el('div',undefined,'peer-guide-flow');
 const steps=[['1 · QUESTION','(b) '+QUESTIONS[1]],['2 · KEY IDEA',KEYS[1]],['3 · TEXT BRIDGE','Check every part · 证据是否全部匹配？'],['4 · WHO','Is the person correct? · 人物对吗？']];
 steps.forEach(([label,text],i)=>{const card=el('section',undefined,'peer-guide-step');card.style.setProperty('--i',i);card.append(el('small',label),el('p',text));flow.append(card);});
 board.append(heading,ring,flow);
 play.onclick=()=>{board.classList.remove('playing');void board.offsetWidth;board.classList.add('playing');};
}
