import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Added Link
import SuggestedVideos from "./SuggestedVideos";

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const API_KEY = "AIzaSyDxLg0QxECeZGluy1-7kaocA1m4Sm3RoTI";

  useEffect(() => {
    getVideoDetails();
    getComments();
    window.scrollTo(0, 0);
    setIsExpanded(false);
  }, [id]);

  const getVideoDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
      );
      const data = res.data.items[0];
      setVideo(data);
      if (data) getChannelDetails(data.snippet.channelId);
    } catch (err) { console.error(err); }
  };

  const getChannelDetails = async (channelId) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
      );
      setChannelData(res.data.items[0]);
    } catch (err) { console.error(err); }
  };

  const getComments = async () => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&key=${API_KEY}&maxResults=15`
      );
      setComments(res.data.items);
    } catch (err) { console.error(err); }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="container-fluid bg-black text-light min-vh-100 py-4 px-lg-5" style={{ direction: 'rtl' }}>
      <div className="row mt-5">
        
        <div className="col-lg-8">
          {/* Player */}
          <div className="ratio ratio-16x9 mb-3 rounded-4 overflow-hidden">
            <iframe 
              src={`https://www.youtube.com/embed/${id}?autoplay=1`} 
              allowFullScreen 
              title="video" 
              className="rounded-4" 
              style={{ border: 0 }} 
            />
          </div>

          <h5 className="fw-bold mb-3">{video?.snippet?.title}</h5>

          {/* Action Bar */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            
            <div className="d-flex align-items-center">
              {/* Added Link to Channel Image */}
              <Link to={`/channel/${video?.snippet?.channelId}`}>
                <img src={channelData?.snippet?.thumbnails?.default?.url} className="rounded-circle" width="40" height="40" loading="lazy" alt="" />
              </Link>
              <div className="mx-3">
                {/* Added Link to Channel Title */}
                <Link to={`/channel/${video?.snippet?.channelId}`} className="text-decoration-none text-light">
                  <div className="fw-bold small mb-0">{video?.snippet?.channelTitle}</div>
                </Link>
                <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                    {formatNumber(channelData?.statistics?.subscriberCount)} subscribers
                </div>
              </div>
              <button className="btn btn-light rounded-pill px-3 fw-bold btn-sm text-black border-0">Subscribe</button>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center bg-white bg-opacity-10 rounded-pill">
                <button 
                  className="btn text-light border-0 px-3 py-1 d-flex align-items-center gap-2 shadow-none" 
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <i className={isLiked ? "bi bi-hand-thumbs-up-fill text-info" : "bi bi-hand-thumbs-up"}></i>
                  <span className="small fw-bold border-start ps-2">{formatNumber(video?.statistics?.likeCount)}</span>
                </button>
                <div className="bg-secondary opacity-25" style={{ width: '1px', height: '20px' }}></div>
                <button className="btn text-light border-0 px-3 py-1 shadow-none">
                  <i className="bi bi-hand-thumbs-down"></i>
                </button>
              </div>

              <button className="btn bg-white bg-opacity-10 rounded-pill px-3 py-1 text-light fw-bold small border-0 shadow-none">
                <i className="bi bi-share-fill me-2"></i> Share
              </button>
              
              <button className="btn bg-white bg-opacity-10 rounded-pill px-3 py-1 text-light fw-bold small border-0 shadow-none">
                <i className="bi bi-download me-2"></i> Download
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div 
            className="p-3 rounded-4 mb-4" 
            style={{ backgroundColor: "#272727", fontSize: '0.9rem', cursor: 'pointer' }} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="fw-bold mb-1">
              {Number(video?.statistics?.viewCount).toLocaleString()} views • {new Date(video?.snippet?.publishedAt).toDateString()}
            </div>
            <p className="mb-0" style={{ 
                whiteSpace: "pre-line", 
                overflow: "hidden", 
                display: "-webkit-box", 
                WebkitLineClamp: isExpanded ? "unset" : "2", 
                WebkitBoxOrient: "vertical" 
            }}>
              {video?.snippet?.description}
            </p>
            <button className="btn btn-link p-0 text-white text-decoration-none fw-bold mt-2 small shadow-none">
                {isExpanded ? "Show less" : "...more"}
            </button>
          </div>

          {/* Comments Section */}
          <div className="comments-section mt-4">
            <h6 className="mb-4 fw-bold">{video?.statistics?.commentCount} Comments</h6>
            {comments.map((item) => {
              const comment = item.snippet.topLevelComment.snippet;
              return (
                <div key={item.id} className="d-flex gap-3 mb-4">
                  <img src={comment.authorProfileImageUrl} className="rounded-circle" width="36" height="36" alt="" loading="lazy" />
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold" style={{ fontSize: '0.85rem' }}>@{comment.authorDisplayName}</span>
                    </div>
                    <p className="mb-1" style={{ fontSize: '0.9rem' }}>{comment.textDisplay}</p>
                    <div className="d-flex align-items-center gap-3">
                        <small className="text-secondary"><i className="bi bi-hand-thumbs-up"></i> {comment.likeCount || ''}</small>
                        <small className="text-light fw-bold" style={{ fontSize: '0.75rem' }}>Reply</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-lg-4">
          <SuggestedVideos currentVideoId={id} />
        </div>

      </div>
    </div>
  );
}

export default VideoPlayer;