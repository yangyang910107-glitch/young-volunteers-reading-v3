/* Decorative layer only: stage-specific artwork outside the learning workspace. */
(()=>{
  const form=document.getElementById('setup')||document.getElementById('join');
  const themes={
    lobby:[9,0],lead:[0,9],vocabMatch:[1,3],vocabUse:[2,11],gist:[3,0],
    demo:[4,9],keys:[5,7],bridgeDemo:[6,0],combined:[7,6],peer:[8,9],
    response:[9,0],exit:[10,8],homework:[11,9]
  };
  const frame=document.createElement('div');frame.className='page-collage';
  frame.setAttribute('aria-hidden','true');frame.setAttribute('inert','');
  for(const name of ['corner-left','corner-right','footer-left','footer-right']){
    const part=document.createElement('span');part.className='frame-'+name;
    if(name.startsWith('corner')){const leaf=document.createElement('span');leaf.className='frame-leaf';part.append(leaf);}
    frame.append(part);
  }
  for(const edge of ['top','left','right','bottom']){
    for(let index=0;index<4;index++){
      const part=document.createElement('span');
      part.className='frame-edge frame-edge-'+edge+' frame-piece-'+index;
      frame.append(part);
    }
  }
  for(const edge of ['left','right']){
    const motif=document.createElement('span');
    motif.className='frame-edge-motif frame-edge-motif-'+edge;
    frame.append(motif);
  }
  document.body.prepend(frame);
  const position=index=>(index%4*100/3)+'% '+(Math.floor(index/4)*50)+'%';
  let previous=null;
  function update(){
    const stage=form&&!form.hidden?'lobby':document.body.dataset.lessonStage||'lobby';
    if(stage===previous)return;previous=stage;
    const [primary,partner]=themes[stage]||themes.lobby;
    document.body.style.setProperty('--stage-sticker',position(primary));
    document.body.style.setProperty('--partner-sticker',position(partner));
    document.body.dataset.frameStage=stage;
  }
  const observer=new MutationObserver(update);
  observer.observe(document.body,{attributes:true,attributeFilter:['data-lesson-stage']});
  if(form)observer.observe(form,{attributes:true,attributeFilter:['hidden']});
  update();
})();
