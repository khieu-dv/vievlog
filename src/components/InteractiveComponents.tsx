'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState<number>(0)
  
  const handleIncrement = (): void => {
    setCount(prev => prev + 1)
  }
  
  const handleDecrement = (): void => {
    setCount(prev => prev - 1)
  }
  
  const handleReset = (): void => {
    setCount(0)
  }
  
  return (
    <div className="p-6 bg-white border rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Interactive Counter</h4>
      <div className="text-3xl font-bold text-blue-600 mb-4 text-center">{count}</div>
      <div className="flex gap-2 justify-center">
        <button 
          onClick={handleDecrement}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          -
        </button>
        <button 
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={handleIncrement}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

export function TodoList() {
  const [todos, setTodos] = useState<Array<{id: number, text: string, completed: boolean}>>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [nextId, setNextId] = useState<number>(1)
  
  const addTodo = (): void => {
    if (inputValue.trim()) {
      setTodos(prev => [...prev, { id: nextId, text: inputValue.trim(), completed: false }])
      setInputValue('')
      setNextId(prev => prev + 1)
    }
  }
  
  const toggleTodo = (id: number): void => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  const deleteTodo = (id: number): void => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }
  
  return (
    <div className="p-6 bg-white border rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Interactive Todo List</h4>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
      )}
    </div>
  )
}

export function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6')
  const [customText, setCustomText] = useState<string>('Hello TypeScript!')
  
  const colors: Array<{name: string, value: string}> = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' }
  ]
  
  return (
    <div className="p-6 bg-white border rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Interactive Color Picker</h4>
      <div className="mb-4">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Enter your text..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div 
        className="p-6 rounded-lg mb-4 text-white text-center text-xl font-bold"
        style={{ backgroundColor: selectedColor }}
      >
        {customText}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {colors.map(color => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.value)}
            className={`p-3 rounded-lg text-white font-medium transition-all ${
              selectedColor === color.value ? 'ring-4 ring-offset-2 ring-gray-400' : ''
            }`}
            style={{ backgroundColor: color.value }}
          >
            {color.name}
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Current color: <code className="bg-gray-100 px-2 py-1 rounded">{selectedColor}</code>
      </div>
    </div>
  )
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface MultiChoiceQuizProps {
  questions: Question[]
  title?: string
}

export function MultiChoiceQuiz({ questions, title = "Bài tập trắc nghiệm" }: MultiChoiceQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState<boolean>(false)
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({})

  const handleAnswerSelect = (questionId: number, answerIndex: number): void => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleSubmit = (): void => {
    setShowResults(true)
  }

  const handleReset = (): void => {
    setSelectedAnswers({})
    setShowResults(false)
    setShowExplanation({})
    setCurrentQuestion(0)
  }

  const toggleExplanation = (questionId: number): void => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const calculateScore = (): number => {
    let correct = 0
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const getAnswerColor = (questionId: number, answerIndex: number): string => {
    if (!showResults) {
      return selectedAnswers[questionId] === answerIndex 
        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300 shadow-md' 
        : 'bg-white/70 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border-purple-100'
    }

    const question = questions.find(q => q.id === questionId)
    if (!question) return 'bg-white/70 border-purple-100'

    if (answerIndex === question.correctAnswer) {
      return 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-300 shadow-md'
    } else if (selectedAnswers[questionId] === answerIndex) {
      return 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-300 shadow-md'
    }
    return 'bg-white/50 border-gray-200'
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-xl shadow-lg">
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2 text-indigo-800 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">{title}</h4>
        <div className="flex justify-between text-sm text-indigo-600 mt-3">
          <span className="bg-white/50 px-3 py-1 rounded-full">📝 Số câu hỏi: {questions.length}</span>
          {showResults && (
            <span className="font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full">
              ✨ Điểm: {calculateScore()}/100
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h5 className="font-semibold mb-4 text-indigo-900 text-lg">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">
                {index + 1}
              </span>
              {question.question}
            </h5>
            
            <div className="space-y-3 mb-4">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(question.id, optionIndex)}
                  disabled={showResults}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                    getAnswerColor(question.id, optionIndex)
                  }`}
                >
                  <span className="font-medium mr-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white text-sm inline-flex items-center justify-center">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {showResults && (
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    selectedAnswers[question.id] === question.correctAnswer 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {selectedAnswers[question.id] === question.correctAnswer ? '✓ Đúng rồi!' : '✗ Chưa đúng'}
                  </span>
                  <button
                    onClick={() => toggleExplanation(question.id)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm underline hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                  >
                    {showExplanation[question.id] ? '🔼 Ẩn giải thích' : '🔽 Xem giải thích'}
                  </button>
                </div>
                
                {showExplanation[question.id] && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-400 shadow-inner">
                    <p className="text-sm text-indigo-800 mb-2">
                      <strong>💡 Đáp án chính xác:</strong> <span className="bg-indigo-100 px-2 py-1 rounded font-medium">{String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}</span>
                    </p>
                    <p className="text-sm text-indigo-700 leading-relaxed">
                      <strong>📚 Giải thích chi tiết:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              Object.keys(selectedAnswers).length === questions.length
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            🚀 Nộp bài ({Object.keys(selectedAnswers).length}/{questions.length})
          </button>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🔄 Làm lại
            </button>
            <div className={`px-6 py-3 rounded-xl font-medium shadow-lg ${
              calculateScore() >= 80 
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-2 border-emerald-200' 
                : calculateScore() >= 60 
                ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-2 border-amber-200'
                : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-2 border-rose-200'
            }`}>
              {calculateScore() >= 80 ? '🎉 Xuất sắc! Bạn đã làm rất tốt!' : 
               calculateScore() >= 60 ? '👍 Khá tốt! Tiếp tục cố gắng nhé!' : 
               '💪 Cần cố gắng thêm! Đừng bỏ cuộc!'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}