	var clips = [];
	var nodes = [];
	var track;
	var node_sound;
	var walker;
	var clip_index = 0;
	var first_clip  = false;
	var bg;

	let font;
	// we will have one shader that blurs horizontally, and one that blurs vertically
	let blurH, blurV;
	// we need two createGraphics layers for our blur algorithm
	let pass1, pass2;


	//••••••••••••••••••••••••••••••••••••••••••

	function preload(){
		blurH = loadShader('base.vert', 'blur.frag');
		blurV = loadShader('base.vert', 'blur.frag');
		font = loadFont('assets/Apercu Pro Light.otf');
		loadClips();
		loadTracks();
	}
	//••••••••••••••••••••••••••••••••••••••••••

	function startEverything(){
		track.loop();
		fireWalker();
		noCursor();
	}
	//••••••••••••••••••••••••••••••••••••••••••

	function setup() {

		createCanvas(windowWidth,windowHeight);


		setVariables();

		calculateDimensions();
		createNodes();
		walker = new Walker();


		bg = createGraphics(width,height);
	  bg.pixelDensity(1);

		pass1 = createGraphics(windowWidth, windowHeight, WEBGL);
		pass2 = createGraphics(windowWidth, windowHeight, WEBGL);

		// turn off the cg layers stroke
		pass1.noStroke();
		pass2.noStroke();

		textAlign(CENTER, CENTER);
		// initialize the createGraphics layers
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function draw(){

		background(0);
		//if(acum_bg)
		//	image(bg,0,0);
		//renderVideoBackground();
	//	renderVideo();

	if(FIRST_CLICK){

	 	let blur_amt = 0;

		if(walker.t > 0.5){
			blur_amt = map(walker.t, 0.5, 1, 0, MAX_BLUR);
		}

	// set the shader for our first pass
		 pass1.shader(blurH);

		 // send the camera texture to the horizontal blur shader
		 // send the size of the texels
		 // send the blur direction that we want to use [1.0, 0.0] is horizontal
		 blurH.setUniform('tex0', clips[clip_index]);
		 blurH.setUniform('texelSize', [1.0/width*blur_amt, 1.0/height*blur_amt]);
		 blurH.setUniform('direction', [1.0, 0.0]);

		 // we need to make sure that we draw the rect inside of pass1
		 pass1.rect(0,0,width, height);

		 // set the shader for our second pass
		 pass2.shader(blurV);

		 // instead of sending the webcam, we will send our first pass to the vertical blur shader
		 // texelSize remains the same as above
		 // direction changes to [0.0, 1.0] to do a vertical pass
		 blurV.setUniform('tex0', pass1);
		 blurV.setUniform('texelSize', [1.0/width*blur_amt, 1.0/height*blur_amt]);
		 blurV.setUniform('direction', [0.0, 1.0]);

		 // again, make sure we have some geometry to draw on in our 2nd pass
		 pass2.rect(0,0,width, height);

		 // draw the second pass to the screen
		 image(pass2, 0,0, width, height);




			// filter(GRAY);
		image(walker.trail,0,0);
		//renderSpaces();

		for(var i = 0 ; i < nodes.length ; i ++){
			nodes[i].render();
			nodes[i].update();
		}
		walker.render();
		walker.update();
		if(walker.flag){
			//if(acum_bg)
			//	updateBg();
			node_sound.play();

			if(walker.rhythm === 'quick'){
				var vol = random(0.4, 0.8);
				node_sound.setVolume(vol);
			}else
				node_sound.setVolume(0.2);
			nodes[walker.index_target].fireAnimation();
			handleNode();
		}

	}else{
		push();
		let th = 20;
		textFont(font, th);
		noStroke();
		let tex = 'caer';
		let delta = 0;
		cursor(ARROW);
		if(mouseY > height/2 - th/2 && mouseY < height/2 + th/2){
			if(mouseX > width/2 - textWidth(tex)/2 &&  width/2 + textWidth(tex)/2){
				delta = 1;
				cursor(HAND);
			}

		}

		fill(252, 216, 172);
		text(tex, width/2 + random(-delta, delta), height/2  + random(-delta, delta));
		stroke(252, 216, 172);


		pop();



	}
		//if(walker.halfway_flag){
		//	walker.lowerHalfFlag();
		//}
	//	renderGuides();
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function mousePressed(){
		if(!FIRST_CLICK ){
			FIRST_CLICK = true;
			startEverything();
		}
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function keyPressed(){
	//	if(keyCode === 68){
	//		console.log('key');
	//		walker.render_debug = !walker.render_debug;
	//	}
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function fireWalker(){
		var index = int(random(nodes.length));
		walker.setOrigin(nodes[index].x, nodes[index].y, index);
		clip_index = index;
		fireVideo();
		selectTarget();
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function handleNode(){
		if(first_clip)
			stopVideo()
		selectTarget();
		flag = true;
		fireVideo();
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function selectTarget(){
		clip_index = walker.index_target;

		var max = MAX_DURATION;
		if(walker.rhythm === 'quick')
			max = MAX_DURATION_QUICK;

		if((clips[clip_index].duration() * 1000) < max)
			max = clips[clip_index].duration() * 1000;

		var min = MIN_DURATION;
		if(walker.rhythm === 'quick')
			min = MIN_DURATION_QUICK;

		if((clips[clip_index].duration() * 1000) < min)
			min = clips[clip_index].duration() * 1000;

		var duration = (random(min, max));

		if(!first_clip)
			duration = MIN_DURATION;

		first_clip = true;
		var index = int(random(nodes.length));
		var x = nodes[index].x;
		var y = nodes[index].y;
		walker.assignTarget(x,y,index,duration);
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function fireVideo(){
	 	clips[clip_index].play();
	 	clips[clip_index].volume(0);
	}

	//••••••••••••••••••••••••••••••••••••••••••

	function stopVideo(){
	 	clips[clip_index].stop();
	}
