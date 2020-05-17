function Node( x_, y_, index_ ) {

  this.x = x_;
  this.y = y_;

  this.anim_frames = 0;
  this.anim_duration = 20;
  this.animating = false;
  this.active = false;
  this.index = index_;
  this.clean_radius = NODES_CLEAN_RADIUS;

//••••••••••••••••••••••••••••••••••••••••••

  this.render = function() {

    push();
    rectMode(CENTER);
    if (this.animating) {
      noFill();
      stroke(255,map(this.anim_frames, 0, this.anim_duration, 255, 0));
      var diam = map(this.anim_frames, 0, this.anim_duration, 10, 70);
      ellipse(this.x,this.y,diam,diam);
    }
    fill(255, 231, 201);
    stroke(255, 231, 201);
    //rect(this.x, this.y, 10, 10);
    //ellipse(this.x,this.y,5,5);
    translate(this.x,this.y);
    //triangle(-5,0,5,0,0,7);
    ellipse(0,0,5,5);
    //this.renderCleanRadius();
    pop();
  }

//••••••••••••••••••••••••••••••••••••••••••

  this.renderCleanRadius = function(){
    fill(255,0,0,40);
    stroke(255,0,0);
    ellipse(0,0,this.clean_radius * 2 , this.clean_radius * 2);
    for(var i = 0 ; i < 4 ; i++){
     rotate(HALF_PI);
    // line(0,0,this.clean_radius, 0);
    }
  }

//••••••••••••••••••••••••••••••••••••••••••

  this.update = function() {
    if (this.animating)
      if (this.anim_frames < this.anim_duration)
        this.anim_frames++;
      else
        this.animating = false;
  }

//••••••••••••••••••••••••••••••••••••••••••

  this.fireAnimation = function() {
    this.anim_frames = 0;
    this.animating = true;
  }
}

//••••••••••••••••••••••••••••••••••••••••••
