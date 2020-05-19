### Using this module

### How to use
1. npm install reactjs-video-player@0.2.5
2. import VideoPlayer from 'reactjs-video-player';

### Required properties
1. video: the source for the video
2. type: the type of video such as 'video/mp4'
3. videoWidth: this can any type of measurement such as px, rem and %
4. videoHeight: this can any type of measurement such as px, rem and %
### Option properties
1. trackColor: this will style the video track

### Notes:
1. Make sure to install version >= 0.2.5, or this module will not work.
3. If you would like to style the thumb for the video track you will need to use !important to override the style. For example, on chrome the style would be:
  input::-webkit-slider-thumb { background: rgb(248, 14, 1) !important; }
