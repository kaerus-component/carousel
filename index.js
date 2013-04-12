var Emitter = require('emitter'),
    TRANSITIONS = ['prev','show','next'],
    DEFAULT_INTERVAL = 4000;


function Carousel(container,classname,tag) {

    classname = classname ? classname : 'carousel';

    if(typeof container === 'string')
        container = document.getElementById(container);

    if(!container) throw new Error("invalid carousel container");

    /* add class to container */
    if(container.className) container.className+= ' ' + classname;
    else container.className = classname;

    if(tag) tag = tag.toUpperCase();

    var childs = container.childNodes, nodes = [];

    /* get child nodes from parent container */
    for(var i = 0, l = childs.length; i < l; i++){
        if(childs[i].nodeType === 1 && (!tag || childs[i].nodeName === tag)){ 
            addTransition(childs[i],classname);
            nodes.push(childs[i]);
        }    
    }

    /* clone nodes if we have less than three childs */
    for(var i = 0; nodes.length < 3; i++){
        nodes[nodes.length] = nodes[i].cloneNode(true);
        container.appendChild(nodes[nodes.length-1]);
        addTransition(nodes[nodes.length-1],classname);
    }

    /* cap the index */
    function cap(value){
        value = value % nodes.length;
        if(value < 0) value = nodes.length + value;

        return value;
    }

    /* item index */
    var index = 0;

    /* nodes in transit */
    this.transits = {};

    /* manages index updates */
    Object.defineProperty(this,'index',{
        enumerable:false,
        get: function(){
            return index;
        },
        set: function(value){
            this.transits['prev'] = nodes[index];       
            index = cap(value);
            this.transits['show'] = nodes[index];
            this.transits['next'] = nodes[cap(index+1)];

            return index;
        }
    })
}

function addTransition(elem,cn){
    elem.className = cn + '-item';

    Emitter(elem).on('transition',function(type){
        this.className = type ? cn + '-item ' + cn + '-' + type : cn + '-item';
    });
}

Carousel.prototype.next = function(){
    if(this.transits['prev'])
        this.transits['prev'].emit('transition',null);

    this.index++;

    transition(this.transits);

    return this;
}

function transition(transits){
    TRANSITIONS.forEach(function(type){
        if(transits[type])
            transits[type].emit('transition',type);
    })     
}

Carousel.prototype.show = function(index){
    index = isNaN(index) ? this.index : index;
    
    this.index = index;

    transition(this.transits);

    return this;
};

Carousel.prototype.setInterval = function(interval){
    var self = this;

    interval = interval ? interval : DEFAULT_INTERVAL;

    this.interval = interval;

    this._timer = setInterval(function(){
        self.next();
    },this.interval);

    return this;
}

Carousel.prototype.start = function(index,interval){  
    this.show(index);    
    this.setInterval(interval);

    return this;
};

Carousel.prototype.stop = function(){
    if(this._timer){
        clearInterval(this._timer);
        delete this._timer;
    }    
}

module.exports = Carousel;