<template>
  <div ref="canvasContainer" class="fixed inset-0 pointer-events-none z-[-10] w-full h-full overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let bookGroup: THREE.Group
let leftBook: THREE.Group
let rightBook: THREE.Group
let particles: THREE.Points
let animationFrameId: number

// Texture Generators for PBR Materials
const createCoverTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024)
  gradient.addColorStop(0, '#B50E30')
  gradient.addColorStop(0.5, '#7A0A20')
  gradient.addColorStop(1, '#4A0510')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1024, 1024)

  ctx.strokeStyle = '#D4A017' // Gold
  ctx.lineWidth = 12
  ctx.strokeRect(50, 50, 924, 924)
  ctx.lineWidth = 2
  ctx.strokeRect(70, 70, 884, 884)

  ctx.fillStyle = '#D4A017' 
  ctx.font = 'bold 130px sans-serif'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 10
  ctx.fillText('NEXUS', 512, 480)
  
  ctx.font = '40px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.shadowBlur = 0
  ctx.fillText('by UTP', 512, 560)

  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fillRect(0, 0, 80, 1024)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

const createMetalnessTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  // Fondo negro (No metálico)
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 1024, 1024)

  // Zonas Doradas blancas (Metálico)
  ctx.strokeStyle = '#ffffff' 
  ctx.lineWidth = 12
  ctx.strokeRect(50, 50, 924, 924)
  ctx.lineWidth = 2
  ctx.strokeRect(70, 70, 884, 884)

  ctx.fillStyle = '#ffffff' 
  ctx.font = 'bold 130px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('NEXUS', 512, 480)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

const createRoughnessTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  // Fondo gris claro (Cuero opaco, alta rugosidad)
  ctx.fillStyle = 'rgb(200, 200, 200)'
  ctx.fillRect(0, 0, 1024, 1024)

  // Zonas Doradas gris oscuro (Metal liso y reflectante)
  ctx.strokeStyle = 'rgb(40, 40, 40)' 
  ctx.lineWidth = 12
  ctx.strokeRect(50, 50, 924, 924)
  ctx.lineWidth = 2
  ctx.strokeRect(70, 70, 884, 884)

  ctx.fillStyle = 'rgb(40, 40, 40)' 
  ctx.font = 'bold 130px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('NEXUS', 512, 480)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

const createBumpTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)
  
  // Ruido granulado fino para poros del cuero
  const imgData = ctx.getImageData(0, 0, 512, 512)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = 128 + (Math.random() - 0.5) * 30
    data[i] = noise
    data[i+1] = noise
    data[i+2] = noise
    data[i+3] = 255
  }
  ctx.putImageData(imgData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  return texture
}

const createPageEdgeTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#fdfdfd'
  ctx.fillRect(0, 0, 256, 256)
  
  // Líneas finas simulando hojas apiladas
  ctx.fillStyle = '#e0e0e0'
  for(let y=0; y<256; y+=3) {
    ctx.fillRect(0, y, 256, 1)
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

const initThree = () => {
  if (!canvasContainer.value) return

  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 12)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  canvasContainer.value.appendChild(renderer.domElement)

  bookGroup = new THREE.Group()
  leftBook = new THREE.Group()
  rightBook = new THREE.Group()
  bookGroup.add(leftBook)
  bookGroup.add(rightBook)

  const bookW = 5.0
  const bookH = 6.8
  const bookD = 0.6
  const coverThickness = 0.12

  // Texturas PBR
  const bumpTex = createBumpTexture()
  const coverMatFront = new THREE.MeshStandardMaterial({ 
    map: createCoverTexture(),
    bumpMap: bumpTex,
    bumpScale: 0.003,
    metalnessMap: createMetalnessTexture(),
    roughnessMap: createRoughnessTexture()
  })

  const coverMatBack = new THREE.MeshStandardMaterial({ 
    color: 0x660519, 
    bumpMap: bumpTex,
    bumpScale: 0.003,
    roughness: 0.85,
    metalness: 0.1
  })

  // Material de las páginas
  const pageMatFace = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.9 })
  const pageMatEdge = new THREE.MeshStandardMaterial({ map: createPageEdgeTexture(), roughness: 0.9 })

  // BoxGeometry caras: 0:Right, 1:Left, 2:Top, 3:Bottom, 4:Front, 5:Back
  const rightPagesMaterials = [ pageMatEdge, pageMatFace, pageMatEdge, pageMatEdge, pageMatFace, pageMatFace ]
  const leftPagesMaterials = [ pageMatFace, pageMatEdge, pageMatEdge, pageMatEdge, pageMatFace, pageMatFace ]

  // LADO DERECHO
  const rightCoverGeo = new THREE.BoxGeometry(bookW, bookH, coverThickness)
  rightCoverGeo.translate(bookW / 2, 0, -bookD/2 + coverThickness/2)
  const rightCoverMesh = new THREE.Mesh(rightCoverGeo, coverMatBack)
  rightCoverMesh.castShadow = true
  rightCoverMesh.receiveShadow = true
  rightBook.add(rightCoverMesh)

  const pagesRightGeo = new THREE.BoxGeometry(bookW - 0.2, bookH - 0.3, bookD - coverThickness)
  pagesRightGeo.translate((bookW - 0.2) / 2 + 0.1, 0, 0)
  const pagesRightMesh = new THREE.Mesh(pagesRightGeo, rightPagesMaterials)
  pagesRightMesh.castShadow = true
  pagesRightMesh.receiveShadow = true
  rightBook.add(pagesRightMesh)

  // LADO IZQUIERDO
  const leftCoverGeo = new THREE.BoxGeometry(bookW, bookH, coverThickness)
  leftCoverGeo.translate(bookW / 2, 0, bookD/2 - coverThickness/2)
  
  const coverMaterials = [ coverMatBack, coverMatBack, coverMatBack, coverMatBack, coverMatFront, coverMatBack ]
  const leftCoverMesh = new THREE.Mesh(leftCoverGeo, coverMaterials)
  leftCoverMesh.castShadow = true
  leftCoverMesh.receiveShadow = true
  leftBook.add(leftCoverMesh)

  const pagesLeftGeo = new THREE.BoxGeometry(bookW - 0.2, bookH - 0.3, 0.05)
  pagesLeftGeo.translate((bookW - 0.2) / 2 + 0.1, 0, bookD/2 - coverThickness - 0.025)
  const pagesLeftMesh = new THREE.Mesh(pagesLeftGeo, leftPagesMaterials)
  pagesLeftMesh.receiveShadow = true
  leftBook.add(pagesLeftMesh)

  // LOMO (Spine)
  const spineGeo = new THREE.BoxGeometry(coverThickness, bookH, bookD)
  spineGeo.translate(-coverThickness/2, 0, 0)
  const spineMesh = new THREE.Mesh(spineGeo, coverMatBack)
  bookGroup.add(spineMesh)

  bookGroup.position.set(0, 0, 0)
  scene.add(bookGroup)

  // --- PARTICLES ---
  const particleGeo = new THREE.BufferGeometry()
  const particleCount = 200
  const posArray = new Float32Array(particleCount * 3)
  for(let i=0; i<particleCount*3; i++){
    posArray[i] = (Math.random() - 0.5) * 20
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xD4A017,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })
  particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // --- SHADOW PLANE ---
  const planeGeo = new THREE.PlaneGeometry(100, 100)
  const planeMat = new THREE.ShadowMaterial({ opacity: 0.2 })
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -3.5
  plane.receiveShadow = true
  scene.add(plane)

  // --- LIGHTS ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.7))

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(5, 10, 7)
  dirLight.castShadow = true
  dirLight.shadow.camera.top = 10
  dirLight.shadow.camera.bottom = -10
  dirLight.shadow.camera.left = -10
  dirLight.shadow.camera.right = 10
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024
  scene.add(dirLight)

  const rimLight = new THREE.PointLight(0xffffff, 1.5, 30)
  rimLight.position.set(-8, 5, -5)
  scene.add(rimLight)
}

const onWindowResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Control de scroll
let scrollProgress = 0

const onScroll = () => {
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
  scrollProgress = window.scrollY / maxScroll
}

// Interpolación inercial
let currentBookX = 0
let currentBookY = 0
let currentBookZ = 0
let currentBookRotX = 0
let currentBookRotY = 0
let currentLeftHingeY = 0

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  let targetX = 0
  let targetY = 0
  let targetZ = 0
  let targetRotX = 0
  let targetRotY = 0
  let targetHinge = 0

  if (scrollProgress < 0.25) {
    const p = scrollProgress / 0.25
    targetX = window.innerWidth > 768 ? 4 : 0
    targetY = Math.sin(Date.now() * 0.002) * 0.2
    targetZ = 0
    targetRotX = 0.2
    targetRotY = -0.5 + p * 0.2
    targetHinge = 0 
  } else if (scrollProgress < 0.55) {
    const p = (scrollProgress - 0.25) / 0.30
    const ease = 1 - Math.pow(1 - p, 3) 
    targetX = (window.innerWidth > 768 ? 4 : 0) * (1 - ease)
    targetY = 0
    targetZ = 1 * ease
    targetRotX = 0.2 * (1 - ease) + 0.5 * ease 
    targetRotY = (-0.3) * (1 - ease) + 0 * ease 
    targetHinge = 0
  } else {
    const p = Math.min((scrollProgress - 0.55) / 0.25, 1)
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    targetX = 0
    targetY = 0
    targetZ = 1 + ease * 8.5 
    targetRotX = 0.5 * (1 - ease) 
    targetRotY = 0
    targetHinge = ease * (-Math.PI + 0.1)
  }

  currentBookX += (targetX - currentBookX) * 0.05
  currentBookY += (targetY - currentBookY) * 0.05
  currentBookZ += (targetZ - currentBookZ) * 0.05
  currentBookRotX += (targetRotX - currentBookRotX) * 0.05
  currentBookRotY += (targetRotY - currentBookRotY) * 0.05
  currentLeftHingeY += (targetHinge - currentLeftHingeY) * 0.08

  if (bookGroup && leftBook) {
    bookGroup.position.x = currentBookX
    bookGroup.position.y = currentBookY
    bookGroup.position.z = currentBookZ
    bookGroup.rotation.x = currentBookRotX
    bookGroup.rotation.y = currentBookRotY
    leftBook.rotation.y = currentLeftHingeY
    
    if (scrollProgress === 0) {
      bookGroup.rotation.y += Math.sin(Date.now() * 0.001) * 0.05
    }
  }

  if (particles) {
    particles.rotation.y += 0.0005
    const positions = particles.geometry.attributes.position.array as Float32Array
    for(let i=1; i<positions.length; i+=3) {
      positions[i] += 0.005 
      if (positions[i] > 10) positions[i] = -10
    }
    particles.geometry.attributes.position.needsUpdate = true
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('scroll', onScroll)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
})
</script>
