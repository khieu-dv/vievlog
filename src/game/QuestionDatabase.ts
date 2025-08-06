export type Question = {
    id: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    explanation?: string;
    points: number;
}

export class QuestionDatabase {
    private questions: Question[] = [
        // English Questions
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
            id: 4,
            category: 'English',
            difficulty: 'hard',
            question: 'If I ___ you, I would accept that job offer.',
            options: ['am', 'was', 'were', 'will be'],
            correctAnswer: 2,
            explanation: 'In second conditional, use "were" for all persons after "if".',
            points: 20
        },

        // English Questions (continued)
        {
            id: 5,
            category: 'English',
            difficulty: 'easy',
            question: 'What does "happy" mean?',
            options: ['Sad', 'Angry', 'Joyful', 'Tired'],
            correctAnswer: 2,
            explanation: '"Happy" means feeling joyful or pleased.',
            points: 10
        },
        {
            id: 6,
            category: 'English',
            difficulty: 'easy',
            question: 'Choose the opposite of "big":',
            options: ['Large', 'Huge', 'Small', 'Tall'],
            correctAnswer: 2,
            explanation: '"Small" is the opposite of "big".',
            points: 10
        },
        {
            id: 7,
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
            id: 8,
            category: 'English',
            difficulty: 'hard',
            question: 'Choose the word that means "existing everywhere":',
            options: ['Ubiquitous', 'Rare', 'Temporary', 'Limited'],
            correctAnswer: 0,
            explanation: 'Ubiquitous means existing or being everywhere.',
            points: 20
        },

        // English Questions (continued)
        {
            id: 9,
            category: 'English',
            difficulty: 'medium',
            question: 'The cat sat on the mat. Where was the cat?',
            options: ['On the chair', 'On the mat', 'Under the table', 'In the box'],
            correctAnswer: 1,
            explanation: 'The text clearly states the cat sat on the mat.',
            points: 15
        },
        {
            id: 10,
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

        // More questions for variety
        {
            id: 11,
            category: 'English',
            difficulty: 'easy',
            question: 'Choose the correct article: ___ apple is red.',
            options: ['A', 'An', 'The', 'No article'],
            correctAnswer: 1,
            explanation: 'Use "an" before words starting with vowel sounds.',
            points: 10
        },
        {
            id: 12,
            category: 'English',
            difficulty: 'medium',
            question: 'What does "abundant" mean?',
            options: ['Scarce', 'Plentiful', 'Empty', 'Broken'],
            correctAnswer: 1,
            explanation: 'Abundant means existing in large quantities; plentiful.',
            points: 15
        },
        {
            id: 13,
            category: 'English',
            difficulty: 'medium',
            question: 'Choose the correct form: She ___ here since 2020.',
            options: ['lives', 'lived', 'has lived', 'is living'],
            correctAnswer: 2,
            explanation: 'Present perfect with "since" shows an action continuing from past to present.',
            points: 15
        },
        {
            id: 14,
            category: 'English',
            difficulty: 'hard',
            question: 'Choose the word meaning "to make less severe":',
            options: ['Aggravate', 'Mitigate', 'Complicate', 'Intensify'],
            correctAnswer: 1,
            explanation: 'Mitigate means to make less severe or serious.',
            points: 20
        },
        {
            id: 15,
            category: 'English',
            difficulty: 'hard',
            question: 'By next year, I ___ learning English for 5 years.',
            options: ['will learn', 'will be learning', 'will have learned', 'will have been learning'],
            correctAnswer: 3,
            explanation: 'Future perfect continuous shows duration up to a future point.',
            points: 20
        },

        // IT Questions - Easy
        {
            id: 16,
            category: 'IT',
            difficulty: 'easy',
            question: 'What does "HTML" stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'],
            correctAnswer: 0,
            explanation: 'HTML stands for HyperText Markup Language, used for creating web pages.',
            points: 10
        },
        {
            id: 17,
            category: 'IT',
            difficulty: 'easy',
            question: 'Which of these is a programming language?',
            options: ['Microsoft Word', 'Python', 'Adobe Photoshop', 'Google Chrome'],
            correctAnswer: 1,
            explanation: 'Python is a popular programming language used for various applications.',
            points: 10
        },
        {
            id: 18,
            category: 'IT',
            difficulty: 'easy',
            question: 'What does "CPU" stand for?',
            options: ['Computer Personal Unit', 'Central Processing Unit', 'Central Program Unit', 'Computer Processing Unit'],
            correctAnswer: 1,
            explanation: 'CPU stands for Central Processing Unit, the main processor of a computer.',
            points: 10
        },

        // IT Questions - Medium
        {
            id: 19,
            category: 'IT',
            difficulty: 'medium',
            question: 'In object-oriented programming, what is inheritance?',
            options: [
                'Creating new variables',
                'A way for classes to acquire properties from parent classes',
                'Deleting unused code',
                'Running multiple programs simultaneously'
            ],
            correctAnswer: 1,
            explanation: 'Inheritance allows a class to inherit properties and methods from another class.',
            points: 15
        },
        {
            id: 20,
            category: 'IT',
            difficulty: 'medium',
            question: 'What is the purpose of a database index?',
            options: [
                'To store backup data',
                'To improve query performance',
                'To encrypt sensitive data',
                'To compress database files'
            ],
            correctAnswer: 1,
            explanation: 'Database indexes improve query performance by creating faster data access paths.',
            points: 15
        },
        {
            id: 21,
            category: 'IT',
            difficulty: 'medium',
            question: 'Which HTTP status code indicates "Not Found"?',
            options: ['200', '301', '404', '500'],
            correctAnswer: 2,
            explanation: 'HTTP status code 404 indicates that the requested resource was not found.',
            points: 15
        },

        // IT Questions - Hard
        {
            id: 22,
            category: 'IT',
            difficulty: 'hard',
            question: 'In computer science, what is the time complexity of binary search?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 1,
            explanation: 'Binary search has O(log n) time complexity because it eliminates half the search space each iteration.',
            points: 20
        },
        {
            id: 23,
            category: 'IT',
            difficulty: 'hard',
            question: 'What is a race condition in concurrent programming?',
            options: [
                'When programs run too slowly',
                'When multiple threads access shared data simultaneously causing unpredictable results',
                'When a program crashes due to memory issues',
                'When code is executed in the wrong order'
            ],
            correctAnswer: 1,
            explanation: 'A race condition occurs when multiple threads access shared resources simultaneously, causing unpredictable behavior.',
            points: 20
        },
        {
            id: 24,
            category: 'IT',
            difficulty: 'hard',
            question: 'In microservices architecture, what is the purpose of an API Gateway?',
            options: [
                'To store application data',
                'To provide a single entry point and handle cross-cutting concerns',
                'To compile source code',
                'To monitor system performance only'
            ],
            correctAnswer: 1,
            explanation: 'An API Gateway serves as a single entry point and handles cross-cutting concerns like authentication, routing, and rate limiting.',
            points: 20
        },

        // Korean Questions - Easy
        {
            id: 25,
            category: 'Korean',
            difficulty: 'easy',
            question: 'How do you say "Hello" in Korean?',
            options: ['안녕하세요 (Annyeonghaseyo)', '감사합니다 (Gamsahamnida)', '죄송합니다 (Joesonghamnida)', '안녕히 가세요 (Annyeonghi gaseyo)'],
            correctAnswer: 0,
            explanation: '안녕하세요 (Annyeonghaseyo) is the polite way to say "Hello" in Korean.',
            points: 10
        },
        {
            id: 26,
            category: 'Korean',
            difficulty: 'easy',
            question: 'What does "감사합니다" (Gamsahamnida) mean?',
            options: ['Hello', 'Thank you', 'Goodbye', 'Excuse me'],
            correctAnswer: 1,
            explanation: '감사합니다 (Gamsahamnida) means "Thank you" in Korean.',
            points: 10
        },
        {
            id: 27,
            category: 'Korean',
            difficulty: 'easy',
            question: 'How do you say "Yes" in Korean?',
            options: ['아니요 (Aniyo)', '네 (Ne)', '모르겠어요 (Moreugesseoyo)', '괜찮아요 (Gwaenchanayo)'],
            correctAnswer: 1,
            explanation: '네 (Ne) means "Yes" in Korean.',
            points: 10
        },

        // Korean Questions - Medium
        {
            id: 28,
            category: 'Korean',
            difficulty: 'medium',
            question: 'Which particle is used to mark the subject in Korean?',
            options: ['을/를', '이/가', '에서', '와/과'],
            correctAnswer: 1,
            explanation: '이/가 particles are used to mark the subject in Korean sentences.',
            points: 15
        },
        {
            id: 29,
            category: 'Korean',
            difficulty: 'medium',
            question: 'What is the Korean word for "student"?',
            options: ['선생님 (Seonsaengnim)', '학생 (Haksaeng)', '학교 (Hakgyo)', '공부 (Gongbu)'],
            correctAnswer: 1,
            explanation: '학생 (Haksaeng) means "student" in Korean.',
            points: 15
        },
        {
            id: 30,
            category: 'Korean',
            difficulty: 'medium',
            question: 'How do you say "I am studying Korean" in Korean?',
            options: [
                '한국어를 공부해요 (Hangugeo-reul gongbuhaeyo)',
                '한국어가 좋아요 (Hangugeo-ga johayo)',
                '한국어를 먹어요 (Hangugeo-reul meogeoyo)',
                '한국어에서 와요 (Hangugeo-eseo wayo)'
            ],
            correctAnswer: 0,
            explanation: '한국어를 공부해요 means "I am studying Korean" using the correct verb and particle.',
            points: 15
        },

        // Korean Questions - Hard
        {
            id: 31,
            category: 'Korean',
            difficulty: 'hard',
            question: 'What is the difference between 있어요 and 계세요?',
            options: [
                'No difference, they mean the same thing',
                '있어요 is informal, 계세요 is formal for people',
                '있어요 is for objects, 계세요 is the honorific form for people',
                '있어요 is past tense, 계세요 is present tense'
            ],
            correctAnswer: 2,
            explanation: '있어요 is used for objects or informal situations, while 계세요 is the honorific form used for people you respect.',
            points: 20
        },
        {
            id: 32,
            category: 'Korean',
            difficulty: 'hard',
            question: 'Which grammar pattern expresses "even though" or "despite"?',
            options: ['-아/어도', '-기 때문에', '-면서', '-거나'],
            correctAnswer: 0,
            explanation: '-아/어도 is used to express "even though" or "despite" in Korean.',
            points: 20
        },
        {
            id: 33,
            category: 'Korean',
            difficulty: 'hard',
            question: 'What does the grammar pattern "-으ㄹ/ㄹ 것 같다" express?',
            options: [
                'Certainty about future events',
                'Past completed actions',
                'Probability or conjecture',
                'Commands or requests'
            ],
            correctAnswer: 2,
            explanation: '-(으)ㄹ 것 같다 expresses probability, conjecture, or "it seems like" in Korean.',
            points: 20
        }
    ];

    getRandomQuestion(difficulty?: 'easy' | 'medium' | 'hard', category?: string): Question {
        let filteredQuestions = this.questions;
        
        if (category) {
            filteredQuestions = filteredQuestions.filter(q => q.category === category);
        }
        
        if (difficulty) {
            filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
        }
        
        if (filteredQuestions.length === 0) {
            // Fallback to any question if no matches found
            filteredQuestions = this.questions;
        }
        
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        return filteredQuestions[randomIndex];
    }

    getQuestionsByCategory(category: string): Question[] {
        return this.questions.filter(q => q.category === category);
    }

    getQuestionById(id: number): Question | undefined {
        return this.questions.find(q => q.id === id);
    }

    getAllCategories(): string[] {
        return [...new Set(this.questions.map(q => q.category))];
    }

    getDifficultyBasedOnScore(score: number): 'easy' | 'medium' | 'hard' {
        if (score < 50) return 'easy';
        if (score < 150) return 'medium';
        return 'hard';
    }
}

export const questionDatabase = new QuestionDatabase();