function createNodes() {
  for (var i = 0; i < clips.length; i++) {
    findNewCoords();
    var node = new Node(new_node_x, new_node_y, i);
    nodes[i] = node;
  }

  console.log('nodes: ' + nodes.length);
}

//••••••••••••••••••••••••••••••••••••••••••

function calculateDimensions(){
  video_width = VIDEO_WIDTH;

  video_width = 1280;

  video_height = int((video_width * RATIO_HEIGHT) / RATIO_WIDTH);
  console.log("video width: " + video_width);
  console.log("video height: " + video_height);
  var offset = 20;
  video_x = (width - (NODES_RIGHT_BORDER - NODES_LEFT_BORDER))/2  + offset;
  video_y = height/2;


  video_x = width/2;
  video_y = height/2;

}

//••••••••••••••••••••••••••••••••••••••••••

function loadClips(){
  for(var i = 0 ; i < 17 ; i ++){
    clips[i] = createVideo(['assets/clips/'+ (i+1) + '.mp4',]);
    clips[i].hide();
  }
}

//••••••••••••••••••••••••••••••••••••••••••

function loadTracks(){
  track = loadSound('assets/audio/loop.mp3');
  node_sound = loadSound('assets/audio/node.mp3');
}

//••••••••••••••••••••••••••••••••••••••••••

function findNewCoords(){
  var x = random(NODES_LEFT_BORDER + NODES_MARGIN, NODES_RIGHT_BORDER - NODES_MARGIN);
  var y = random(NODES_TOP_BORDER + NODES_MARGIN, NODES_BOTTOM_BORDER - NODES_MARGIN);
  // var point = createVector(x, y);
  var is_clean = true;
  for(var i = 0 ; i < nodes.length ; i++){
    if(dist(x, y, nodes[i].x, nodes[i].y) < NODES_CLEAN_RADIUS * 2){
      is_clean = false;
      break;
    }
  }
  if(!is_clean){
    findNewCoords();
  }else{
    new_node_x = x;
    new_node_y = y;
  }

}

//••••••••••••••••••••••••••••••••••••••••••

function setVariables(){
  NODES_LEFT_BORDER = width * .2;
  NODES_TOP_BORDER = height * .2;
  NODES_RIGHT_BORDER = width - NODES_LEFT_BORDER;
  NODES_BOTTOM_BORDER = height - NODES_TOP_BORDER;
  NODES_AREA_WIDTH = NODES_RIGHT_BORDER - NODES_LEFT_BORDER;
  NODES_AREA_HEIGHT = NODES_BOTTOM_BORDER - NODES_TOP_BORDER;
}
