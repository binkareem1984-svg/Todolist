import { useState } from 'react'
import './App.css'

const sections = [
  { status: 'progressing', title: 'In progress', icon: 'fa-list-check' },
  { status: 'finished', title: 'Finished', icon: 'fa-circle-check' },
  { status: 'removed', title: 'Removed', icon: 'fa-trash-can' },
]

function formatCreatedAt(date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function formatDueDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(`${date}T00:00:00`))
}

function App() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')
  const [dueDate, setDueDate] = useState('')

  function addTodo(event) {
    event.preventDefault()
    const text = todo.trim()
    if (!text) return

    setTodos((currentTodos) => [
      {
        id: crypto.randomUUID(),
        text,
        status: 'progressing',
        createdAt: new Date().toISOString(),
        dueDate,
      },
      ...currentTodos,
    ])
    setTodo('')
    setDueDate('')
  }

  function updateTodoStatus(id, status) {
    setTodos((currentTodos) =>
      currentTodos.map((item) => (item.id === id ? { ...item, status } : item)),
    )
  }

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">YOUR DAY, IN FOCUS</p>
          <h1>To-do list</h1>
          <p className="subtitle">Make space for what matters.</p>
        </div>
        <div className="date-badge">
          <i className="fa-regular fa-calendar" aria-hidden="true" />
          <span>
            {new Intl.DateTimeFormat(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }).format(new Date())}
          </span>
        </div>
      </header>

      <form className="input" onSubmit={addTodo}>
        <i className="fa-solid fa-plus" aria-hidden="true" />
        <input
          className="task-input"
          aria-label="New task"
          value={todo}
          onChange={(event) => setTodo(event.target.value)}
          type="text"
          placeholder="What needs to get done?"
        />
        <label className="date-picker">
          <i className="fa-regular fa-calendar" aria-hidden="true" />
          <span className="visually-hidden">Task due date</span>
          <input
            aria-label="Task due date"
            onChange={(event) => setDueDate(event.target.value)}
            type="date"
            value={dueDate}
          />
        </label>
        <button type="submit">Add task</button>
      </form>

      <div className="board">
        {sections.map((section) => {
          const sectionTodos = todos.filter((item) => item.status === section.status)

          return (
            <section className={`todo-section ${section.status}`} key={section.status}>
              <div className="section-heading">
                <div className="section-title">
                  <i className={`fa-solid ${section.icon}`} aria-hidden="true" />
                  <h2>{section.title}</h2>
                </div>
                <span className="task-count">{sectionTodos.length}</span>
              </div>

              {sectionTodos.length === 0 ? (
                <p className="empty-state">
                  {section.status === 'progressing'
                    ? 'Nothing on your list yet.'
                    : `No ${section.title.toLowerCase()} tasks.`}
                </p>
              ) : (
                <ul className="todo-list">
                  {sectionTodos.map((item) => (
                    <li className="todo" key={item.id}>
                      {section.status === 'progressing' && (
                        <input
                          aria-label={`Mark ${item.text} as finished`}
                          checked={false}
                          onChange={() => updateTodoStatus(item.id, 'finished')}
                          type="checkbox"
                        />
                      )}
                      {section.status === 'finished' && (
                        <i className="fa-solid fa-circle-check finished-icon" aria-hidden="true" />
                      )}
                      {section.status === 'removed' && (
                        <i className="fa-regular fa-trash-can removed-icon" aria-hidden="true" />
                      )}

                      <div className="todo-content">
                        <p className={section.status === 'finished' ? 'todo-text completed' : 'todo-text'}>
                          {item.text}
                        </p>
                        <time className="todo-date" dateTime={item.createdAt}>
                          Added {formatCreatedAt(item.createdAt)}
                        </time>
                        {item.dueDate && (
                          <time className="todo-due-date" dateTime={item.dueDate}>
                            Due {formatDueDate(item.dueDate)}
                          </time>
                        )}
                      </div>

                      {section.status === 'progressing' && (
                        <button
                          aria-label={`Move ${item.text} to removed`}
                          className="icon-button remove-button"
                          onClick={() => updateTodoStatus(item.id, 'removed')}
                          type="button"
                        >
                          <i className="fa-solid fa-xmark" aria-hidden="true" />
                        </button>
                      )}
                      {section.status === 'removed' && (
                        <button
                          className="restore-button"
                          onClick={() => updateTodoStatus(item.id, 'progressing')}
                          type="button"
                        >
                          Restore
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </main>
  )
}

export default App
