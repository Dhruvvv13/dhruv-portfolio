import * as React from "react";

/**
 * A slowly-animating dark gradient "veil" background (WebGL2 fragment
 * shader). Not a pasted component — only a usage snippet was given
 * (`import DarkVeil from './DarkVeil'` with a prop list), so this
 * implements that same prop surface from scratch, following the same
 * canvas-effect pattern already used elsewhere on this site (hero's
 * beams): resize via ResizeObserver, pause when off-screen or the tab is
 * hidden, single static frame under prefers-reduced-motion.
 */
export interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  className?: string;
}

const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHueShift;
uniform float uNoiseIntensity;
uniform float uScanlineIntensity;
uniform float uScanlineFrequency;
uniform float uWarpAmount;
out vec4 fragColor;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash(i) * 2.0 - 1.0, f);
  float b = dot(hash(i + vec2(1.0, 0.0)) * 2.0 - 1.0, f - vec2(1.0, 0.0));
  float c = dot(hash(i + vec2(0.0, 1.0)) * 2.0 - 1.0, f - vec2(0.0, 1.0));
  float d = dot(hash(i + vec2(1.0, 1.0)) * 2.0 - 1.0, f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}
vec3 hueRotate(vec3 col, float deg) {
  float a = radians(deg), s = sin(a), c = cos(a);
  mat3 m = mat3(
    0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s, 0.114 - 0.114 * c - 0.497 * s,
    0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
    0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s, 0.114 + 0.886 * c - 0.203 * s
  );
  return clamp(m * col, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 p = uv - 0.5;
  p.x *= iResolution.x / iResolution.y;

  vec2 warp = uWarpAmount * 0.4 * vec2(
    noise(p * 2.0 + iTime * 0.05),
    noise(p * 2.0 - iTime * 0.04 + 5.0)
  );
  vec2 wp = p + warp;

  float n1 = noise(wp * 1.6 + vec2(iTime * 0.06, -iTime * 0.04));
  float n2 = noise(wp * 2.6 - vec2(iTime * 0.03, iTime * 0.05) + 10.0);
  float veil = smoothstep(0.15, 0.95, n1 * 0.6 + n2 * 0.4);

  vec3 deep = vec3(0.035, 0.047, 0.063);
  vec3 mid  = vec3(0.075, 0.115, 0.165);
  vec3 col = mix(deep, mid, veil);

  float grain = hash(uv * iResolution.xy + iTime).x;
  col += (grain - 0.5) * uNoiseIntensity;

  float scan = sin(uv.y * iResolution.y * uScanlineFrequency) * 0.5 + 0.5;
  col -= scan * uScanlineIntensity * 0.18;

  col = hueRotate(col, uHueShift);

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("DarkVeil: failed to create shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("DarkVeil shader error: " + log);
  }
  return sh;
}

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  className,
}: DarkVeilProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // The render loop reads props via this ref instead of the effect's
  // closure, so prop changes update the running shader without tearing
  // down and recreating the WebGL context on every render.
  const propsRef = React.useRef({ hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount });
  propsRef.current = { hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("DarkVeil link error: " + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      iResolution: gl.getUniformLocation(program, "iResolution"),
      iTime: gl.getUniformLocation(program, "iTime"),
      uHueShift: gl.getUniformLocation(program, "uHueShift"),
      uNoiseIntensity: gl.getUniformLocation(program, "uNoiseIntensity"),
      uScanlineIntensity: gl.getUniformLocation(program, "uScanlineIntensity"),
      uScanlineFrequency: gl.getUniformLocation(program, "uScanlineFrequency"),
      uWarpAmount: gl.getUniformLocation(program, "uWarpAmount"),
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(container!.clientWidth * dpr));
      const h = Math.max(1, Math.floor(container!.clientHeight * dpr));
      if (canvas!.width === w && canvas!.height === h) return;
      canvas!.width = w;
      canvas!.height = h;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(u.iResolution, w, h);
    }

    function render() {
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let elapsedMs = 0;
    let lastFrame = performance.now();

    function loop(now: number) {
      const dt = now - lastFrame;
      lastFrame = now;
      const p = propsRef.current;
      elapsedMs += dt * p.speed;
      gl!.uniform1f(u.iTime, elapsedMs * 0.001);
      gl!.uniform1f(u.uHueShift, p.hueShift);
      gl!.uniform1f(u.uNoiseIntensity, p.noiseIntensity);
      gl!.uniform1f(u.uScanlineIntensity, p.scanlineIntensity);
      gl!.uniform1f(u.uScanlineFrequency, p.scanlineFrequency);
      gl!.uniform1f(u.uWarpAmount, p.warpAmount);
      render();
      raf = requestAnimationFrame(loop);
    }

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) {
        lastFrame = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (raf === 0) render();
    });
    ro.observe(container);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render();
    } else {
      tryStart();
    }

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
