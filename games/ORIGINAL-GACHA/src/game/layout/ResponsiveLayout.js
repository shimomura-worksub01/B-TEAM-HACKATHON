export class ResponsiveLayout {

    constructor(scene) {
        this.scene = scene;
    }

    getSize() {
        const { width, height } = this.scene.scale;
        return {
            width,
            height,
            cx: width / 2,
            cy: height / 2,
            isPortrait: height > width,
        };
    }

    getFontSize(ratio = 0.05) {
        return Math.floor(this.scene.scale.width * ratio);
    }
}