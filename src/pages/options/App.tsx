import { Alert, Box, Button, Snackbar } from '@mui/material';
import { getRulesAsString, saveRulesAsString } from 'lib/Config';
import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';


export default function App() {
  const [value, setValue] = useState<string>('');
  const [initialValueFetched, setInitialValueFetched] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  useEffect(() => {
    getRulesAsString().then((value) => {
      setValue(value);
      setInitialValueFetched(true);
    });
  }, []);

  if (initialValueFetched == null) {
    return <></>
  }

  const doSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveRulesAsString(value);
    setNotificationOpen(true);
  };

  const notificationHandleClose = () => {
    setNotificationOpen(false);
  }

  return (
    <form style={{ height: '100%' }} onSubmit={doSubmit}>
      <div style={{ height: '85%', marginBottom: '10px' }}>
          <EditorPresenter value={value} setValue={setValue} />
      </div>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" type="submit" >Save</Button>
      </Box>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={notificationHandleClose}
      >
        <Alert onClose={notificationHandleClose} severity="success" sx={{ width: '100%' }}>
          Saved
        </Alert>
      </Snackbar>
    </form>
  )
}

function EditorPresenter({ value, setValue }: { value: string, setValue: (v: string) => void }) {
  return (
    <MonacoEditor
      language="javascript"
      value={value}
      onChange={setValue}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  );
}