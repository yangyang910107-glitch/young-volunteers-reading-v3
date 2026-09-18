// Each guest owns a separate set of groups. None is registered in the class.
function createGuestPractice({STAGES,CAPS,blankKeys,blankMarks,blank,closeDrafts,initialAnswer}) {
  return function guestRoom(source, guest) {
    let room = guest.practiceRoom;
    if (!room || room.round !== source.round) {
      guest.notes = '';
      guest.notesRevision = 0;
      guest.exit = null;
      room = guest.practiceRoom = {
        guestPractice:true, owner:guest, source,
        code:source.code, id:source.id, round:source.round, step:source.step,
        keysAttempt:source.keysAttempt||0,bridgeAttempt:source.bridgeAttempt||0,expectedStudents:0, students:new Map([[guest.id,guest]]), observers:new Map(),
        groups:CAPS.map((capacity,q)=>({
          id:q+1,q,capacity,markings:blankMarks(),
          drafts:{keys:blankKeys(),combined:blank(),peer:blank()},
          submissions:{},feedback:null,target:null
        }))
      };
    }
    if (room.step !== source.step) {
      if(STAGES[room.step]!=='peer')closeDrafts(room, STAGES[room.step]);
      room.step = source.step;
    }
    if(room.keysAttempt!==(source.keysAttempt||0)){room.keysAttempt=source.keysAttempt||0;room.groups.forEach(g=>{if(g.submissions.keys)g.drafts.keys=structuredClone(g.submissions.keys);delete g.submissions.keys;delete g.closedDrafts?.keys;});}
    if(room.bridgeAttempt!==(source.bridgeAttempt||0)){room.bridgeAttempt=source.bridgeAttempt||0;room.groups.forEach(g=>{if(g.submissions.combined)g.drafts.combined=structuredClone(g.submissions.combined);delete g.submissions.combined;delete g.submissions.peer;delete g.closedDrafts?.combined;delete g.closedDrafts?.peer;g.drafts.peer=blank();g.feedback=null;g.target=null;});}
    room.revealed = {...source.revealed};
    room.demo = source.demo;
    if (STAGES[room.step] === 'peer') {
      for (const group of room.groups) {
        if (!group.target) {
          group.target = source.groups[group.id-1].target || group.id % CAPS.length + 1;
          group.drafts.peer = structuredClone(initialAnswer(group));
        }
      }
    }
    return room;
  };
}
module.exports = {createGuestPractice};
