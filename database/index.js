// Express - Фреймворк для Node.js с готовыми инструментами для обработки HTTP запросов, упрощает создание серверной части
// импорт библиотеки express. require - способ подключения модулей Node.js.
const express = require('express')

const PORT = process.env.PORT || 8800

// экземпляр express-приложения. app- веб сервер
const app = express()

app.get('/',(req,res) => {
    res.send('Welcome to the database!')
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))