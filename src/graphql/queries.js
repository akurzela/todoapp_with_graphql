/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listTodos = /* GraphQL */ `
  query ListTodos($limit: Int, $nextToken: String) {
    listTodos(limit: $limit, nextToken: $nextToken) {
      todos {
        id
        name
        description
        priority
        status
      }
      nextToken
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      priority
      status
    }
  }
`;
