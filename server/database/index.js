//index.js - создание веб сервера (обрабатывает http запросы, отвечает пользователям)
// Express - Фреймворк для Node.js с готовыми инструментами для обработки HTTP запросов, упрощает создание серверной части
// импорт библиотеки express. require - способ подключения модулей Node.js.
//server
const express = require("express")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 8800

//middlewares
app.use(express.static(path.join(__dirname, "../..", "client")))
app.use(express.json())

//routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "client/templates/index.html"))
})

const productRouter = require("./routes/product.routes.js")
app.use("/api", productRouter)

//const orderRouter = require('./routes/order.routes.js')
// экземпляр express-приложения. app- веб сервер
//app.use('/api',orderRouter)

// говорим приложению прослушивать порт
app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
