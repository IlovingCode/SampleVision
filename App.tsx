/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Button, Image, Platform, View } from 'react-native';
import { ArViewerView } from 'react-native-ar-viewer';
import RNFS from 'react-native-fs';

function App(): JSX.Element {
  const [localModelPath, setLocalModelPath] = React.useState<string>()
  const extension = Platform.OS === 'android' ? 'glb' : 'usdc'
  const modelSrc = `https://static.momocdn.net/app/img/minigames/qr-models/SheenChair1.${extension}`
  const modelPath = `${RNFS.DocumentDirectoryPath}/model.${extension}`
  const ref = React.useRef() as React.MutableRefObject<ArViewerView>
  const [detection, setDetection] = React.useState<number>(1)
  const [detected, setDetected] = React.useState<string>(' ')

  const loadPath = async () => {
    const exists = await RNFS.exists(modelPath)
    if (!exists) {
      await RNFS.downloadFile({
        fromUrl: modelSrc,
        toFile: modelPath,
      }).promise
    }

    setLocalModelPath(modelPath)
  }

  React.useEffect(() => {
    loadPath()
  })

  const onChange = () => {
    let type = (detection + 1) % 2

    ref.current.setPlaneOrientation(type == 1 ? 'image' : 'horizontal')
    type == 1 && ref.current.loadArImage([
      'https://static.momocdn.net/app/img/Gamification/lacxi2023/unnamed.jpg',
      'https://static.momocdn.net/app/img/Gamification/lacxi2023/IMG_0706.jpg',
      'https://static.momocdn.net/app/img/Gamification/lacxi2023/IMG_0707.jpg',
      'https://static.momocdn.net/app/img/Gamification/lacxi2023/IMG_0709.jpg',
      // 'https://static.momocdn.net/app/img/Gamification/lacxi2023/IMG_0708.jpg',
    ])

    setDetection(type)
  }

  const takeScreenshot = async () => {
    console.log('takeScreenshot')
    let res = await ref.current.takeScreenshot()
    setDetected(res)
  }

  return <>
    {localModelPath && <ArViewerView
      style={{ flex: 1 }}
      model={modelPath}
      lightEstimation
      manageDepth
      allowRotate
      allowScale
      allowTranslate
      // disableInstantPlacement
      onStarted={() => console.log('started')}
      onEnded={() => console.log('ended')}
      onModelPlaced={(e) => setDetected(e.nativeEvent.detected)}
      onModelRemoved={() => setDetected(' ')}
      planeOrientation='image'
      ref={ref}
    />}
    <Button onPress={takeScreenshot} title={detection == 0 ? 'Plane' : 'Image'} />
    {detected.length > 1 && <View style={{
      position: 'absolute', 
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      width: 200,
      height: 300,
      borderRadius: 10,
      left: 100, top:100
    }}>
      <Image source={{uri: detected }} width={100} height={100} />
    </View>}
  </>
}

export default App;
