import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Moment from 'react-moment';

const LogItem = ({ log: { _id, priority, user, text, created }, onDelete }) => {
  const setBg = () => {
    if (priority === 'high') {
      return 'danger';
    } else if (priority === 'moderate') {
      return 'warning';
    } else {
      return 'success';
    }
  };

  return (
    <tr>
      <td>
        <Badge className='p-2' bg={setBg()}>
          {priority.charAt(0).toUpperCase() + priority.substring(1)}
        </Badge>
      </td>
      <td>{text}</td>
      <td>{user}</td>
      <td>
        <Moment format='MMMM Do YYYY h:mm:ss a'>{new Date(created)}</Moment>
      </td>
      <td>
        <Button variant='danger' size='sm' onClick={() => onDelete(_id)}>
          X
        </Button>
      </td>
    </tr>
  );
};

export default LogItem;
