package com.meshgradient

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class MeshGradientViewManager : SimpleViewManager<MeshGradientView>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MeshGradientView {
        return MeshGradientView(reactContext)
    }

    @ReactProp(name = "speed")
    fun setSpeed(view: MeshGradientView, speed: Float) {
        view.setSpeed(speed)
    }

    @ReactProp(name = "brightness")
    fun setBrightness(view: MeshGradientView, brightness: Float) {
        view.setBrightness(brightness)
    }

    @ReactProp(name = "frequency")
    fun setFrequency(view: MeshGradientView, frequency: Float) {
        view.setFrequency(frequency)
    }

    @ReactProp(name = "amplitude")
    fun setAmplitude(view: MeshGradientView, amplitude: Float) {
        view.setAmplitude(amplitude)
    }

    @ReactProp(name = "contrast")
    fun setContrast(view: MeshGradientView, contrast: Float) {
        view.setContrast(contrast)
    }

    @ReactProp(name = "colors")
    fun setColors(view: MeshGradientView, data: ReadableArray) {
        val colors = mutableListOf<Int>()
        for (i in 0 until data.size()) {
            colors.add(data.getInt(i))
        }
        view.setColors(colors.toIntArray())
    }

    companion object {
        private const val REACT_CLASS = "MeshGradientView"
    }
}
