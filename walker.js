function Walker(){

  this.target_dir;

  this.x = NODES_LEFT_BORDER + ( (NODES_RIGHT_BORDER - NODES_LEFT_BORDER) / 2);
  this.y = NODES_TOP_BORDER + ( (NODES_BOTTOM_BORDER - NODES_TOP_BORDER) / 2);
  this.prev_x;
  this.prev_y;
  this.x_target = this.x;
  this.y_target = this.y;
  this.x_origin = this.x;
  this.y_origin = this.y;
  this.index_target;
  this.dir = 0;
  this.flag = false;
  this.prev_pos = [];
  this.f = 0.04;
  this.travel_time = 2000;
  this.travel_time_trigger = 0;
  this.control_a = createVector(0,0);
  this.control_b = createVector(0,0);
  this.trail = createGraphics(width,height);
  this.trail.pixelDensity(1);
  this.render_debug = false;
  this.curve_angle = 0;
  this.halfway_flag = false;
  this.halfway_reached = false;

  this.t = 0;

  this.rhythm = 'normal';
  this.rhythm_change_trigger = 0;
  this.rhythm_change_time = NODES_NORMAL_TIME;

  for (var i = 0; i < 50; i ++) {
      this.prev_pos[i] = new p5.Vector(this.x, this.y);
  }

//••••••••••••••••••••••••••••••••••••••••••

  this.render = function() {
    push();
    for (var i = 0; i < this.prev_pos.length -1; i ++) {
      strokeWeight(map(i, 0, this.prev_pos.length, 8, 2));
      stroke(255, 231, 201,map(i, 0, this.prev_pos.length, 255, 0));
     // if(this.rhythm === 'quick')
     //   stroke(255,116,115,map(i, 0, this.prev_pos.length, 255, 0) );
      line(this.prev_pos[i].x, this.prev_pos[i].y, this.prev_pos[i+1].x, this.prev_pos[i+1].y );
    }
   // fill(33, 170, 146);
    fill(255, 231, 201);
  //  if(this.rhythm === 'quick')
   //     fill(255,116,115);
    noStroke();
    rectMode(CENTER);
   // rect(this.x, this.y, 10, 10);
    ellipse(this.x, this.y, 8,8);
   // this.renderTarget();
    if(this.render_debug)
      this.renderDebug();
    this.renderTrail();
    pop();
  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.setOrigin = function(x,y, index){
    this.x = x;
    this.y = y;
    this.x_target = this.x;
    this.y_target = this.y;
    this.x_origin = this.x;
    this.y_origin = this.y;
    this.index_target = index;
    for (var i = 0; i < this.prev_pos.length; i ++) {
      this.prev_pos[i] = new p5.Vector(this.x, this.y);
    }
  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.assignTarget = function(x, y, index, ttime) {
    this.x_origin = this.x_target;
    this.y_origin = this.y_target;
    this.x_target = x;
    this.y_target = y;
    this.flag = false;
    this.index_target = index;
    var tolerance = 60;
    this.control_a = createVector(random(this.x_origin - tolerance, this.x_origin + tolerance), random(this.y_origin - tolerance, this.y_origin + tolerance));
    this.control_b = createVector(random(this.x_target - tolerance, this.x_target + tolerance), random(this.y_target - tolerance, this.y_target + tolerance));
    this.calculateControlPoints();

    //this.dir = atan2( this.y_target - this.y, this.x_target - this.x);
    this.travel_time = ttime;
    this.travel_time_trigger = millis();
    this.halfway_reached = false;
    this.halfway_flag = false;

  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.renderTarget = function() {
    push();
    strokeWeight(1);
    stroke(255, 128, 0, 255);
    line(this.x, this.y, this.x_target, this.y_target);
    pop();
  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.renderDebug = function() {
    push();
    this.renderBezier();
    fill(255,0,0);
    noStroke();
    text('travel time: ' + nf(this.travel_time/1000,0,2), 800, 600);
    text('travel curr: ' + nf((millis() - this.travel_time_trigger)/1000,0,2), 800, 630);
    text('vid duration: ' + clips[clip_index].duration(), 800, 660);
    text('rhythm: ' + this.rhythm, 1000, 600);
    text('change time: ' + int(this.rhythm_change_time), 1000, 630);
    text('curr time: ' + int((millis() - this.rhythm_change_trigger)), 1000, 660);
    pop();
  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.renderBezier = function(){
    push();
    stroke(255,0,0);
    noFill();
    strokeWeight(3);
    bezier(this.x_origin, this.y_origin, this.control_a.x, this.control_a.y, this.control_b.x, this.control_b.y, this.x_target, this  .y_target);
    ellipse(this.control_a.x, this.control_a.y, 10, 10);
    ellipse(this.control_b.x, this.control_b.y, 10, 10);
    strokeWeight(1);
    line(this.x_origin, this.y_origin, this.control_a.x,this.control_a.y);
    line(this.x_target, this.y_target, this.control_b.x,this.control_b.y);
    stroke(0,200,0);
    line(this.x_origin, this.y_origin, this.x_target, this.y_target);
    translate(lerp(this.x_origin, this.x_target, 0.5), lerp(this.y_origin, this.y_target, 0.5));
    rotate(this.curve_angle);
    line(0,0,100,0);
    pop();
  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.renderTrail = function() {
      var opacity = 20*sin(frameCount*0.05) + 30;
      this.trail.stroke(255, 231, 201, opacity);
      this.trail.strokeWeight(1.3);
      this.trail.line(this.x,this.y,this.prev_x,this.prev_y);
      if(frameCount % BG_ERASE_INTERVAL === 0){

          var img = createImage(this.trail.width,walker.trail.height);
         // console.log(img.width);
          img.copy(this.trail, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
          this.trail.clear();
          this.trail.push();
          this.trail.tint(255, 255 - BG_ERASE_OPACITY);
          this.trail.image(img,0,0);
          this.trail.pop();
          console.log('bg_erase');
     //   this.trail.background(0,BG_ERASE_OPACITY);
      }


  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.update = function() {
    for (var i = this.prev_pos.length-1; i > 0; i-- ) {
      this.prev_pos[i] = this.prev_pos[i-1];
    }
    this.prev_pos[0] = new p5.Vector(this.x, this.y);

    this.prev_x = this.x;
    this.prev_y = this.y;

    var curr_time = millis() - this.travel_time_trigger;
    this.t = map(curr_time, 0, this.travel_time, 0, 1);
    this.t = constrain(this.t,0,1);
    if(!this.halfway_reached)
        if(this.t>0.5)
            this.raiseHalfFlag();
    //this.x = lerp(this.x_origin,this.x_target,t);
    //this.y = lerp(this.y_origin,this.y_target,t);
    this.x = bezierPoint(this.x_origin, this.control_a.x, this.control_b.x, this.x_target, this.t);
    this.y = bezierPoint(this.y_origin, this.control_a.y, this.control_b.y, this.y_target, this.t);

    var variance = 0;

    if(wiggle){
      if(this.rhythm === 'normal'){
        if(this.t>0.7)
          variance = map(this.t,0.7,1,0,3);
      }else if(this.rhythm === 'quick'){
          variance = map(this.t,0,1,0.2,5);
      }
    }

    this.x += random(-variance, variance);
    this.y += random(-variance, variance);

    if (this.t >= 1){
      this.flag=true;
      if(millis() - this.rhythm_change_trigger > this.rhythm_change_time){
        if(this.rhythm === 'normal'){
            this.rhythm = 'quick';
            this.rhythm_change_trigger = millis();
            this.rhythm_change_time = random(NODES_QUICK_TIME, NODES_QUICK_TIME * 1.3);
        }else if(this.rhythm === 'quick'){
            this.rhythm = 'normal';
            this.rhythm_change_trigger = millis();
            this.rhythm_change_time = random(NODES_NORMAL_TIME, NODES_NORMAL_TIME * 1.8);
        }
      }
    }


  }

  //••••••••••••••••••••••••••••••••••••••••••

  this.calculateControlPoints = function(){
    this.curve_angle = atan2(this.y_origin - this.y_target, this.x_origin - this.x_target);
    this.curve_angle += HALF_PI;

    this.curve_angle = this.curve_angle % TWO_PI;


    var mid = createVector(lerp(this.x_origin, this.x_target, 0.5), lerp(this.y_origin, this.y_target, 0.5));

    var x_center = NODES_LEFT_BORDER + (NODES_RIGHT_BORDER - NODES_LEFT_BORDER)/2;
    var y_center = NODES_TOP_BORDER + (NODES_BOTTOM_BORDER - NODES_TOP_BORDER)/2;

    if(mid.x <= x_center && mid.y <= y_center){// case A
      if(this.curve_angle < PI)
          this.curve_angle += PI;
    } else if(mid.x >= x_center && mid.y <= y_center){// case B
      if(this.curve_angle < PI + HALF_PI)
          this.curve_angle += PI;
    }else if(mid.x >= x_center && mid.y >= y_center){// case C
      if(this.curve_angle >  HALF_PI)
          this.curve_angle += PI;
    }else if(mid.x <= x_center && mid.y >= y_center){// case D
      if(this.curve_angle >  PI)
          this.curve_angle += PI;
    }

    var variance = radians(35);

    var distance = dist(this.x_origin,this.y_origin,this.x_target,this.y_target);

    if(distance === 0 ){
      distance = 200;
      variance = radians(45);
    }

    var min_l = 30;
    var max_l = 150;

    min_l = distance * 0.3;
    max_l = distance * 1;

    min_l = constrain(min_l, 20, 300);
    max_l = constrain(max_l, 20, 300);

    var control_a_angle = this.curve_angle + random(-variance,variance);
    var control_a_length = random(min_l, max_l);
    var control_b_angle = this.curve_angle + random(-variance,variance);
    var control_b_length = random(min_l, max_l);

    var x_a = this.x_origin +  cos(control_a_angle) * control_a_length;
    var y_a = this.y_origin +  sin(control_a_angle) * control_a_length;

    var x_b = this.x_target +  cos(control_b_angle) * control_b_length;
    var y_b = this.y_target +  sin(control_b_angle) * control_b_length;



    this.control_a = createVector(x_a, y_a);
    this.control_b = createVector(x_b, y_b);


  }

//••••••••••••••••••••••••••••••••••••••••••

  this.raiseHalfFlag = function(){
    this.halfway_flag = true;
    this.halfway_reached = true;
  }

//••••••••••••••••••••••••••••••••••••••••••

  this.lowerHalfFlag = function(){
    this.halfway_flag = false;
  }

}
