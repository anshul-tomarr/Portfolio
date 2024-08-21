// set up

function backgroundEffect(){
  const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// console.log(ctx);
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
// gradient.addColorStop(0, 'green');
// gradient.addColorStop(0.5, 'red');
// gradient.addColorStop(1, 'blue');
gradient.addColorStop(1, 'rgb(3,3,3)');

// ctx.fillStyle = 'white';
ctx.fillStyle = gradient;
ctx.strokeStyle = 'black';


class Partical{
  constructor(effect, index){
    this.effect = effect;
    this.index = index;
    this.radius = Math.floor(Math.random() * 100 + 5);
    if(this.index % 80 === 0){
      this.radius = Math.floor(Math.random() * 20 + 5);
    }
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 1.5 - 0.5;
    this.vy = Math.random() * 1.5 - 0.5;
    this.pushX = 0;
    this.pushY = 0;
    this.friction = 0.85;
  }
  draw(context){
    // context.globalAlpha = 0.8;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  update(){
    if(this.effect.mouse.pressed){
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = (this.effect.mouse.radius / distance);
      if(distance < this.effect.mouse.radius){
        const angle = Math.atan2(dy, dx);
        this.pushX += Math.cos(angle) * force;
        this.pushY += Math.sin(angle) * force;
      }
    }
    if(this.x < this.radius){
      this.x = this.radius;
      this.vx *= -1;
    } else if(this.x > this.effect.width - this.radius){
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }
    if(this.y < this.radius){
      this.y = this.radius;
      this.vy *= -1;
    } else if(this.y > this.effect.height - this.radius){
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }
    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;
  }

  reset(){
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
  }
}

class Effect{
  constructor(canvas, context){
    this.canvas = canvas;
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particals = [];
    this.numberOfParticales = 200;
    this.creatParticals();

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 150
    }

    window.addEventListener('resize', e => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
    });
    window.addEventListener('mousemove', e => {
      if(this.mouse.pressed){
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
      // console.log(this.mouse.x,this.mouse.y);
    });
    window.addEventListener('mousemove', e => {
      this.mouse.pressed = true;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    window.addEventListener('mouseout', e => {
      this.mouse.pressed = false;
    });
  }
  creatParticals(){
    for(let i=0; i<this.numberOfParticales; i++){
      this.particals.push(new Partical(this , i))
    }
  }
  handleParticals(context){
    this.conectParticals(context);
    this.particals.forEach(partical =>{
      partical.draw(context);
      partical.update();
    });
    
  }
  conectParticals(context){
    const maxDistance = 100;
    for(let a = 0; a < this.particals.length; a++){
      for(let b = a; b < this.particals.length; b++){
        const dx = this.particals[a].x - this.particals[b].x;
        const dy = this.particals[a].y - this.particals[b].y;
        const distance = Math.hypot(dx, dy);
        if(distance < maxDistance){
          context.save();
          const opacity = 1 - (distance/maxDistance);
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particals[a].x, this.particals[a].y);
          context.lineTo(this.particals[b].x, this.particals[b].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
  resize(width, height){
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    const gradient = this.context.createLinearGradient(0, 0, width, height);
    // gradient.addColorStop(0, 'rgb(37, 36, 36)');
    // gradient.addColorStop(0.5, 'black');
    gradient.addColorStop(1, 'rgb(3, 3, 3)');
    this.context.fillStyle = gradient;
    this.context.strokeStyle = 'black'
    this.particals.forEach(partical => {
      partical.reset();
    });
  }
}

const effect = new Effect(canvas,ctx);


function animate(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  effect.handleParticals(ctx);
  requestAnimationFrame(animate);
};
animate();
}
backgroundEffect();

          // <----- image effect ----->

function imageEffect(){
  const canvas = document.getElementById('canvas2');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  class Cell{
    constructor(effect, x, y){
      this.effect = effect;
      this.x = x;
      this.y = y;
      this.width = this.effect.cellWidth;
      this.height = this.effect.cellHeight;
      this.image = document.getElementById('projectImage');
      this.slideX = 0;
      this.slideY = 0;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.01;
      this.friction = 0.8;
    }
    draw(context){
      context.drawImage(this.image, this.x + this.slideX, this.y + this.slideY, this.width, this.height, this.x, this.y, this.width, this.height);
      
      // context.strokeRect(this.x, this.y, this.width, this.height);
    }
    update(){
      const dx = this.effect.mouse.x - this.x;
      const dy = this.effect.mouse.y - this.y;
      const distance = Math.hypot(dx, dy);
      if(distance < this.effect.mouse.radius){
        const angle = Math.atan2(dy, dx);
        const force = distance / this.effect.mouse.radius;
        this.vx = force * Math.cos(angle);
        this.vy = force * Math.sin(angle);
      } 
      this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
      this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
    }
  }

  class Effect{
    constructor(canvas){
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.cellWidth = this.width / 30;
      this.cellHeight = this.height / 35;
      this.cell = new Cell(this, 0, 0);
      this.imageGrid = [];
      this.createGrid();
      this.mouse = {
        x: undefined,
        y: undefined,
        radius: 100,
      }
      this.canvas.addEventListener('mousemove', e => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      });
      this.canvas.addEventListener('mouseleave', e => {
        this.mouse.x = undefined;
        this.mouse.y = undefined;
      });
    }
    createGrid(){
      for(let y = 0; y < this.height; y += this.cellHeight){
        for(let x = 0; x < this.width; x += this.cellWidth){
          this.imageGrid.push(new Cell(this, x, y));
        }
      }
    }
    render(context){
      
      this.imageGrid.forEach((cell, i) => {
        cell.update();
        cell.draw(context);
      })
    }
  }

  const effect = new Effect(canvas);


  function animate(){
    effect.render(ctx)
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
imageEffect();


          // <--- header scroll animation --->


const body = document.body;
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if(currentScroll <= 0){
    body.classList.remove('scroll_up');
  }
  if(currentScroll > lastScroll && !body.classList.contains('scroll_down')){
    body.classList.remove('scroll_up');
    body.classList.add('scroll_down');
  }
  if(currentScroll < lastScroll && body.classList.contains('scroll_down')){
    body.classList.remove('scroll_down');
    body.classList.add('scroll_up');
  }


  lastScroll = currentScroll;
});


          // ----- home featured projects img effect -----

          
const homefeaturedimg1 = document.getElementById('home_featured_img1');
const homefeaturedimg2 = document.getElementById('home_featured_img2');
const homefeaturedimg3 = document.getElementById('home_featured_img3');
const homefeaturedtitle1 = document.getElementById('home_featured_title1');
const homefeaturedtitle2 = document.getElementById('home_featured_title2');
const homefeaturedtitle3 = document.getElementById('home_featured_title3');


homefeaturedimg1.addEventListener('mousemove', (e) => {
  homefeaturedimg2.classList.add('home_featured_image2');
  homefeaturedimg3.classList.add('home_featured_image3');
  homefeaturedtitle1.style.opacity = "100%";
  homefeaturedimg1.style.transform = "scale(102%)";
  homefeaturedtitle1.classList.add('home_featured_titletxt1');

  homefeaturedimg1.style.transition = "all 0.2s ease-in";
  homefeaturedtitle1.style.transition = "all 0.2s ease-in";
  homefeaturedimg2.style.transition = "all 0.2s ease-in";
  homefeaturedimg3.style.transition = "all 0.2s ease-in";
});
homefeaturedimg1.addEventListener('mouseleave', (e) => {
  homefeaturedimg2.classList.remove('home_featured_image2');
  homefeaturedimg3.classList.remove('home_featured_image3');
  homefeaturedtitle1.classList.remove('home_featured_titletxt1');
  homefeaturedtitle1.style.opacity = "0%";
  homefeaturedimg1.style.transform = "scale(100%)"
});


homefeaturedimg2.addEventListener('mousemove', (e) => {
  homefeaturedimg1.classList.add('home_featured_image1');
  homefeaturedimg3.classList.add('home_featured_image3');
  homefeaturedtitle2.style.opacity = "100%"
  homefeaturedimg2.style.transform = "scale(102%)";
  homefeaturedtitle2.classList.add('home_featured_titletxt2');

  homefeaturedimg2.style.transition = "all 0.2s ease-in";
  homefeaturedtitle2.style.transition = "all 0.2s ease-in";
  homefeaturedimg1.style.transition = "all 0.2s ease-in";
  homefeaturedimg3.style.transition = "all 0.2s ease-in";
});
homefeaturedimg2.addEventListener('mouseleave', (e) => {
  homefeaturedimg1.classList.remove('home_featured_image1');
  homefeaturedimg3.classList.remove('home_featured_image3');
  homefeaturedtitle2.classList.remove('home_featured_titletxt2');
  homefeaturedtitle2.style.opacity = "0%"
  homefeaturedimg2.style.transform = "scale(100%)";
});


homefeaturedimg3.addEventListener('mousemove', (e) => {
  homefeaturedimg2.classList.add('home_featured_image2');
  homefeaturedimg1.classList.add('home_featured_image1');
  homefeaturedtitle3.style.opacity = "100%";
  homefeaturedimg3.style.transform = "scale(102%)";
  homefeaturedtitle3.classList.add('home_featured_titletxt3');

  homefeaturedimg3.style.transition = "all 0.2s ease-in";
  homefeaturedtitle3.style.transition = "all 0.2s ease-in";
  homefeaturedimg2.style.transition = "all 0.2s ease-in";
  homefeaturedimg1.style.transition = "all 0.2s ease-in";
});
homefeaturedimg3.addEventListener('mouseleave', (e) => {
  homefeaturedimg2.classList.remove('home_featured_image2');
  homefeaturedimg1.classList.remove('home_featured_image1');
  homefeaturedtitle3.classList.remove('home_featured_titletxt3');
  homefeaturedtitle3.style.opacity = "0%";
  homefeaturedimg3.style.transform = "scale(100%)";
});



    //  ------Capabilities - section ------

function Capabilities(){
  const canvas = document.getElementById('canvas3');
  canvas.width = 1250;
  canvas.height = 550;
  const ctx = canvas.getContext('2d');

  function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  let mouse = {
    x: undefined,
    y: undefined
  };
  let mousep = {
    xp: undefined,
    yp: undefined
  };
  canvas.addEventListener('click', function(event){
    mousep.xp = event.clientX - canvas.offsetLeft;
    mousep.yp = event.clientY - canvas.offsetTop;
    // console.log(mouse.x, mouse.y);
  });
  canvas.addEventListener('mousemove', function(event){
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
    // console.log(mouse.x, mouse.y);
  });
  canvas.addEventListener('mouseout', function(event){
    mouse.x = undefined;
    mouse.y = undefined;
    mousep.xp = undefined;
    mousep.yp = undefined;
  })
  function gotDistance(x1, y1, x2, y2){
    let distanceX = x2 - x1;
    let distanceY = y2 - y1;
    
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY ,2));
  };


  //  * Rotates coordinate system for velocities
  //  *
  //  * Takes velocities and alters them as if the coordinate system they're on was rotated
  //  *
  //  * @param  Object | velocity | The velocity of an individual particle
  //  * @param  Float  | angle    | The angle of collision between two objects in radians
  //  * @return Object | The altered x and y velocities after the coordinate system has been rotated
  
  function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
  }

  // * Swaps out two colliding particles' x and y velocities after running through
  // * an elastic collision reaction equation
  // *
  // * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
  // * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
  // * @return Null | Does not return a value

  function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
  }

  function Particle(x, y, radius, color, text, str1, str2){
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
    this.opacity = 100;
    this.mass = 1;
    this.x = x;
    this.dx = this.x;
    this.y = y;
    this.dy = this.y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.fillcolor = 'transparent';
    this.textcolor = 'white'
    this.str1 = str1;
    this.str2 = str2;
    
    this.update = function(){ 
      for(let i = 0; i < particles.length; i++){
        if(this === particles[i]) continue;
        if(gotDistance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0){
          resolveCollision(this, particles[i])
        };
      };
      if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width){
        this.velocity.x = -this.velocity.x;
      };
      if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height){
        this.velocity.y = -this.velocity.y;
      };
    
      
      // mouse collision detection
      if(gotDistance(mouse.x, mouse.y, this.x, this.y) < this.radius ){
        this.fillcolor = 'white';
        this.textcolor = 'black';
      }else if(gotDistance(mouse.x, mouse.y, this.x, this.y) > this.radius ){
        this.fillcolor = 'transparent';
        this.textcolor = 'white';
      }else if(mouse.x == undefined){
        this.fillcolor = 'transparent';
        this.textcolor = 'white';
      };
      if(gotDistance(mousep.xp, mousep.yp, this.x, this.y) < this.radius ){
        this.x = mousep.xp
        this.y = mousep.yp
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.draw();
    };
    
    this.draw = function(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      // ctx.save();
      // ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.fillcolor;
      ctx.fill();
      // ctx.restore();
      ctx.strokeStyle = this.color;
      ctx.stroke();
      ctx.font = '12px Arial';
      ctx.fillStyle = this.textcolor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if(this.str2 != 0){
        ctx.fillText(this.str1, this.x, this.y - 8);
        ctx.fillText(' ' + this.str2, this.x, this.y + 8);     
      }
      if(this.str2 == 0){
        ctx.fillText(this.str1, this.x, this.y);
      }
      ctx.closePath();
    };
  };

  //initiation
  let particles;
  function init(){
    particles = [];
    for(let i = 0; i < 4; i++){
      radius = 60;
      let x = randomIntFromRange(radius, canvas.width - radius);
      let y = randomIntFromRange(radius, canvas.height - radius);
      color = 'white';

      if(i !==0){
        for(let j=0; j < particles.length; j++){
          if(gotDistance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0){
            x = randomIntFromRange(radius, canvas.width - radius);
            y = randomIntFromRange(radius, canvas.height - radius);

            j = -1;
          }
        }
      }

      particles.push(new Particle(x, y, radius, color));
    };
    particles[0].str1 = 'LANDING';
    particles[0].str2 = 'PAGES';
    particles[1].str1 = 'UI/UX';
    particles[1].str2 =  'DESIGN';
    particles[2].str1 = 'INERACTIVE';
    particles[2].str2 =  'DESIGN';
    particles[3].str1 = 'ECOMMERCE';
    particles[3].str2 =  0;
  };

  //animation loop
  function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for(let i=0; i < particles.length; i++){
      particles[i].update();
    }    
  };
  init();
  animate();
}    
Capabilities();


// ----- home contact background -----
const contactbg = document.getElementById('home_contact_bgg');
const contactssc = document.getElementById('home_contact_ssc')
const contactborder = document.getElementById('home_contact_txt_container');
window.addEventListener('scroll', scroll);

function scroll(){
  const triggerbottom = window.innerHeight/9.9;

    const bgbottom = contactssc.getBoundingClientRect().top;
    if(bgbottom < triggerbottom){
      contactbg.classList.add('home_contact_bg');
      console.log('add bg' , triggerbottom);
      contactborder.classList.add('home_contact_add_border');
    } else{
      contactbg.classList.remove('home_contact_bg');
      console.log('remove bg', triggerbottom);
      contactborder.classList.remove('home_contact_add_border');
  }
}


            // <---- reveal animation stuff ---->

function  startLoader(){
  let counting = document.querySelector('#counting1');
  let currentValue = 0;

  function updateCounting(){
    if(currentValue === 100){
      return;
    } else {
      currentValue += Math.floor(Math.random()*10) + 1;
    }
    if(currentValue > 100){
      currentValue = 100
    }
    counting.textContent = currentValue + "%";
    
    let delay = Math.floor(Math.random() * 150) + 20;
    setTimeout(updateCounting, delay) 
  }
  updateCounting();
}
startLoader();


gsap.to("#counting1",0.4,{
  delay: 2.4,
  opacity: 0,
});

gsap.to(".heading_span",0.4,{
  delay: 2.5,
  y: -120,
  opacity: 1,
  stagger: {
    amount: 0.5,
  },
  ease: "power4,inOut",
});
gsap.to(".heading_spa",0.5,{
  delay: 2.7,
  y: -122,
  opacity: 1,
  stagger: {
    amount: 0.5,
  },
  ease: "power4,inOut",
});
gsap.to(".reveal_heading",0.5,{
  delay: 3.5,
  opacity:0
})

gsap.to(".bar",0.5,{
  delay: 3.8,
  y: 800,
  stagger: {
    amount: 0.5,
  },
  ease: "power4,inOut"
})
gsap.to(".reveal",0.5,{
  delay: 4.3,
  opacity: 0,
  ease: "power4,inOut",
})
