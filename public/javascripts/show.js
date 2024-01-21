let progress=document.getElementById('progress');
    let songEle=document.getElementById('song');
    let ctrlIcon=document.getElementById('ctrlIcon');
    let nextSong=document.getElementById('nextSong');
    let prevSong=document.getElementById('prevSong');

    songEle.play();

    songEle.onloadedmetadata = function(){
        progress.max=songEle.duration;
        progress.value=songEle.currentTime;
    }

    function playPause(){
        if(ctrlIcon.classList.contains('fa-pause')){
            songEle.pause();
            ctrlIcon.classList.remove('fa-pause');
            ctrlIcon.classList.add('fa-play');
        }
        else{
            songEle.play();
            ctrlIcon.classList.add('fa-pause');
            ctrlIcon.classList.remove('fa-play');
        }
    }
    if(songEle.play())
    {
        setInterval(()=>{
            progress.value=songEle.currentTime;
        },500);
    }
    progress.onchange=function(){
        songEle.play();
        songEle.currentTime=progress.value;
        ctrlIcon.classList.add('fa-pause');
        ctrlIcon.classList.remove('fa-play');
    }