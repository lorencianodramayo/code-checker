import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Main from 'pages/Main';
import Code from 'pages/Code';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/code/:codeId" element={<Code />} />
      </Routes>
    </Router>
  );
}

export default App;
