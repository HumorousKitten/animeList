import React from 'react'
import Content from './components/content/Content'
import Header from './components/header/Header'
import { useNavigate } from 'react-router-dom'
import style from './App.module.css'

function App() {
  const navigate = useNavigate()
  return (
    <div className='App'>
      <Header>
        <div className={style.container}>
          <h2 style={{color: '#fff', fontSize: '32px', cursor:'pointer'}} onClick={() => navigate('/favouritePage')}>Избранное</h2>
        </div>
      </Header>
      <Content />
    </div>
  )
}

export default App
