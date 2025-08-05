import * as Phaser from "phaser";
import { Question } from "./QuestionDatabase";

export type PlayerStats = {
    totalScore: number;
    questionsAnswered: number;
    correctAnswers: number;
    wrongAnswers: number;
    streak: number;
    maxStreak: number;
    botsDefeated: number;
    level: number;
    experience: number;
    categoryStats: Record<string, { correct: number; total: number }>;
}

export class ScoreSystem {
    private scene: Phaser.Scene;
    private scoreUI!: Phaser.GameObjects.Container;
    private scoreText!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private streakText!: Phaser.GameObjects.Text;
    private expBar!: Phaser.GameObjects.Graphics;
    private expText!: Phaser.GameObjects.Text;
    
    private stats: PlayerStats = {
        totalScore: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        streak: 0,
        maxStreak: 0,
        botsDefeated: 0,
        level: 1,
        experience: 0,
        categoryStats: {}
    };

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createScoreUI();
        this.loadStats();
    }

    private createScoreUI(): void {
        this.scoreUI = this.scene.add.container(10, 10);
        this.scoreUI.setDepth(999);

        // Background panel
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x2c3e50, 0.9);
        bg.fillRoundedRect(0, 0, 300, 120, 8);
        bg.lineStyle(2, 0x3498db, 1);
        bg.strokeRoundedRect(0, 0, 300, 120, 8);
        this.scoreUI.add(bg);

        // Title
        const titleText = this.scene.add.text(150, 15, '🎓 English Champion Stats', {
            fontSize: '16px',
            color: '#f39c12',
            fontStyle: 'bold'
        });
        titleText.setOrigin(0.5, 0);
        this.scoreUI.add(titleText);

        // Score
        this.scoreText = this.scene.add.text(15, 40, 'Score: 0', {
            fontSize: '14px',
            color: '#e74c3c',
            fontStyle: 'bold'
        });
        this.scoreUI.add(this.scoreText);

        // Level
        this.levelText = this.scene.add.text(15, 60, 'Level: 1', {
            fontSize: '14px',
            color: '#9b59b6'
        });
        this.scoreUI.add(this.levelText);

        // Streak
        this.streakText = this.scene.add.text(15, 80, 'Streak: 0', {
            fontSize: '14px',
            color: '#f39c12'
        });
        this.scoreUI.add(this.streakText);

        // Experience bar
        this.expBar = this.scene.add.graphics();
        this.scoreUI.add(this.expBar);

        // Experience text
        this.expText = this.scene.add.text(150, 100, 'EXP: 0/100', {
            fontSize: '12px',
            color: '#95a5a6'
        });
        this.expText.setOrigin(0.5, 0);
        this.scoreUI.add(this.expText);

        this.updateScoreDisplay();
    }

    private updateScoreDisplay(): void {
        this.scoreText.setText(`Score: ${this.stats.totalScore}`);
        this.levelText.setText(`Level: ${this.stats.level}`);
        this.streakText.setText(`Streak: ${this.stats.streak} 🔥`);
        
        // Update experience bar
        const expToNext = this.getExpRequiredForLevel(this.stats.level + 1);
        const expForCurrent = this.getExpRequiredForLevel(this.stats.level);
        const currentLevelExp = this.stats.experience - expForCurrent;
        const requiredExp = expToNext - expForCurrent;
        const expPercent = Math.min(currentLevelExp / requiredExp, 1);

        this.expBar.clear();
        // Background
        this.expBar.fillStyle(0x34495e);
        this.expBar.fillRoundedRect(15, 100, 270, 8, 4);
        // Progress
        this.expBar.fillStyle(0x3498db);
        this.expBar.fillRoundedRect(15, 100, 270 * expPercent, 8, 4);
        // Border
        this.expBar.lineStyle(1, 0x95a5a6);
        this.expBar.strokeRoundedRect(15, 100, 270, 8, 4);

        this.expText.setText(`EXP: ${currentLevelExp}/${requiredExp}`);
    }

    private getExpRequiredForLevel(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    addScore(points: number, question: Question, isCorrect: boolean): void {
        // Update question stats
        this.stats.questionsAnswered++;
        
        if (isCorrect) {
            this.stats.correctAnswers++;
            this.stats.streak++;
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.streak);
            
            // Apply streak multiplier
            let multiplier = 1;
            if (this.stats.streak >= 5) multiplier = 1.5;
            if (this.stats.streak >= 10) multiplier = 2;
            if (this.stats.streak >= 20) multiplier = 3;
            
            const finalPoints = Math.floor(points * multiplier);
            this.stats.totalScore += finalPoints;
            this.stats.experience += finalPoints;
            
            // Show score popup
            this.showScorePopup(finalPoints, multiplier > 1 ? `${multiplier}x Streak Bonus!` : '');
            
        } else {
            this.stats.wrongAnswers++;
            this.stats.streak = 0;
            this.showScorePopup(0, 'Try again!');
        }

        // Update category stats
        if (!this.stats.categoryStats[question.category]) {
            this.stats.categoryStats[question.category] = { correct: 0, total: 0 };
        }
        this.stats.categoryStats[question.category].total++;
        if (isCorrect) {
            this.stats.categoryStats[question.category].correct++;
        }

        // Check for level up
        this.checkLevelUp();
        
        // Update display
        this.updateScoreDisplay();
        
        // Save stats
        this.saveStats();
    }

    addBotDefeatBonus(): void {
        this.stats.botsDefeated++;
        const bonus = 5 + (this.stats.level * 2);
        this.stats.totalScore += bonus;
        this.stats.experience += bonus;
        
        this.showScorePopup(bonus, 'Bot defeated!');
        this.updateScoreDisplay();
        this.saveStats();
    }

    private showScorePopup(points: number, message: string): void {
        const popup = this.scene.add.container(this.scene.scale.width / 2, 100);
        popup.setDepth(1001);

        const bg = this.scene.add.graphics();
        bg.fillStyle(points > 0 ? 0x27ae60 : 0xe74c3c, 0.9);
        bg.fillRoundedRect(-80, -20, 160, 40, 20);
        popup.add(bg);

        const pointsText = points > 0 ? `+${points}` : '0';
        const scoreText = this.scene.add.text(0, -5, pointsText, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        scoreText.setOrigin(0.5);
        popup.add(scoreText);

        if (message) {
            const msgText = this.scene.add.text(0, 15, message, {
                fontSize: '12px',
                color: '#ffffff'
            });
            msgText.setOrigin(0.5);
            popup.add(msgText);
        }

        // Animate popup
        popup.setScale(0);
        this.scene.tweens.add({
            targets: popup,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(1500, () => {
                    this.scene.tweens.add({
                        targets: popup,
                        alpha: 0,
                        y: popup.y - 50,
                        duration: 500,
                        onComplete: () => popup.destroy()
                    });
                });
            }
        });
    }

    private checkLevelUp(): void {
        const requiredExp = this.getExpRequiredForLevel(this.stats.level + 1);
        
        if (this.stats.experience >= requiredExp) {
            this.stats.level++;
            this.showLevelUpEffect();
            
            // Level up bonus
            const bonus = this.stats.level * 10;
            this.stats.totalScore += bonus;
            this.showScorePopup(bonus, `Level ${this.stats.level}! 🎉`);
        }
    }

    private showLevelUpEffect(): void {
        const effect = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
        effect.setDepth(1002);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0xf39c12, 0.9);
        bg.fillRoundedRect(-150, -50, 300, 100, 10);
        effect.add(bg);

        const levelText = this.scene.add.text(0, -15, `LEVEL UP!`, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        levelText.setOrigin(0.5);
        effect.add(levelText);

        const newLevelText = this.scene.add.text(0, 15, `Level ${this.stats.level}`, {
            fontSize: '20px',
            color: '#ffffff'
        });
        newLevelText.setOrigin(0.5);
        effect.add(newLevelText);

        // Animate
        effect.setScale(0);
        this.scene.tweens.add({
            targets: effect,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(2000, () => {
                    this.scene.tweens.add({
                        targets: effect,
                        alpha: 0,
                        scaleX: 0.5,
                        scaleY: 0.5,
                        duration: 300,
                        onComplete: () => effect.destroy()
                    });
                });
            }
        });
    }

    getStats(): PlayerStats {
        return { ...this.stats };
    }

    getAccuracy(): number {
        if (this.stats.questionsAnswered === 0) return 0;
        return Math.round((this.stats.correctAnswers / this.stats.questionsAnswered) * 100);
    }

    getCategoryAccuracy(category: string): number {
        const categoryStats = this.stats.categoryStats[category];
        if (!categoryStats || categoryStats.total === 0) return 0;
        return Math.round((categoryStats.correct / categoryStats.total) * 100);
    }

    private saveStats(): void {
        try {
            localStorage.setItem('englishGameStats', JSON.stringify(this.stats));
        } catch (error) {
            console.warn('Could not save stats to localStorage:', error);
        }
    }

    private loadStats(): void {
        try {
            const saved = localStorage.getItem('englishGameStats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Could not load stats from localStorage:', error);
        }
    }

    resetStats(): void {
        this.stats = {
            totalScore: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            streak: 0,
            maxStreak: 0,
            botsDefeated: 0,
            level: 1,
            experience: 0,
            categoryStats: {}
        };
        this.updateScoreDisplay();
        this.saveStats();
    }

    destroy(): void {
        this.scoreUI.destroy();
    }
}