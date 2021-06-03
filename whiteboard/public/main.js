(function(){
    const canvas = document.getElementById('canvas')
    const colors = document.getElementsByClassName('color')
    const socket = io()
    const context = canvas.getContext('2d')

    const current = {
        color: 'red'
    }

    let drawing = false,
        w = canvas.width,
        h = canvas.height

    socket.on('drawing', onDrawEvent)

    for(let i = 0, length = colors.length; i < length; i++){
        colors[i].addEventListener('click', onUpdateColor, false)
    }

    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mousemove', throttle(onMousemove, 10), false)
    canvas.addEventListener('mouseup', onMouseUp, false)
    canvas.addEventListener('mouseout', onMouseUp, false)

    function onUpdateColor(e){
        current.color = e.target.className.split(' ')[1]
    }

    function drawLine(x0, y0, x1, y1, color, emit){
        context.beginPath()
        context.lineWidth = 2
        context.strokeStyle = color
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.stroke()
        if(!emit){return}
        socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color
        })
    }

    function onMouseDown(e){
        current.x = e.pageX
        current.y = e.pageY
        drawing = true
    }

    function onMousemove(e){
        if(!drawing){return}
        drawLine(current.x, current.y, e.pageX, e.pageY, current.color, true)
        current.x = e.pageX
        current.y = e.pageY
    }

    function onMouseUp(e){
        if(!drawing){return}
        drawLine(current.x, current.y, e.pageX, e.pageY, current.color, true)
        drawing = false
    }

    function throttle(callback, delay){
        let previous = new Date().getTime()
        return function(){
            let now = new Date().getTime()
            if(now - previous >= delay){
                callback.apply(null, arguments)
                previous = now
            }
        }
    }

    function onDrawEvent(data){
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    }
})()