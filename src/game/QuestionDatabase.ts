import { englishQuestions } from './questions/english-questions';
import { itQuestions } from './questions/it-questions';
import { koreanQuestions } from './questions/korean-questions';

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
    private questions: Question[] = [];

    constructor() {
        // Load all questions from separate category files
        this.loadQuestions();
    }

    private loadQuestions(): void {
        // Combine all questions from different categories
        this.questions = [
            ...englishQuestions,
            ...itQuestions,
            ...koreanQuestions
        ];
        
        console.log('Loaded questions:', {
            English: englishQuestions.length,
            IT: itQuestions.length,
            Korean: koreanQuestions.length,
            Total: this.questions.length
        });
    }

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

    // Get questions by difficulty level
    getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
        return this.questions.filter(q => q.difficulty === difficulty);
    }

    // Get total number of questions
    getTotalQuestions(): number {
        return this.questions.length;
    }

    // Get questions count by category
    getQuestionCountByCategory(): { [category: string]: number } {
        const counts: { [category: string]: number } = {};
        this.questions.forEach(q => {
            counts[q.category] = (counts[q.category] || 0) + 1;
        });
        return counts;
    }

    // Get questions count by difficulty
    getQuestionCountByDifficulty(): { [difficulty: string]: number } {
        const counts: { [difficulty: string]: number } = {};
        this.questions.forEach(q => {
            counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
        });
        return counts;
    }
}

export const questionDatabase = new QuestionDatabase();