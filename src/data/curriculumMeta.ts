import { RAW_DATA, LOGO_B64, HERO_B64 } from './extractedData';

export { LOGO_B64, HERO_B64 };

export type LessonId =
  | '1.1'
  | '1.2'
  | '1.3'
  | '1.4'
  | '1.5'
  | '2.1'
  | '2.2'
  | '2.3'
  | '2.4'
  | '2.5'
  | '2.6';

export interface QuizQuestion {
  q: string;
  o: readonly string[];
  a: number;
  e: string;
}

export interface ScenarioLab {
  id: string;
  title: string;
  prompt: string;
  options: {
    label: string;
    isOptimal: boolean;
    feedback: string;
  }[];
}

export interface LessonMeta {
  id: LessonId;
  moduleNum: 1 | 2;
  codeLabel: string;
  altCodeLabel?: string;
  title: string;
  subtitle: string;
  researchDiscussionTitle: string;
  researchDiscussionBody: string;
  researchInsight: string;
  authenticApplication: string;
  essentialPrinciples: string[];
  keyTerms: { term: string; meaning: string }[];
  mistakesTable?: { mistake: string; solution: string }[];
  scenarioLab: ScenarioLab;
  reflectionPrompt: string;
}

export const MODULES_CONFIG = [
  {
    id: 1 as const,
    code: 'MODULE 1',
    title: 'Teaching Methods',
    subtitle: 'Learning Module 1.1–1.5 | College-Level Instructional Material',
    overview:
      'This module introduces four language-teaching methods that future teachers can apply when planning lessons and facilitating classroom learning: Communicative Language Teaching (CLT), Grammar-Translation Method (GTM), Direct Method, and Task-Based Language Teaching (TBLT). It explains the principles, purposes, classroom applications, advantages, limitations, and practical teaching strategies associated with each method.',
    outcomes: [
      'Define and explain the four language-teaching methods (CLT, GTM, Direct Method, TBLT).',
      'Identify the principles and characteristics of each method.',
      'Differentiate the teaching methods based on their classroom applications.',
      'Apply appropriate teaching methods to realistic classroom situations.',
      'Design activities that support language development.',
      'Evaluate the strengths and limitations of each method.',
      'Demonstrate effective teaching decisions through practical exercises.'
    ],
    lessonIds: ['1.1', '1.2', '1.3', '1.4', '1.5'] as LessonId[],
    examId: 1 as const
  },
  {
    id: 2 as const,
    code: 'MODULE 2',
    title: 'Practice-Teaching Preparedness',
    subtitle: 'Learning Module 2.1–2.6 (7.1–7.5) | College-Level Instructional Material',
    overview:
      'Practice teaching is an essential part of teacher preparation. It allows future teachers to apply what they have learned about education, instructional methods, classroom management, communication, and professional responsibilities. This module focuses on five connected competencies that prepare future teachers for actual classroom teaching.',
    outcomes: [
      'Demonstrate the knowledge and teaching skills needed for effective instruction.',
      'Apply appropriate communication skills when interacting with students.',
      'Identify and apply proactive classroom management strategies.',
      'Develop calibrated confidence when delivering lessons and handling classroom situations.',
      'Demonstrate professionalism, confidentiality, and ethical behavior.',
      'Analyze teaching situations and make appropriate classroom decisions.',
      'Prepare for practice teaching through realistic classroom exercises.'
    ],
    lessonIds: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'] as LessonId[],
    examId: 2 as const
  }
];

export const LESSON_ORDER: LessonId[] = [
  '1.1',
  '1.2',
  '1.3',
  '1.4',
  '1.5',
  '2.1',
  '2.2',
  '2.3',
  '2.4',
  '2.5',
  '2.6'
];

export const LESSONS_META: Record<LessonId, LessonMeta> = {
  '1.1': {
    id: '1.1',
    moduleNum: 1,
    codeLabel: '1.1',
    title: 'Communicative Language Teaching (CLT)',
    subtitle:
      'CLT emphasizes meaningful communication, authentic discourse, and communicative competence over mechanical grammatical repetition.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Understanding Communicative Language Teaching (CLT)',
    researchDiscussionBody:
      'Communicative Language Teaching (CLT) shifted language pedagogy from structuralist habit-formation to communicative competence (Hymes, 1972; Canale & Swain, 1980). Rather than isolating grammatical structures into decontextualized drills, CLT asserts that language is best acquired when learners engage in pragmatic, purposeful interaction where meaning is negotiated in real time.',
    researchInsight:
      'CLT emphasizes meaningful language use and interaction to develop communicative competence. Learners use language to exchange genuine information, express meaning, and participate in purposeful communication, with pedagogical tasks adapted to classroom context.',
    authenticApplication:
      'Students work in pairs to interview one another about their personal hobbies and career goals, then synthesize and report their partner’s answers to the class, using language purposefully to bridge an authentic information gap.',
    essentialPrinciples: [
      'Prioritize communicative competence (grammatical, sociolinguistic, discourse, and strategic) as the primary goal.',
      'Use authentic or realistic materials, role-plays, interviews, and information-gap tasks.',
      'Balance fluency and accuracy: allow uninterrupted communication during fluency tasks and address common errors afterward.',
      'The teacher acts as a facilitator, organizer, and language monitor rather than the sole controller of every utterance.'
    ],
    keyTerms: [
      { term: 'Communicative Competence', meaning: 'The ability to communicate appropriately and effectively according to situation, purpose, and participants.' },
      { term: 'Fluency', meaning: 'The ability to express ideas smoothly without excessive hesitation.' },
      { term: 'Accuracy', meaning: 'The correct use of grammar, vocabulary, pronunciation, and sentence structure.' },
      { term: 'Interaction', meaning: 'Meaningful two-way communication between two or more people.' },
      { term: 'Authentic Communication', meaning: 'Language use that resembles communication in real-life situations.' },
      { term: 'Negotiation of Meaning', meaning: 'The process of clarifying, rephrasing, or adjusting communication when misunderstanding occurs.' }
    ],
    mistakesTable: [
      { mistake: 'Correcting every mistake while students speak', solution: 'Allow students to finish communicating before providing delayed feedback.' },
      { mistake: 'Giving unclear activity instructions', solution: 'Demonstrate the conversation or activity before students begin.' },
      { mistake: 'Allowing only confident students to participate', solution: 'Assign speaking turns, sentence starters, and rotating group roles.' },
      { mistake: 'Focusing only on speaking', solution: 'Integrate listening, reading, and writing activities within communicative contexts.' },
      { mistake: 'Choosing topics unfamiliar to students', solution: 'Use familiar, relevant, and meaningful real-life situations.' }
    ],
    scenarioLab: {
      id: 'lab-1.1',
      title: '1.1 Scenario Simulation: Communicative Language Teaching (CLT)',
      prompt:
        'Classroom Scenario: You are 15 minutes into your demonstration lesson. Students can complete written grammar worksheets accurately, but they freeze and give one-word answers when asked to speak in English. What is your best pedagogical move?',
      options: [
        {
          label: 'A. Stop the speaking activity and assign a 20-item written grammar worksheet so students feel comfortable.',
          isOptimal: false,
          feedback: 'Reverting to silent worksheets avoids the core problem—students need scaffolded oral interaction to build communicative confidence.'
        },
        {
          label: 'B. Pair students for a 3-minute information-gap activity using a campus map and sentence starters, noting common errors for post-task review.',
          isOptimal: true,
          feedback: 'Optimal CLT decision! Low-risk pair interaction with an authentic information gap and sentence frames lowers anxiety while preserving fluency and delayed error feedback.'
        },
        {
          label: 'C. Call hesitant students to the front one by one and correct every grammatical error immediately.',
          isOptimal: false,
          feedback: 'Public on-the-spot interruption heightens affective filter and blocks fluency development.'
        }
      ]
    },
    reflectionPrompt:
      'Create a 4-line dialogue for a realistic school or community situation (e.g., asking for directions on campus or ordering at the canteen) that incorporates an information gap.'
  },
  '1.2': {
    id: '1.2',
    moduleNum: 1,
    codeLabel: '1.2',
    title: 'Grammar-Translation Method (GTM)',
    subtitle:
      'GTM develops explicit grammatical knowledge, structural sentence analysis, reading comprehension, and translation accuracy.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Understanding the Grammar-Translation Method (GTM)',
    researchDiscussionBody:
      'The Grammar-Translation Method (GTM) emphasizes deductive grammar instruction, bilingual vocabulary study, close reading, and translation between the native language and target language. While GTM alone does not build spontaneous oral fluency, modern pedagogical research recognizes its targeted value for metalinguistic awareness, contrastive analysis, and clarifying complex syntax.',
    researchInsight:
      'Deductive rule presentation followed by structural sentence analysis and translation helps learners notice grammatical form and meaning differences, especially when combined with communicative follow-up.',
    authenticApplication:
      'Students analyze a short English passage, identify subject-verb-object patterns and third-person singular markers, translate the passage accurately, and compare literal versus natural translations.',
    essentialPrinciples: [
      'Explicit, deductive grammar instruction: rules are explained clearly before students apply them in exercises.',
      'Emphasis on reading comprehension, written accuracy, syntax, and morphology.',
      'Use of translation and contrastive analysis between native language and target language to clarify meaning.',
      'Best used selectively in modern classrooms to clarify form alongside communicative practice.'
    ],
    keyTerms: [
      { term: 'Grammar', meaning: 'Rules that explain how words are organized and inflected in sentences.' },
      { term: 'Translation', meaning: 'Converting a written or spoken message accurately from one language into another.' },
      { term: 'Syntax', meaning: 'The arrangement of words and phrases to form well-structured sentences.' },
      { term: 'Morphology', meaning: 'The study of word forms, roots, prefixes, and inflectional endings.' },
      { term: 'Deductive Learning', meaning: 'Presenting an explicit grammar rule first, followed by examples and structured exercises.' },
      { term: 'Target vs. Native Language', meaning: 'Target language is the language being learned; native language is the learner’s first language.' }
    ],
    mistakesTable: [
      { mistake: 'Explaining grammar without concrete examples', solution: 'Provide practical, meaningful sentences and situations.' },
      { mistake: 'Requiring students to memorize isolated word lists', solution: 'Teach vocabulary through context, reading passages, and usage.' },
      { mistake: 'Focusing exclusively on translation', solution: 'Combine grammar analysis with speaking and listening application.' },
      { mistake: 'Giving too many grammar rules at once', solution: 'Introduce grammatical structures gradually and systematically.' },
      { mistake: 'Correcting errors without explanation', solution: 'Explain why an answer is incorrect using clear structural rules.' }
    ],
    scenarioLab: {
      id: 'lab-1.2',
      title: '1.2 Scenario Simulation: Grammar-Translation Method (GTM)',
      prompt:
        'Classroom Scenario: Your students repeatedly write "She go to school" and "The student read the book" in their essays, struggling with subject-verb agreement and literal word-for-word translation. How do you intervene?',
      options: [
        {
          label: 'A. Mark every sentence wrong with red ink without explaining the underlying rule.',
          isOptimal: false,
          feedback: 'Marking errors without explanation leaves learners guessing why their structure failed.'
        },
        {
          label: 'B. Present the subject-verb-object and third-person singular (-s/-es) rule explicitly, contrast singular vs. plural examples, and guide students in revising and translating sentences.',
          isOptimal: true,
          feedback: 'Optimal GTM application! Explicit deductive grammar instruction paired with contrastive examples directly resolves structural writing errors.'
        },
        {
          label: 'C. Avoid grammar instruction altogether and hope students notice the rule on their own.',
          isOptimal: false,
          feedback: 'When persistent structural errors block written accuracy, explicit attention to form is warranted.'
        }
      ]
    },
    reflectionPrompt:
      'Write two example sentences demonstrating Subject-Verb-Object agreement (singular vs. plural subject) and explain how you would guide students to analyze their parts.'
  },
  '1.3': {
    id: '1.3',
    moduleNum: 1,
    codeLabel: '1.3',
    title: 'Direct Method',
    subtitle:
      'The Direct Method connects target-language words directly to objects, actions, pictures, and context without relying on translation.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Direct Association & Target-Language Immersion',
    researchDiscussionBody:
      'Arising as a reform response to Grammar-Translation, the Direct Method immerses learners in the target language using realia (real objects), visual aids, demonstrations, and question-and-answer routines. Grammar is acquired inductively—learners observe concrete examples and infer patterns naturally.',
    researchInsight:
      'Connecting vocabulary and structures directly to realia, gestures, and visual context builds oral comprehension and helps learners think directly in the target language.',
    authenticApplication:
      'The teacher holds up classroom objects (pen, notebook, ruler), models sentences in English ("This is a blue notebook"), and engages students in progressive Question-and-Answer practice.',
    essentialPrinciples: [
      'Target language serves as the primary medium of classroom instruction.',
      'Direct association of words with meaning through realia, pictures, actions, and context.',
      'Inductive grammar learning: students observe examples and identify patterns before formal rule statements.',
      'Strong emphasis on oral communication, pronunciation, and question-and-answer interaction.'
    ],
    keyTerms: [
      { term: 'Realia', meaning: 'Real, tangible objects brought into the classroom as teaching materials.' },
      { term: 'Direct Association', meaning: 'Connecting a target-language word directly to its meaning or object without translating.' },
      { term: 'Inductive Learning', meaning: 'Discovering a grammatical rule by examining examples and identifying patterns.' },
      { term: 'Demonstration', meaning: 'Showing how something works or what a word means through physical action or visuals.' },
      { term: 'Contextual Learning', meaning: 'Understanding words and expressions through the real situation in which they are used.' }
    ],
    mistakesTable: [
      { mistake: 'Speaking too quickly in the target language', solution: 'Use clear, paced, and comprehensible speech with visual support.' },
      { mistake: 'Using complex vocabulary with beginners', solution: 'Introduce concrete, familiar words first and build gradually.' },
      { mistake: 'Demonstrating without checking comprehension', solution: 'Ask progressive questions (yes/no -> choice -> full sentence) to verify understanding.' },
      { mistake: 'Making students repeat words without context', solution: 'Have students use vocabulary in meaningful full sentences.' },
      { mistake: 'Relying only on teacher demonstrations', solution: 'Give students opportunities to hold objects, demonstrate, and ask questions.' }
    ],
    scenarioLab: {
      id: 'lab-1.3',
      title: '1.3 Scenario Simulation: Direct Method',
      prompt:
        'Classroom Scenario: You need to teach the abstract word "honesty" using the Direct Method, where physical realia alone cannot show the concept. What is the most effective Direct Method strategy?',
      options: [
        {
          label: 'A. Abandon the target language and dictate a long definition in the students’ first language.',
          isOptimal: false,
          feedback: 'This bypasses target-language contextualization completely.'
        },
        {
          label: 'B. Show an illustration of a student returning a lost wallet, narrate the situation in simple English, ask guiding questions, and have students share examples of honest actions.',
          isOptimal: true,
          feedback: 'Excellent! Using visual scenarios, simple target-language storytelling, and guided Q&A makes abstract concepts comprehensible without translation.'
        },
        {
          label: 'C. Skip all abstract words in the curriculum.',
          isOptimal: false,
          feedback: 'Abstract vocabulary is essential; the Direct Method handles it through context and scenarios.'
        }
      ]
    },
    reflectionPrompt:
      'Describe how you would use realia, gestures, and a 3-step Question-and-Answer sequence to teach five action verbs or prepositions to beginners.'
  },
  '1.4': {
    id: '1.4',
    moduleNum: 1,
    codeLabel: '1.4',
    title: 'Task-Based Language Teaching (TBLT)',
    subtitle:
      'TBLT organizes instruction around meaningful tasks with a clear real-world outcome across Pre-Task, Task Cycle, and Language Focus stages.',
    researchDiscussionTitle:
      'Research-Supported Discussion: The Three-Stage TBLT Framework',
    researchDiscussionBody:
      'Task-Based Language Teaching (Willis, 1996; Ellis, 2003) structures learning around purposeful tasks that require learners to comprehend, negotiate, solve problems, and produce a concrete outcome (such as an event plan, itinerary, or survey report). Attention to specific language forms occurs in the post-task Language Focus stage based on authentic learner needs.',
    researchInsight:
      'A true pedagogical task has a primary focus on meaning, an information or reasoning gap, learner choice of language resources, and a clearly defined non-linguistic outcome.',
    authenticApplication:
      'Groups are given a ₱5,000 budget to plan a classroom educational event. Assigned specific roles (Leader, Researcher, Recorder, Budget Manager, Presenter), they negotiate expenses, present their proposal, and then review useful expressions in the Language Focus stage.',
    essentialPrinciples: [
      'Lessons are organized around a meaningful task with a clear, identifiable outcome.',
      'Three-Stage Framework: Stage 1 Pre-Task (prepare & scaffold), Stage 2 Task Cycle (task, planning, report), Stage 3 Language Focus (analysis & practice).',
      'Assign clear group roles and checklists to ensure equal participation and individual accountability.',
      'Focus on meaning and task completion first, followed by targeted grammar and vocabulary analysis.'
    ],
    keyTerms: [
      { term: 'Task', meaning: 'A goal-oriented classroom activity in which learners use language to achieve a real outcome.' },
      { term: 'Pre-Task Stage', meaning: 'The preparation phase where the teacher introduces the topic, clarifies instructions, and activates useful language.' },
      { term: 'Task Cycle', meaning: 'The core phase where students perform the task in groups, plan their summary, and report results to the class.' },
      { term: 'Language Focus', meaning: 'The post-task stage where teacher and students examine and practice specific language features that arose.' },
      { term: 'Learner Autonomy', meaning: 'The capacity of learners to take responsibility for their decisions and language use during collaboration.' }
    ],
    mistakesTable: [
      { mistake: 'Giving tasks without clear instructions or outcomes', solution: 'Define the required output clearly and model expectations during Pre-Task.' },
      { mistake: 'Allowing one or two students to do all the group work', solution: 'Assign distinct roles (Leader, Recorder, Budget Manager, Presenter) and individual reflections.' },
      { mistake: 'Skipping the Language Focus stage', solution: 'Always review useful expressions and common grammatical errors after the task report.' },
      { mistake: 'Focusing only on the final poster/product', solution: 'Assess both target-language communication and collaborative task completion with a rubric.' }
    ],
    scenarioLab: {
      id: 'lab-1.4',
      title: '1.4 Scenario Simulation: Task-Based Language Teaching (TBLT)',
      prompt:
        'Classroom Scenario: During the ₱5,000 School Event Challenge, you notice one outspoken student is writing the entire proposal while the other four group members sit silently. What is the best TBLT intervention?',
      options: [
        {
          label: 'A. Cancel group work permanently and convert the task into a silent individual grammar test.',
          isOptimal: false,
          feedback: 'Canceling collaborative tasks eliminates the communicative core of TBLT.'
        },
        {
          label: 'B. Structure the task with explicit roles (Leader, Researcher, Budget Manager, Recorder, Presenter), a task checklist, and a brief individual contribution reflection.',
          isOptimal: true,
          feedback: 'Spot on! Role assignment and individual accountability ensure equitable participation and genuine peer interaction.'
        },
        {
          label: 'C. Ignore the unequal participation as long as the final poster looks neat.',
          isOptimal: false,
          feedback: 'In TBLT, equitable language use during the process is just as important as the final product.'
        }
      ]
    },
    reflectionPrompt:
      'Outline a 3-stage TBLT lesson (Pre-Task, Task Cycle, Language Focus) where students plan a one-day educational field trip within a set budget.'
  },
  '1.5': {
    id: '1.5',
    moduleNum: 1,
    codeLabel: '1.5',
    title: 'Comparison of the Four Teaching Methods & Final Check',
    subtitle:
      'Synthesizing CLT, GTM, Direct Method, and TBLT to select and combine methods based on learning objectives and student needs.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Principled Eclecticism & Method Selection',
    researchDiscussionBody:
      'Comparative pedagogy demonstrates that no single method is universally superior for every objective. Principled eclecticism empowers teachers to select and combine techniques deliberately—using Direct Method realia to introduce vocabulary, brief GTM explanations to clarify complex grammar, and CLT or TBLT activities for communicative application.',
    researchInsight:
      'Effective teachers align their choice of method with the specific lesson objective, learner proficiency level, class size, and target skill.',
    authenticApplication:
      'In a unit on food and dining, a teacher introduces food vocabulary with real items (Direct Method), clarifies countable/uncountable grammar rules (GTM), conducts a server-customer role-play (CLT), and has groups design a healthy canteen menu within a budget (TBLT).',
    essentialPrinciples: [
      'CLT prioritizes communicative competence through interactive conversations, interviews, and role-plays.',
      'GTM prioritizes grammatical accuracy, structural analysis, reading, and translation.',
      'Direct Method prioritizes target-language immersion, oral Q&A, realia, and inductive grammar.',
      'TBLT prioritizes completing meaningful tasks with clear outcomes across Pre-Task, Task Cycle, and Language Focus.'
    ],
    keyTerms: [
      { term: 'Principled Eclecticism', meaning: 'Selecting and combining teaching methods purposefully based on objectives and learner needs.' },
      { term: 'CLT Main Focus', meaning: 'Meaningful interaction and communicative competence (Teacher as facilitator).' },
      { term: 'GTM Main Focus', meaning: 'Explicit grammar rules, reading, and translation accuracy (Teacher as instructor).' },
      { term: 'Direct Method Main Focus', meaning: 'Direct target-language association using realia and demonstration (Teacher as language model).' },
      { term: 'TBLT Main Focus', meaning: 'Language use through completing purposeful tasks with concrete outcomes (Teacher as task designer).' }
    ],
    scenarioLab: {
      id: 'lab-1.5',
      title: '1.5 Scenario Simulation: Selecting & Combining Teaching Methods',
      prompt:
        'Classroom Scenario: After a communicative role-play (CLT), you notice many students repeatedly confuse "much" and "many." You pause for a 4-minute explicit rule contrast with examples (GTM-style), then return to a group menu-planning task (TBLT). How is this pedagogical decision evaluated?',
      options: [
        {
          label: 'A. It is inconsistent and harmful because methods must never be mixed in one lesson.',
          isOptimal: false,
          feedback: 'Rigidly isolating methods ignores learners’ immediate developmental needs.'
        },
        {
          label: 'B. It is sound and research-supported because methods can be combined purposefully to address both form and communicative meaning.',
          isOptimal: true,
          feedback: 'Correct! Targeted form-focused support within a communicative/task-based lesson exemplifies principled eclecticism.'
        },
        {
          label: 'C. The teacher should abandon speaking tasks for the rest of the semester.',
          isOptimal: false,
          feedback: 'Brief grammar clarification should support, not replace, communicative practice.'
        }
      ]
    },
    reflectionPrompt:
      'Explain how you would combine at least two of the four teaching methods (CLT, GTM, Direct Method, TBLT) in a single 45-minute English lesson.'
  },
  '2.1': {
    id: '2.1',
    moduleNum: 2,
    codeLabel: '2.1',
    altCodeLabel: '7.1',
    title: 'Knowledge and Teaching Skills',
    subtitle:
      'Integrating Content Knowledge, Pedagogical Knowledge, and Pedagogical Content Knowledge (PCK) for aligned lesson planning and assessment.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Content Knowledge, Pedagogical Knowledge & PCK',
    researchDiscussionBody:
      'Shulman (1986) established that effective teaching requires more than isolated subject expertise or generic classroom tricks; it requires Pedagogical Content Knowledge (PCK)—knowing how to represent specific concepts using clear analogies, visual models, scaffolding, and formative checks tailored to learners’ prior knowledge and likely misconceptions.',
    researchInsight:
      'Instructional alignment ensures that measurable learning objectives, instructional activities, and formative/summative assessments all target the exact same competency.',
    authenticApplication:
      'When teaching the four stages of the water cycle, a practice teacher activates prior knowledge, uses a labeled visual diagram, guides students in sorting and explaining each stage in their own words, and uses an exit ticket to check understanding.',
    essentialPrinciples: [
      'Combine strong Content Knowledge (what to teach) with Pedagogical Content Knowledge (how to make it understandable).',
      'Maintain strict instructional alignment among learning objectives, teaching activities, and assessments.',
      'Use ongoing formative assessments and specific checks for understanding rather than vague "Does everyone understand?" questions.',
      'When unsure of an answer to a student’s question, acknowledge it honestly, verify with reliable sources, and follow up accurately.'
    ],
    keyTerms: [
      { term: 'Content Knowledge', meaning: 'Deep, accurate understanding of the subject or topic being taught.' },
      { term: 'Pedagogical Knowledge', meaning: 'Understanding of teaching methods, learning processes, and instructional strategies.' },
      { term: 'Pedagogical Content Knowledge (PCK)', meaning: 'Knowing how to teach specific subject matter effectively using examples, visuals, and scaffolding.' },
      { term: 'Instructional Alignment', meaning: 'Consistency among measurable learning objectives, classroom activities, and assessments.' },
      { term: 'Formative Assessment', meaning: 'Ongoing checks during instruction used to identify misconceptions and adjust teaching.' },
      { term: 'Differentiated Instruction', meaning: 'Adjusting content, process, or support to address diverse student needs and readiness.' }
    ],
    mistakesTable: [
      { mistake: 'Teaching without reviewing the content thoroughly', solution: 'Study the topic, anticipate misconceptions, and prepare clear examples before class.' },
      { mistake: 'Reading directly from presentation slides', solution: 'Explain concepts interactively using visual models and real-life analogies.' },
      { mistake: 'Preparing activities unrelated to the lesson objective', solution: 'Align every activity and assessment item directly with intended learning outcomes.' },
      { mistake: 'Guessing or inventing an answer when unsure', solution: 'Acknowledge the question honestly, verify the facts, and provide the accurate answer.' }
    ],
    scenarioLab: {
      id: 'lab-2.1',
      title: '2.1 (7.1) Scenario Simulation: Knowledge and Teaching Skills',
      prompt:
        'Classroom Scenario: On a 3-minute exit ticket at the end of your reading lesson, 12 out of 30 students wrote a minor supporting detail when asked to identify the paragraph’s main idea. What is your best instructional response?',
      options: [
        {
          label: 'A. Proceed to the next chapter tomorrow since 18 students got it right.',
          isOptimal: false,
          feedback: 'Moving on leaves 40% of the class with an unresolved misconception.'
        },
        {
          label: 'B. Use the formative evidence to re-teach the concept using a graphic organizer that contrasts umbrella main ideas with supporting details.',
          isOptimal: true,
          feedback: 'Optimal PCK response! Formative assessment data should drive targeted re-teaching with a clearer representation.'
        },
        {
          label: 'C. Scold the 12 students for not listening and repeat the exact same lecture louder.',
          isOptimal: false,
          feedback: 'Repeating the same explanation louder does not address the conceptual confusion.'
        }
      ]
    },
    reflectionPrompt:
      'Write one measurable learning objective for a 5-minute mini-lesson in your subject area, along with the formative check you would use to verify mastery.'
  },
  '2.2': {
    id: '2.2',
    moduleNum: 2,
    codeLabel: '2.2',
    altCodeLabel: '7.2',
    title: 'Communication Skills',
    subtitle:
      'Mastering verbal clarity, active listening, nonverbal presence, chunked instruction delivery, and task-focused constructive feedback.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Classroom Discourse, Wait Time & Constructive Feedback',
    researchDiscussionBody:
      'Teacher communication shapes both cognitive clarity and classroom climate. Research on classroom discourse highlights the power of chunking multi-step instructions, modeling tasks before release, providing 3–5 seconds of wait time after posing questions, and delivering specific, task-focused feedback that identifies strengths and actionable next steps.',
    researchInsight:
      'Effective feedback focuses on the quality of the work and specific steps for improvement rather than vague praise ("Good job!") or personal criticism.',
    authenticApplication:
      'Before a 15-minute poster activity, the teacher gains full attention, chunks instructions into three numbered steps on the board, models an example, and asks a student to summarize what to do (instruction-checking).',
    essentialPrinciples: [
      'Chunk complex instructions into clear, sequential steps supported by visual/written cues and instruction-checking questions.',
      'Practice active listening: give full attention, avoid interrupting, and paraphrase student ideas to confirm understanding.',
      'Align nonverbal communication (eye contact, open posture, calm tone, audibility) with spoken encouragement.',
      'Provide specific, timely, and empathetic feedback that separates evaluation of work from the student’s personal worth.'
    ],
    keyTerms: [
      { term: 'Verbal & Nonverbal Communication', meaning: 'Sharing meaning through spoken words supported by facial expressions, gestures, posture, and eye contact.' },
      { term: 'Active Listening', meaning: 'Paying full attention to a speaker and responding thoughtfully without premature interruption.' },
      { term: 'Instruction Checking', meaning: 'Asking learners brief questions to confirm they understand what to do before starting an activity.' },
      { term: 'Wait Time', meaning: 'Pausing after asking a question so all learners can process and formulate thoughtful responses.' },
      { term: 'Constructive Feedback', meaning: 'Specific, task-focused information that highlights what was done well and how to improve.' },
      { term: 'Empathy', meaning: 'Understanding and considering a student’s feelings, perspective, and circumstances.' }
    ],
    mistakesTable: [
      { mistake: 'Giving several complex instructions all at once', solution: 'Break instructions into numbered steps and write key steps on the board.' },
      { mistake: 'Saying "Okay?" after every sentence instead of checking', solution: 'Ask specific instruction-checking or concept-checking questions.' },
      { mistake: 'Giving vague or personal feedback ("Weak" or "Good job!")', solution: 'Name specific strengths and concrete next steps in the student’s work.' },
      { mistake: 'Interrupting students before they finish explaining', solution: 'Practice wait time and active listening before probing or responding.' }
    ],
    scenarioLab: {
      id: 'lab-2.2',
      title: '2.2 (7.2) Scenario Simulation: Teacher Communication Skills',
      prompt:
        'Classroom Scenario: A student receives a low score on an essay draft and looks visibly upset, saying, "I worked hard on this, you just don’t like my writing." How should you communicate?',
      options: [
        {
          label: 'A. Tell the student in front of the class not to be oversensitive about grades.',
          isOptimal: false,
          feedback: 'Public dismissal damages trust and escalates emotional defensiveness.'
        },
        {
          label: 'B. Speak privately, listen without interrupting, acknowledge their effort, point out a specific strength in their introduction, and outline two clear steps to strengthen their supporting evidence.',
          isOptimal: true,
          feedback: 'Exemplary communication! Private, empathetic active listening combined with specific task-focused feedback restores motivation and clarity.'
        },
        {
          label: 'C. Change the grade immediately without reviewing the rubric criteria.',
          isOptimal: false,
          feedback: 'Inflating grades without criteria undermines assessment fairness and learning.'
        }
      ]
    },
    reflectionPrompt:
      'Write a clear, chunked 4-step instruction script for a 10-minute pair activity, including one instruction-checking question you would ask before students begin.'
  },
  '2.3': {
    id: '2.3',
    moduleNum: 2,
    codeLabel: '2.3',
    altCodeLabel: '7.3',
    title: 'Classroom Management',
    subtitle:
      'Building a safe, organized, inclusive, and productive learning environment through proactive routines, positive reinforcement, and least-intrusive interventions.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Proactive Management & Least-Intrusive Intervention',
    researchDiscussionBody:
      'Research on classroom management (Kounin, 1970; Evertson & Weinstein, 2006) shows that effective management is primarily preventive rather than punitive. By teaching, modeling, and practicing routines early, using positive reinforcement, and addressing minor off-task behavior with the least intrusive response (proximity control, eye contact, calm redirection), teachers protect instructional time and student dignity.',
    researchInsight:
      'Proactive planning, clear expectations, and engaging instruction prevent most disruptions before they start, while private, respectful redirection avoids classroom power struggles.',
    authenticApplication:
      'When two students begin chatting during seatwork, the practice teacher uses proximity control—walking calmly near their desks while continuing the lesson—and praises nearby on-task groups, restoring focus without interrupting instruction.',
    essentialPrinciples: [
      'Establish a few clear, positively stated classroom rules and practice regular routines (entry, transitions, group work).',
      'Apply the principle of the least intrusive response: start with nonverbal cues or proximity control before private verbal reminders.',
      'Use specific positive reinforcement to recognize responsible, cooperative student behavior.',
      'Address sensitive or persistent behavior privately, seek the underlying cause, and never humiliate students publicly or use collective punishment.'
    ],
    keyTerms: [
      { term: 'Proactive Management', meaning: 'Preventing classroom disruptions through advance planning, clear expectations, and predictable routines.' },
      { term: 'Classroom Routines', meaning: 'Established procedures students follow automatically during daily transitions and activities.' },
      { term: 'Proximity Control', meaning: 'Moving physically closer to off-task learners to redirect behavior calmly without stopping instruction.' },
      { term: 'Least Intrusive Response', meaning: 'Starting with the mildest, most private intervention likely to restore order and escalating only if necessary.' },
      { term: 'Positive Reinforcement', meaning: 'Recognizing and encouraging appropriate behavior so students repeat it.' }
    ],
    mistakesTable: [
      { mistake: 'Shouting over a noisy class to get attention', solution: 'Use a taught, consistent attention signal and wait for full focus.' },
      { mistake: 'Embarrassing or arguing with a student in front of peers', solution: 'Stay calm, avoid power struggles, and speak with the student privately.' },
      { mistake: 'Punishing the entire class for one student’s misbehavior', solution: 'Avoid collective punishment; address individuals fairly and consistently.' },
      { mistake: 'Labeling a non-participating student as lazy immediately', solution: 'Approach privately to check if the student is confused, anxious, or needs a manageable starting step.' }
    ],
    scenarioLab: {
      id: 'lab-2.3',
      title: '2.3 (7.3) Scenario Simulation: Classroom Management',
      prompt:
        'Classroom Scenario: During a group activity, one student pushes their chair back and refuses to participate. What is the most effective classroom management response?',
      options: [
        {
          label: 'A. Call out the student across the room and threaten an immediate zero.',
          isOptimal: false,
          feedback: 'Public confrontation often triggers defiance or humiliation without solving the barrier to participation.'
        },
        {
          label: 'B. Approach calmly, check privately if the student needs clarification, clarify their specific role, and offer a manageable starting task.',
          isOptimal: true,
          feedback: 'Optimal management! Understanding the cause of behavior privately and scaffolding entry preserves dignity and re-engages the learner.'
        },
        {
          label: 'C. Ignore the student for the entire semester.',
          isOptimal: false,
          feedback: 'Inclusive management requires supporting every learner to participate safely.'
        }
      ]
    },
    reflectionPrompt:
      'List four positively stated classroom expectations you would establish on your first day of practice teaching and explain how you would teach one transition routine.'
  },
  '2.4': {
    id: '2.4',
    moduleNum: 2,
    codeLabel: '2.4',
    altCodeLabel: '7.4',
    title: 'Teaching Confidence',
    subtitle:
      'Developing calibrated self-efficacy, emotional composure, micro-teaching readiness, and reflective growth mindset.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Teacher Self-Efficacy & Reflective Practice',
    researchDiscussionBody:
      'Grounded in Bandura’s (1997) self-efficacy theory, teaching confidence is built through mastery experiences (rehearsing and delivering lessons), vicarious experiences (observing skilled mentors), and constructive feedback. Importantly, research emphasizes calibrated confidence—self-assurance that is backed by thorough preparation, contingency planning, and reflective practice rather than overconfidence.',
    researchInsight:
      'Teaching confidence does not mean never feeling nervous or knowing every answer immediately; it grows through preparation, aloud rehearsal, reflection, and openness to feedback.',
    authenticApplication:
      'Before a first demonstration lesson, a practice teacher outlines brief cue notes, rehearses key explanations and transitions aloud with a peer, prepares a non-digital backup activity in case the projector fails, and reflects on mentor feedback afterward.',
    essentialPrinciples: [
      'Build calibrated confidence through thorough subject preparation, timed aloud rehearsal, and contingency (backup) plans.',
      'Maintain emotional composure when minor mistakes or unexpected events happen—correct calmly and continue.',
      'Use a structured reflection cycle (What happened? Why did it happen? What specific change will I make next?).',
      'Treat critical feedback from cooperating teachers as actionable guidance about the lesson, not a personal attack.'
    ],
    keyTerms: [
      { term: 'Self-Efficacy', meaning: 'A teacher’s belief in their capability to plan and execute actions needed to support student learning (Bandura).' },
      { term: 'Calibrated Confidence', meaning: 'Realistic self-assurance that matches actual preparation and evidence of student learning.' },
      { term: 'Mastery & Vicarious Experience', meaning: 'Gaining confidence by succeeding in teaching segments (mastery) and observing skilled mentors (vicarious).' },
      { term: 'Reflective Practice', meaning: 'Systematically analyzing what happened in a lesson, why it happened, and how to improve next time.' },
      { term: 'Growth Mindset', meaning: 'The belief that teaching competence develops continuously through effort, strategy, and feedback.' }
    ],
    mistakesTable: [
      { mistake: 'Trying to memorize every word of a lesson script', solution: 'Understand the core concepts deeply and use concise cue notes.' },
      { mistake: 'Speaking too rapidly due to stage fright', solution: 'Pause deliberately, breathe, and check student understanding between points.' },
      { mistake: 'Panicking when classroom technology fails', solution: 'Always prepare a low-tech contingency plan (board work or handouts).' },
      { mistake: 'Becoming defensive when receiving mentor criticism', solution: 'Ask for specific examples and set a concrete, measurable improvement goal.' }
    ],
    scenarioLab: {
      id: 'lab-2.4',
      title: '2.4 (7.4) Scenario Simulation: Teaching Confidence',
      prompt:
        'Classroom Scenario: Two minutes before your observed demonstration lesson begins, a power outage shuts down your slide projector. How does a confident, prepared practice teacher respond?',
      options: [
        {
          label: 'A. Panic and ask the cooperating teacher to cancel the observation.',
          isOptimal: false,
          feedback: 'Canceling instruction when technology fails shows over-reliance on slides rather than pedagogical readiness.'
        },
        {
          label: 'B. Transition calmly to your prepared contingency plan using the chalkboard and printed activity sheets while maintaining steady classroom presence.',
          isOptimal: true,
          feedback: 'Excellent! Calibrated confidence shines through adaptability and advance contingency preparation.'
        },
        {
          label: 'C. Read your laptop screen aloud for 45 minutes without interacting with students.',
          isOptimal: false,
          feedback: 'Reading slides aloud without visual or interactive engagement loses student attention.'
        }
      ]
    },
    reflectionPrompt:
      'Apply the 3-step reflection cycle (What happened -> Why -> Next step) to a presentation or micro-teaching experience where you felt nervous.'
  },
  '2.5': {
    id: '2.5',
    moduleNum: 2,
    codeLabel: '2.5',
    altCodeLabel: '7.5',
    title: 'Professionalism',
    subtitle:
      'Upholding professional ethics, integrity, confidentiality, safeguarding protocols, fair assessment, and digital boundaries.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Ethical Standards, Confidentiality & Safeguarding',
    researchDiscussionBody:
      'Teacher professionalism encompasses ethical conduct, accountability, punctuality, impartial grading, and strict adherence to institutional policies and the Code of Ethics for Professional Teachers. While student confidentiality must be protected against gossip or unauthorized disclosure, teachers must also recognize that confidentiality is not absolute when a learner’s safety or welfare is at risk—requiring prompt reporting through designated school safeguarding channels.',
    researchInsight:
      'Professionalism is demonstrated every day through fair criteria-based grading, maintaining appropriate digital and personal boundaries, protecting learner privacy, and following the official chain of communication.',
    authenticApplication:
      'When a student discloses a potential safety concern at home, the practice teacher listens calmly without promising secrecy, protects the student from peer gossip, and reports the concern immediately to the cooperating teacher and designated guidance/safeguarding personnel.',
    essentialPrinciples: [
      'Uphold integrity and accountability: arrive early, prepare thoroughly, and promptly correct any instructional or grading errors.',
      'Protect student confidentiality: never share learner records, family situations, or unapproved photos online or in casual conversation.',
      'Follow safeguarding exceptions: report safety or abuse concerns immediately to designated school authorities rather than promising secrecy.',
      'Maintain clear professional boundaries in person and on social media, and evaluate all learners using objective, transparent rubrics.'
    ],
    keyTerms: [
      { term: 'Professional Ethics', meaning: 'Moral principles and standards that govern responsible conduct in the teaching profession.' },
      { term: 'Accountability', meaning: 'Being answerable for one’s professional duties, decisions, and their outcomes.' },
      { term: 'Confidentiality', meaning: 'Protecting private student information and sharing it only with authorized personnel who have a legitimate educational or safety need.' },
      { term: 'Professional Boundaries', meaning: 'Appropriate limits that keep teacher-student relationships respectful, fair, and free from conflicts of interest.' },
      { term: 'Chain of Communication', meaning: 'Raising instructional or policy concerns first with the appropriate supervisor (e.g., cooperating teacher) through official channels.' }
    ],
    mistakesTable: [
      { mistake: 'Posting photos of students’ faces on personal social media', solution: 'Respect learner privacy and obtain official school/parental authorization first.' },
      { mistake: 'Accepting personal social media requests or late-night private chats from students', solution: 'Keep all teacher-student communication on official school platforms at appropriate hours.' },
      { mistake: 'Showing favoritism in participation or project grading', solution: 'Use transparent, objective rubrics and apply standards consistently to every learner.' },
      { mistake: 'Promising absolute secrecy when a student discloses danger', solution: 'Listen supportively without promising secrecy and report promptly to designated safeguarding staff.' }
    ],
    scenarioLab: {
      id: 'lab-2.5',
      title: '2.5 (7.5) Scenario Simulation: Teacher Professionalism & Ethics',
      prompt:
        'Classroom Scenario: After class, a student privately tells you something suggesting they may be experiencing physical harm at home, and begs you, "Please promise you won’t tell anyone!" What is your ethical and professional duty?',
      options: [
        {
          label: 'A. Promise to keep it a complete secret so the student continues to trust you.',
          isOptimal: false,
          feedback: 'Teachers must never promise secrecy when a learner’s safety is at risk.'
        },
        {
          label: 'B. Listen calmly and empathetically, explain that you cannot promise secrecy when their safety is involved, and report promptly to your cooperating teacher and designated safeguarding personnel.',
          isOptimal: true,
          feedback: 'Correct! Safeguarding student welfare takes precedence while still protecting the student from unauthorized gossip.'
        },
        {
          label: 'C. Post the situation anonymously on social media to ask other teachers for advice.',
          isOptimal: false,
          feedback: 'Posting student disclosures online violates confidentiality and school safeguarding protocols.'
        }
      ]
    },
    reflectionPrompt:
      'Explain how a practice teacher should handle (a) a student’s friend request on personal social media and (b) discovering an accidental error in a recorded quiz score.'
  },
  '2.6': {
    id: '2.6',
    moduleNum: 2,
    codeLabel: '2.6',
    altCodeLabel: '7.6',
    title: 'Comparison of the Five Competencies & Final Check',
    subtitle:
      'Integrating Knowledge & Teaching Skills, Communication, Classroom Management, Confidence, and Professionalism for complete practice-teaching readiness.',
    researchDiscussionTitle:
      'Research-Supported Discussion: Holistic Practice-Teaching Preparedness',
    researchDiscussionBody:
      'The five competencies of Module 2 operate as an interconnected system. Strong content knowledge (2.1) requires clear communication (2.2) to be understood; engaging instruction is protected by proactive classroom management (2.3); steady delivery relies on calibrated confidence (2.4); and every interaction is anchored in ethical professionalism (2.5).',
    researchInsight:
      'A prepared pre-service teacher integrates subject mastery, clear communication, proactive management, reflective confidence, and ethical professionalism in every lesson.',
    authenticApplication:
      'During a formal demonstration lesson, the practice teacher arrives early in professional attire (2.5), rehearses and prepares a backup plan (2.4), aligns the lesson plan and diagram with the objective (2.1), chunks activity instructions clearly (2.2), and uses assigned group roles and proximity control (2.3).',
    essentialPrinciples: [
      '2.1 (7.1) Knowledge & Teaching Skills: Know what to teach and how to represent it clearly (PCK & alignment).',
      '2.2 (7.2) Communication Skills: Explain, chunk instructions, listen actively, and give specific task-focused feedback.',
      '2.3 (7.3) Classroom Management: Maintain a safe, organized, inclusive environment through routines and least-intrusive interventions.',
      '2.4 (7.4) Teaching Confidence & 2.5 (7.5) Professionalism: Combine prepared self-assurance and reflection with integrity, fairness, and confidentiality.'
    ],
    keyTerms: [
      { term: '2.1 / 7.1 Knowledge & Teaching Skills', meaning: 'Understanding subject matter and selecting aligned instructional strategies and assessments.' },
      { term: '2.2 / 7.2 Communication Skills', meaning: 'Explaining clearly, checking instructions, listening actively, and giving constructive feedback.' },
      { term: '2.3 / 7.3 Classroom Management', meaning: 'Organizing routines, expectations, roles, and calm behavioral interventions.' },
      { term: '2.4 / 7.4 Teaching Confidence', meaning: 'Developing calibrated self-efficacy through preparation, rehearsal, and reflection.' },
      { term: '2.5 / 7.5 Professionalism', meaning: 'Demonstrating ethical conduct, punctuality, confidentiality, and fair evaluation.' }
    ],
    scenarioLab: {
      id: 'lab-2.6',
      title: '2.6 Scenario Simulation: Integrating All Five Competencies',
      prompt:
        'Classroom Scenario: Which statement best captures how the five practice-teaching competencies work together during your internship?',
      options: [
        {
          label: 'A. Strong subject knowledge alone guarantees a successful classroom lesson.',
          isOptimal: false,
          feedback: 'Even deep subject knowledge fails if instructions are confusing or the classroom is disorganized.'
        },
        {
          label: 'B. Effective practice-teaching preparedness integrates subject and pedagogical knowledge, clear communication, proactive classroom management, prepared confidence, and ethical professionalism.',
          isOptimal: true,
          feedback: 'Exactly right! All five competencies reinforce one another to support student learning and safety.'
        },
        {
          label: 'C. Strict punishment and formal clothing are the only requirements for practice teachers.',
          isOptimal: false,
          feedback: 'True preparedness is holistic, learner-centered, and grounded in ethical pedagogy.'
        }
      ]
    },
    reflectionPrompt:
      'Which of the five competencies in Module 2 is currently your strongest, and which one will you prioritize developing before your next teaching demonstration?'
  }
};

export interface CleanedBlock {
  type: 'h' | 's' | 'p' | 'l' | 't';
  text: string;
}

// Clean up OCR artifacts at the beginning of lessons in RAW_DATA.C and normalize 6.x/7.x to 1.x/2.x
export function getCleanedLessonBlocks(lid: LessonId): CleanedBlock[] {
  const rawBlocks = RAW_DATA.C[lid] as readonly (readonly [string, string])[];
  const result: CleanedBlock[] = [];

  let started = lid === '1.1' || lid === '1.5' || lid === '2.1' || lid === '2.3' || lid === '2.6';

  for (const [type, rawText] of rawBlocks) {
    const text = rawText
      .replace(/MODULE 6/g, 'MODULE 1')
      .replace(/Module 6/g, 'Module 1')
      .replace(/MODULE 7/g, 'MODULE 2')
      .replace(/Module 7/g, 'Module 2')
      .replace(/LESSON 6\./g, 'LESSON 1.')
      .replace(/Lesson 6\./g, 'Lesson 1.')
      .replace(/LESSON 7\./g, 'LESSON 2.')
      .replace(/Lesson 7\./g, 'Lesson 2.');

    if (!started) {
      if (text.startsWith('LESSON ') || (type === 'h' && text.startsWith('1. Introduction'))) {
        started = true;
        if (text.startsWith('LESSON ')) continue; // Title is already rendered in the lesson header
      } else {
        continue;
      }
    }

    // Skip stray embedded Knowledge Check text inside 2.4 OCR block since Knowledge Check is rendered interactively
    if (text.startsWith('16. Knowledge Check')) {
      continue;
    }

    result.push({
      type: type as CleanedBlock['type'],
      text
    });
  }

  return result;
}

export function getQuizQuestions(lid: LessonId): readonly QuizQuestion[] {
  return RAW_DATA.Q[lid];
}

export interface ExamConfig {
  id: 1 | 2 | 3;
  code: string;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
  durationSeconds: number;
  questionCount: number;
  topics: string[];
  getPool: () => {
    ref: string;
    question: string;
    options: readonly string[];
    correctIndex: number;
    topicTag: string;
    moduleRef: LessonId;
  }[];
}

function getTopicForExamA(index: number): { topicTag: string; moduleRef: LessonId } {
  if (index < 30) return { topicTag: '1.1 Communicative Language Teaching (CLT)', moduleRef: '1.1' };
  if (index < 60) return { topicTag: '1.2 Grammar-Translation Method (GTM)', moduleRef: '1.2' };
  if (index < 90) return { topicTag: '1.3 Direct Method', moduleRef: '1.3' };
  return { topicTag: '1.4 Task-Based Language Teaching (TBLT) & Integration', moduleRef: '1.4' };
}

function getTopicForExamB(index: number): { topicTag: string; moduleRef: LessonId } {
  if (index < 24) return { topicTag: '7.1 (2.1) Knowledge and Teaching Skills', moduleRef: '2.1' };
  if (index < 48) return { topicTag: '7.2 (2.2) Communication Skills', moduleRef: '2.2' };
  if (index < 72) return { topicTag: '7.3 (2.3) Classroom Management', moduleRef: '2.3' };
  if (index < 96) return { topicTag: '7.4 (2.4) Teaching Confidence', moduleRef: '2.4' };
  return { topicTag: '7.5 (2.5) Professionalism', moduleRef: '2.5' };
}

export const EXAMS_CONFIG: Record<1 | 2 | 3, ExamConfig> = {
  1: {
    id: 1,
    code: 'EXAM 1',
    shortTitle: 'EXAM 1 - Teaching Methods (CLT, GTM, Direct Method, TBLT)',
    fullTitle: 'EXAM 1 - Teaching Methods (CLT, GTM, Direct Method, TBLT)',
    subtitle: 'Randomized 1–60 Examination · 60 Minutes · Module 1 Comprehensive Pool (120 Items)',
    durationSeconds: 3600,
    questionCount: 60,
    topics: [
      '1.1 Communicative Language Teaching (CLT)',
      '1.2 Grammar-Translation Method (GTM)',
      '1.3 Direct Method',
      '1.4 Task-Based Language Teaching (TBLT)'
    ],
    getPool: () =>
      RAW_DATA.E.a.map((item, idx) => {
        const meta = getTopicForExamA(idx);
        return {
          ref: `a:${idx}`,
          question: item[0],
          options: item[1],
          correctIndex: item[2],
          topicTag: meta.topicTag,
          moduleRef: meta.moduleRef
        };
      })
  },
  2: {
    id: 2,
    code: 'EXAM 2',
    shortTitle: 'EXAM 2 - Practice-Teaching Preparedness (7.1–7.5 / 2.1–2.5)',
    fullTitle:
      'EXAM 2 - 7.1 Knowledge and Teaching Skills · 7.2 Communication Skills · 7.3 Classroom Management · 7.4 Teaching Confidence · 7.5 Professionalism',
    subtitle: 'Randomized 1–60 Examination · 60 Minutes · Module 2 Comprehensive Pool (120 Items)',
    durationSeconds: 3600,
    questionCount: 60,
    topics: [
      '7.1 (2.1) Knowledge and Teaching Skills',
      '7.2 (2.2) Communication Skills',
      '7.3 (2.3) Classroom Management',
      '7.4 (2.4) Teaching Confidence',
      '7.5 (2.5) Professionalism'
    ],
    getPool: () =>
      RAW_DATA.E.b.map((item, idx) => {
        const meta = getTopicForExamB(idx);
        return {
          ref: `b:${idx}`,
          question: item[0],
          options: item[1],
          correctIndex: item[2],
          topicTag: meta.topicTag,
          moduleRef: meta.moduleRef
        };
      })
  },
  3: {
    id: 3,
    code: 'EXAM 3',
    shortTitle: 'EXAM 3 - All Modules Comprehensive Assessment (1–60 Randomized)',
    fullTitle: 'EXAM 3 - ALL Modules Comprehensive Licensure Benchmark (Module 1 & Module 2)',
    subtitle: 'Randomized 1–60 Examination · 60 Minutes · Full 240-Item Institutional Question Bank',
    durationSeconds: 3600,
    questionCount: 60,
    topics: [
      'Module 1: Teaching Methods (CLT, GTM, Direct Method, TBLT)',
      '7.1 (2.1) Knowledge and Teaching Skills',
      '7.2 (2.2) Communication Skills',
      '7.3 (2.3) Classroom Management',
      '7.4 (2.4) Teaching Confidence',
      '7.5 (2.5) Professionalism'
    ],
    getPool: () => [
      ...EXAMS_CONFIG[1].getPool(),
      ...EXAMS_CONFIG[2].getPool()
    ]
  }
};

export function getExamQuestionByRef(ref: string) {
  const [bank, idxStr] = ref.split(':');
  const idx = parseInt(idxStr, 10);
  if (bank === 'a') {
    const item = RAW_DATA.E.a[idx];
    const meta = getTopicForExamA(idx);
    return {
      ref,
      question: item[0],
      options: item[1],
      correctIndex: item[2],
      topicTag: meta.topicTag,
      moduleRef: meta.moduleRef
    };
  } else {
    const item = RAW_DATA.E.b[idx];
    const meta = getTopicForExamB(idx);
    return {
      ref,
      question: item[0],
      options: item[1],
      correctIndex: item[2],
      topicTag: meta.topicTag,
      moduleRef: meta.moduleRef
    };
  }
}
