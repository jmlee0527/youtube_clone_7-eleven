// API 주소(VideoList)
const VideoList = 'https://oreumi.appspot.com/video/getVideoList';
//videoinfo를 가져오는 API
const videoUrl = "https://oreumi.appspot.com/video/getVideoInfo?video_id="

// 정보를 가져오는 함수
async function fetchData() {
    try {
        const response = await fetch(VideoList); //fetch함수로 API URL에 응답내용을 response 변수에 담는다
        const VideoList_data = await response.json(); //response 에 담긴 내용을 json형태로 VideoList_data에 담는다
        videoData(VideoList_data);
        console.log(VideoList_data);
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}
//mainContainer에 영상들을 불러오는 함수
async function videoData(data) {
    try {
        // 로딩 이미지 생성 및 스타일 설정
        const loadingImage = document.createElement("img");
        loadingImage.src = "./img/sidebar/spin.gif";
        loadingImage.style.background = `url("./img/sidebar/spin.gif") no-repeat center`;
        loadingImage.style.backgroundSize = "contain";
        loadingImage.style.width = "100px";
        loadingImage.style.height = "100px";
        loadingImage.style.margin = "20px auto";

        // 메인 컨테이너 요소 가져오기
        const mainContainer = document.getElementById("mainContainer");

        // 로딩 이미지를 메인 컨테이너에 추가
        mainContainer.appendChild(loadingImage);

        // data 배열의 각 비디오 정보를 가져오기 위해 비동기 프로미스 배열 생성
        const fetchPromises = data.map(async (video_src) => {
            let video_desc = video_src.video_id.toString();
            const response = await fetch(videoUrl + video_desc);
            const data_video = await response.json();
            return data_video;
        });

        // 모든 비디오 데이터를 한꺼번에 가져오기 위해 프로미스들을 병렬로 처리
        const videoDataArray = await Promise.all(fetchPromises);

        // 각 비디오 데이터에 대해 프로필 이미지를 가져오고 메인 컨테이너에 데이터를 추가하는 작업 수행
        videoDataArray.forEach(async (videoData) => {
            const profileImage = await channelData(videoData.video_channel); // 채널 프로필 이미지 가져오기
            videoData.profile_image = profileImage.channel_profile;
            appendItemsToMain(videoData);
        });

        // 데이터 로딩이 완료되었으므로 로딩 이미지를 숨깁니다.
        loadingImage.style.display = "none";
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

//chennelvedio를 가져오는 API
const channelList = 'https://oreumi.appspot.com/channel/getChannelVideo?video_channel=';
// 정보를 가져오는 함수
async function fetchChannelData(searchValue) {
    try {
        const data = { "video_channel": searchValue }
        // API에 POST 요청을 보내서 채널 비디오 리스트 데이터를 가져옴
        const response = await fetch(channelList, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('API 호출에 실패했습니다');
        }
        const channelList_data = await response.json();

        videoData(channelList_data);
        console.log(channelList_data);

        // 채널 정보 가져오기
        await channelData(channelList_data);

        return channelList_data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

// channelinfo에서 channel profile 가져오기 위한 API URL
const channelurl = "https://oreumi.appspot.com/channel/getChannelInfo?video_channel=";
// channelinfo에서 비디오 채널 데이터를 가져오는 비동기 함수
async function channelData(data) {
    try {
        const response = await fetch(channelurl + data, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { 'video_channel': data }
        });
        if (!response.ok) {
            throw new Error('API 호출에 실패했습니다');
        }
        const channelInfoData = await response.json();
        return channelInfoData;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

//홈 video

//숫자를 천,백만 단위에 K,M으로 변경
function formatNumber(num) {
    if (num >= 1000000) {
        // 백만 단위 이상일 경우 "M"으로 표현
        return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
        // 천 단위 이상일 경우 "K"로 표현
        return (num / 1000).toFixed(1) + "K";
    } else {
        // 그 외의 경우는 그대로 반환
        return num.toString();
    }
}
//maincontainer
function appendItemsToMain(data) {

    function daysPassedSinceDate(dateString) {
        const date = new Date(dateString); // 입력받은 날짜 문자열을 Date 객체로 변환
        const currentDate = new Date(); // 현재 날짜를 구함

        // 입력된 날짜와 현재 날짜의 타임스탬프 차이 계산
        const timeDifferenceInMilliseconds = currentDate - date;
        const daysPassed = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);

        return Math.floor(daysPassed); // 소수점 이하는 버림하여 정수값으로 반환
    } async function channelData(data) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            const response = await fetch(data, requestOptions);  // channelUrl값으로 응답내용 호출
            const channelUrl = await response.json();       // json 형태로 변경
        } catch (error) {
            console.error('API 호출에 실패했습니다:', error);
        }
    }
    const daysPassed = daysPassedSinceDate(data.upload_date);

    const mainContainer = document.getElementById("mainContainer");  //영상들을 나열할 태그 선택
    const span = document.createElement("span"); // 영상들을 어떤 태그에 담을지 선택

    span.innerHTML = `    
    <form id="video-Form-${data.video_id}" action="video.html" method="GET">\n
        <input type="hidden" name="id" value="${data.video_id}">\n
        <input type="hidden" name="channel" value="${data.video_channel}">\n                         
    </form>\n
    <form id="channel-Form-${data.video_id}" action="channel.html" method="GET">\n
        <input type="hidden" name="id" value="${data.video_id}">\n 
        <input type="hidden" name="channel" value="${data.video_channel}">\n                        
    </form>\n
    <img src=${data.image_link} class="video-${data.video_id}">\n
    <div class='profile-and-desc'>\n
        <img class="channel-${data.video_id}" src="${data.profile_image}" >\n
        <div>\n
            <p class="video-${data.video_id}">${data.video_title}</p>\n
            <p class="channel-${data.video_id}">${data.video_channel}</p>\n
            <p class="video-${data.video_id}">${formatNumber(data.views)} views · ${daysPassed}일전</p>        
        </div>\n
    </div>`;// videoData
    mainContainer.appendChild(span);

    // 이미지를 클릭하면 submit ------- class와 id 또는 태그 부분 CSS와 회의 필요    

    document.querySelectorAll(".video-" + data.video_id).forEach((element) => {
        element.addEventListener("click", function () {
            document.getElementById("video-Form-" + data.video_id).submit()
        });
    });
    document.querySelectorAll(".channel-" + data.video_id).forEach((element) => {
        element.addEventListener("click", function () {
            document.getElementById("channel-Form-" + data.video_id).submit()
        });
    });
}

fetchData();
//검색창
const searchBtn = document.querySelector("div.searchbox > a");
const searchTextbox = document.querySelector("#searchInput"); // 검색 입력란 요소

async function search(searchText) {
    try {
        const response = await fetch(VideoList); // 영상 목록 데이터 가져오기
        const VideoList_data = await response.json(); // JSON 형태로 변환

        // 검색 텍스트를 소문자로 변환하여 대소문자 구분 없이 검색
        const searchTextLower = searchText.toLowerCase();

        const mainContainer = document.getElementById("mainContainer");
        mainContainer.innerHTML = "";
        // 검색 조건에 맞는 영상들만 필터링
        const findVideoList = VideoList_data.filter((data) => {
            const title = data.video_title.toLowerCase();
            const channelName = data.video_channel.toLowerCase();
            return title.includes(searchTextLower) || channelName.includes(searchTextLower);
        });

        if (findVideoList.length === 0) {
            // 검색 결과가 없는 경우 알림을 띄움
            alert("검색 결과가 없습니다.");
            return;
        }

        const fetchPromises = findVideoList.map(async (videoData) => {
            const video_desc = videoData.video_id.toString();
            const response = await fetch(videoUrl + video_desc);
            const data_video = await response.json();
            return data_video;
        });

        // 모든 비디오 데이터를 한꺼번에 가져오기 위해 프로미스들을 병렬로 처리
        const videoDataArray = await Promise.all(fetchPromises);

        // 검색 결과를 메인 컨테이너에 추가
        videoDataArray.forEach(async (videoData) => {
            const profileImage = await channelData(videoData.video_channel); // 채널 프로필 이미지 가져오기
            videoData.profile_image = profileImage.channel_profile;
            appendItemsToMain(videoData);
        });

    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}
// 검색 버튼 클릭 이벤트 핸들러
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const searchText = searchTextbox.value; // 검색어를 얻어옴
    search(searchText); // 검색 함수 호출
});

// Enter 키 입력 이벤트 핸들러
async function homeEnterkey(event) {
    if (event.keyCode === 13) {
        await search(searchTextbox.value);
    }
}
