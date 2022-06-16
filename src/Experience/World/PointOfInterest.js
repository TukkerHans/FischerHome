import Experience from "../Experience";

export default class PointOfInterest {

    constructor(position, text, timeout) {
        // get context elements
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes

        // set attributes
        this.position = position

        // create html element
        this.element = this.createElement(text, timeout)
    }

    /**
     * creates new Element from a html template
     * @param {*} text 
     * @returns 
     */
    createElement(text, timeout) {
        const app = document.querySelector(".app")
        const newPointElement = document.querySelector("#pointTemplate").content.cloneNode(true).firstElementChild
        newPointElement.querySelector(".label").innerHTML = ""
        // newPointElement.querySelector(".text").innerHTML = text
        const newNode = app.appendChild(newPointElement)
        
        // show points of interest after x seconds
        setTimeout(() => {
            newNode.classList.add("visible")
        }, 1500);
        return newNode
    }

    update() {
        const screenPosition = this.position.clone()
        screenPosition.project(this.camera)

        const translateX = screenPosition.x * this.sizes.width * 0.5
        const translateY = - screenPosition.y * this.sizes.height * 0.5
        this.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }
}