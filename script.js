// 動画パスの定義
const VIDEO_PATH = "./time/";
const transitions = {
    normal: ["9to0", "0to1", "1to2", "2to3", "3to4", "4to5", "5to6", "6to7", "7to8", "8to9"],
    special: {
        "2-0": "2to0", // 23時 -> 00時の「2」
        "3-0": "3to0", // 23時 -> 00時の「3」
        "5-0": "5to0"  // 59分 -> 00分の「5」
    }
};

// 各桁の状態管理
let prevTimeStr = "      "; // 初回比較用
let useA = [true, true, true, true, true, true]; // 各桁がA/Bどちらを使っているか

function updateClock() {
    const now = new Date();
    
    // 現在時刻に1秒加算する
    now.setSeconds(now.getSeconds() + 1);

    // 加算後の時刻から文字列を作成
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
    const vA = container.querySelector(".v-a");
    const vB = container.querySelector(".v-b");

    const activeVideo = useA[index] ? vA : vB;
    const nextVideo = useA[index] ? vB : vA;

    // 動画ファイルの選択
    let fileName = "";
    const key = `${from}-${to}`;
    
    if (transitions.special[key]) {
        fileName = transitions.special[key]; // 2-0, 3-0, 5-0 などの特殊遷移
    } else {
        fileName = transitions.normal[parseInt(to)]; // 通常の 0to1, 1to2...
    }

    nextVideo.src = `${VIDEO_PATH}${fileName}_2k.webm`;
    nextVideo.load();

    nextVideo.oncanplaythrough = () => {
        // 再生速度を1秒（1000ms）に強制的に合わせる
        nextVideo.playbackRate = nextVideo.duration; 
        
        nextVideo.style.visibility = "visible";
        nextVideo.play();
        
        activeVideo.style.visibility = "hidden";
        activeVideo.pause();

        useA[index] = !useA[index];
        nextVideo.oncanplaythrough = null;
    };
}

// 精度を出すため 100ms ごとにチェック
setInterval(updateClock, 100);

// 初回実行
updateClock();