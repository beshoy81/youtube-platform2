import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function SearchPage() {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelImages, setChannelImages] = useState({});

  const API_KEY = "AIzaSyDxLg0QxECeZGluy1-7kaocA1m4Sm3RoTI";

  const fetchChannelDetails = useCallback(async (videoItems) => {
    const channelIds = [...new Set(videoItems.map(item => item.snippet.channelId))].join(',');
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`
      );
      const images = {};
      res.data.items.forEach(item => {
        images[item.id] = item.snippet.thumbnails.default.url;
      });
      setChannelImages(images);
    } catch (err) {
      console.error("Channels Error:", err);
    }
  }, [API_KEY]);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&type=video&key=${API_KEY}`
        );
        setResults(res.data.items);
        fetchChannelDetails(res.data.items);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
    window.scrollTo(0, 0);
  }, [query, fetchChannelDetails]);

  return (
    <div className="container-fluid bg-black text-light min-vh-100 pt-5 mt-4 px-lg-5" style={{ direction: 'ltr' }}>
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <h6 className="text-secondary mb-4 small fw-bold">Search results for: "{query}"</h6>

        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-3 text-secondary">Looking for videos...</p>
          </div>
        ) : (
          <div className="row">
            {results.map((video) => (
              <div className="col-12 mb-3 search-card" key={video.id.videoId}>
                <Link to={`/video/${video.id.videoId}`} className="text-decoration-none d-flex flex-column flex-md-row gap-3 text-light p-2 rounded-4 hover-bg">
                  
              
                  <div className="col-12 col-md-4 col-lg-3 flex-shrink-0">
                    <div className="ratio ratio-16x9">
                      <img 
                        src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url} 
                        className="rounded-4 object-fit-cover w-100 h-100" 
                        alt={video.snippet.title} 
                        loading="lazy"
                      />
                    </div>
                  </div>

            
                  <div className="flex-grow-1 py-1 overflow-hidden">
                    <h5 className="fw-bold mb-1 video-title-text" style={{ fontSize: '1.15rem', lineHeight: '1.4' }}>
                      {video.snippet.title}
                    </h5>
                    
                    <div className="text-secondary mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                      <span>{new Date(video.snippet.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <div className="me-2 overflow-hidden rounded-circle bg-dark" style={{ width: '28px', height: '28px' }}>
                        {channelImages[video.snippet.channelId] ? (
                          <img src={channelImages[video.snippet.channelId]} className="w-100 h-100 object-fit-cover" alt="chan" loading="lazy" />
                        ) : (
                          <div className="w-100 h-100 bg-secondary opacity-25"></div>
                        )}
                      </div>
                      <span className="text-secondary small fw-bold">{video.snippet.channelTitle}</span>
                    </div>

                    <p className="text-secondary small d-none d-md-block line-clamp-2 mt-2" style={{ maxWidth: '600px' }}>
                      {video.snippet.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS Styles Local */}
      <style>{`
        .hover-bg:hover {
          background-color: rgba(255, 255, 255, 0.08);
          transition: 0.2s ease-in-out;
        }
        .video-title-text {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .video-title-text { font-size: 1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default SearchPage;
