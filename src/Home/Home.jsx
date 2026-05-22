import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [details, setDetails] = useState(null);
  const [loader, setLoader] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [channelImages, setChannelImages] = useState({});
  const [shortsVideos, setShortsVideos] = useState([]);

  const API_KEY = "AIzaSyDxLg0QxECeZGluy1-7kaocA1m4Sm3RoTI";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  /* Channel Images ================= */
  const fetchChannelImages = useCallback(
    async (videos) => {
      try {
        const channelIds = videos
          .map((video) => video.snippet?.channelId)
          .filter(Boolean)
          .join(",");

        if (!channelIds) return;

        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`
        );

        const imagesMap = {};
        res.data.items.forEach((channel) => {
          imagesMap[channel.id] = channel.snippet?.thumbnails?.default?.url;
        });

        setChannelImages((prev) => ({ ...prev, ...imagesMap }));
      } catch (error) {
   
      }
    },
    [API_KEY]
  );


  const getShortsVideos = useCallback(async () => {
    try {
      const queries = ["#Shorts", "viral shorts", "funny shorts", "trending"];
      const randomQ = queries[Math.floor(Math.random() * queries.length)];
      
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${randomQ}&type=video&videoDuration=short&key=${API_KEY}`
      );
      setShortsVideos(shuffleArray(res.data.items || []));
    } catch (error) {
      
    }
  }, [API_KEY]);

  const getMostPopular = useCallback(async () => {
    try {
      setLoader(true);
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=EG&maxResults=50&key=${API_KEY}`
      );
      const shuffledVideos = shuffleArray(res.data.items);
      setDetails({ ...res.data, items: shuffledVideos });
      fetchChannelImages(shuffledVideos);
    } catch (error) {
      console.error("Most Popular Error:", error);
    } finally {
      setLoader(false);
    }
  }, [API_KEY, fetchChannelImages]);

  const getCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=EG&key=${API_KEY}`
      );
      setCategories(res.data.items || []);
    } catch (error) {

    }
  }, [API_KEY]);

  const getVideosByCategory = useCallback(
    async (categoryId) => {
      try {
        setLoader(true);
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=40&videoCategoryId=${categoryId}&key=${API_KEY}`
        );
        const shuffledCategory = shuffleArray(res.data.items);
        setDetails({ ...res.data, items: shuffledCategory });
        fetchChannelImages(shuffledCategory);
      } catch (error) {
      } finally {
        setLoader(false);
      }
    },
    [API_KEY, fetchChannelImages]
  );

  useEffect(() => {
    getMostPopular();
    getCategories();
    getShortsVideos();
  }, [getMostPopular, getCategories, getShortsVideos]);

  useEffect(() => {
    if (selectedCategoryId) {
      getVideosByCategory(selectedCategoryId);
    }
  }, [selectedCategoryId, getVideosByCategory]);

  /* ================= Handlers ================= */
  function handleCategoryClick(categoryId) {
    setSelectedCategoryId(categoryId);
  }

  function handleAllClick() {
    setSelectedCategoryId(null);
    getMostPopular();
  }

  return (
    <div className="container mt-5 pt-3">
      <style>{`
        /* شريط التصنيفات مطابق للصور */
        .categories-wrapper {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none; 
          padding: 15px 0;
          background: transparent;
          margin-bottom: 5px;
        }
        .categories-wrapper::-webkit-scrollbar {
          display: none;
        }
        .yt-top-link {
          background-color: #f2f2f2;
          color: #0f0f0f;
          border: none;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
          cursor: pointer;
        }
        .yt-top-link.active {
          background-color: #0f0f0f;
          color: #ffffff;
        }
        
  
        body.dark .yt-top-link {
          background-color: #272727;
          color: #ffffff;
        }
        body.dark .yt-top-link.active {
          background-color: #ffffff;
          color: #0f0f0f;
        }

        .shorts-shelf { margin: 25px 0; padding: 15px 0; border-top: 1px solid #333; border-bottom: 1px solid #333; }
        .shorts-container-home { display: flex; overflow-x: auto; gap: 15px; scrollbar-width: none; }
        .shorts-container-home::-webkit-scrollbar { display: none; }
        .short-card-home { min-width: 170px; border-radius: 12px; overflow: hidden; position: relative; transition: transform 0.2s; }
        .short-card-home:hover { transform: scale(1.03); }
        .short-img-home { width: 100%; height: 280px; object-fit: cover; }
        .short-overlay-home { position: absolute; bottom: 0; padding: 10px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; width: 100%; font-size: 13px; font-weight: 500; }
        
        .yt-video-title:hover {color: #0f0f0f;  text-decoration: none; font-weight: 600; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .yt-channel-name, .yt-video-date { color: #aaa; font-size: 13px; text-decoration: none; display: block; }
        .yt-avatar-img { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; object-fit: cover; }
        .yt-thumb { border-radius: 12px; transition: border-radius 0.2s; }
        .yt-video-card:hover .yt-thumb { border-radius: 0; }
      `}</style>

      <div className="categories-wrapper mt-3">
        <button 
          className={`yt-top-link ${!selectedCategoryId ? "active" : ""}`} 
          onClick={handleAllClick}
        >
          All
        </button>
        {categories.map((category) => (
          <button 
            key={category.id} 
            onClick={() => handleCategoryClick(category.id)} 
            className={`yt-top-link ${selectedCategoryId === category.id ? "active" : ""}`}
          >
            {category.snippet?.title}
          </button>
        ))}
      </div>


      {loader && <div className="text-center text-light my-5 fs-5">Loading videos...</div>}

      <div className="row g-4 mt-1">
        {details?.items?.map((video, index) => (
          <React.Fragment key={video.id}>
            
     
            {index === 8 && shortsVideos.length > 0 && (
              <div className="col-12 shorts-shelf">
                <h5 className="text-white mb-3 d-flex align-items-center">
                  <i className="fa-solid fa-bolt text-danger me-2"></i> Shorts
                </h5>
                <div className="shorts-container-home">
                  {shortsVideos.map((short) => (
                    <Link to="/shorts" key={short.id.videoId || short.id} className="short-card-home text-decoration-none">
                      <img src={short.snippet?.thumbnails?.high?.url} className="short-img-home" loading="lazy" alt="short" />
                      <div className="short-overlay-home">
                        {short.snippet?.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card yt-video-card text-light h-100 border-0 bg-transparent">
                <Link to={`/video/${video.id}`}>
                  <div className="yt-thumb-wrapper">
                    <img
                      src={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url}
                      alt={video.snippet?.title}
                      className="w-100 yt-thumb img-fluid"
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="p-2 pt-3 d-flex">
                  <Link to={`/channel/${video.snippet?.channelId}`}>
                    <img
                      src={channelImages[video.snippet?.channelId] || "https://via.placeholder.com/38"}
                      alt={video.snippet?.channelTitle}
                      loading="lazy"
                      className="yt-avatar-img"
                      onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=C&background=random"; }}
                    />
                  </Link>
                  <div className="overflow-hidden">
                    <Link to={`/video/${video.id}`} className="yt-video-title">{video.snippet?.title}</Link>
                    <Link to={`/channel/${video.snippet?.channelId}`} className="yt-channel-name">{video.snippet?.channelTitle}</Link>
                    <span className="yt-video-date">{formatDate(video.snippet?.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default HomePage;