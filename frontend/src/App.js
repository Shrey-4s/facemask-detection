import React, { useState } from 'react';
import { Button, Container, Nav, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LiveCamera from './components/LiveCamera';
import UploadPhoto from './components/UploadPhoto';
import './styles.css';

function App() {
  const [useLiveMode, setUseLiveMode] = useState(false);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Face Mask Detection</h1>
      
      <Card className="shadow">
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="#upload">
            <Nav.Item>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setUseLiveMode(false)}
                active={!useLiveMode}
              >
                📷 Upload Photo
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant="outline-success"
                onClick={() => setUseLiveMode(true)}
                active={useLiveMode}
              >
                🎥 Live Detection
              </Button>
            </Nav.Item>
          </Nav>
        </Card.Header>
        
        <Card.Body className="p-4">
          {useLiveMode ? (
            <div>
              <h4 className="mb-3">Live Camera Detection</h4>
              <LiveCamera />
            </div>
          ) : (
            <div>
              <h4 className="mb-3">Upload Photo</h4>
              <UploadPhoto />
            </div>
          )}
        </Card.Body>
      </Card>

      <footer className="mt-4 text-center text-muted">
        <p>Mask Detection System - Built with React and TensorFlow</p>
      </footer>
    </Container>
  );
}

export default App;