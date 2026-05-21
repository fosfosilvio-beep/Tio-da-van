import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { mockTodos } from '@/lib/mocks/todos';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let todos = null;
  
  try {
    const { data } = await supabase.from('todos').select();
    if (data && data.length > 0) {
      todos = data;
    }
  } catch {
    // Ignore error and fallback to mock data gracefully
  }

  const displayTodos = todos || mockTodos;
  const isUsingMocks = !todos;

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">Tio da Van</h1>
        <p className="app-subtitle">Logística e tarefas inteligentes</p>
      </header>

      {isUsingMocks && (
        <div style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          backgroundColor: 'rgba(255,255,255,0.03)',
          padding: '0.5rem 0.8rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          💡 Visualizando dados de demonstração (tabela &apos;todos&apos; ausente no Supabase).
        </div>
      )}

      {displayTodos && displayTodos.length > 0 ? (
        <ul className="todo-list">
          {displayTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-name">{todo.name}</span>
              <span className="todo-id">ID {todo.id}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <p className="empty-text">Nenhuma tarefa encontrada no momento.</p>
        </div>
      )}
    </main>
  );
}
