/* Local QR generation; no room URL is sent to a third-party service. */
(function(root){
  function classroomJoinUrl(origin,code,guest=false){
    if(!/^[A-Z0-9]{3,12}$/.test(code))throw Error('Create a room first.');
    const url=new URL('/student.html',origin);
    if(!['http:','https:'].includes(url.protocol))throw Error('Use a classroom website address.');
    url.searchParams.set('room',code);
    if(guest){url.searchParams.set('view','1');url.searchParams.set('practice','1');}
    return url.href;
  }
  if(typeof module!=='undefined')module.exports={classroomJoinUrl};
  else root.classroomJoinUrl=classroomJoinUrl;
})(typeof window!=='undefined'?window:globalThis);
