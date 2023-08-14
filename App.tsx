/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Button, Platform, TouchableHighlight } from 'react-native';
import { ArViewerView } from 'react-native-ar-viewer';
import RNFS from 'react-native-fs';

function App(): JSX.Element {
  const [localModelPath, setLocalModelPath] = React.useState<string>()
  const extension = Platform.OS === 'android' ? 'glb' : 'usdz'
  const modelSrc = `https://github.com/riderodd/react-native-ar/blob/main/example/src/dice.${extension}?raw=true`
  const modelPath = `${RNFS.DocumentDirectoryPath}/model.${extension}`
  const ref = React.useRef() as React.MutableRefObject<ArViewerView>
  const [detection, setDetection] = React.useState<number>(0)

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

    type == 1 && ref.current.loadArImage('https://static.momocdn.net/app/img/Gamification/16032022.2x.jpg', 3)
    ref.current.setPlaneOrientation(type == 1 ? 'image' : 'horizontal')

    setDetection(type)
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
      onModelPlaced={() => console.log('model displayed')}
      onModelRemoved={() => console.log('model not visible anymore')}
      planeOrientation='horizontal'
      ref={ref}
    />}
    <Button onPress={onChange} title={detection == 0 ? 'Plane' : 'Image'} />
  </>
}

export default App;
