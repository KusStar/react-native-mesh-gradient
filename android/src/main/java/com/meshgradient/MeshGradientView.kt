package com.meshgradient

import android.content.Context
import android.opengl.GLSurfaceView
import android.opengl.GLSurfaceView.RENDERMODE_CONTINUOUSLY
import android.util.AttributeSet

class MeshGradientView @JvmOverloads constructor(
  context: Context,
  attrs: AttributeSet? = null,
) : GLSurfaceView(context, attrs) {

  private val renderer: MeshGradientRenderer

  init {
    setEGLContextClientVersion(2)
    renderer = MeshGradientRenderer()
    setRenderer(renderer)
    renderMode = RENDERMODE_CONTINUOUSLY
  }

  fun setColors(colors: IntArray) {
    renderer.setColors(colors)
  }

  fun setSpeed(speed: Float) {
    renderer.setSpeed(speed)
  }

  fun setBrightness(brightness: Float) {
    renderer.setBrightness(brightness)
  }

  fun setContrast(contrast: Float) {
    renderer.setContrast(contrast)
  }

  fun setFrequency(frequency: Float) {
    renderer.setFrequency(frequency)
  }

  fun setAmplitude(amplitude: Float) {
    renderer.setAmplitude(amplitude)
  }
}
