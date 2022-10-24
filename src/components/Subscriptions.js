import { onAddTodo } from '../graphql/subscriptions'
import { API } from 'aws-amplify'
import { useState } from 'react';
import { Grid, View, Heading, Alert } from '@aws-amplify/ui-react';
import { Card } from '@aws-amplify/ui-react';



export const Subscriptions = ({ todoData, handleTodoDelete }) => {

  const [newTodoSubscriptionMessage, setNewTodoSubscriptionMessage] = useState([])
  const [subscriptionVar, setSubscriptionVar] = useState()

  const handleTodoSubscription = async () => {
    try {
      const res = await API.graphql({
        query: onAddTodo,
        authToken: "custom-authorized"
      })
        .subscribe({
          next: newTodoSubMessage => {
            const todoDetails = {
              name: newTodoSubMessage.value.data.onAddTodo.name,
              description: newTodoSubMessage.value.data.onAddTodo.description,
              priority: newTodoSubMessage.value.data.onAddTodo.priority,
              status: newTodoSubMessage.value.data.onAddTodo.status
            }

            setNewTodoSubscriptionMessage((curTodoMessage) => {
              return [...curTodoMessage, JSON.stringify(todoDetails)]
            })
          }
        })

      setSubscriptionVar(res)

    } catch (error) {
      console.log(error)
    }
  }

  const handleTodoUnSubscription = async () => {
    try {
      subscriptionVar.unsubscribe()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Heading level={3}>Todo Notifications</Heading>
      <button className="button-sub" onClick={handleTodoSubscription}>Subscribe</button>
      <button className="button-sub" onClick={handleTodoUnSubscription}>Unsubscribe</button>


      <h3> Subscribe to new todos</h3>

      {
        todoData.map((todo) => (
          <Card margin="medium">
            <div
              key={todo.id}
              onClick={(e) => handleTodoDelete(todo.id)} >
              <Grid
                templateColumns="1fr 1fr 1fr 1fr"
                templateRows="1rem 1rem"
                gap='small'
              >
                <View >Name: {todo.name}</View>
                <View >Description: {todo.description}</View>
                <View >Priority: {todo.priority}</View>
                <View >Status: {todo.status}</View>
              </Grid>

            </div>
          </Card>
        ))
      }
      <div>
        {newTodoSubscriptionMessage ? <Alert variation="info">{newTodoSubscriptionMessage}</Alert> : ''}
      </div>
    </div >

  );
}


