import { ResponsiveLayout } from "../layout/ResponsiveLayout.js";

export class BaseScene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    create() {
        this.layout = new ResponsiveLayout(this);

        this.build();      // 子クラスがUI生成
        this.relayout();   // 初期配置
        this.setMotion();

        this.scale.on("resize", () => {
            this.relayout();
        });
    }

    // 子クラスで上書きする
    build() {}

    // 子クラスで上書きする
    relayout() {}

    // 子クラスで上書きする
    setMotion() {}
}