import React, { useState, useEffect } from 'react';
import './VideoPlayer.css';
import play from '../assets/images/play.png';
import pause from '../assets/images/pause.png';
import mute from '../assets/images/mute.png';
import volume from '../assets/images/volume.png';
import settings from '../assets/images/settings.png';
import defaultView from '../assets/images/default.png';
import expandView from '../assets/images/enlarge.png';
import normalView from '../assets/images/normal.png';
import right from '../assets/images/right.png';
import left from '../assets/images/left.png';

const VideoPlayer = props => {
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState('1');
  const [playing, setPlaying] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [previousLevel, setPreviousLevel] = useState('1');
  const [duration, setDuration] = useState(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(null);
  const [videoPosition, setVideoPosition] = useState('0');
  const [view, setView] = useState('default');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState('720p');
  const [autoplay, setAutoplay] = useState(false);
  const [menu, showMenu] = useState(null);
  const [previousWidth, setPreviousWidth] = useState(props.videoWidth ? props.videoWidth : '60%');
  const [previousHeight, setPreviousHeight] = useState(props.videoHeight ? props.videoHeight : '30rem');
  /**
   * Set display properties for the video passed in when
   * the video has loaded.
   * @property {Object} player
   */

  useEffect(() => {
    if (!player) {
      const videoElement = document.getElementById('video_player');
      if (!videoElement) return;
      videoElement.controls = false;
      setPlayer(videoElement);
      const getDuration = setInterval(() => {
        if (videoElement.readyState > 0) {
          const duration = videoElement.duration;
          const totalMinutes = parseInt(duration / 60, 10);
          const totalSeconds = Math.floor(duration) % 60;
          setTotalMinutes(totalMinutes);
          setTotalSeconds(totalSeconds);
          setDuration(duration);
          clearInterval(getDuration);
        }
      }, 1);
    }
  }, [player]);
  /**
   * Play the video when user clicks the play button,
   * and start keeping track of how much time has elapsed.
   */

  const playVideo = () => {
    if (!player) return;
    setPlaying(true);
    player.play();
    player.volume = level;
    window.videoTime = setInterval(() => {
      if (player.readyState > 0) {
        const minutes = parseInt(player.currentTime / 60, 10);
        const seconds = Math.floor(player.currentTime) % 60;
        setMinutes(minutes);
        setSeconds(seconds);
        const newVideoPosition = player.currentTime / duration * 10;
        setVideoPosition(String(newVideoPosition));
        const videoTime = document.getElementById('video_time');
        const position = String(newVideoPosition * 10);
        let increase = 1;

        if (position > 20 && position < 50) {
          increase = 0.5;
        }

        videoTime.style.width = position < 50 ? String(newVideoPosition * 10 + increase) + '%' : String(newVideoPosition * 10) + '%';
      }
    }, 1000);
  };
  /**
   * Pause the video when user clicks the pause button,
   * and stop the time on the video from increasing.
   */


  const pauseVideo = () => {
    if (!player) return;
    setPlaying(false);
    player.pause();
    clearInterval(window.videoTime);
  };
  /**
   * Change the volume of the video and determine
   * whether to show the muted icon or not depending
   * on the volume on the video.
   * @param {Object} event 
   */


  const changeVolume = event => {
    if (!player) return;
    setLevel(event.target.value);

    if (event.target.value <= 0.01) {
      setMuted(true);
      player.volume = 0;
      return;
    }

    setMuted(false);
    player.volume = event.target.value;
  };
  /**
   * This will either mute or unmute the video
   * and set volume to previous volume level if
   * the button is showing as muted
   * @param {Boolean} value 
   */


  const setVolumeControl = value => {
    if (!player) return;
    setMuted(value);

    if (value) {
      setPreviousLevel(level);
      setLevel('0');
      player.volume = 0;
    } else {
      setLevel(previousLevel);
      player.volume = previousLevel;
    }
  };
  /**
   * Determine how much progress to show on the video when the
   * trackbar is clicked and where the thumb should show on the video
   * @param {Object} event 
   */


  const videoControl = event => {
    if (!player) return;
    setVideoPosition(parseFloat(event.target.value));
    player.currentTime = duration * (parseFloat(event.target.value) / 10);
    const newVideoPosition = player.currentTime / duration * 10;
    const position = String(newVideoPosition * 10);
    let increase = 1;

    if (position > 20 && position < 50) {
      increase = 0.5;
    }

    if (player.readyState > 0) {
      const minutes = parseInt(player.currentTime / 60, 10);
      const seconds = Math.floor(player.currentTime) % 60;
      setMinutes(minutes);
      setSeconds(seconds);
      const videoTime = document.getElementById('video_time');
      videoTime.style.width = position < 50 ? String(player.currentTime / duration * 100 + increase) + '%' : String(player.currentTime / duration * 100) + '%';

      if (playing) {
        window.videoTime = setInterval(() => {
          const minutes = parseInt(player.currentTime / 60, 10);
          const seconds = Math.floor(player.currentTime) % 60;
          setMinutes(minutes);
          setSeconds(seconds);
          setVideoPosition(String(newVideoPosition));
          videoTime.style.width = position < 50 ? String(player.currentTime / duration * 100 + increase) + '%' : String(player.currentTime / duration * 100) + '%';
        }, 1000);
      }
    }
  };
  /**
   * expand the video to show in full screen mode
   */


  const expandVideo = () => {
    if (!player) return;
    setView('expanded');
    const container = document.getElementById('videocontainer');
    const currentWidth = container.style.width;
    const currentHeight = container.style.width;
    setPreviousWidth(currentWidth);
    setPreviousHeight(currentHeight);
    container.style.position = 'absolute';
    container.style.zIndex = '999';
    container.style.top = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.height = '100%';
    container.style.width = '100%';
    const videoPlayer = document.getElementById('video_player');
    videoPlayer.style.height = '94%';
    const videoControls = document.getElementById('video_controls');
    videoControls.style.marginTop = '4px';
    const settings = document.getElementById('settings');

    if (settings) {
      settings.style.marginBottom = '3rem';
    }
  };
  /**
   * Reduce video size to the normal video size. If the width was previously
   * 100%, then keep that video width, otherwise it will be the default.
   */


  const normalVideo = () => {
    if (!player) return;
    setView('normal');
    const container = document.getElementById('videocontainer');
    container.attributeStyleMap.clear();
    container.style.width = previousWidth;
    container.style.height = previousHeight;
    const videoPlayer = document.getElementById('video_player');
    videoPlayer.attributeStyleMap.clear();
    const videoControls = document.getElementById('video_controls');
    videoControls.attributeStyleMap.clear();
    const settings = document.getElementById('settings');

    if (settings) {
      settings.attributeStyleMap.clear();
    }
  };
  /**
   * Change video width and height back to default.
   */


  const defaultVideo = () => {
    if (!player) return;

    if (view !== 'expanded') {
      const container = document.getElementById('videocontainer');
      container.style.width = props.videoWidth;
      container.style.height = props.videoHeight;
    }
  };
  /**
   * Show settings menu for changing autoplay, speed, and quality properties.
   */


  const showSettings = () => {
    if (!player) return;
    const settingsicon = document.getElementById('settingsicon');

    if (settingsVisible) {
      settingsicon.style.transform = 'rotate(45deg)';
      showMenu(null);
    } else {
      settingsicon.style.transform = 'rotate(-45deg)';
    }

    setSettingsVisible(!settingsVisible);
  };
  /**
   * Adjust settings menu depending on video size and menu currently open.
   * @property {Boolean} settingsVisible
   * @property {String} view
   * @property {Boolean} menu
   */


  useEffect(() => {
    if (!player) return;

    if (view === 'expanded' && settingsVisible && !menu) {
      const settings = document.getElementById('settings');

      if (settings) {
        settings.style.marginBottom = '3rem';
      }
    } else if (view === 'expanded' && settingsVisible && menu) {
      const speed = document.getElementById('speed');

      if (speed) {
        speed.style.marginBottom = '3.5rem';
      }

      const quality = document.getElementById('quality');

      if (quality) {
        quality.style.marginBottom = '3.5rem';
      }
    }
  }, [settingsVisible, view, menu, player]);
  /**
   * Set the video speed.
   * @param {String} value 
   */

  const controlSpeed = value => {
    if (!player) return;
    setSpeed(value);
    showMenu(null);
    const speed = document.getElementById('speed');

    if (speed && view === 'expanded') {
      speed.style.marginBottom = '3.5rem';
    }
  };
  /**
   * Set the video quality.
   * @param {String} value 
   */


  const controlQuality = value => {
    if (!player) return;
    setQuality(value);
    showMenu(null);
    const quality = document.getElementById('quality');

    if (quality) {
      quality.style.marginBottom = '6rem';
    }
  };
  /**
   * Modify video speed depending on speed selected
   * @property {speed} Number
   * @property {player} Object
   */


  useEffect(() => {
    if (player) {
      player.playbackRate = speed;
    }
  }, [speed, player]);

  if (!props.video || !props.type || !props.videoWidth || !props.videoHeight) {
    return /*#__PURE__*/React.createElement("div", {
      className: "missing"
    }, "Properties are missing that are required for this component to work properly.");
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("div", {
    id: "videocontainer",
    className: "video__container",
    style: {
      width: props.videoWidth,
      height: props.videoHeight
    }
  }, settingsVisible && !menu ? /*#__PURE__*/React.createElement("div", {
    id: "settings",
    className: "video__container--settings"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Autoplay"), /*#__PURE__*/React.createElement("div", {
    className: "switch",
    onClick: () => {
      setAutoplay(!autoplay);
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: autoplay,
    onChange: e => {}
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider round"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Playback Speed"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      showMenu('speed');
    }
  }, /*#__PURE__*/React.createElement("span", null, speed === 1 ? 'Normal' : speed), " ", /*#__PURE__*/React.createElement("img", {
    type: "image",
    src: right,
    height: 12,
    width: 20,
    alt: "speed"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Quality"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      showMenu('quality');
    }
  }, /*#__PURE__*/React.createElement("span", null, quality), " ", /*#__PURE__*/React.createElement("img", {
    type: "image",
    src: right,
    height: 12,
    width: 20,
    alt: "quality"
  })))) : null, settingsVisible && menu && menu === 'speed' ? /*#__PURE__*/React.createElement("div", {
    id: "speed",
    className: "video__container--speed"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      showMenu(null);
    }
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("img", {
    type: "image",
    src: left,
    height: 12,
    width: 20,
    alt: "speed"
  }), " ", /*#__PURE__*/React.createElement("span", null, "Playback Speed"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(0.25);
    }
  }, "0.25"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(0.5);
    }
  }, "0.5"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(0.75);
    }
  }, "0.75"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(1);
    }
  }, "Normal"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(1.25);
    }
  }, "1.25"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(1.5);
    }
  }, "1.5"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(1.75);
    }
  }, "1.75"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlSpeed(2);
    }
  }, "2"))) : null, settingsVisible && menu && menu === 'quality' ? /*#__PURE__*/React.createElement("div", {
    id: "quality",
    className: "video__container--quality"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      showMenu(null);
    }
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("img", {
    type: "image",
    src: left,
    height: 12,
    width: 20,
    alt: "speed"
  }), " ", /*#__PURE__*/React.createElement("span", null, "Quality"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlQuality('720p');
    }
  }, "720p"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlQuality('480p');
    }
  }, "480p"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlQuality('360p');
    }
  }, "360p"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlQuality('240p');
    }
  }, "240p"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlQuality('144p');
    }
  }, "144p"), /*#__PURE__*/React.createElement("p", {
    onClick: () => {
      controlQuality('Auto');
    }
  }, "Auto"))) : null, props.video && props.type ? /*#__PURE__*/React.createElement("video", {
    id: "video_player"
  }, /*#__PURE__*/React.createElement("source", {
    src: props.video,
    type: props.type
  })) : null, /*#__PURE__*/React.createElement("div", {
    className: "video__container--timedisplay"
  }, /*#__PURE__*/React.createElement("span", {
    id: "video_time",
    style: {
      background: props.trackColor ? props.trackColor : 'rgb(248, 14, 1)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "range",
    onChange: event => {
      videoControl(event);
    },
    step: "0.01",
    min: "0",
    max: "10",
    value: videoPosition
  }), /*#__PURE__*/React.createElement("div", {
    id: "video_controls",
    className: "video__container--controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "video__container--controls-left"
  }, playing === true ? /*#__PURE__*/React.createElement("img", {
    type: "image",
    src: pause,
    onClick: () => {
      pauseVideo();
    },
    alt: "pause"
  }) : /*#__PURE__*/React.createElement("img", {
    type: "image",
    src: play,
    onClick: () => {
      playVideo();
    },
    alt: "play"
  }), /*#__PURE__*/React.createElement("div", {
    className: "video__container--controls-left-volume",
    onMouseEnter: () => {
      setVolumeVisible(true);
    },
    onMouseLeave: () => {
      setVolumeVisible(false);
    }
  }, muted ? /*#__PURE__*/React.createElement("img", {
    src: mute,
    alt: "vol",
    onClick: () => {
      setVolumeControl(false);
    }
  }) : /*#__PURE__*/React.createElement("img", {
    src: volume,
    alt: "vol",
    onClick: () => {
      setVolumeControl(true);
    }
  }), volumeVisible ? /*#__PURE__*/React.createElement("input", {
    type: "range",
    onChange: event => {
      changeVolume(event);
    },
    step: "0.01",
    min: "0",
    max: "1",
    value: level
  }) : null), /*#__PURE__*/React.createElement("span", null, minutes, ":", seconds < 10 ? "0" + seconds : seconds, " / ", totalMinutes, ":", totalSeconds)), /*#__PURE__*/React.createElement("div", {
    className: "video__container--controls-right"
  }, /*#__PURE__*/React.createElement("img", {
    id: "settingsicon",
    src: settings,
    alt: "settings",
    onClick: () => {
      showSettings();
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: defaultView,
    alt: "defaultView",
    onClick: () => {
      defaultVideo();
    }
  }), view === 'expanded' ? /*#__PURE__*/React.createElement("img", {
    src: normalView,
    alt: "normalView",
    onClick: () => {
      normalVideo();
    }
  }) : /*#__PURE__*/React.createElement("img", {
    src: expandView,
    alt: "expandView",
    onClick: () => {
      expandVideo();
    }
  })))));
};

export default VideoPlayer;