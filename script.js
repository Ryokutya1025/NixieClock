const VIDEO_PATH = "./time/";
const transitions = {
    normal: ["9to0", "0to1", "1to2", "2to3", "3to4", "4to5", "5to6", "6to7", "7to8", "8to9"],
    special: {
        "2-0": "2to0", 
        "3-0": "3to0", 
        "5-0": "5to0"  
    }
};

let prevTimeStr = "      "; 
let useA = [true, true, true, true, true, true]; 

function updateClock() {
    const now = new Date();
    
    // 次の1秒を表示（切り替えアニメーション用）
    now.setSeconds(now.getSeconds() + 1);

    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const currentTimeStr = h + m + s;

    for (let i = 0; i < 6; i++) {
        const currentDigit = currentTimeStr[i];
        const prevDigit = prevTimeStr[i];

        if (currentDigit !== prevDigit) {
            animateDigit(i, prevDigit, currentDigit);
        }
    }
    prevTimeStr = currentTimeStr;
}

function animateDigit(index, from, to) {
    const container = document.getElementById(`digit${index + 1}`);
    if (!container) return;

    const vA = container.querySelector(".v-a");
    const vB = container.querySelector(".v-b");

    const activeVideo = useA[index] ? vA : vB;
    const nextVideo = useA[index] ? vB : vA;

    let fileName = "";
    const key = `${from}-${to}`;
    
    if (transitions.special[key]) {
        fileName = transitions.special[key];
    } else {
        fileName = transitions.normal[parseInt(to)];
    }

    nextVideo.src = `${VIDEO_PATH}${fileName}_2k.webm`;
    nextVideo.load();

    nextVideo.oncanplaythrough = () => {
        // 再生速度を調整
        nextVideo.playbackRate = nextVideo.duration || 1.0; 
        
        nextVideo.style.visibility = "visible";
        nextVideo.play();
        
        activeVideo.style.visibility = "hidden";
        activeVideo.pause();

        useA[index] = !useA[index];
        nextVideo.oncanplaythrough = null;
    };
}

// 起動
setInterval(updateClock, 1000);
updateClock();