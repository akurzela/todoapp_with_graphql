import logo from './logo.svg';
import './App.css';
import {addTodo, deleteTodo} from './graphql/mutations'
import {listTodos} from './graphql/queries'
import {API} from 'aws-amplify'
import { useEffect, useState } from 'react';

function App() {

  const [todoData, setTodoData] = useState([])

  useEffect(() => {
    try {
      const fetchTodos = async () => {
        const res = await API.graphql({
          query: listTodos,
          authMode: 'AWS_LAMBDA',
          authToken: "custom-authorized"
        })
        return res.data.listTodos.todos
      }

      fetchTodos().then(todos => setTodoData(todos))

    } catch (error) {
      console.log(error)
    }
    
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault()
    const { target } = e

    try{
        const { data } = await API.graphql({
        query: addTodo,
        variables : {
          input: {
            id: Math.floor(Math.random() * 10000),
            name: target.todoName.value,
            description: target.description.value,
            priority: parseInt(target.priority.value),
            status: target.status.value
          }
        },
        authMode: 'AWS_LAMBDA',
        authToken: "custom-authorized"
      })

      setTodoData((curTodoData) => {
        return [...curTodoData, data.addTodo]
      })
    }catch(error){
      console.log(error)
    }
  }

  const handleTodoDelete = async (todoId) => {
    const newTodoData = todoData.filter((todo) => todo.id != todoId)
    try{
      await API.graphql({
        query: deleteTodo,
        variables: {
          input: {
            id: todoId
          }
        },
        authMode: 'AWS_LAMBDA',
        authToken: "custom-authorized"
      })
      setTodoData(newTodoData)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder='Enter a name' name="todoName"/>
        <input placeholder='Enter a description' name="description"/>
        <select name='priority'>
          <option value="none" disabled>Select priority</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <select name='status'>
          <option value="none" disabled>Select status</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
        <button>Create Todo</button>
      </form>
      <main>
        <ul>
          {todoData.map((todo) => (
            <li 
              key={todo.id}
              onClick={(e) => handleTodoDelete(todo.id)}
            >
              <article>
                <h3>{todo.name}</h3>
                <h3>{todo.description}</h3>
                <h3>{todo.priority}</h3>
                <h3>{todo.status}</h3>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  
  );
}

export default App;
