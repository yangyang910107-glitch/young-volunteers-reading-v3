(function(root){const STAGES=[
{
    "id": "gist",
    "title": "GET THE BIG PICTURE"
  },
  {
    "id": "demo",
    "title": "EXAMPLE 0"
  },
  {
    "id": "keys",
    "title": "FIND THE KEYS"
  },
  {
    "id": "bridgeDemo",
    "title": "EXAMPLE 0 · TEXT BRIDGE"
  },
  {
    "id": "combined",
    "title": "TEXT BRIDGE + WHO"
  },
  {
    "id": "peer",
    "title": "PEER CHECK"
  },
  {"id":"summary","title":"RECAPTURE"},
  {
    "id": "exit",
    "title": "EXIT TICKET · TEAM CHALLENGE"
  }
],PROFILES=[
  {
    "id": "A",
    "name": "Maya",
    "instrument": "community food project",
    "sentences": [
      "I first heard about the Riverside Food Project when a coordinator visited our school to explain how the project supports families.",
      "I had assumed volunteering meant carrying boxes or handing out food, neither of which appealed to me.",
      "Hearing that volunteers also plan deliveries and decide how donated food should be shared interested me, so I decided to try it.",
      "At first, I worried about mistakes and asked an experienced volunteer to check almost every decision.",
      "The staff gradually gave me more responsibility, and I now feel comfortable making those choices without asking someone else first.",
      "Before each delivery, I check the food and make sure the boxes are ready.",
      "I still volunteer most Saturdays, but my final exams are approaching, and schoolwork has to be my priority for a while.",
      "For the next two months, I’ll go only twice a month.",
      "My parents kept asking me to stop volunteering until the exams were over, but I decided to continue doing a little."
    ],
    "paragraphStarts": [
      0,
      3,
      6
    ]
  },
  {
    "id": "B",
    "name": "Leo",
    "instrument": "environmental organisation",
    "sentences": [
      "My parents care about environmental issues, so people sometimes assume they persuaded me to volunteer.",
      "In fact, a friend who had already joined the organisation got me involved.",
      "For several weeks, he kept sending photographs from weekend clean-ups and asking when I would come with him.",
      "Eventually I agreed, thinking a morning outdoors would be better than staying home.",
      "I collected litter and planted trees, but the manager later discovered that I make and edit short videos for fun.",
      "She asked whether I could use those skills for the organisation.",
      "I now produce social-media posts encouraging other teenagers to join.",
      "Recently, she asked me to lead a small group of new volunteers and explain their jobs.",
      "I started straight away, without special training.",
      "I used to avoid speaking in front of others.",
      "Although I still get nervous, talking to a group now feels much easier.",
      "I will have more schoolwork next term, but I plan to spend the same amount of time volunteering."
    ],
    "paragraphStarts": [
      0,
      4,
      7
    ]
  },
  {
    "id": "C",
    "name": "Sofia",
    "instrument": "animal rescue centre",
    "sentences": [
      "I had wanted to help at an animal rescue centre for years.",
      "When I applied, I imagined feeding dogs and taking them for walks.",
      "However, I was only fifteen, and volunteers under sixteen could not work directly with animals.",
      "A staff member suggested helping in the charity shop until I was old enough.",
      "I didn’t want to work in the shop, but I accepted because I wanted to volunteer somewhere.",
      "I expected sorting donated clothes and serving customers to be dull.",
      "After a few weeks, I discovered that money from the shop paid for food, medicine and emergency treatment for the animals.",
      "That completely changed my opinion of the job.",
      "I am sixteen now and occasionally work with the dogs, but still spend most of my volunteering time in the shop.",
      "I once thought that only people working directly with animals were really helping them; I no longer believe that.",
      "Customers sometimes thank us for what we do to keep the centre running."
    ],
    "paragraphStarts": [
      0,
      4,
      8
    ]
  },
  {
    "id": "D",
    "name": "Oliver",
    "instrument": "youth support charity",
    "sentences": [
      "The youth centre where I volunteer was familiar to me because I attended its homework club when I was younger.",
      "I often found the work difficult but was too embarrassed to admit I needed help.",
      "Remembering that is useful: when a child becomes quiet or claims everything is fine, I can sometimes recognise what is happening because I behaved in the same way.",
      "When I started volunteering, I wanted to lead activities immediately, although I had never worked with younger children.",
      "The centre did not let me take charge of a group straight away.",
      "Instead, I spent several weeks watching experienced volunteers and completed a training course before I was given that responsibility.",
      "I had planned to travel with my cousin this summer, but the charity offered me a place on a youth-leadership programme running at the same time.",
      "I decided the opportunity was too valuable to miss, so the trip will have to wait until next year.",
      "My cousin understood my decision."
    ],
    "paragraphStarts": [
      0,
      3,
      6
    ]
  }
],DEMO_SOURCE={
  "question": "mentions the preparation required before they were given responsibility for a group?",
  "key": "gets ready first + then leads a group",
  "who": "D",
  "evidence": [
    "D5",
    "D6"
  ],
  "parts": [
    "the preparation required",
    "responsibility for a group"
  ],
  "keyParts": [
    "gets ready first",
    "then leads a group"
  ],
  "rows": [
    {
      "who": "A",
      "ids": [
        "A6"
      ],
      "correct": false,
      "hits": [
        [
          "check the food",
          "make sure the boxes are ready"
        ],
        []
      ],
      "proof": [
        "check food / make boxes ready ↔ gets ready",
        "No proof of leading a group"
      ],
      "note": "Preparation of food and boxes, not preparation followed by group leadership."
    },
    {
      "who": "B",
      "ids": [
        "B8",
        "B9"
      ],
      "correct": false,
      "hits": [
        [
          "without special training"
        ],
        [
          "lead a small group of new volunteers"
        ]
      ],
      "proof": [
        "No proof of required preparation beforehand",
        "lead a small group of new volunteers ↔ leads a group"
      ],
      "note": "He started straight away, without special training. Group leadership alone is not the complete match."
    },
    {
      "who": "D",
      "ids": [
        "D5",
        "D6"
      ],
      "correct": true,
      "hits": [
        [
          "watching experienced volunteers",
          "completed a training course"
        ],
        [
          "take charge of a group",
          "before I was given that responsibility"
        ]
      ],
      "proof": [
        "watching experienced volunteers / completed a training course ↔ gets ready first",
        "before I was given that responsibility ↔ then leads a group"
      ]
    }
  ]
},MODEL_OPTIONS=[
  "hobby skill + helps the organisation",
  "makes choices + no need to ask",
  "gets ready first + then leads a group",
  "asked again and again + finally joins",
  "didn't want it + thought it didn't help → found it helpful",
  "other work comes first → less time to help",
  "wanted work + too young",
  "past problem → knows when others need help",
  "new chance → changes plan"
];STAGES.push({id:"awards",title:"MATCHING SUPERPOWERS"});const SENTENCES=PROFILES.flatMap(p=>p.sentences.map((text,i)=>({id:p.id+(i+1),who:p.id,text})));const EVIDENCE_UNITS=SENTENCES.map(s=>({...s,parent:s.id}));if(typeof module!=='undefined')module.exports={STAGES,PROFILES,SENTENCES,EVIDENCE_UNITS,DEMO_SOURCE,MODEL_OPTIONS};else Object.assign(root,{STAGES,PROFILES,SENTENCES,EVIDENCE_UNITS,DEMO_SOURCE,MODEL_OPTIONS});})(typeof window!=='undefined'?window:globalThis);
