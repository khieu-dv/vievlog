import { Question } from '../QuestionDatabase';

export const englishQuestions: Question[] = [
    // Easy Questions (1-20)
    {
        id: 1,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: I ___ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 0,
        explanation: 'Use "go" with "I" in present simple tense.',
        points: 10
    },
    {
        id: 2,
        category: 'English',
        difficulty: 'easy',
        question: 'What is the past tense of "eat"?',
        options: ['eated', 'ate', 'eaten', 'eating'],
        correctAnswer: 1,
        explanation: '"Ate" is the simple past tense of "eat".',
        points: 10
    },
    {
        id: 3,
        category: 'English',
        difficulty: 'easy',
        question: 'What does "happy" mean?',
        options: ['Sad', 'Angry', 'Joyful', 'Tired'],
        correctAnswer: 2,
        explanation: '"Happy" means feeling joyful or pleased.',
        points: 10
    },
    {
        id: 4,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the opposite of "big":',
        options: ['Large', 'Huge', 'Small', 'Tall'],
        correctAnswer: 2,
        explanation: '"Small" is the opposite of "big".',
        points: 10
    },
    {
        id: 5,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct article: ___ apple is red.',
        options: ['A', 'An', 'The', 'No article'],
        correctAnswer: 1,
        explanation: 'Use "an" before words starting with vowel sounds.',
        points: 10
    },
    {
        id: 6,
        category: 'English',
        difficulty: 'easy',
        question: 'What is the plural of "child"?',
        options: ['childs', 'children', 'childes', 'child'],
        correctAnswer: 1,
        explanation: '"Children" is the irregular plural form of "child".',
        points: 10
    },
    {
        id: 7,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct pronoun: ___ is my friend.',
        options: ['Him', 'Her', 'She', 'Them'],
        correctAnswer: 2,
        explanation: '"She" is the correct subject pronoun.',
        points: 10
    },
    {
        id: 8,
        category: 'English',
        difficulty: 'easy',
        question: 'What does "run" mean?',
        options: ['To walk slowly', 'To move quickly on foot', 'To sit down', 'To sleep'],
        correctAnswer: 1,
        explanation: '"Run" means to move quickly on foot.',
        points: 10
    },
    {
        id: 9,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: They ___ playing football.',
        options: ['is', 'am', 'are', 'be'],
        correctAnswer: 2,
        explanation: 'Use "are" with "they" in present continuous.',
        points: 10
    },
    {
        id: 10,
        category: 'English',
        difficulty: 'easy',
        question: 'What is the opposite of "hot"?',
        options: ['Warm', 'Cool', 'Cold', 'Freezing'],
        correctAnswer: 2,
        explanation: '"Cold" is the most common opposite of "hot".',
        points: 10
    },
    {
        id: 11,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: She ___ a book yesterday.',
        options: ['read', 'reads', 'reading', 'readed'],
        correctAnswer: 0,
        explanation: '"Read" (pronounced "red") is the past tense of "read".',
        points: 10
    },
    {
        id: 12,
        category: 'English',
        difficulty: 'easy',
        question: 'What does "dog" refer to?',
        options: ['A bird', 'A fish', 'An animal', 'A plant'],
        correctAnswer: 2,
        explanation: 'A dog is a type of animal, specifically a mammal.',
        points: 10
    },
    {
        id: 13,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: I ___ hungry.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 0,
        explanation: 'Use "am" with "I".',
        points: 10
    },
    {
        id: 14,
        category: 'English',
        difficulty: 'easy',
        question: 'What is the past tense of "go"?',
        options: ['goed', 'went', 'gone', 'going'],
        correctAnswer: 1,
        explanation: '"Went" is the irregular past tense of "go".',
        points: 10
    },
    {
        id: 15,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: The cat ___ on the mat.',
        options: ['sit', 'sits', 'sitting', 'sat'],
        correctAnswer: 1,
        explanation: 'Use "sits" for third person singular present tense.',
        points: 10
    },
    {
        id: 16,
        category: 'English',
        difficulty: 'easy',
        question: 'What does "book" mean?',
        options: ['A chair', 'Something to read', 'A color', 'Food'],
        correctAnswer: 1,
        explanation: 'A book is something you read, containing pages with text.',
        points: 10
    },
    {
        id: 17,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: We ___ to the park.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 0,
        explanation: 'Use "go" with "we" in present simple.',
        points: 10
    },
    {
        id: 18,
        category: 'English',
        difficulty: 'easy',
        question: 'What is the opposite of "up"?',
        options: ['Over', 'Under', 'Down', 'Around'],
        correctAnswer: 2,
        explanation: '"Down" is the opposite direction of "up".',
        points: 10
    },
    {
        id: 19,
        category: 'English',
        difficulty: 'easy',
        question: 'Choose the correct form: He ___ a car.',
        options: ['have', 'has', 'having', 'had'],
        correctAnswer: 1,
        explanation: 'Use "has" with "he" in present simple.',
        points: 10
    },
    {
        id: 20,
        category: 'English',
        difficulty: 'easy',
        question: 'What does "water" refer to?',
        options: ['A liquid we drink', 'A solid object', 'A color', 'An emotion'],
        correctAnswer: 0,
        explanation: 'Water is a liquid that we drink and is essential for life.',
        points: 10
    },

    // Medium Questions (21-35)
    {
        id: 21,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct sentence:',
        options: [
            'She have been studying for 2 hours.',
            'She has been studying for 2 hours.',
            'She had been studying for 2 hours.',
            'She is been studying for 2 hours.'
        ],
        correctAnswer: 1,
        explanation: 'Present perfect continuous uses "has/have been + verb-ing".',
        points: 15
    },
    {
        id: 22,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "procrastinate" mean?',
        options: [
            'To finish early',
            'To delay or postpone',
            'To work quickly',
            'To organize well'
        ],
        correctAnswer: 1,
        explanation: 'Procrastinate means to delay or postpone something.',
        points: 15
    },
    {
        id: 23,
        category: 'English',
        difficulty: 'medium',
        question: 'The cat sat on the mat. Where was the cat?',
        options: ['On the chair', 'On the mat', 'Under the table', 'In the box'],
        correctAnswer: 1,
        explanation: 'The text clearly states the cat sat on the mat.',
        points: 15
    },
    {
        id: 24,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "abundant" mean?',
        options: ['Scarce', 'Plentiful', 'Empty', 'Broken'],
        correctAnswer: 1,
        explanation: 'Abundant means existing in large quantities; plentiful.',
        points: 15
    },
    {
        id: 25,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct form: She ___ here since 2020.',
        options: ['lives', 'lived', 'has lived', 'is living'],
        correctAnswer: 2,
        explanation: 'Present perfect with "since" shows an action continuing from past to present.',
        points: 15
    },
    {
        id: 26,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "generous" mean?',
        options: ['Selfish', 'Giving and kind', 'Angry', 'Lazy'],
        correctAnswer: 1,
        explanation: 'Generous means giving freely and being kind to others.',
        points: 15
    },
    {
        id: 27,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct passive form: The book ___ by millions.',
        options: ['reads', 'is read', 'was reading', 'has read'],
        correctAnswer: 1,
        explanation: 'Passive voice uses "is/are + past participle".',
        points: 15
    },
    {
        id: 28,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "diligent" mean?',
        options: ['Lazy', 'Hardworking and careful', 'Careless', 'Slow'],
        correctAnswer: 1,
        explanation: 'Diligent means showing care and effort in work.',
        points: 15
    },
    {
        id: 29,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct form: If it ___ tomorrow, we will stay home.',
        options: ['rain', 'rains', 'rained', 'raining'],
        correctAnswer: 1,
        explanation: 'In first conditional, use present simple after "if".',
        points: 15
    },
    {
        id: 30,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "meticulous" mean?',
        options: ['Careless', 'Very careful and precise', 'Fast', 'Loud'],
        correctAnswer: 1,
        explanation: 'Meticulous means showing great attention to detail.',
        points: 15
    },
    {
        id: 31,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct reported speech: He said, "I am tired."',
        options: ['He said he is tired.', 'He said he was tired.', 'He said he will be tired.', 'He said he has been tired.'],
        correctAnswer: 1,
        explanation: 'In reported speech, present tense changes to past tense.',
        points: 15
    },
    {
        id: 32,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "persistent" mean?',
        options: ['Giving up easily', 'Continuing despite difficulties', 'Being quiet', 'Moving slowly'],
        correctAnswer: 1,
        explanation: 'Persistent means continuing firmly despite difficulties.',
        points: 15
    },
    {
        id: 33,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct form: I wish I ___ speak French.',
        options: ['can', 'could', 'will', 'would'],
        correctAnswer: 1,
        explanation: 'Use "could" after "wish" for present unreal situations.',
        points: 15
    },
    {
        id: 34,
        category: 'English',
        difficulty: 'medium',
        question: 'What does "comprehensive" mean?',
        options: ['Incomplete', 'Complete and thorough', 'Simple', 'Confusing'],
        correctAnswer: 1,
        explanation: 'Comprehensive means complete and including everything.',
        points: 15
    },
    {
        id: 35,
        category: 'English',
        difficulty: 'medium',
        question: 'Choose the correct form: She made me ___ the dishes.',
        options: ['wash', 'to wash', 'washing', 'washed'],
        correctAnswer: 0,
        explanation: 'After "make someone", use the base form of the verb.',
        points: 15
    },

    // Hard Questions (36-50)
    {
        id: 36,
        category: 'English',
        difficulty: 'hard',
        question: 'If I ___ you, I would accept that job offer.',
        options: ['am', 'was', 'were', 'will be'],
        correctAnswer: 2,
        explanation: 'In second conditional, use "were" for all persons after "if".',
        points: 20
    },
    {
        id: 37,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the word that means "existing everywhere":',
        options: ['Ubiquitous', 'Rare', 'Temporary', 'Limited'],
        correctAnswer: 0,
        explanation: 'Ubiquitous means existing or being everywhere.',
        points: 20
    },
    {
        id: 38,
        category: 'English',
        difficulty: 'hard',
        question: 'John works diligently but struggles with complex tasks. What can we infer about John?',
        options: [
            'He is lazy',
            'He is hardworking but finds difficult tasks challenging',
            'He never completes his work',
            'He only does easy tasks'
        ],
        correctAnswer: 1,
        explanation: '"Diligently" shows he works hard, "struggles" shows difficulty with complex tasks.',
        points: 20
    },
    {
        id: 39,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the word meaning "to make less severe":',
        options: ['Aggravate', 'Mitigate', 'Complicate', 'Intensify'],
        correctAnswer: 1,
        explanation: 'Mitigate means to make less severe or serious.',
        points: 20
    },
    {
        id: 40,
        category: 'English',
        difficulty: 'hard',
        question: 'By next year, I ___ learning English for 5 years.',
        options: ['will learn', 'will be learning', 'will have learned', 'will have been learning'],
        correctAnswer: 3,
        explanation: 'Future perfect continuous shows duration up to a future point.',
        points: 20
    },
    {
        id: 41,
        category: 'English',
        difficulty: 'hard',
        question: 'What does "quintessential" mean?',
        options: ['Ordinary', 'Representing the most perfect example', 'Confusing', 'Temporary'],
        correctAnswer: 1,
        explanation: 'Quintessential means representing the most perfect or typical example.',
        points: 20
    },
    {
        id: 42,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the correct form: Not only ___ he intelligent, but he is also kind.',
        options: ['is', 'was', 'does', 'has'],
        correctAnswer: 0,
        explanation: 'In "not only... but also" constructions with inversion, use "is".',
        points: 20
    },
    {
        id: 43,
        category: 'English',
        difficulty: 'hard',
        question: 'What does "surreptitious" mean?',
        options: ['Open and honest', 'Done secretly', 'Very loud', 'Extremely fast'],
        correctAnswer: 1,
        explanation: 'Surreptitious means done secretly or stealthily.',
        points: 20
    },
    {
        id: 44,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the word meaning "using few words":',
        options: ['Verbose', 'Laconic', 'Eloquent', 'Garrulous'],
        correctAnswer: 1,
        explanation: 'Laconic means using very few words; concise.',
        points: 20
    },
    {
        id: 45,
        category: 'English',
        difficulty: 'hard',
        question: 'What does "perspicacious" mean?',
        options: ['Confused', 'Having keen insight', 'Very tired', 'Extremely tall'],
        correctAnswer: 1,
        explanation: 'Perspicacious means having a ready insight into things; shrewd.',
        points: 20
    },
    {
        id: 46,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the correct form: Had I known earlier, I ___ differently.',
        options: ['act', 'acted', 'would act', 'would have acted'],
        correctAnswer: 3,
        explanation: 'Third conditional with inversion uses "would have + past participle".',
        points: 20
    },
    {
        id: 47,
        category: 'English',
        difficulty: 'hard',
        question: 'What does "ephemeral" mean?',
        options: ['Lasting forever', 'Very short-lived', 'Extremely heavy', 'Perfectly round'],
        correctAnswer: 1,
        explanation: 'Ephemeral means lasting for a very short time.',
        points: 20
    },
    {
        id: 48,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the word meaning "showing deep respect":',
        options: ['Irreverent', 'Reverent', 'Indifferent', 'Hostile'],
        correctAnswer: 1,
        explanation: 'Reverent means feeling or showing deep respect.',
        points: 20
    },
    {
        id: 49,
        category: 'English',
        difficulty: 'hard',
        question: 'What does "pusillanimous" mean?',
        options: ['Very brave', 'Showing lack of courage', 'Extremely intelligent', 'Very generous'],
        correctAnswer: 1,
        explanation: 'Pusillanimous means showing lack of courage or determination.',
        points: 20
    },
    {
        id: 50,
        category: 'English',
        difficulty: 'hard',
        question: 'Choose the correct form: Scarcely ___ the meeting started when the fire alarm rang.',
        options: ['has', 'had', 'have', 'was'],
        correctAnswer: 1,
        explanation: 'After "scarcely" in inversion, use "had" for past perfect.',
        points: 20
    }
];