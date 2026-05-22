import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ChannelPage() {
  const { channelId } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(true);

  const API_KEY = "AIzaSyDxLg0QxECeZGluy1-7kaocA1m4Sm3RoTI";

  const getChannelDetails = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`
      );
      setChannelData(res.data.items[0]);
    } catch (err) { console.error("Error fetching channel details:", err); }
  }, [channelId]);

  const getChannelVideos = useCallback(async () => {
    try {
      setLoader(true);
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${API_KEY}`
      );
      setVideos(res.data.items);
    } catch (err) { console.error("Error fetching videos:", err); } finally {
      setLoader(false);
    }
  }, [channelId]);

  useEffect(() => {
    getChannelDetails();
    getChannelVideos();
    window.scrollTo(0, 0);
  }, [getChannelDetails, getChannelVideos]);

  const formatNumber = (num) => {
    if (!num) return "0";
    const n = Number(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="container-fluid bg-black text-light min-vh-100 mt-5 pt-3 px-lg-5" style={{ direction: 'ltr' }}>
      
      {/* 1. Banner Image */}
      {channelData?.brandingSettings?.image?.bannerExternalUrl ? (
        <div className="w-100 overflow-hidden rounded-4 mb-4" style={{ height: '200px' }}>
          <img 
            src={channelData.brandingSettings.image.bannerExternalUrl} 
            className="w-100 h-100 object-fit-cover" 
            alt="Channel Banner" 
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mb-4 pt-4"></div> 
      )}

      {/* 2. Channel Info Section */}
      <div className="d-flex align-items-center gap-4 mb-5 flex-wrap">
        <img 
          src={channelData?.snippet?.thumbnails?.medium?.url} 
          className="rounded-circle shadow" 
          width="160" height="160" 
          alt="Channel Avatar" 
          loading="lazy"
        />
        <div>
          <h1 className="fw-bold mb-1">{channelData?.snippet?.title}</h1>
          <div className="text-secondary mb-3">
            <span>@{channelData?.snippet?.customUrl || "channel"}</span> • 
            <span className="mx-2">{formatNumber(channelData?.statistics?.subscriberCount)} subscribers</span> • 
            <span>{formatNumber(channelData?.statistics?.videoCount)} videos</span>
          </div>
          <p className="small text-secondary mb-3" style={{ maxWidth: '600px' }}>
            {channelData?.snippet?.description?.substring(0, 150)}...
          </p>
          <button className="btn btn-light rounded-pill px-4 fw-bold text-black border-0">Subscribe</button>
        </div>
      </div>

      <hr className="border-secondary opacity-25" />

      <div className="d-flex gap-4 mb-4 fw-bold border-bottom border-secondary border-opacity-10">
        <p className="pb-2 border-bottom border-3 border-light mb-0 cursor-pointer">Videos</p>
        <p className="text-secondary mb-0 cursor-pointer">Shorts</p>
        <p className="text-secondary mb-0 cursor-pointer">Live</p>
        <p className="text-secondary mb-0 cursor-pointer">Playlists</p>
      </div>

      {/* 4. Videos List */}
      {loader ? (
        <div className="text-center py-5">
           <div className="spinner-border text-light" role="status"></div>
           <p className="mt-2">Loading videos...</p>
        </div>
      ) : (
        <div className="row g-4">
          {videos.map((video) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={video.id.videoId}>
              <Link to={`/video/${video.id.videoId}`} className="text-decoration-none">
                <div className="card bg-transparent border-0 text-light h-100">
                  <div className="ratio ratio-16x9 mb-2">
                    <img 
                      src={video.snippet?.thumbnails?.medium?.url} 
                      className="rounded-4 w-100 h-100 object-fit-cover shadow-sm" 
                      alt={video.snippet?.title} 
                      loading="lazy"
                    />
                  </div>
                  <div className="px-1">
                    <div className="fw-bold small mb-1 text-light line-clamp-2" style={{ fontSize: '0.95rem' }}>
                      {video.snippet?.title}
                    </div>
                    <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      {new Date(video.snippet?.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChannelPage;