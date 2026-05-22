import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_KEY = "AIzaSyDxLg0QxECeZGluy1-7kaocA1m4Sm3RoTI";

export default function Shorts() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef({});

  useEffect(() => {
    fetchShortsData();
  }, []);

  const fetchShortsData = async () => {
    setLoading(true);
    try {

      const randomKeywords = ["#Shorts", "funny shorts", "gaming shorts", "viral shorts", "trending shorts", "entertainment"];
      const selectedQuery = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];

      // 2. استخدام "publishedBefore" أو "publishedAfter" عشوائي قليلاً لضمان تغيير النتائج
      const randomPage = Math.floor(Math.random() * 5); // اختيار صفحة عشوائية من النتائج (0 إلى 4)

      const searchRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            maxResults: 10,
            q: selectedQuery,
            type: 'video',
            videoDuration: 'short',
            order: 'viewCount',
            relevanceLanguage: 'ar',
            key: API_KEY
          }
        }
      );

   
      const shuffledItems = searchRes.data.items.sort(() => Math.random() - 0.5);
      
      const videoIds = shuffledItems.map(item => item.id.videoId).join(',');
      
      const statsRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
      );

      setVideos(statsRes.data.items);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videos.length === 0) return;

    const observerOptions = { root: null, threshold: 0.8 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.dataset.videoid;
        const iframe = videoRefs.current[videoId];
        if (iframe && iframe.contentWindow) {
          if (entry.isIntersecting) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        }
      });
    }, observerOptions);

    const videoElements = document.querySelectorAll('.short-container');
    videoElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos]);

  const formatNumber = (num) => {
    if (!num) return '0';
    return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num;
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-black text-white">
       <div className="spinner-border text-danger" role="status"></div>
       <span className="ms-3">جاري البحث عن فيديوهات جديدة...</span>
    </div>
  );

  return (
    <div className="vh-100 shorts-wrapper">
      <style>{`
        .shorts-wrapper {
          height: calc(100vh - 56px);
          background: #000;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
        }
        .short-container {
          height: calc(100vh - 56px);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          scroll-snap-align: start;
          position: relative;
        }
        .video-box {
          width: 100%;
          max-width: 400px;
          height: 90%;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: #111;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
        }
        iframe { width: 100%; height: 100%; border: none; }
        .info-overlay {
          position: absolute;
          bottom: 20px;
          left: 15px;
          right: 70px;
          color: white;
          pointer-events: none;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .side-actions {
          position: absolute;
          right: 15px;
          bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: center;
        }
        .action-item { color: white; text-align: center; cursor: pointer; }
        .btn-circle {
          width: 48px; height: 48px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 3px;
          transition: 0.3s;
        }
        .btn-circle:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }
      `}</style>

      {videos.map((video) => (
        <div key={video.id} className="short-container" data-videoid={video.id}>
          <div className="video-box">
            <iframe
              ref={(el) => (videoRefs.current[video.id] = el)}
              title={video.snippet.title}
              src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&autoplay=0&controls=0&rel=0&loop=1&playlist=${video.id}&modestbranding=1&iv_load_policy=3`}
              allow="autoplay; encrypted-media"
            ></iframe>

            <div className="info-overlay">
              <h6 className="fw-bold">@{video.snippet.channelTitle}</h6>
              <p className="small text-truncate">{video.snippet.title}</p>
            </div>

            <div className="side-actions">
              <div className="action-item">
                <div className="btn-circle text-danger"><i className="fa-solid fa-heart"></i></div>
                <span>{formatNumber(video.statistics.likeCount)}</span>
              </div>
              <div className="action-item">
                <div className="btn-circle"><i className="fa-solid fa-comment"></i></div>
                <span>{formatNumber(video.statistics.commentCount)}</span>
              </div>
              <div className="action-item">
                <div className="btn-circle"><i className="fa-solid fa-share"></i></div>
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}