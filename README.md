# Videobookmarker

Random addon

Will send key-events as post-requests to localhost:9393/

Format: 
``` 
{
    "title": string     // "Cool youtube video"
    "timestep": number  // 2515.190189
    "key": string       // "e"
}
``` 

# To load extension

go to chrome://extensions/

`Load unpacked` -> select this folder



# server
There is a http-server in ./server/ which prints the post-requests received by the extension.