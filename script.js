// Change the letter, birthday note, playlist, and background track here.
const CONFIG = {
  nickname: 'Precious',
  backgroundMusic: 'assets/music/background.mp3',
  letter: `Helloooo Precious!!!,\n\nI know that I can't be there with you on your 21st bday (sayang), but I uhh still made you a gift!.\n\n There's a lot more that i wanted to say but next time na yan AHHAHAH. I hope you have fun sa party moo and i'll be waiting for the pics :>. \nalso click the bg music on the bottom left`,
  birthday: `Heyyy it’s me again. First and foremost, I want to say that I am so so so proud of you precious!! Look at youuu all grown up now. you’re working, studying, and all of that! I see nothing but light when I look at you because you have a really bright future. Anyways, I want to say thanks to you for ya know, making my heart beat again, and for making me feel emotions when there was nothing xd. I still remember the time you said you’ll miss me back then. Man that made me so happy lol. ANYWAYS AGAIN, I wish I could've celebrate with you in person but ya know, until then, eto muna ha. Happiest birthday to you, my favorite person. Precious. Shall we travel the world together in our 30s?`,
  songs: [
    {
      title: 'Backburner',
      artist: 'NIKI',
      note: 'Tbh any NIKI songs lol.',
      src: 'assets/music/song1.mp3',
    },
    {
      title: 'Aphrodite',
      artist: 'The Ridleys',
      note: 'I remember dedicating this song to you lol.',
      src: 'assets/music/song2.mp3',
    },
    {
      title: 'Secret',
      artist: 'Nakita ko lang sa reels',
      note: 'I hope you find the one.',
      src: 'assets/music/song3.mp3',
    },
  ],
  flowers: [
    ['🌹', 'Rose'],
    ['🌷', 'Tulip'],
    ['🌼', 'Daisy'],
    ['🌻', 'Sunflower'],
    ['💐', 'Lavender'],
    ['🌸', 'Cherry blossom'],
    ['🪷', 'Lily'],
    ['🍃', 'Leaf'],
    ['🎀', 'Ribbon'],
  ],
};
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let currentSong = 0;
const audio = new Audio();
const backgroundAudio = new Audio(CONFIG.backgroundMusic);
let backgroundMusicWanted = false;
let stream = null;
let photos = [];
let shotCount = 0;
let pendingPhotos = false;
let keepsakeUrl = null;
$('#letter-copy').textContent=CONFIG.letter;
$('#birthday-copy').textContent=CONFIG.birthday;
backgroundAudio.loop=true;
backgroundAudio.volume=.28;
const backgroundButton=$('#backgroundAudioToggle'),backgroundStatus=$('#backgroundAudioStatus');
function updateBackgroundButton(playing) {
  backgroundButton.textContent=playing?'♫ Pause background music':'♫ Play background music';
  backgroundButton.setAttribute('aria-pressed',String(playing))
}
backgroundButton.onclick=async()=> {
  if(backgroundMusicWanted) {
    backgroundMusicWanted=false;
    backgroundAudio.pause();
    updateBackgroundButton(false);
    backgroundStatus.textContent='Background music paused.';
    return
  }backgroundMusicWanted=true;
  audio.pause();
  try {
    await backgroundAudio.play();
    updateBackgroundButton(true);
    backgroundStatus.textContent='Background music is playing.'
  }catch(error) {
    backgroundMusicWanted=false;
    updateBackgroundButton(false);
    backgroundStatus.textContent='Add assets/music/background.mp3, then refresh the page.'
  }
};
audio.addEventListener('play',()=> {
  if(!backgroundAudio.paused) {
    backgroundAudio.pause();updateBackgroundButton(false);backgroundStatus.textContent='Background music pauses while a playlist song plays.'
  }
});
audio.addEventListener('ended',()=> {
  if(backgroundMusicWanted) {
    backgroundAudio.play().then(()=> {
      updateBackgroundButton(true);backgroundStatus.textContent='Background music is playing again.'
    }).catch(()=> {
    })
  }
});
function go(id) {
  $$('.scene').forEach(s=>s.classList.toggle('active',s.id===id));
  window.scrollTo( {
    top:0,behavior:'smooth'
  });
  if(id==='scrapbook')watchScrapbookScroll();
  if(id==='final')stopCamera();
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
const envelope=$('#envelope');
function openEnvelope() {
  envelope.classList.add('open');
  setTimeout(()=>go('letter'),650)
}envelope.addEventListener('click',openEnvelope);
envelope.addEventListener('keydown',e=> {
  if(e.key==='Enter'||e.key===' ') {
    e.preventDefault();openEnvelope()
  }
});
function renderPlaylist() {
  const playlist = $('#playlist');
  playlist.innerHTML = '';

  CONFIG.songs.forEach((song, index) => {
    const row = document.createElement('div');
    row.className = 'song';
    row.innerHTML = `<div><strong>${song.title}</strong><small>${song.artist}${song.note ? ` · ${song.note}` : ''}</small></div><button aria-label="Play ${song.title}">${index === currentSong && !audio.paused ? 'Ⅱ' : '▶'}</button>`;
    row.querySelector('button').onclick = () => playSong(index);
    playlist.append(row);
  });
}

function playSong(index) {
  const song = CONFIG.songs[index];
  if (!song) return;

  if (!song.src) {
    currentSong = index;
    $('#musicStatus').textContent = 'Add this song file path to CONFIG.songs before playing it.';
    renderPlaylist();
    return;
  }

  if (currentSong === index && !audio.paused) {
    audio.pause();
    $('.cassette').classList.remove('playing');
  } else {
    currentSong = index;
    audio.src = song.src;
    audio.play()
      .then(() => {
        $('#musicStatus').textContent = '';
      })
      .catch(() => {
        $('#musicStatus').textContent = `Could not play ${song.title}. Check the file path and audio format.`;
      });
    $('.cassette').classList.add('playing');
  }

  renderPlaylist();
}

$$('[data-action="play"]').forEach((button) => {
  button.onclick = () => {
    if (!audio.paused) {
      audio.pause();
      $('.cassette').classList.remove('playing');
      renderPlaylist();
    } else {
      playSong(currentSong);
    }
  };
});

$('[data-action="next"]').onclick = () => playSong((currentSong + 1) % CONFIG.songs.length);
$('[data-action="prev"]').onclick = () => playSong((currentSong + CONFIG.songs.length - 1) % CONFIG.songs.length);
audio.onended = () => {
  $('.cassette').classList.remove('playing');
  renderPlaylist();
};
renderPlaylist();
async function waitForCameraFrame(video) {
  if(video.readyState<HTMLMediaElement.HAVE_CURRENT_DATA||video.videoWidth===0) {
    await new Promise((resolve,reject)=> {
      const timeout=setTimeout(()=> {
        cleanup();reject(new Error('The camera is still starting. Please try again.'))
      },8000);const ready=()=> {
        if(video.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&video.videoWidth>0) {
          cleanup();resolve()
        }
      };const cleanup=()=> {
        clearTimeout(timeout);video.removeEventListener('loadeddata',ready);video.removeEventListener('canplay',ready)
      };video.addEventListener('loadeddata',ready);video.addEventListener('canplay',ready);ready()
    })
  }if(video.readyState<HTMLMediaElement.HAVE_CURRENT_DATA||video.videoWidth===0)throw new Error('The camera did not produce a usable picture. Please try again.');
  if(typeof video.requestVideoFrameCallback==='function') {
    await new Promise((resolve,reject)=> {
      const timeout=setTimeout(()=>reject(new Error('No camera picture arrived. Please check the camera and try again.')),3000);video.requestVideoFrameCallback(()=> {
        clearTimeout(timeout);resolve()
      })
    })
  }else {
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))
  }if(video.videoWidth===0||video.videoHeight===0)throw new Error('The camera did not produce a usable picture. Please try again.')
}
async function startCamera() {
  try {
    stream=await navigator.mediaDevices.getUserMedia( {
      video: {
        facingMode:'user'
      },audio:false
    });
    const video=$('#video');
    video.srcObject=stream;
    video.classList.add('ready');
    $('#camera-placeholder').hidden=true;
    await video.play();
    await waitForCameraFrame(video);
    $('#captureBtn').disabled=photos.length>=3;
    $('#cameraStatus').textContent='Ready when you are.'
  }catch(e) {
    stopCamera();
    $('#video').classList.remove('ready');
    $('#camera-placeholder').hidden=false;
    $('#cameraStatus').textContent=e.message||'Camera unavailable or permission declined. Choose photos from your device instead.'
  }
}function stopCamera() {
  if(stream)stream.getTracks().forEach(t=>t.stop());
  stream=null
}$('#cameraBtn').onclick=startCamera;
function addPhoto(src) {
  if(photos.length<3)photos.push(src);
  renderPhotos()
}function renderPhotos() {
  const strip=$('#photoStrip');
  strip.innerHTML='';
  for(let i=0;i<3;i++) {
    if(photos[i]) {
      const im=new Image();
      im.src=photos[i];
      im.alt=`Photobooth photo ${i+1}`;
      strip.append(im)
    }else {
      const slot=document.createElement('div');
      slot.className='empty-shot';
      strip.append(slot)
    }
  }$('#download').disabled=!photos.length||pendingPhotos;
  $('#captureBtn').disabled=!stream||photos.length>=3||pendingPhotos;
  $('#captureBtn').textContent=photos.length>=3?'All three photos taken':`Take photo ${photos.length+1} of 3`
}
$('#captureBtn').textContent='Take photo 1 of 3';
$('#captureBtn').onclick=async()=> {
  if(!stream||photos.length>=3)return;
  $('#captureBtn').disabled=true;
  try {
    for(let n=3;n>0;n--) {
      $('#countdown').textContent=n;
      await new Promise(r=>setTimeout(r,750))
    }const v=$('#video');
    await waitForCameraFrame(v);
    if(!stream||v.videoWidth===0||v.videoHeight===0)throw new Error('No camera picture was available. Please turn the camera on and try again.');
    const c=document.createElement('canvas');
    c.width=v.videoWidth;
    c.height=v.videoHeight;
    const ctx=c.getContext('2d');
    ctx.translate(c.width,0);
    ctx.scale(-1,1);
    ctx.drawImage(v,0,0,c.width,c.height);
    addPhoto(c.toDataURL('image/jpeg',.94));
    $('#flash').classList.remove('on');
    void $('#flash').offsetWidth;
    $('#flash').classList.add('on')
  }catch(e) {
    $('#cameraStatus').textContent=e.message||'Could not capture a camera picture. Please try again.'
  }finally {
    $('#countdown').textContent='';
    $('#captureBtn').disabled=!stream||photos.length>=3;
    $('#captureBtn').textContent=photos.length>=3?'All three photos taken':`Take photo ${photos.length+1} of 3`
  }
};
$('#uploads').onchange=async e=> {
  const input=e.target,
  files=[...input.files].slice(0,3-photos.length);
  if(!files.length)return;
  pendingPhotos=true;
  $('#download').disabled=true;
  $('#captureBtn').disabled=true;
  $('#cameraStatus').textContent='Loading your selected photos…';
  try {
    const loaded=await Promise.all(files.map(file=>new Promise((resolve,reject)=> {
      const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error(`Could not read ${file.name}`));reader.readAsDataURL(file)
    })));
    photos.push(...loaded.slice(0,3-photos.length));
    $('#cameraStatus').textContent=`${photos.length} of 3 photos are ready in the keepsake.`
  }catch(err) {
    $('#cameraStatus').textContent=err.message
  }finally {
    pendingPhotos=false;
    input.value='';
    renderPhotos()
  }
};
// Five-photo scrapbook with local, editable image paths and upload fallback.
const memories=[
{
  type:'image',
  src:'assets/images/photo1.jpg',
  caption:'And here'
},
{
  type:'image',
  src:'assets/images/photo2.jpg',
  caption:'our memories captured,'
},
{
  type:'image',
  src:'assets/images/photo3.jpg',
  caption:'trapped in a frame.'
},
{
  type:'image',
  src:'assets/images/photo4.jpg',
  caption:'The short but happy moments'
},
{
  type:'image',
  src:'assets/images/photo5.jpg',
  caption:'will forever be in my memory.'
},
{
  type:'image',
  src:'assets/images/photo6.jpg',
  caption:'I wished that i recorded'
},
{
  type:'image',
  src:'assets/images/photo7.gif',
  caption:'all the things we did together,'
},
{
  type:'image',
  src:'assets/images/photo8.jpg',
  caption:'so that when we meet again,'
},
{
  type:'image',
  src:'assets/images/photo9.gif',
  caption:'we can look back'
},
{
  type:'image',
  src:'assets/images/photo10.jpg',
  caption:'and laugh at the things we did.'
},
{
  type:'image',
  src:'assets/images/photo11.jpg',
  caption:'Saudade (search it up)'
},
{
  type:'video',
  src:'assets/videos/Video1.mp4',
  caption:'Kalokohan natin'
},
{
  type:'video',
  src:'assets/videos/Video2.mp4',
  caption:'You being freaky lol'
},
{
  type:'video',
  src:'assets/videos/memory3.mp4',
  caption:'Basketballer yarn?'
}
];
const photoMemories=memories.filter(item=>item.type==='image'),videoMemories=memories.filter(item=>item.type==='video');
const grid=$('#memoryGrid'),videoGrid=$('#videoGrid'),videoSection=$('#videoMemories'),memorySentinel=$('#memorySentinel');
let memoriesShown=0;
const memoryBatchSize=4;
function appendMemory(item,index) {
  const fig=document.createElement('figure');
  fig.className='memory-card memory-reveal';
  fig.style.setProperty('--tilt',`${[-3,2,-1,3,-2][index%5]}deg`);
  const media=document.createElement('img');
  media.src=item.src;
  media.alt=item.caption;
  media.loading='lazy';
  const fallback=document.createElement('span');
  fallback.className='memory-media-placeholder';
  fallback.hidden=true;
  fallback.innerHTML=`<b>✿</b><small>Add <code>${item.src.split('/').pop()}</code></small>`;
  media.onerror=()=> {
    media.hidden=true;
    fallback.hidden=false
  };
  fig.append(media,fallback);
  const caption=document.createElement('figcaption');
  caption.textContent=item.caption;
  fig.append(caption);
  grid.append(fig)
}
function appendVideo(item) {
  const fig=document.createElement('figure');
  fig.className='memory-video-card memory-reveal';
  const media=document.createElement('video');
  media.src=item.src;
  media.muted=true;
  media.loop=true;
  media.autoplay=true;
  media.playsInline=true;
  media.controls=true;
  media.preload='metadata';
  const fallback=document.createElement('span');
  fallback.className='memory-media-placeholder';
  fallback.hidden=true;
  fallback.innerHTML=`<b>▶</b><small>Add <code>${item.src.split('/').pop()}</code> to assets/videos/</small>`;
  media.onloadeddata=()=> {
    fallback.hidden=true
  };
  media.onerror=()=> {
    media.hidden=true;
    fallback.hidden=false
  };
  fig.append(media,fallback);
  const caption=document.createElement('figcaption');
  caption.textContent=item.caption;
  fig.append(caption);
  videoGrid.append(fig);
  media.play().catch(()=> {
  })
}
function revealMoreMemories() {
  const end=Math.min(memoriesShown+memoryBatchSize,photoMemories.length);
  for(;memoriesShown<end;memoriesShown++)appendMemory(photoMemories[memoriesShown],memoriesShown);
  if(memoriesShown>=photoMemories.length) {
    videoMemories.forEach(appendVideo);
    videoSection.hidden=false;
    memoryObserver.disconnect();
    memorySentinel.textContent=''
  }
}
const memoryObserver=new IntersectionObserver(entries=> {
  if(entries.some(entry=>entry.isIntersecting))revealMoreMemories()
}, {
  rootMargin:'220px 0px'
});
revealMoreMemories();
function watchScrapbookScroll() {
  memoryObserver.observe(memorySentinel)
}
$$('.layout-choice').forEach(b=>b.onclick=()=> {
  $$('.layout-choice').forEach(x=>x.classList.toggle('selected',x===b));$('#composition').classList.remove('grid','wide');if(b.dataset.layout!=='classic')$('#composition').classList.add(b.dataset.layout)
});
$('#insertCoin').onclick=()=> {
  $('#boothCurtain').classList.add('open');
  startCamera()
};
// Replace this fixed message with your own note before sharing the site.
const CUSTOM_FLOWER_NOTE='Eto teh flowers for you, one of the things i regret was not giving you one. But heres a digital one for now';
$('#gardenNotePreview').textContent=CUSTOM_FLOWER_NOTE;
$('#download').onclick=async()=> {
  const button=$('#download'),
  status=$('#downloadStatus'),
  save=$('#downloadLink');
  button.disabled=true;
  button.textContent='Preparing PNG…';
  status.textContent='Preparing your complete framed PNG…';
  save.hidden=true;
  save.removeAttribute('href');
  try {
    const canvas=$('#exportCanvas'),
    ctx=canvas.getContext('2d');
    canvas.width=1080;
    canvas.height=1920;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const loadImage=src=>new Promise((resolve,reject)=> {
      const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Could not load ${src}`));image.src=src
    });
    const frame=await loadImage(window.PHOTOBOOTH_FRAME_DATA);
    ctx.drawImage(frame,0,0,1080,1920);
    const slots=[ {
      x:154,
      y:102,
      w:475,
      h:388,
      a:-4
    },
{
      x:182,
      y:517,
      w:475,
      h:388,
      a:-4
    },
{
      x:211,
      y:933,
      w:475,
      h:388,
      a:-4
    }];
    for(let i=0;i<photos.length&&i<3;i++) {
      const im=await loadImage(photos[i]),
      s=slots[i],
      scale=Math.max(s.w/im.width,s.h/im.height),
      w=im.width*scale,
      h=im.height*scale;
      ctx.save();
      ctx.translate(s.x+s.w/2,s.y+s.h/2);
      ctx.rotate(s.a*Math.PI/180);
      ctx.beginPath();
      ctx.rect(-s.w/2,-s.h/2,s.w,s.h);
      ctx.clip();
      ctx.drawImage(im,-w/2,-h/2,w,h);
      ctx.restore()
    }const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob)throw new Error('The browser could not create the PNG. Please try again.');
    if(keepsakeUrl)URL.revokeObjectURL(keepsakeUrl);
    keepsakeUrl=URL.createObjectURL(blob);
    save.href=keepsakeUrl;
    save.hidden=false;
    save.textContent='Download complete keepsake PNG';
    status.textContent='Your complete framed keepsake is ready. Select the download button above to save it.'
  }catch(err) {
    status.textContent=`Keepsake download failed: ${err.message}`
  }finally {
    button.disabled=!photos.length||pendingPhotos;
    button.textContent='Prepare keepsake PNG'
  }
};
