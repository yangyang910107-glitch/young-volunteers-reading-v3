# Young Volunteers · Reading v3

Separate reading-only edition. The previous reading-v2 project is not modified.

Flow: teacher-only Lead-in → vocabulary line match → Hot Potato → START READING → skim → Example 0 (Key Idea) → group Key Ideas → Example 0 (Text Bridge) → group Text Bridge and Who → ring peer check (Approve / Revise only) → teacher reveals one-question comparisons and six-group result cards → Recapture → h/i exit ticket → Matching Superpowers.

The formal warm-up follows the approved preview designs in `presentation-simplification-comparison.html` and `lead-vocab-reading-flow-preview.html`: photo-and-prompt Lead-in, deliberately crossed vocabulary matching with animated reveal lines, six large Hot Potato sentences with two answers revealed per round, and a teacher-controlled START READING handoff. The check-in shows which group tablets are online, but the teacher can press START CLASS at any attendance count; missing groups may join later.

Six groups: a–f. Teacher example: g. Exit: h/i. Current revised reading text is preserved.

Run: Node 20+, npm install, npm start. Set PORT if needed.
Render: create a NEW service linked to a NEW repository; Root Directory blank, Build npm install, Start npm start, Health /health. Do not update the older services.
Upload the files and public folder after extracting the complete ZIP; do not upload the ZIP or an outer folder.

Teacher: /teacher.html. Student: /student.html?room=CODE. QR: /join.html?room=CODE.
Students and guests wait while the teacher runs the warm-up. Their tablets open SKIM automatically after START READING. Guest practice is separate from class results.
Class records remain in server memory: server restart/reset can clear classroom data. Export PDFs before restarting.

Reading v3b: strict hidden-section rules; original option numbers (Example 3); compact progress and peer check; comma/punctuation evidence fragments without printed sentence IDs; highlighted original evidence beside matching explanations; prominent WHY.
Points appear after teacher reveal. Key Ideas: 10 per correct answer; Bridge: 30 for a complete correct match; Exit: 20 per correct answer. Fully correct groups earn speed bonuses up to 3 based on elapsed time in each phase. Guest practice does not enter the class ranking.


Live leaderboard: teacher and student screens animate after Skim, Key Ideas, and the reading/peer-check reveal, then Exit Ticket. The teacher clicks SHOW ANSWERS to move directly into answer discussion. Uses actual shared group submissions, correct peer judgments, reveal-only scoring and approved plush avatars. Duplicate state updates and refresh do not award extra points or replay an already-viewed round.

Recommended interface: English carries the academic task; short Chinese text only supports an action. Key Idea review shows one question at a time and directly compares the group selection with the reference answer. Text Bridge review shows `THEIR SELECTION → REFERENCE ANSWER → KEY IDEA` with consistent purple, teal, coral and green colours; Who is checked separately. Recapture keeps Key Ideas as its first step. Question f keeps its original displayed Key Idea.
