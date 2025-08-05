import * as Phaser from "phaser";
import { Question } from "./QuestionDatabase";

export class QuestionUI {
    private scene: Phaser.Scene;
    private background: Phaser.GameObjects.Graphics | null = null;
    private questionText: Phaser.GameObjects.Text | null = null;
    private optionButtons: any[] = [];
    private isVisible = false;
    private currentQuestion: Question | null = null;
    private onAnswerCallback: ((correct: boolean, question: Question) => void) | null = null;
    private allUIElements: Phaser.GameObjects.GameObject[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createUI();
    }

    private createUI(): void {
        console.log('QuestionUI createUI called - will create UI dynamically when showing question');
        this.isVisible = false;
    }

    showQuestion(question: Question, onAnswer: (correct: boolean, question: Question) => void): void {
        console.log('QuestionUI.showQuestion called with:', question);
        console.log('Question text:', question.question);
        console.log('Question options:', question.options);
        
        // Pause the game when showing question
        this.scene.physics.pause();
        // Set pause state instead of pausing the entire scene
        (this.scene as any).isPaused = true;
        
        this.currentQuestion = question;
        this.onAnswerCallback = onAnswer;

        // Clear any existing UI elements
        this.clearUI();

        // Get camera position and dimensions
        const camera = this.scene.cameras.main;
        const baseX = camera.scrollX;
        const baseY = camera.scrollY;
        
        console.log('Creating UI at camera position:', baseX, baseY);
        console.log('Camera dimensions:', camera.width, camera.height);

        // Create background overlay
        this.background = this.scene.add.graphics();
        this.background.fillStyle(0x000000, 0.8);
        this.background.fillRect(baseX, baseY, camera.width, camera.height);
        this.background.setDepth(1000);
        this.allUIElements.push(this.background);

        // Add pause indicator
        const pauseText = this.scene.add.text(
            baseX + camera.width - 100,
            baseY + 20,
            '⏸️ PAUSED',
            {
                fontSize: '16px',
                color: '#f39c12',
                fontStyle: 'bold',
                backgroundColor: '#2c3e50',
                padding: { x: 8, y: 4 }
            }
        );
        pauseText.setDepth(999);
        this.allUIElements.push(pauseText);

        // Create question panel - responsive sizing
        const isMobile = camera.width < 768 || camera.height < 600;
        const panelWidth = isMobile ? Math.min(camera.width - 20, 350) : Math.min(600, camera.width - 40);
        const panelHeight = isMobile ? Math.min(camera.height - 40, camera.height * 0.85) : 400;
        const panelX = baseX + (camera.width - panelWidth) / 2;
        const panelY = baseY + (camera.height - panelHeight) / 2;

        const questionPanel = this.scene.add.graphics();
        questionPanel.fillStyle(0x2c3e50, 1);
        questionPanel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);
        questionPanel.lineStyle(3, 0x3498db, 1);
        questionPanel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);
        questionPanel.setDepth(1001);
        this.allUIElements.push(questionPanel);

        // Create title
        const titleText = this.scene.add.text(
            baseX + camera.width / 2,
            panelY + (isMobile ? 20 : 30),
            '🎓 English Challenge! 🎓',
            {
                fontSize: isMobile ? '18px' : '24px',
                color: '#f39c12',
                fontStyle: 'bold'
            }
        );
        titleText.setOrigin(0.5);
        titleText.setDepth(1002);
        this.allUIElements.push(titleText);

        // Create question text
        this.questionText = this.scene.add.text(
            baseX + camera.width / 2,
            panelY + (isMobile ? 50 : 80),
            question.question,
            {
                fontSize: isMobile ? '14px' : '18px',
                color: '#ecf0f1',
                align: 'center',
                wordWrap: { width: panelWidth - (isMobile ? 30 : 60) }
            }
        );
        this.questionText.setOrigin(0.5);
        this.questionText.setDepth(1002);
        this.allUIElements.push(this.questionText);

        // Create option buttons
        this.optionButtons = [];
        const startY = panelY + (isMobile ? 100 : 160);
        const buttonSpacing = isMobile ? 45 : 60;
        const buttonHeight = isMobile ? 40 : 50;
        const buttonMargin = isMobile ? 20 : 100;

        for (let i = 0; i < question.options.length; i++) {
            const buttonX = baseX + (camera.width - (panelWidth - buttonMargin)) / 2;
            const buttonY = startY + i * buttonSpacing;

            // Create button background
            const buttonBg = this.scene.add.graphics();
            buttonBg.fillStyle(0x34495e, 1);
            buttonBg.fillRoundedRect(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight, 5);
            buttonBg.lineStyle(2, 0x95a5a6, 1);
            buttonBg.strokeRoundedRect(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight, 5);
            buttonBg.setDepth(1002);
            buttonBg.setInteractive(new Phaser.Geom.Rectangle(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight), Phaser.Geom.Rectangle.Contains);
            this.allUIElements.push(buttonBg);

            // Create button text
            const buttonText = this.scene.add.text(
                buttonX + (panelWidth - buttonMargin) / 2,
                buttonY + buttonHeight / 2,
                `${String.fromCharCode(65 + i)}. ${question.options[i]}`,
                {
                    fontSize: isMobile ? '12px' : '16px',
                    color: '#ecf0f1',
                    wordWrap: { width: panelWidth - buttonMargin - 20 }
                }
            );
            buttonText.setOrigin(0.5);
            buttonText.setDepth(1003);
            this.allUIElements.push(buttonText);

            // Add click handler
            buttonBg.on('pointerdown', () => {
                console.log(`Option ${i} clicked: ${question.options[i]}`);
                this.selectOption(i);
            });

            // Store for later reference
            this.optionButtons.push({ bg: buttonBg, text: buttonText, index: i });
        }

        // Create close button
        const closeButton = this.scene.add.text(
            panelX + panelWidth - 25,
            panelY + 15,
            '✕',
            {
                fontSize: isMobile ? '16px' : '20px',
                color: '#e74c3c',
                fontStyle: 'bold'
            }
        );
        closeButton.setOrigin(0.5);
        closeButton.setDepth(1003);
        closeButton.setInteractive();
        closeButton.on('pointerdown', () => {
            this.hide();
        });
        this.allUIElements.push(closeButton);

        this.isVisible = true;
        console.log('Question UI created and should be visible now');
    }

    private clearUI(): void {
        // Destroy all existing UI elements
        this.allUIElements.forEach((element) => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        this.allUIElements = [];
        this.optionButtons = [];
    }

    private selectOption(selectedIndex: number): void {
        if (!this.currentQuestion || !this.onAnswerCallback) return;

        const isCorrect = selectedIndex === this.currentQuestion.correctAnswer;
        
        // Visual feedback
        this.showAnswerFeedback(selectedIndex, isCorrect);

        // Call callback after short delay to show feedback
        this.scene.time.delayedCall(1500, () => {
            if (this.onAnswerCallback && this.currentQuestion) {
                this.onAnswerCallback(isCorrect, this.currentQuestion);
            }
            this.hide();
        });
    }

    private showAnswerFeedback(selectedIndex: number, isCorrect: boolean): void {
        if (!this.currentQuestion) return;

        const camera = this.scene.cameras.main;
        const baseX = camera.scrollX;
        const baseY = camera.scrollY;
        const isMobile = camera.width < 768 || camera.height < 600;
        const panelWidth = isMobile ? Math.min(camera.width - 20, 350) : Math.min(600, camera.width - 40);
        const panelHeight = isMobile ? Math.min(camera.height - 40, camera.height * 0.85) : 400;
        const buttonSpacing = isMobile ? 45 : 60;
        const buttonHeight = isMobile ? 40 : 50;
        const buttonMargin = isMobile ? 20 : 100;

        // Highlight selected answer
        const selectedButton = this.optionButtons[selectedIndex];
        if (selectedButton?.bg) {
            const buttonX = baseX + (camera.width - (panelWidth - buttonMargin)) / 2;
            const buttonY = baseY + (camera.height - panelHeight) / 2 + (isMobile ? 100 : 160) + selectedIndex * buttonSpacing;
            
            selectedButton.bg.clear();
            selectedButton.bg.fillStyle(isCorrect ? 0x27ae60 : 0xe74c3c, 1);
            selectedButton.bg.fillRoundedRect(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight, 5);
            selectedButton.bg.lineStyle(2, isCorrect ? 0x229954 : 0xc0392b, 1);
            selectedButton.bg.strokeRoundedRect(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight, 5);
        }

        // Highlight correct answer if user was wrong
        if (!isCorrect && this.currentQuestion.correctAnswer < this.optionButtons.length) {
            const correctButton = this.optionButtons[this.currentQuestion.correctAnswer];
            if (correctButton?.bg) {
                const buttonX = baseX + (camera.width - (panelWidth - buttonMargin)) / 2;
                const buttonY = baseY + (camera.height - panelHeight) / 2 + (isMobile ? 100 : 160) + this.currentQuestion.correctAnswer * buttonSpacing;
                
                correctButton.bg.clear();
                correctButton.bg.fillStyle(0x27ae60, 1);
                correctButton.bg.fillRoundedRect(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight, 5);
                correctButton.bg.lineStyle(2, 0x229954, 1);
                correctButton.bg.strokeRoundedRect(buttonX, buttonY, panelWidth - buttonMargin, buttonHeight, 5);
            }
        }

        // Show result text
        const resultText = this.scene.add.text(
            baseX + camera.width / 2,
            baseY + camera.height / 2 + (isMobile ? 120 : 150),
            isCorrect ? '✅ Correct! Well done!' : '❌ Wrong answer!',
            {
                fontSize: isMobile ? '16px' : '20px',
                color: isCorrect ? '#27ae60' : '#e74c3c',
                fontStyle: 'bold'
            }
        );
        resultText.setOrigin(0.5);
        resultText.setDepth(1003);
        this.allUIElements.push(resultText);

        // Show explanation if available
        if (this.currentQuestion.explanation) {
            const explanationText = this.scene.add.text(
                baseX + camera.width / 2,
                baseY + camera.height / 2 + (isMobile ? 145 : 180),
                this.currentQuestion.explanation,
                {
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#bdc3c7',
                    align: 'center',
                    wordWrap: { width: panelWidth - (isMobile ? 30 : 60) }
                }
            );
            explanationText.setOrigin(0.5);
            explanationText.setDepth(1003);
            this.allUIElements.push(explanationText);
        }
    }

    hide(): void {
        console.log('QuestionUI hide() called');
        
        // Resume the game when hiding question
        this.scene.physics.resume();
        // Clear pause state
        (this.scene as any).isPaused = false;
        
        this.clearUI();
        this.isVisible = false;
        this.currentQuestion = null;
        this.onAnswerCallback = null;
        console.log('QuestionUI hidden successfully');
    }

    isShowing(): boolean {
        return this.isVisible;
    }

    destroy(): void {
        this.clearUI();
    }
}