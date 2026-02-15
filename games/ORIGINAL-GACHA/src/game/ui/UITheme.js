export const UITheme = {

    colors: {
        primary: "#ffffff",
        accent: "#ffcc00",
        shadow: "#000000"
    },

    textStyles: {

        title: {
            fontFamily: "Arial Black",
            color: "#ffffff",
            stroke: "#ffcc00",
            strokeThickness: 8,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: "#000000",
                blur: 5,
                stroke: true,
                fill: true
            }
        },

        normal: (fontSize) => ({
            fontFamily: "Arial",
            fontSize: fontSize + "px",
            color: "#ffffff"
        })
    }
};
