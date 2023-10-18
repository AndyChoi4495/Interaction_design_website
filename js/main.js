(() => {
    let yOffset = 0; // window.scrollY Variable
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 눈 앞에 보고있는 씬(current scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true
    let acc = 0.2;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        {
            // index 0
            type: 'sticky',
            heightNum: 5, // 5 times height based on browser set scrollHeight
            scrollHeight: 0, // Depends on scrollHeight diplays pictures
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                // context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [],
            },
        },
        {
            // index 1
            type: 'normal',
            heightNum: 5, // 5 times height based on browser set scrollHeight
            scrollHeight: 0, // Depends on scrollHeight diplays pictures
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                // context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [],
            },
        },
        {
            // index 2
            type: 'sticky',
            heightNum: 5, // 5 times height based on browser set scrollHeight
            scrollHeight: 0, // Depends on scrollHeight diplays pictures
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                // context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [],
            },
        },
        {
            // index 3
            type: 'sticky',
            heightNum: 5, // 5 times height based on browser set scrollHeight
            scrollHeight: 0, // Depends on scrollHeight diplays pictures
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                // context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [],
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            },
        },
    ];

    function setLayout() {
        // set each section of height for scroll
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.screenY;
        let totalScrollHeight = 0;

        for (let i = 0; i < sceneInfo.length; i++) {
            // 새로 고침 햇을경우 currentScene 설정하기
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) {
        let rv; // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight; //현재 scence 에 스크롤 된 위치
        const scrollRatio = currentYOffset / scrollHeight; //(min: 0 ~ max: 1)

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight; // 현재 페이지 스크롤 위치 ex) section 0 에 어디에 위치했나
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;

        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            document.body.classList.remove('scroll-effect-end');
        }

        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            if (currentScene === sceneInfo.length - 1) {
                document.body.classList.add('scroll-effect-end');
            }
            if (currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            if (currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        playAnimation();
    }
    window.addEventListener('load', setLayout);
    window.addEventListener('scroll', () => {
        yOffset = window.scrollY;
        scrollLoop();
    });
    setLayout();
})();
