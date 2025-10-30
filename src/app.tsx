import React, { useEffect } from 'react'
import './app.scss'
import 'taro-ui/dist/style/index.scss'

function App(props: { children?: React.ReactNode }) {
  useEffect(() => {
    // 可以在这里做全局初始化，例如检查更新、初始化日志等
  }, [])

  return props.children as React.ReactElement
}

export default App


