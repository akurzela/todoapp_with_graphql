import React from 'react';
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from '@aws-amplify/ui-react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect } from 'react';
import { API } from 'aws-amplify'
import { listTodos } from '../graphql/queries'

export const Todo = (props,) => {
  const { todoData } = props;
  useEffect(() => {
    try {
      const fetchTodos = async () => {
        const res = await API.graphql({
          query: listTodos,
          authToken: "custom-authorized"
        })
        return res.data.listTodos.todos
      }

      fetchTodos().then(todos => props.setTodoData(todos))

    } catch (error) {
      console.log(error)
    }

  }, [])

  return (
    <Table
      textAlign="left"
      size="small"
      caption=""
      highlightOnHover={false}>
      <TableHead>
        <TableRow size="small">
          {/* <TableCell as="th">Id</TableCell> */}
          <TableCell as="th">Name</TableCell>
          <TableCell as="th">Description</TableCell>
          <TableCell as="th">Priority</TableCell>
          <TableCell as="th">Status</TableCell>
          <TableCell as="th">Remove</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {todoData.map((row) => (
          <TableRow
            key={row.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            {/* <TableCell component="th" scope="row">
              {row.id}
            </TableCell> */}
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right">{row.description}</TableCell>
            <TableCell align="right">{row.priority}</TableCell>
            <TableCell align="right">{row.status}</TableCell>
            <TableCell align="right">
              <HighlightOffIcon
                onClick={() => props.removeTodo(row.id)}
                className='delete-icon'
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table >
  )

}
