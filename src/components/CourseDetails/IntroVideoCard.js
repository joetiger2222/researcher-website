import React, { useEffect } from 'react'
import { useState } from 'react';
import loaderPng from '../../loaderpng.gif'
export default function IntroVideoCard({videoId, userData}) {
    const [introVideo, setIntroVideo] = useState(null);
    const [videoLoading,setVideoLoading]=useState(false);
    const abortController = new AbortController();


    function getVideo() {
        setVideoLoading(true);
        fetch(`https://resweb-001-site1.htempurl.com/api/courses/Videos/${videoId}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${userData.token}`,
          },
          signal: abortController.signal
        })
          .then((response) => {
           
            if (!response.ok) {
              throw new Error("Failed to fetch video.");
            }
    
            return response.blob();
          })
          .then((blob) => {
            const videoItself = URL.createObjectURL(blob);
    
            setIntroVideo(videoItself);
            setVideoLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setVideoLoading(false);
          });
      }


useEffect(() => {
    if(videoId&&!introVideo){
getVideo()

    }
},[videoId])

useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="VideoDv">
        {videoLoading&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%'}} >
            <img src={loaderPng} />
     </div>}
                {!videoLoading&&introVideo&&<video
                  className="Video"
                  controls
                  src={introVideo}
                  type="video/mp4"
                  controlsList="nodownload"
                />}
              </div>
  )
}
