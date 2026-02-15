precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution

// 疑似乱数
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// ソフトなデジタルノイズ
float digitalNoise(vec2 uv) {
    vec2 grid = floor(uv * 18.0);
    return rand(grid);
}

// 控えめな横ズレ
vec2 glitchShift(vec2 uv, float strength) {
    float line = floor(uv.y * resolution.y / 10.0);
    float shift = step(0.9, rand(vec2(line, floor(iTime * 0.5)))) * strength;
    uv.x += shift;
    return uv;
}

void mainImage(out vec4 col, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    // アスペクト補正
    uv.x *= iResolution.x / iResolution.y;

    // 穏やかなグリッチ
    uv = glitchShift(uv, 0.02);

    // ゆっくり変化するノイズ
    float n = digitalNoise(uv + iTime * 0.05);

    // ほぼ気づかない走査線
    float scan = step(0.995, rand(vec2(floor(uv.y * 120.0), floor(iTime * 0.3))));

    // 弱い RGB 分離
    vec3 color;
    color.r = n;
    color.g = digitalNoise(uv + vec2(0.003, 0.0));
    color.b = digitalNoise(uv - vec2(0.003, 0.0));

    // 明るさを抑える
    color *= 0.6;

    // ごく軽いハイライト
    color += scan * vec3(0.1, 0.05, 0.05);

    col = vec4(color, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
