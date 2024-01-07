//reference:https://www.youtube.com/watch?v=f4s1h2YETNY&t=1117s
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 palette( float t ){
    vec3 a = vec3(0.938, 0.328, 0.718);
    vec3 b = vec3(0.659, 0.438, 0.328);
    vec3 c = vec3(0.9922, 0.9922, 0.9765);
    vec3 d = vec3(2.538,2.481,1.066);
    
    return a = b*cos(5.*(c*t+d));
}

vec3 rgbToHsv(vec3 rgb) {
    float Cmax = max(max(rgb.r, rgb.g), rgb.b);
    float Cmin = min(min(rgb.r, rgb.g), rgb.b);
    float delta = Cmax - Cmin;

    float hue = 0.0;
    if (delta != 0.0) {
        if (Cmax == rgb.r) {
            hue = mod((rgb.g - rgb.b) / delta, 4.0);
        } else if (Cmax == rgb.g) {
            hue = ((rgb.b - rgb.r) / delta) + 1.0;
        } else {
            hue = ((rgb.r - rgb.g) / delta) + 8.0;
        }
        hue *= 60.0;
    }

    float saturation = (Cmax != 0.0) ? (delta / Cmax) : 0.0;
    float value = Cmax;

    return vec3(hue, saturation, value);
}

vec3 hsvToRgb(vec3 hsv) {
    float C = hsv.y * hsv.z;
    float X = C * (1.0 - abs(mod(hsv.x / 60.0, 2.0) - 1.0));
    float m = hsv.z - C;

    vec3 rgb = vec3(0.0, 0.0, 0.0);
    if (hsv.x >= 0.0 && hsv.x < 60.0) {
        rgb = vec3(C, X, 0.0);
    } else if (hsv.x >= 60.0 && hsv.x < 120.0) {
        rgb = vec3(X, C, 0.0);
    } else if (hsv.x >= 120.0 && hsv.x < 180.0) {
        rgb = vec3(0.0, C, X);
    } else if (hsv.x >= 180.0 && hsv.x < 240.0) {
        rgb = vec3(0.0, X, C);
    } else if (hsv.x >= 240.0 && hsv.x < 300.0) {
        rgb = vec3(X, 0.0, C);
    } else {
        rgb = vec3(C, 0.0, X);
    }

    return rgb + m;
}




void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;//[0-1]目前原點範圍
    st.x *= u_resolution.x/u_resolution.y;//mark掉 圓形會跟著畫布變形
    
    st.x -= 0.4;//移到中間
    vec2 uv=st*2.0-1.0;//[-1到1]原點範圍
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    
    for(float i =0.0;i<4.;i++){
    
    uv *= 1.45;//(2)變4倍 16個
    uv = fract(uv);//重複(1)
    uv -=0.5;//(3)改變中點
    //簡化成 uv = fract(uv*2.0)-0.5;
    
    float d=length(uv)*exp(-length(uv0));//圓 座標系統要改成uv disc是從原點出發
    float circle=abs(d-0.888);//圓心改變位置 abs：取絕對值 圓環顏色顛倒
    vec3 color=palette(length(uv0)+i*0.1 + u_time*.3);//red
    
    
     vec3 hsvColor = rgbToHsv(color);
        hsvColor.z *= 0.5;
        color = hsvToRgb(hsvColor);

    d = sin(d*8. + u_time)/8.;
    d = abs(d);

    d = pow(0.01/d,0.600);
    
    finalColor += color * d;
    }
    gl_FragColor = vec4(finalColor,1.0);//output 指定像素
}