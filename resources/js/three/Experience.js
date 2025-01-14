import { on } from "events"
import * as THREE from "three"

import Camera from "./Camera"
import Renderer from "./Renderer"
import sources from "./sources"
import Cursor from "./Utils/Cursor"
import Debug from "./Utils/Debug"
import Resources from "./Utils/Resources"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import World from "./World/World"

let instance = null
export default class Experience {
    constructor(canvas) {
        // make Experience Singleton
        if (instance) return instance
        instance = this

        // just for testing not a good practise!
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug()

        this.sizes = new Sizes()
        this.sizes.on('resize', () => this.resize())

        this.time = new Time()
        this.time.on('tick', () => this.update())

        this.cursor = new Cursor()

        // three.js
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // update shadow maps
        this.renderer.instance.shadowMap.needsUpdate = true
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.debug.beforeUpdate()

        this.world.update()
        this.camera.update()
        this.renderer.update()

        this.debug.afterUpdate()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // traverse the whole scene
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) this.debug.ui.destroy()
    }


}
