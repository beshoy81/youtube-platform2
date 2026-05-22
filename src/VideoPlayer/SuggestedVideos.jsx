import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SuggestedVideos({ currentVideoId }) {
  const [videos, setVideos] = useState([]);
  const API_KEY = "AIzaSyDxLg0QxECeZGluy1-7kaocA1m4Sm3RoTI";


  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const getSuggested = useCallback(async () => {
    try {

      const randomTopics = ["trending", "new music", "gaming", "entertainment", "top news", "vlogs"];
      const randomQ = randomTopics[Math.floor(Math.random() * randomTopics.length)];

      const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          type: "video",
          maxResults: 15,
          key: API_KEY,
          q: randomQ,
          relevanceLanguage: "ar",
        },
      });


      const shuffled = shuffleArray(res.data.items);
      setVideos(shuffled);
    } catch (err) {
      console.error("Suggested Videos Error:", err);
    }
  }, [API_KEY]);

  useEffect(() => {
    getSuggested();
  }, [getSuggested, currentVideoId]); 

  return (
    <div className="suggested-list mt-3">
      <style>{`
        .suggest-item:hover .suggest-title { color: #3ea6ff !important; }
        .suggest-thumb-container { width: 160px; height: 90px; transition: transform 0.2s; }
        .suggest-item:hover .suggest-thumb-container { transform: scale(1.03); }
      `}</style>

      {videos.map((v) => (
        <Link
          key={v.id.videoId}
          to={`/video/${v.id.videoId}`}
          className="d-flex mb-3 text-decoration-none text-light suggest-item"
        >
          <div className="flex-shrink-0 suggest-thumb-container">
            <img
              src={v.snippet.thumbnails.medium.url}
              className="w-100 h-100 rounded-3 shadow-sm"
              style={{ objectFit: 'cover' }}
              alt={v.snippet.title}
              loading="lazy"
            />
          </div>
          
          <div className="ms-2 overflow-hidden flex-grow-1">
            <p className="small fw-bold mb-1 text-white suggest-title" 
               style={{ 
                 display: '-webkit-box', 
                 WebkitLineClamp: '2', 
                 WebkitBoxOrient: 'vertical', 
                 overflow: 'hidden', 
                 fontSize: '0.85rem',
                 transition: '0.2s'
               }}>
              {v.snippet.title}
            </p>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
              <div className="mb-1 text-truncate" style={{ maxWidth: '150px' }}>
                {v.snippet.channelTitle}
              </div>
              <div className="d-flex align-items-center gap-1">
                <i className="fa-solid fa-circle-check" style={{fontSize: '10px'}}></i>
                <span>فيديو مقترح</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SuggestedVideos;