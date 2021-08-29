import type { IArgsMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";
import { Bang, isBang } from "../sdk";
import LiveTextUI, { LiveTextUIState } from "../ui/text";
import LiveObject, { LiveObjectProps } from "./base";

export interface LiveTextProps extends LiveObjectProps {
    bgColor: string;
    bgOnColor: string;
    activeBgColor: string;
    activeBgOnColor: string;
    borderColor: string;
    focusBorderColor: string;
    textColor: string;
    textOnColor: string;
    activeTextColor: string;
    activeTextOnColor: string;
    fontFamily: string;
    fontSize: number;
    fontFace: "regular" | "bold" | "italic" | "bold italic";
    mode: "button" | "toggle";
    text: string;
    textOn: string;
}
export default class LiveText extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveTextProps, LiveTextUIState> {
    static description = "Button or toggle with text";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "number",
        description: "Set and output the value"
    }, {
        isHot: false,
        type: "number",
        description: "Set without output the value"
    }];
    static outlets: IOutletsMeta = [{
        type: "number",
        description: "Number value"
    }, {
        type: "string",
        description: "Display value"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Initial value"
    }];
    static props: IPropsMeta<Partial<LiveTextProps>> = {
        bgColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Background color (inactive / off)",
            isUIState: true
        },
        activeBgColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Background color (active / off)",
            isUIState: true
        },
        bgOnColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Background color (inactive / on)",
            isUIState: true
        },
        activeBgOnColor: {
            type: "color",
            default: "rgba(255, 181, 50, 1)",
            description: "Background color (active / on)",
            isUIState: true
        },
        borderColor: {
            type: "color",
            default: "rgba(80, 80, 80, 1)",
            description: "Border color (unfocus)",
            isUIState: true
        },
        focusBorderColor: {
            type: "color",
            default: "rgba(80, 80, 80, 1)",
            description: "Border color (focus)",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgba(90, 90, 90, 1)",
            description: "Text color (inactive / off)",
            isUIState: true
        },
        textOnColor: {
            type: "color",
            default: "rgba(90, 90, 90, 1)",
            description: "Text color (inactive / on)",
            isUIState: true
        },
        activeTextColor: {
            type: "color",
            default: "rgba(0, 0, 0, 1)",
            description: "Text color (active / off)",
            isUIState: true
        },
        activeTextOnColor: {
            type: "color",
            default: "rgba(0, 0, 0, 1)",
            description: "Text color (active / on)",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Arial",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 10,
            description: "Text font size",
            isUIState: true
        },
        fontFace: {
            type: "enum",
            enums: ["regular", "bold", "italic", "bold italic"],
            default: "regular",
            description: "Text style",
            isUIState: true
        },
        mode: {
            type: "enum",
            enums: ["button", "toggle"],
            default: "toggle",
            description: "Trigger mode",
            isUIState: true
        },
        text: {
            type: "string",
            default: "A",
            description: "Text (off)",
            isUIState: true
        },
        textOn: {
            type: "string",
            default: "B",
            description: "Text (off)",
            isUIState: true
        }
    };
    static UI = LiveTextUI;
    handleUpdateArgs = (args: [number?]) => {
        if (typeof args[0] === "number") {
            this.validateValue(args[0]);
            this.updateUI({ value: this.state.value });
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
            this.handleUpdateArgs(this.args);
        });
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    const value = +data;
                    this.validateValue(value);
                    this.updateUI({ value: this.state.value });
                }
                this.outletAll([this.state.value, this._.displayValue]);
            } else if (inlet === 1) {
                const value = +data;
                this.validateValue(value);
                this.updateUI({ value: this.state.value });
            }
        });
        this.on("changeFromUI", ({ value }) => {
            this.validateValue(value);
            this.outletAll([this.state.value, this._.displayValue]);
        });
    }
}