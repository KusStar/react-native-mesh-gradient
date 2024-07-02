package com.meshgradient

import android.content.Context
import android.opengl.GLES20.GL_COLOR_BUFFER_BIT
import android.opengl.GLES20.GL_COMPILE_STATUS
import android.opengl.GLES20.GL_DEPTH_BUFFER_BIT
import android.opengl.GLES20.GL_FLOAT
import android.opengl.GLES20.GL_FRAGMENT_SHADER
import android.opengl.GLES20.GL_TRIANGLES
import android.opengl.GLES20.GL_VERTEX_SHADER
import android.opengl.GLES20.glAttachShader
import android.opengl.GLES20.glClear
import android.opengl.GLES20.glClearColor
import android.opengl.GLES20.glCompileShader
import android.opengl.GLES20.glCreateProgram
import android.opengl.GLES20.glCreateShader
import android.opengl.GLES20.glDeleteShader
import android.opengl.GLES20.glDisableVertexAttribArray
import android.opengl.GLES20.glDrawArrays
import android.opengl.GLES20.glEnableVertexAttribArray
import android.opengl.GLES20.glGetAttribLocation
import android.opengl.GLES20.glGetShaderiv
import android.opengl.GLES20.glGetUniformLocation
import android.opengl.GLES20.glLinkProgram
import android.opengl.GLES20.glShaderSource
import android.opengl.GLES20.glUniform1f
import android.opengl.GLES20.glUniform2f
import android.opengl.GLES20.glUniform3fv
import android.opengl.GLES20.glUseProgram
import android.opengl.GLES20.glVertexAttribPointer
import android.opengl.GLES20.glViewport
import android.opengl.GLSurfaceView
import android.opengl.GLSurfaceView.RENDERMODE_CONTINUOUSLY
import android.util.AttributeSet
import java.lang.RuntimeException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10
import kotlin.also
import kotlin.apply
import kotlin.run

// from https://www.shadertoy.com/view/wdyczG, Created by hahnzhu in 2020-10-20
const val fragmentShaderCode = /* Your GLSL fragment shader code here */
"""precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform lowp float iSpeed;
uniform lowp float iBrightness;
uniform lowp float iContrast;
uniform lowp float iFrequency;
uniform lowp float iAmplitude;
uniform vec3 iLayer1Color1;
uniform vec3 iLayer1Color2;
uniform vec3 iLayer2Color1;
uniform vec3 iLayer2Color2;
varying vec2 v_TexCoord;

#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}
// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
vec2 hash(vec2 p) {
    p = vec2(dot(p,vec2(2127.1, 81.17)), dot(p,vec2(1269.5, 283.37)));
    return fract(sin(p)*43758.5453);
}
float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix(
        mix(dot(-1.0+2.0*hash(i+vec2(0.0, 0.0)), f-vec2(0.0, 0.0)),
            dot(-1.0+2.0*hash(i+vec2(1.0, 0.0)), f-vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0+2.0*hash(i+vec2(0.0, 1.0)), f-vec2(0.0, 1.0)),
            dot(-1.0+2.0*hash(i+vec2(1.0, 1.0)), f-vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5*n;
}
void main() {
    vec2 fragCoord = v_TexCoord * iResolution;
    vec2 uv = fragCoord / iResolution;
    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv - 0.5;
    float degree = noise(vec2(iTime * 0.1, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
    tuv.y *= ratio;
    float speed = iTime * iSpeed;
    tuv.x += sin(tuv.y * iFrequency + speed) / iAmplitude;
    tuv.y += sin(tuv.x * iFrequency * 1.5 + speed) / (iAmplitude * 0.5);

    vec3 layer1 = mix(iLayer1Color1, iLayer1Color2, S(-.3, .2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(iLayer2Color1, iLayer2Color2, S(-.3, .2, (tuv * Rot(radians(-5.0))).x));

    vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));
    // Contrast and brightness
    finalComp = (finalComp - 0.5) * iContrast + 0.5 + iBrightness - 1.0;
    gl_FragColor = vec4(finalComp, 1.0);
}"""

class MeshGradientView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : GLSurfaceView(context, attrs) {

    private val renderer: GradientRenderer

    init {
        setEGLContextClientVersion(2)
        renderer = GradientRenderer()
        setRenderer(renderer)
        renderMode = RENDERMODE_CONTINUOUSLY
    }

    fun setColors(colors: IntArray) {
        renderer.colors = colors
    }

    fun setSpeed(speed: Float) {
        renderer.speed = speed
    }

    fun setBrightness(brightness: Float) {
        renderer.brightness = brightness
    }

    fun setContrast(contrast: Float) {
        renderer.contrast = contrast
    }

    fun setFrequency(frequency: Float) {
        renderer.frequency = frequency
    }

    fun setAmplitude(amplitude: Float) {
        renderer.amplitude = amplitude
    }

    private class GradientRenderer : Renderer {
        private var width: Int = 0
        private var height: Int = 0
        var speed: Float = 2f
        var colors: IntArray = IntArray(4)
        // 0~2f
        var brightness: Float = 1f
        // 0~2f
        var contrast: Float = 1f
        var frequency: Float = 5f
        var amplitude: Float = 30f

        private val vertexShaderCode =
            "attribute vec4 a_Position;" +
                    "attribute vec2 a_TexCoord;" +
                    "varying vec2 v_TexCoord;" +
                    "void main() {" +
                    "    gl_Position = a_Position;" +
                    "    v_TexCoord = a_TexCoord;" +
                    "}"

        private val vertices: FloatBuffer = ByteBuffer.allocateDirect(4 * 5 * 6).run {
            order(ByteOrder.nativeOrder())
            asFloatBuffer().apply {
                put(
                    floatArrayOf(
                        -1f, -1f, 0f, 0f, 0f,
                        1f, -1f, 0f, 1f, 0f,
                        -1f, 1f, 0f, 0f, 1f,
                        1f, -1f, 0f, 1f, 0f,
                        1f, 1f, 0f, 1f, 1f,
                        -1f, 1f, 0f, 0f, 1f
                    )
                )
                position(0)
            }
        }

        private fun intToNormalizedRGB(color: Int): FloatArray {
            val r = (color shr 16 and 0xFF) / 255.0f
            val g = (color shr 8 and 0xFF) / 255.0f
            val b = (color and 0xFF) / 255.0f
            return floatArrayOf(r, g, b)
        }

        private var program = 0
        private var iTimeLocation = 0
        private var iSpeedLocation = 0
        private var iBrightnessLocation = 0
        private var iContrastLocation = 0
        private var iFrequencyLocation = 0
        private var iAmplitudeLocation = 0
        private var iResolutionLocation = 0
        private var iLayer1Color1Location = 0
        private var iLayer1Color2Location = 0
        private var iLayer2Color1Location = 0
        private var iLayer2Color2Location = 0
        private var startTime: Long = 0

        override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {
            // Initialize shader program
            val vertexShader = loadShader(GL_VERTEX_SHADER, vertexShaderCode)
            val fragmentShader = loadShader(GL_FRAGMENT_SHADER, fragmentShaderCode)
            program = glCreateProgram().apply {
                glAttachShader(this, vertexShader)
                glAttachShader(this, fragmentShader)
                glLinkProgram(this)
            }

            // Get uniform locations
            iResolutionLocation = glGetUniformLocation(program, "iResolution")
            iTimeLocation = glGetUniformLocation(program, "iTime")
            iSpeedLocation = glGetUniformLocation(program, "iSpeed")
            iBrightnessLocation = glGetUniformLocation(program, "iBrightness")
            iContrastLocation = glGetUniformLocation(program, "iContrast")
            iFrequencyLocation = glGetUniformLocation(program, "iFrequency")
            iAmplitudeLocation = glGetUniformLocation(program, "iAmplitude")
            iLayer1Color1Location = glGetUniformLocation(program, "iLayer1Color1")
            iLayer1Color2Location = glGetUniformLocation(program, "iLayer1Color2")
            iLayer2Color1Location = glGetUniformLocation(program, "iLayer2Color1")
            iLayer2Color2Location = glGetUniformLocation(program, "iLayer2Color2")

            // Start time
            startTime = System.currentTimeMillis()
        }

        override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) {
            this.width = width
            this.height = height
            glViewport(0, 0, width, height)
        }

        override fun onDrawFrame(gl: GL10?) {
            // Set the clear color and clear the screen
            glClearColor(0f, 0f, 0f, 1f)
            glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT)

            // Use the shader program
            glUseProgram(program)

            // Set uniforms
            glUniform2f(iResolutionLocation, width.toFloat(), height.toFloat())
            val currentTime = (System.currentTimeMillis() - startTime) / 1000f
            glUniform1f(iTimeLocation, currentTime)
            // speed
            glUniform1f(iSpeedLocation, speed)
            // brightness
            glUniform1f(iBrightnessLocation, brightness)
            // frequency
            glUniform1f(iFrequencyLocation, frequency)
            // amplitude
            glUniform1f(iAmplitudeLocation, amplitude)
            // contrast
            glUniform1f(iContrastLocation, contrast)
            // Set uniforms color
            glUniform3fv(iLayer1Color1Location, 1, intToNormalizedRGB(colors[0]), 0)
            glUniform3fv(iLayer1Color2Location, 1, intToNormalizedRGB(colors[1]), 0)
            glUniform3fv(iLayer2Color1Location, 1, intToNormalizedRGB(colors[2]), 0)
            glUniform3fv(iLayer2Color2Location, 1, intToNormalizedRGB(colors[3]), 0)

            // Draw the quad
            vertices.position(0)
            val aPosition = glGetAttribLocation(program, "a_Position")
            glEnableVertexAttribArray(aPosition)
            glVertexAttribPointer(aPosition, 3, GL_FLOAT, false, 5 * 4, vertices)

            vertices.position(3)
            val aTexCoord = glGetAttribLocation(program, "a_TexCoord")
            glEnableVertexAttribArray(aTexCoord)
            glVertexAttribPointer(aTexCoord, 2, GL_FLOAT, false, 5 * 4, vertices)

            glDrawArrays(GL_TRIANGLES, 0, 6)

            glDisableVertexAttribArray(aPosition)
            glDisableVertexAttribArray(aTexCoord)
        }

        private fun loadShader(type: Int, shaderCode: String): Int {
            return glCreateShader(type).also { shader ->
                glShaderSource(shader, shaderCode)
                glCompileShader(shader)
                val compiled = IntArray(1)
                glGetShaderiv(shader, GL_COMPILE_STATUS, compiled, 0)
                if (compiled[0] == 0) {
                    glDeleteShader(shader)
                    throw RuntimeException("Error creating shader.")
                }
            }
        }
    }
}
