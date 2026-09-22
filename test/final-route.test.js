const {test}=require('node:test');
const assert=require('node:assert/strict');
const {io}=require('socket.io-client');
const {createApp}=require('../server');

test('teacher can choose either final activity order after Recapture',async t=>{
  const app=createApp(),clients=[];
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{clients.forEach(client=>client.disconnect());await new Promise(resolve=>app.io.close(resolve));});
  const client=io('http://127.0.0.1:'+app.server.address().port,{transports:['websocket'],forceNew:true});
  clients.push(client);
  await new Promise(resolve=>client.once('connect',resolve));
  const send=(event,payload={})=>new Promise((resolve,reject)=>client.timeout(3000).emit(event,payload,(err,result)=>err?reject(err):result.ok?resolve(result):reject(Error(result.error))));
  const joined=await send('teacher:join',{code:'FINALORDER'}),auth={code:'FINALORDER',token:joined.token};
  let state=joined.state;
  const current=()=>({...auth,stage:state.stage,round:state.round});
  const refresh=async()=>{state=(await send('teacher:join',auth)).state;};
  const next=async()=>{await send('teacher:next',current());await refresh();};
  const previous=async()=>{await send('teacher:previous',current());await refresh();};
  await send('teacher:start',auth);await refresh();
  for(let i=0;i<6;i++)await next();
  assert.equal(state.stage,'summary');

  await send('teacher:final-route',{...current(),order:'awards-first'});await refresh();
  assert.equal(state.stage,'awards');
  assert.equal(state.finalOrder,'awards-first');
  const classSnapshot=(await send('teacher:record',auth)).record;
  assert.equal(classSnapshot.scope,'class');
  assert.deepEqual(classSnapshot.exitReferences,[]);
  assert.equal(classSnapshot.groups[0].exitGrade,null);
  await send('teacher:celebrate',current());await refresh();
  assert.equal(state.awardsCelebrating,true);
  await next();
  assert.equal(state.stage,'exit');
  assert.equal(state.exitMode,'homework');
  const homeworkSnapshot=(await send('teacher:record',auth)).record;
  assert.deepEqual(homeworkSnapshot.exitReferences,[]);
  await assert.rejects(next(),/final step/);
  await previous();assert.equal(state.stage,'awards');
  await previous();assert.equal(state.stage,'summary');

  await send('teacher:final-route',{...current(),order:'exit-first'});await refresh();
  assert.equal(state.stage,'exit');
  assert.equal(state.exitMode,'class');
  await next();
  assert.equal(state.stage,'awards');
  await assert.rejects(next(),/final step/);
});
