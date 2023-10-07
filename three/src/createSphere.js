import * as THREE from "three";
import CANNON from "cannon";

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);


const cooldownTimers = {};
const hitSound = new Audio("/sounds/hit.mp3");
const playHitSound = (collision) => {
    const bodyId = collision.body.id;
    const currentTime = Date.now();
  
    // Check if the cooldown period has expired for this body
    if (!cooldownTimers[bodyId] || currentTime - cooldownTimers[bodyId] > 100) {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  
      if (impactStrength > 0.3) {
        hitSound.volume = Math.min(impactStrength * 0.1, 1);
        hitSound.currentTime = 0;
        hitSound.play();
      }
  
      // Update the cooldown timer for this body
      cooldownTimers[bodyId] = currentTime;
    }
  };

export const createSphere = (
  scene,
  world,
  objectList,
  geo,
  shader,
  radius,
  position,
  material
) => {
  const mesh = new THREE.Mesh(geo, shader);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: material,
  });

  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  objectList.push({
    mesh: mesh,
    body: body,
  });
};

export const createBox = (
  scene,
  world,
  objectList,
  geo,
  shader,
  width,
  height,
  depth,
  position,
  material
) => {
  const mesh = new THREE.Mesh(geo, shader);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: material,
  });

  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  objectList.push({
    mesh: mesh,
    body: body,
  });
};
