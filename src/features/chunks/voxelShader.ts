export const vertexShader = `
uniform sampler2D voxelNormals;
uniform float voxelCount;
uniform vec3 sunColor;
uniform vec3 lightDir;
uniform vec3 ambient;
uniform float normalBias;
uniform float skyBias;
uniform float isWater;
uniform float waterAlpha;

attribute vec3 color;
attribute uint voxelIndex;
attribute float ao;

varying vec3 vColor;
varying float vSunDif;
varying float vSkyDif;
varying float vAo;

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>

float bias(float v, float amount) {
    return amount + (1.0 - amount) * v;
}

void main() {
    vec2 uv = vec2(float(voxelIndex) / voxelCount, 0.5);
    vec3 nor = texture2D(voxelNormals, uv).xyz;
    vSunDif = bias(clamp(dot(lightDir, nor), 0.0, 1.0), normalBias);
    vSkyDif = bias(clamp(dot(vec3(0.0, -1.0, 0.0), nor), 0.0, 1.0), skyBias);

    vColor = color;
    vAo = ao;

    #include <begin_vertex>
    #include <project_vertex>
    #include <worldpos_vertex>
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <defaultnormal_vertex>
    #include <shadowmap_vertex>
}
`;

export const fragmentShader = `
uniform vec3 sunColor;
uniform vec3 ambient;
uniform float isWater;
uniform float waterAlpha;

varying vec3 vColor;
varying float vSunDif;
varying float vSkyDif;
varying float vAo;

#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

void main() {
    vec3 lin = vec3(0.0);
    float shadow = getShadowMask();
    lin += vSunDif * sunColor * shadow;
    lin += vSkyDif * vec3(1.30, 1.40, 1.80) * 1.5;
    lin += ambient;

    vec3 color = vColor * lin * (1.0 - vAo * 0.15);

    float a = isWater == 1.0 ? waterAlpha : 1.0;
    gl_FragColor = vec4(color, a);
}
`;
