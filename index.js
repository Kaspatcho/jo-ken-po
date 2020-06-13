const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
let players = []

server.listen(5000)

app.engine('html', require('ejs').renderFile)

app.get('/', (req, res) => {
    res.render(__dirname + '/public/index.html')
})

app.get('/file/:file', (req, res) => {
    const { params: {file} } = req
    res.sendFile(__dirname + `/public/${file}`)
})

app.get('/image/:img', (req, res) => {
    const { params: {img} } = req
    res.sendFile(__dirname + `/public/images/${img}`)
})

io.on('connection', (socket) => {
    socket.emit('newPlayer', {id: socket.id})
    
    socket.on('game', data => {
        for(let i in players){
            if(players[i].id == data.id){
                players[i] = data
            } else if(players.length == 1) players.push(data)
        }
        if(players.length == 0) players.push(data)
        if(players.length == 2){
            let winner = getWinner(players[0], players[1])
            for(let i in players){
                if(winner == -1) break
                if(players[i].id == winner){
                    players[i].score++
                    break
                }
            }
            io.emit('newData', players)
            io.emit('result', {result: winner != -1 ? winner : 'empate'})
            players = []
        }
        io.emit('newData', players)
    })

    socket.on('disconnect', () => {
        for(let i in players) if(players[i].id == socket.id) players.splice(i, 1)
    })
})

function getWinner(p1, p2){
    if(p1.weapon == (p2.weapon + 1) % 3) return p1.id // player 1 win
    if(p1.weapon == p2.weapon) return -1 // tie
    else return p2.id // player 2 win
}
