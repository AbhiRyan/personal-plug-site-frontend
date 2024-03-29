export const vertexShader = `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;
