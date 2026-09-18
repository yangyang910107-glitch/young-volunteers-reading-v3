(function(){
  const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
  let code=String(params.get('room')||'').trim().toUpperCase(),mode='student',lastUrl=null;
  function draw(){
    if(!/^[A-Z0-9]{3,12}$/.test(code)){$('qr-error').textContent='Open this screen from your teacher room.';$('qr-image').hidden=true;return;}
    const guest=mode==='guest',url=classroomJoinUrl(location.origin,code,guest);
    $('qr-room').textContent='ROOM '+code;
    $('qr-class').className=guest?'quiet':'chosen';$('qr-guest').className=guest?'chosen':'quiet';
    $('qr-class').setAttribute('aria-pressed',!guest);$('qr-guest').setAttribute('aria-pressed',guest);
    $('qr-title').textContent=guest?'GUEST PRACTICE':'CLASS STUDENTS';
    $('qr-note').textContent=guest?'Scan, enter your name and try the activities independently.':'Scan, enter your name and choose your assigned group.';
    $('qr-data-note').textContent=guest?'Your practice does not affect class submissions, accuracy or leaderboard.':'Your group work counts towards class results.';
    $('qr-copy').textContent=guest?'COPY GUEST LINK':'COPY STUDENT LINK';
    $('qr-image').alt=(guest?'Guest practice':'Class students')+' QR code for room '+code;
    if(lastUrl!==url){try{
      const qr=qrcode(0,'M');qr.addData(url);qr.make();const count=qr.getModuleCount(),scale=10,margin=4,canvas=document.createElement('canvas');
      canvas.width=canvas.height=(count+2*margin)*scale;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000';
      for(let row=0;row<count;row++)for(let col=0;col<count;col++)if(qr.isDark(row,col))ctx.fillRect((col+margin)*scale,(row+margin)*scale,scale,scale);
      $('qr-image').src=canvas.toDataURL('image/png');$('qr-image').hidden=false;$('qr-error').textContent='';lastUrl=url;
    }catch{$('qr-error').textContent='QR generation failed. Return to the teacher page and reopen this screen.';}}
    $('qr-copy').onclick=async()=>{try{await navigator.clipboard.writeText(url);$('qr-copy').textContent='LINK COPIED ✓';}catch{$('qr-error').textContent='Copy is unavailable. Scan the QR code instead.';}};
  }
  $('qr-class').onclick=()=>{mode='student';draw();};$('qr-guest').onclick=()=>{mode='guest';draw();};draw();
})();
