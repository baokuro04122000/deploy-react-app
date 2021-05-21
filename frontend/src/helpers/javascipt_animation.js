const ripples = (x,y)=>{
    let animate = document.createElement('q')
        animate.style.left = x + 'px';
        animate.style.top = y + 'px';
    return animate;
}
export const animation = ()=>{
    const buttons = document.querySelectorAll('button');
    buttons.forEach( btn =>{
        btn.addEventListener('click',function(e){
            let x = e.clientX -e.target.offsetLeft;
            let y = e.clientY -e.target.offsetTop; 
            const effect = ripples(x,y);
            this.appendChild(effect);
            setTimeout(()=> {effect.remove()},1000)
        })
    })
}
