import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { AiChat } from 'pages/aichat';

export const App = () => {
  return (
    <Router basename='/' >
      <Routes >
        <Route path="/" Component={AiChat} />
      </Routes>
    </Router>
  )
};