function updateBg(){
// bg.tint(255,10);
// bg.blendMode(SOFT_LIGHT);
// if(first_clip){
// var img = createImage(video_width, video_height);
//  img.copy(video_x - video_width/2 , video_y - video_height/2 , video_width, video_height, 0, 0, img.width, img.height);
// img.copy(clips[clip_index],200,200,200,200,0,0,200,200);
// bg.image(clips[clip_index],0,0,width,height);
// }
//img.copy(clips[clip_index],0,0,img.width,img.height,0,0,img.width,img.height);
// bg.image(clips[clip_index],0,0);
}

//••••••••••••••••••••••••••••••••••••••••••

function renderSpaces(){
  push();
  noFill();
  stroke(255);
  strokeWeight(3);
  rectMode(CENTER);
  rect(video_x,video_y,video_width,video_height);
  rectMode(CORNER);
  rect(NODES_LEFT_BORDER, NODES_TOP_BORDER, NODES_AREA_WIDTH, NODES_AREA_HEIGHT);
  pop();
}

//••••••••••••••••••••••••••••••••••••••••••

function renderGuides() {

  push();
  for (var i = 0; i < width; i += 50) {
    stroke(255, 40);
    strokeWeight(1);
    line(i, 0, i, height);
    strokeWeight(3);
    stroke(255);
    if (i%100 == 0) {
      line(i, 0, i, 45);
      line(i, height, i, height-45);
    } else {
      line(i, 0, i, 20);
      line(i, height, i, height-20);
    }
    fill(255);
    noStroke();
    text(i, i + 5, height-30);
  }
  for (var i = 0; i < height; i += 50) {
    stroke(255, 40);
    strokeWeight(1);
    line(0, i, width, i);
    strokeWeight(3);
    stroke(255);
    if (i%100 == 0) {
      line(0, i, 45, i);
      line(width, i, width-45, i);
    } else {
      line(0, i, 20, i);
      line(width, i, width-20, i);
    }
    fill(255);
    noStroke();
    text(i, 30, i-5);
  }
  pop();
}

//••••••••••••••••••••••••••••••••••••••••••

function renderVideo(){
  push();
  //noFill();
  //stroke(255);
  //strokeWeight(3);
  //rectMode(CENTER);
  //rect(video_x,video_y,video_width,video_height);
  imageMode(CENTER);
   if(first_clip)
  image(clips[clip_index],video_x,video_y, video_width,video_height);
  pop();
}

//••••••••••••••••••••••••••••••••••••••••••

function renderVideoBackground(){
  push();
  tint(255,40);
  if(first_clip)
    image(clips[clip_index],0,0,width,height);
  pop();
}