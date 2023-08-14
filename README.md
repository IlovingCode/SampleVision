## R&D Step:

### Step 1: 

Create basic React Native app using npx ```react-native@latest init SampleVision```

### Step 2: 

Add `ArViewer` package: ```npm i react-native-ar-viewer```

### Step 3: 

Follow the instruction of set up ARView in the link: [Github](https://github.com/riderodd/react-native-ar.git)

The `ARViewer` package only support Plane Dectection, so we need to add Image Tracking support by following below steps:

### Step 4: 

Go to `node_modules/react-native-ar-viewer/ios`

Image Tracking is enabled easily by following steps:
- download images from given links
- add the images into a set of `ARReferenceImage`
- assign the image set to the AR session

### Step 5:

Declare `arImages` variable 

```
class ModelARView: ARView, ARSessionDelegate {
   var arImages: Set<ARReferenceImage>?
   ...
``` 

in `./ModelArView.swift`

### Step 6: 

Add more options in the function ```func changeDetection(detection: String)(./ModelARView.swift)``` like this:
- `any`: enable both Plane Detection and Image Tracking
- `horizontal`: only enable Plane Detection by horizontal
- `vertical`: only enable Plane Detection by vertical
-  `image`: only enable Image Tracking
- `none` or **default**: disable both Plane Detection and Image Tracking

### Step 7: 

Declare some bridge functions for React Native (in `./ArViewerViewManager.m`):

```
RCT_EXTERN_METHOD(setPlaneOrientation:(nonnull NSNumber*) reactTag withDetection:(nonnull NSString*)detection)

RCT_EXTERN_METHOD(loadArImage:(nonnull NSNumber*) reactTag withPath:(nonnull NSString*)path andWidth:(nonnull NSNumber*)width)
```

`setPlaneOrientation` function will allow us to change the detection type at runtime

`loadArImage` function help us to download the images from links on native to build ARReferenceImage Set

### Step 8:

Respectively, add the implementation for above functions

### Step 9:

Implement these bridge function on JS side

**DONE!!!**