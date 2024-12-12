import { useState } from "preact/hooks";
import { useStore } from "../../store";
import style from "./style.css";
import { produce } from "immer";

// Hàm chuyển đổi từ RGB sang Hex
const rgbToHex = ({ r, g, b }) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;

const Preview = () => {
  const [template1, setTemplate1] = useState(true);
  const [template2, setTemplate2] = useState(true);

  const [shadowSettings, setShadowSettings] = useStore.shadowSettings();
  const [backgroundPreviewSettings, setBackgroundPreviewSettings] =
    useStore.backgroundPreviewSettings();
  // Chuyển các giá trị RGB thành Hex để sử dụng cho input color
  const backgroundAreaPreviewHex = rgbToHex(
    backgroundPreviewSettings.backgroundAreaPreview
  );
  const backgroundBoxPreviewHex = rgbToHex(
    backgroundPreviewSettings.backgroundBoxPreview
  );

  // Tạo chuỗi box-shadow cho tất cả các phần tử trong shadowSettings
  const boxShadows = shadowSettings
    .map((currentShadow) => {
      return `rgba(${currentShadow.color?.r || 0}, ${
        currentShadow.color?.g || 0
      }, ${currentShadow.color?.b || 0}, ${currentShadow.opacity / 100 || 0}) ${
        currentShadow.inset ? "inset" : ""
      } ${currentShadow.shiftRight || 0}px ${currentShadow.shiftDown || 0}px ${
        currentShadow.blur || 0
      }px ${currentShadow.spread || 0}px`;
    })
    .join(", ");

  const handleInputChange = (key, value, event) => {
    if (key === "backgroundAreaPreview" || key === "backgroundBoxPreview") {
      const hexToRgbObject = (hex) => {
        hex = hex.replace(/^#/, "");
        const bigint = parseInt(hex, 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255,
        };
      };
      value = hexToRgbObject(value);
    }

    // Cập nhật giá trị màu sắc vào store
    setBackgroundPreviewSettings((prevSettings) =>
      produce(prevSettings, (draft) => {
        draft[key] = value;
      })
    );

    // set background gradient cho slider
    if (event) {
      const input = event.target;
      const min = Number(input.min);
      const max = Number(input.max);
      const percentage = ((value - min) / (max - min)) * 100;
      input.style.background = `linear-gradient(to right, #5c6ac4 ${percentage}%, #d3d3d3 ${percentage}%)`;
    }
  };
  const handleTemplate1Click1 = () => {
    let newShadowSettings;
    if (!template2) {
      setTemplate2(true);
    }
    if (template1) {
      newShadowSettings = [
        {
          id: 1,
          shiftRight: 5,
          shiftDown: 5,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 40, g: 159, b: 237 },
          inset: false,
        },
        {
          id: 2,
          shiftRight: 10,
          shiftDown: 10,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 95, g: 184, b: 255 },
          inset: false,
        },
        {
          id: 3,
          shiftRight: 15,
          shiftDown: 15,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 161, g: 216, b: 255 },
          inset: false,
        },
        {
          id: 4,
          shiftRight: 20,
          shiftDown: 20,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 202, g: 230, b: 255 },
          inset: false,
        },
        {
          id: 5,
          shiftRight: 25,
          shiftDown: 25,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 225, g: 238, b: 255 },
          inset: false,
        },
      ];
    } else {
      newShadowSettings = [
        {
          id: 4,
          shiftRight: 20,
          shiftDown: 20,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 202, g: 230, b: 255 },
          inset: false,
        },
        {
          id: 5,
          shiftRight: 25,
          shiftDown: 25,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 225, g: 238, b: 255 },
          inset: false,
        },
        {
          id: 3,
          shiftRight: 15,
          shiftDown: 15,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 161, g: 216, b: 255 },
          inset: false,
        },

        {
          id: 1,
          shiftRight: 5,
          shiftDown: 5,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 40, g: 159, b: 237 },
          inset: false,
        },
        {
          id: 2,
          shiftRight: 10,
          shiftDown: 10,
          spread: 0,
          blur: 0,
          opacity: 100,
          color: { r: 95, g: 184, b: 255 },
          inset: false,
        },
      ];
    }

    // Cập nhật shadowSettings trực tiếp
    // setShadowSettings(() => newShadowSettings);
    setShadowSettings((prevSettings) =>
      produce(prevSettings, (draft) => {
        Object.assign(draft, newShadowSettings);
      })
    );
    setTemplate1(!template1);
  };

  const handleTemplate1Click2 = () => {
    let newShadowSettings;
    if (!template1) {
      setTemplate1(true);
    }
    if (template2) {
      newShadowSettings = [
        {
          id: 1,
          shiftRight: -1,
          shiftDown: 0,
          spread: 0,
          blur: 4,
          opacity: 100,
          color: { r: 255, g: 255, b: 255 },
          inset: false,
        },
        {
          id: 2,
          shiftRight: -2,
          shiftDown: 0,
          spread: 0,
          blur: 10,
          opacity: 100,
          color: { r: 255, g: 255, b: 0 },
          inset: false,
        },
        {
          id: 3,
          shiftRight: -10,
          shiftDown: 0,
          spread: 0,
          blur: 20,
          opacity: 100,
          color: { r: 255, g: 128, b: 0 },
          inset: false,
        },
        {
          id: 4,
          shiftRight: -18,
          shiftDown: 0,
          spread: 0,
          blur: 40,
          opacity: 100,
          color: { r: 255, g: 0, b: 0 },
          inset: false,
        },
      ];
    } else {
      newShadowSettings = [
        {
          id: 3,
          shiftRight: -10,
          shiftDown: 0,
          spread: 0,
          blur: 20,
          opacity: 100,
          color: { r: 255, g: 128, b: 0 },
          inset: false,
        },
        {
          id: 4,
          shiftRight: -18,
          shiftDown: 0,
          spread: 0,
          blur: 40,
          opacity: 100,
          color: { r: 255, g: 0, b: 0 },
          inset: false,
        },
        {
          id: 1,
          shiftRight: -1,
          shiftDown: 0,
          spread: 0,
          blur: 4,
          opacity: 100,
          color: { r: 255, g: 255, b: 255 },
          inset: false,
        },
        {
          id: 2,
          shiftRight: -2,
          shiftDown: 0,
          spread: 0,
          blur: 10,
          opacity: 100,
          color: { r: 255, g: 255, b: 0 },
          inset: false,
        },
      ];
    }

    setShadowSettings((prevSettings) =>
      produce(prevSettings, (draft) => {
        draft.splice(0, draft.length, ...newShadowSettings);
      })
    );
    setTemplate2(!template2);
  };

  return (
    <div className={style.containerWrapper}>
      <div className={style.containerPreview}>
        <h2>
          Preview
          <div className={style.selectColor}>
            <div
              style={{
                border: "1px solid #dfe3e8",
                height: "34px",
                borderRadius: "3px",
              }}
            >
              {/* pick color background area preview */}
              <input
                type="color"
                value={backgroundAreaPreviewHex}
                onChange={(e) => {
                  handleInputChange(
                    "backgroundAreaPreview",
                    e.target.value, // Truyền vào Hex màu
                    e
                  );
                }}
              />
            </div>
            <div
              style={{
                border: "1px solid #dfe3e8",
                height: "34px",
                borderRadius: "3px",
              }}
            >
              {/* pick color background box preview */}
              <input
                type="color"
                value={backgroundBoxPreviewHex}
                onChange={(e) => {
                  handleInputChange(
                    "backgroundBoxPreview",
                    e.target.value, // Truyền vào Hex màu
                    e
                  );
                }}
              />
            </div>
          </div>
        </h2>
        <div
          style={{
            maxWidth: "457px",
            width: "100%",
            backgroundColor: `rgb(${backgroundPreviewSettings.backgroundAreaPreview.r}, ${backgroundPreviewSettings.backgroundAreaPreview.g}, ${backgroundPreviewSettings.backgroundAreaPreview.b})`,
            padding: "40px",
            height: "fit-content",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: `rgb(${backgroundPreviewSettings.backgroundBoxPreview.r}, ${backgroundPreviewSettings.backgroundBoxPreview.g}, ${backgroundPreviewSettings.backgroundBoxPreview.b})`,
              boxShadow: boxShadows,
              transition: "box-shadow 0.1s ease-in-out",
            }}
          />
        </div>
      </div>
      <div className={style.containerCssCode}>
        <p>CSS code</p>
        <span>{`box-shadow: ${boxShadows};`}</span>
      </div>

      <div className={style.containerTemplate}>
        <p>Template</p>
        <div className={style.template}>
          <div
            className={style.templateGlobal + " " + style.template1}
            onClick={() => {
              handleTemplate1Click1();
            }}
          />
          <div
            className={style.templateGlobal + " " + style.template2}
            onClick={() => {
              handleTemplate1Click2();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
