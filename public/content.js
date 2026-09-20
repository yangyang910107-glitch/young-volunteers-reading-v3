(function(root){const QUESTIONS=[
  "explains how an opportunity from the organisation led them to reconsider an earlier plan?",
  "mentions agreeing to participate after being persistently encouraged?",
  "explains how they draw on a previous difficult experience to recognise when others need support?",
  "expects their volunteering time to be limited by the need to prioritize another commitment?",
  "describes using a skill developed in their leisure time to contribute to the organisation?",
  "describes discovering that they had underestimated the value of a role they were reluctant to accept?",
  "says they can now make decisions without asking someone else for help?",
  "says they were too young to do the work they wanted at first?"
],KEYS=[
  "new chance → changes plan",
  "asked again and again + finally joins",
  "past problem → knows when others need help",
  "other work comes first → less time to help",
  "hobby skill + helps the organisation",
  "didn't want it + thought it didn't help → found it helpful",
  "makes choices + no need to ask",
  "wanted work + too young",
  "gets ready first + then leads a group"
],GROUP_KEY_IDS=[
  3,
  0,
  5,
  2,
  4,
  1
],KEY_OPTION_IDS=[4,6,8,1,5,3,7,2,0],TASK_LABELS='abcdefhi',GROUP_LABELS='abcdef',EXIT_LABELS='hi';if(typeof module!=='undefined')module.exports={QUESTIONS,KEYS,GROUP_KEY_IDS,KEY_OPTION_IDS,TASK_LABELS,GROUP_LABELS,EXIT_LABELS};else Object.assign(root,{QUESTIONS,KEYS,GROUP_KEY_IDS,KEY_OPTION_IDS,TASK_LABELS,GROUP_LABELS,EXIT_LABELS});})(typeof window!=='undefined'?window:globalThis);
