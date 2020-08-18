const createEnvironment = (engine) => {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine)

  /********** DEVICE ORIENTATION CAMERA EXAMPLE **************************/

  // This creates and positions a device orientation camera
  const camera = new BABYLON.FreeCamera(
    'camera',
    new BABYLON.Vector3(0, 0, 0),
    scene
  )

  // This targets the camera to scene origin
  camera.setTarget(new BABYLON.Vector3(0, 0, 10))
  /**************************************************************/

  let myVideo
  let isAssigned = false

  const plane = BABYLON.Mesh.CreatePlane('plane', 10, scene)
  plane.scaling.x = -1
  plane.rotation.z = Math.PI
  plane.position.z = 10
  plane.position.y = 1

  const videoMaterial = new BABYLON.StandardMaterial('videoTexture', scene)
  videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1)

  // Create our video texture
  BABYLON.VideoTexture.CreateFromWebCam(
    scene,
    (videoTexture) => {
      myVideo = videoTexture
      // myVideo.uScale = -1
      videoMaterial.diffuseTexture = myVideo
    },
    { facingMode: 'environment', maxWidth: 512, maxHeight: 512 }
  )

  // When there is a video stream (!=undefined),
  // check if it's ready          (readyState == 4),
  // before applying videoMaterial to avoid the Chrome console warning.
  // [.Offscreen-For-WebGL-0xa957edd000]RENDER WARNING: there is no texture bound to the unit 0
  scene.onBeforeRenderObservable.add(() => {
    if (
      myVideo !== undefined &&
      isAssigned === false &&
      myVideo.video.readyState === 4
    ) {
      plane.material = videoMaterial
      isAssigned = true
    }
  })

  return scene
}

const createScene = (canvas, engine) => {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine)

  /********** DEVICE ORIENTATION CAMERA EXAMPLE **************************/

  // This creates and positions a device orientation camera
  const camera = new BABYLON.DeviceOrientationCamera(
    'DevOr_camera',
    new BABYLON.Vector3(0, 0, 0),
    scene
  )

  // This targets the camera to scene origin
  camera.setTarget(new BABYLON.Vector3(0, 0, 10))

  // Sets the sensitivity of the camera to movement and rotation
  camera.angularSensibility = 1000
  camera.moveSensibility = 1000

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true)
  /**************************************************************/

  camera.rotation.z = Math.PI

  // Create a basic light, aiming 0,1,0 - meaning, to the sky.
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  )

  // Create a built-in "sphere" shape.
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    'sphere',
    { segments: 16, diameter: 2 },
    scene
  )

  // Move the sphere upward 1/2 of its height.
  sphere.position.x = 10
  sphere.position.y = -1

  // Create a built-in "ground" shape.
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { height: 6, width: 6, subdivisions: 2 },
    scene
  )

  ground.position.x = 10
  ground.position.y = -2

  return scene
}

const start = () => {
  const canvas = document.getElementById('renderCanvas')
  const engine = new BABYLON.Engine(canvas, true)

  const environment = createEnvironment(engine)
  const scene = createScene(canvas, engine)

  scene.autoClear = false

  engine.runRenderLoop(() => {
    environment.render()
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}

console.log(28)

const button = document.getElementById('permissionButton')
button.addEventListener('click', start)
