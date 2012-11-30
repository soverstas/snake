window.onload = function() {
        //load_game();
        start = document.getElementById('start-game');
        start.addEventListener("click", getStart); 
}

/******************parameters*******************/
        /****field****/
var field_x;                    //left fied corner
var field_y;                    //
var field_width;                //field width
var field_height;               //field height
        /*************/
        
        /****snake****/
var start_length;               //start pieces (> 2)
var speed;                      //snake speed(speed of screen refresh)
var segment_radius;
var food_radius;
var food_display_type_flag;     //true/false (=true - create one-by-one.     =false - food create 1 in "food_app" seconds)
var food_app;                   //интервал появления еды(use if food_display_type_flag=false)
var mult;                       //animate style(just for fun)
        /*************/

        /****custom****/
var canvas;                     //object tag <canvas>
var canvas_id;                  //id of tag <canvas>
var display_net;                //true/false
var enable_walls_flag;          //on/off walls
var score = 0;
        /**************/
/***********************************************/

function getStart() {
        start.style.display='none';
        load_game();
        return false;
}

function init_game(){                           //function for init parameters
        form_params = document.forms.params;
        form_params.style.display='none';
        
        field_x = parseInt(form_params.field_x.value);
        field_y = parseInt(form_params.field_y.value);
        field_width = parseInt(form_params.field_width.value);
        field_height = parseInt(form_params.field_height.value);
        
        start_length = parseInt(form_params.start_length.value);
        segment_radius = parseInt(form_params.segment_radius.value);
        food_radius = parseInt(form_params.food_radius.value);
        food_app = parseInt(form_params.food_app.value);
        speed = parseInt(form_params.speed.value);
        mult = parseInt(form_params.mult.value);
        
        food_display_type_flag = form_params.food_display_type_flag.checked;
        enable_walls_flag = form_params.enable_walls_flag.checked;
        display_net = form_params.display_net.checked;
//        field_x = 0;
//        field_y = 40;
//        field_width = 400;
//        field_height = 400;
//        
//        start_length = 13;
//        segment_radius = 5;
//        food_radius = 7;
//        food_app = 10 * 1000;                   //10 seconds
//        speed = 1000/10;                        //one move on 0.1 second
//        mult = 2 * 1;
        
//        food_display_type_flag = true;
//        enable_walls_flag = false;
//        display_net = false;
        canvas_id = 'cnv';
        canvas = document.getElementById(canvas_id);
        canvas.width = field_x + field_width;
        canvas.height = field_y + field_height;
        if(start_length < 3) {
                start_length = 3;
        }

}
/******************GLOBAL VARIABLES*************/
var c;                          //object canvas context
var field;                      //object field
var s;                          //array of object segment. s[0] - head, s[end] - tail
var food;                       //array of object food
/***********************************************/

function Field(x, y, w, h) {    //object "field".
        this.x = x;             //value - field_x
        this.y = y;             //value - field_y
        this.h = h;             //value - field_height
        this.w = w;             //value - field_width
        
        this.draw = function(color) {                                           //function for drawing field area
                c.globalAlpha = 1;                                              //transparency
                c.fillStyle = color;                                            //field color
                c.fillRect(this.x - 1, this.y - 1, this.w + 1, this.h + 1);     //draw rectangle
        }
}

function Parent_Segment() {     //parent of all snake segments
        this.x;
        this.y;
        this.r;
        
        this.draw = function(color) {   //draw segment
                c.beginPath();
                c.strokeStyle = color;
                c.globalAlpha = 1;
                c.fillStyle = color;
                c.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
                c.fill();
                c.stroke();
        }
}
var P_S = new Parent_Segment();

/*********extend of P_S************/
function Head(direct) {         //object head
        this.d = direct;        //direct value: -x, x, -y, y
        this.prev_x;
        this.prev_y;
        
        this.walls_collision = function() { 
                if(field.x > this.x - mult * this.r) {
                        this.x = field.x + field.w - mult * this.r;
                        return true;
                }
                
                if(field.x + field.w < this.x + mult * this.r) {
                        this.x = field.x + mult * this.r;
                        return true;
                }
                
                if(field.y > this.y - mult * this.r) {
                        this.y = field.y + field.h - mult * this.r;
                        return true;
                }
                
                if(field.y + field.h < this.y + mult * this.r) {
                        this.y = field.y + mult * this.r;
                        return true;
                }
                return false;
        };
        
        this.point_collision = function(x, y) {
                if(Math.pow(x - this.x,2) + Math.pow(y - this.y, 2) <= Math.pow(this.r, 2)) {
                        return true;
                }
                return false;
        }
}

function Tail() {       //object tail
}

function Segment() {    //object segment
        this.prev_x;
        this.prev_y;
}

function Food() {
}
Head.prototype = P_S;
Tail.prototype = P_S;
Segment.prototype = P_S;
Food.prototype = P_S;
/***********************************/

//add field net
function net() {
        c.beginPath();
        c.strokeStyle = "#FFF";
        c.globalAlpha = 1;
        c.fillStyle = "#FFF";
        for(var i = 0; i <= (field.w) / (2 * s[0].r); i++) {
                c.moveTo(field.x + i * (2 * s[0].r), field.y);
                c.lineTo(i * (2 * s[0].r), field.h + field.y);
        }
        
        for(var i = 0; i <= (field.h) / (2 * s[0].r); i++) {
                c.moveTo(field.x, field.y + i * (2 * s[0].r));
                c.lineTo(field.w + field.x, field.y +  i * (2 * s[0].r));
        }
        c.stroke();
}

//draw
function shot() {
        field.draw('#222');
        if(display_net) {
                net();
        }
        for(var i = 0; i < food.length; i++) {
                food[i].draw('#F00');
        }
        
        for(var i = 0; i < s.length; i++) {
                s[i].draw('#0F0');
        }
        setTimeout(function() {
                animate();
        }, speed);
        c.fillStyle = '#00f';
        c.textBaseline = 'top';
        c.font = 'bold 20px sans-serif';
        c.strokeText('score: ' + score, field.x + 5, field.y + 5);

}

function animate() {    //calculation of the new coordinates
        var l = s.length;
        var last_collision_flag = false;        //for catch death collision
        var food_eat_flag = false;              //for catch food eat
        //move forvard
        s[0].prev_x = s[0].x;
        s[0].prev_y = s[0].y;
        //direction check
        if(s[0].d == '-x') {
                s[0].x = s[0].x - mult * s[0].r;
                s[0].y = s[0].y;
        }
        
        if(s[0].d == 'x') {
                s[0].x = s[0].x + mult * s[0].r;
                s[0].y = s[0].y;
        }
        
        if(s[0].d == '-y') {
                s[0].y = s[0].y - mult * s[0].r;
                s[0].x = s[0].x;
        }
        
        if(s[0].d == 'y') {
                s[0].y = s[0].y + mult * s[0].r;
                s[0].x = s[0].x;
        }
        if(s[0].walls_collision() && enable_walls_flag) {       //if get wall collision
                last_collision_flag = true;                     //and flag TRUE than die!
        }
        //move segments and check collision with head
        for(var i = 1; i < l - 1; i++) {
                s[i].prev_x = s[i].x;
                s[i].prev_y = s[i].y;
                s[i].x = s[i - 1].prev_x;
                s[i].y = s[i - 1].prev_y;
                if(s[0].point_collision(s[i].x, s[i].y)) {
                        last_collision_flag = true;
                }
        }
         //add segment. event - eat food
         //check food eating
        for(var i = 0; i < food.length; i++) {
                if(s[0].point_collision(food[i].x, food[i].y)) {
                        food_eat(i);
                        food_eat_flag = true;
                        score += 1000 / speed;
                }                
        }        
        //if eat - add segment to snake
        if(food_eat_flag) {
                s[l] = s[l - 1];
                s[l - 1] = new Segment;
                s[l - 1].x = s[l - 2].prev_x;
                s[l - 1].y = s[l - 2].prev_y;
                s[l - 1].r = segment_radius;
        }
        //else continue move
        else {
                s[l - 1].x = s[l - 2].prev_x;
                s[l - 1].y = s[l - 2].prev_y;
        }
        //check for collision head with tail
        if(s[0].point_collision(s[l - 1].x, s[l - 1].y)) {
                last_collision_flag = true;
        }
        
        if(!last_collision_flag) {
                shot();
        }
        else {
                stop();
                
        }
}
//food generator
function food_generate_coord() {
    var coord = {
        x: rand(field.w / (mult * s[0].r) - 1, 1), //normalise
        y: rand(field.h / (mult * s[0].r) - 1, 1)
    } 
    for(var k in s) {
        if(coord.x == s[k].x && coord.y == s[k].y) {
            console.log('regenerate');
            coord = food_generate_coord();
        }
    }
    return coord;
}
//add food item
function food_create() {
        if(food_display_type_flag) {
                var coord = food_generate_coord();
                var x = coord.x;
                var y = coord.y;
                food[0] = new Food();
                food[0].x = field.x + x * (mult * s[0].r);
                food[0].y = field.y + y * (mult * s[0].r);
                food[0].r = food_radius;      
        }
        else {
                setInterval(function(){
                        var coord = food_generate_coord();
                        var x = coord.x;
                        var y = coord.y;
                        food[food.length] = new Food();
                        food[food.length - 1].x = field.x + x * (mult * s[0].r);
                        food[food.length - 1].y = field.y + y * (mult * s[0].r);
                        food[food.length - 1].r = food_radius;        
                }, food_app);
        }
        
          
}
//unset food item
function food_eat(num) {
        food[num] = food[food.length - 1];
        food.splice(food.length - 1, 1);
        if(food_display_type_flag) {
                food_create();
        }
}
//end of game
function stop() {
        alert('you are bad snake!');
        document.location.reload();
}
//randomize.use for food creating
function rand(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
}
//processing press arrows or WASD
function key_press_observer() {
        var key_pressed_flag = false;   //if key was pressed
        document.onkeydown = function(e){
                if(!key_pressed_flag) {
                        if(e.which == "37" || e.which == "65") {
                                if(s[0].d != 'x') {
                                        s[0].d = '-x';
                                }
                        }

                        if(e.which == "39" || e.which == "68") {
                                if(s[0].d != '-x') {
                                        s[0].d = 'x';
                                }
                        }

                        if(e.which == "38" || e.which == "87") {
                                if(s[0].d != 'y') {
                                        s[0].d = '-y';
                                }
                        }

                        if(e.which == "40" || e.which == "83") {
                                if(s[0].d != '-y') {
                                        s[0].d = 'y';
                                }
                        }
                        key_pressed_flag = true;
                }
                //alert(e.which);

        }
        document.onkeyup = function(e){
                key_pressed_flag = false;
        }        
}
//start game
function load_game() {
        init_game();            //function for init parameters
        field = new Field(field_x, field_y, field_width, field_height); //init field
        c = canvas.getContext('2d');
        //init snake body
        s = new Array();
        s[0] = new Head('-y');
        s[0].x = field.w / 2;
        s[0].y = field.h / 2;
        s[0].r = segment_radius;
        for(var i = 1; i != start_length - 1; i++) {
                s[i] = new Segment();
                s[i].r = segment_radius;
                s[i].x = s[i - 1].x;
                s[i].y = s[i - 1].y + mult * s[i].r
        }
        s[start_length - 1] = new Tail();
        s[start_length - 1].r = segment_radius;
        s[start_length - 1].x = s[start_length - 2].x;
        s[start_length - 1].y = s[start_length - 2].y + mult * s[start_length - 1].r;
        //food add
        food = new Array();
        food_create();
        key_press_observer();
        shot(); //start game;
}