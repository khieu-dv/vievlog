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
        // Grammar Questions
        {
            id: 1,
            category: 'Grammar',
            difficulty: 'easy',
            question: 'Choose the correct form: I ___ to school every day.',
            options: ['go', 'goes', 'going', 'went'],
            correctAnswer: 0,
            explanation: 'Use "go" with "I" in present simple tense.',
            points: 10
        },
        {
            id: 2,
            category: 'Grammar',
            difficulty: 'easy',
            question: 'What is the past tense of "eat"?',
            options: ['eated', 'ate', 'eaten', 'eating'],
            correctAnswer: 1,
            explanation: '"Ate" is the simple past tense of "eat".',
            points: 10
        },
        {
            id: 3,
            category: 'Grammar',
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
            category: 'Grammar',
            difficulty: 'hard',
            question: 'If I ___ you, I would accept that job offer.',
            options: ['am', 'was', 'were', 'will be'],
            correctAnswer: 2,
            explanation: 'In second conditional, use "were" for all persons after "if".',
            points: 20
        },

        // Vocabulary Questions
        {
            id: 5,
            category: 'Vocabulary',
            difficulty: 'easy',
            question: 'What does "happy" mean?',
            options: ['Sad', 'Angry', 'Joyful', 'Tired'],
            correctAnswer: 2,
            explanation: '"Happy" means feeling joyful or pleased.',
            points: 10
        },
        {
            id: 6,
            category: 'Vocabulary',
            difficulty: 'easy',
            question: 'Choose the opposite of "big":',
            options: ['Large', 'Huge', 'Small', 'Tall'],
            correctAnswer: 2,
            explanation: '"Small" is the opposite of "big".',
            points: 10
        },
        {
            id: 7,
            category: 'Vocabulary',
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
            category: 'Vocabulary',
            difficulty: 'hard',
            question: 'Choose the word that means "existing everywhere":',
            options: ['Ubiquitous', 'Rare', 'Temporary', 'Limited'],
            correctAnswer: 0,
            explanation: 'Ubiquitous means existing or being everywhere.',
            points: 20
        },

        // Reading Comprehension
        {
            id: 9,
            category: 'Reading',
            difficulty: 'medium',
            question: 'The cat sat on the mat. Where was the cat?',
            options: ['On the chair', 'On the mat', 'Under the table', 'In the box'],
            correctAnswer: 1,
            explanation: 'The text clearly states the cat sat on the mat.',
            points: 15
        },
        {
            id: 10,
            category: 'Reading',
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
            category: 'Grammar',
            difficulty: 'easy',
            question: 'Choose the correct article: ___ apple is red.',
            options: ['A', 'An', 'The', 'No article'],
            correctAnswer: 1,
            explanation: 'Use "an" before words starting with vowel sounds.',
            points: 10
        },
        {
            id: 12,
            category: 'Vocabulary',
            difficulty: 'medium',
            question: 'What does "abundant" mean?',
            options: ['Scarce', 'Plentiful', 'Empty', 'Broken'],
            correctAnswer: 1,
            explanation: 'Abundant means existing in large quantities; plentiful.',
            points: 15
        },
        {
            id: 13,
            category: 'Grammar',
            difficulty: 'medium',
            question: 'Choose the correct form: She ___ here since 2020.',
            options: ['lives', 'lived', 'has lived', 'is living'],
            correctAnswer: 2,
            explanation: 'Present perfect with "since" shows an action continuing from past to present.',
            points: 15
        },
        {
            id: 14,
            category: 'Vocabulary',
            difficulty: 'hard',
            question: 'Choose the word meaning "to make less severe":',
            options: ['Aggravate', 'Mitigate', 'Complicate', 'Intensify'],
            correctAnswer: 1,
            explanation: 'Mitigate means to make less severe or serious.',
            points: 20
        },
        {
            id: 15,
            category: 'Grammar',
            difficulty: 'hard',
            question: 'By next year, I ___ learning English for 5 years.',
            options: ['will learn', 'will be learning', 'will have learned', 'will have been learning'],
            correctAnswer: 3,
            explanation: 'Future perfect continuous shows duration up to a future point.',
            points: 20
        }
    ];

    getRandomQuestion(difficulty?: 'easy' | 'medium' | 'hard'): Question {
        let filteredQuestions = this.questions;
        
        if (difficulty) {
            filteredQuestions = this.questions.filter(q => q.difficulty === difficulty);
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