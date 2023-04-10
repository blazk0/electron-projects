import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { ipcRenderer } from 'electron';
import AddLogItem from './AddLogItem';

import LogItem from './LogItem';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    variant: 'success',
  });

  useEffect(() => {
    ipcRenderer.send('logs:load');

    ipcRenderer.on('logs:get', (e, logs) => setLogs(JSON.parse(logs)));

    ipcRenderer.on('logs:clear', () => {
      setLogs([]);
      showAlert('Logs cleared');
    });
  }, []);

  const addItem = item => {
    if (!item.text || !item.user || !item.priority) {
      return showAlert('Please enter all fields', 'danger');
    }

    ipcRenderer.send('logs:add', item);
    showAlert('Log Added');
  };

  const removeItem = id => {
    ipcRenderer.send('logs:delete', id);
    // setLogs(logs => logs.filter(log => log._id !== id));
    showAlert('Log removed');
  };

  const showAlert = (msg, variant = 'success', seconds = 3000) => {
    setAlert({ msg, variant, show: true });

    setTimeout(() => {
      setAlert({ msg: '', variant, show: false });
    }, seconds);
  };

  return (
    <Container>
      <AddLogItem addItem={addItem} />

      {alert.show && <Alert variant={alert.variant}>{alert.msg}</Alert>}

      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <LogItem key={log._id} log={log} onDelete={removeItem} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
