const img = document.querySelectorAll('img');
const socket = io.connect('http://localhost:5000')
let me = {id: null, weapon: null, score: 0}
let enemy = null

socket.on('newPlayer', data => me.id = data.id)

socket.on('newData', data => {
    for(let i in data){
        if(data[i].id == me.id){
            me = data[i]
        } else{
            enemy = data[i].score
        }
    }
})

socket.on('result', ({ result }) => {
    const scores = document.querySelector('.scores')
    if(result == 'empate') message('empate')
    else if(result == me.id) message('voce ganhou')
    else message('voce perdeu')
    scores.innerHTML = `Você: ${me.score}<br>Inimigo: ${enemy}`
})

for(const i in img){
    img[i].addEventListener('click', e => {
        e.preventDefault()
        for(const j of img) j.classList.remove('selected')
        img[i].classList.add('selected')
        me.weapon = i
        socket.emit('game', me)
    })
}

function message(msg){
    document.querySelector('.popup').style.display = 'flex'
    document.querySelector('.resultado').innerHTML = msg
    
    document.querySelector('.btn-ok').addEventListener('click', e => {
        e.preventDefault()
        document.querySelector('.popup').style.display = 'none'
        document.querySelector('.resultado').innerHTML = ''

        for(const i in img){
            img[i].classList.remove('selected')
        }
    })
}
