
function createBubble (){
    const section = document.querySelector('section')
    const createElement = document.createElement('span')
    var size = Math.random() * 60;

    createElement.style.width = size + 'px';
    createElement.style.height = size + 'px';
    createElement.style.left = Math.random() * innerWidth + "px";
    section.appendChild(createElement);

    setTimeout(() => {
        createElement.remove()
    }, 4000)
}

setInterval(createBubble, 50)






$(document).ready(function() {
    animateDiv($('.a'), 0.1);
        animateDiv($('.b'), 0.5);
        animateDiv($('.c'), 1);

});

function makeNewPosition($container) {

    // Get viewport dimensions (remove the dimension of the div)
    var h = $container.height() - 50;
    var w = $container.width() - 50;

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);

    return [nh, nw];

}

function animateDiv($target, speedModifier) {
    var newq = makeNewPosition($target.parent());
    var oldq = $target.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq, speedModifier);

    $target.animate({
        top: newq[0],
        left: newq[1]
    }, speed, function() {
        animateDiv($target, speedModifier);
    });

};

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.1;
    
    var speed = Math.ceil(greatest / speedModifier);
    
    return speed;
    
    }