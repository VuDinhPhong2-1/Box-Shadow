import createStore from "teaful";

const { useStore } = createStore({
  shadowSettings: [
    {
      id: 1,
      shiftRight: 0,
      shiftDown: 0,
      spread: 3,
      blur: 5,
      opacity: 20,
      color: { r: 0, g: 0, b: 0 },
      inset: false,
    },
  ],
  backgroundPreviewSettings: {
    backgroundAreaPreview: { r: 255, g: 255, b: 255 },
    backgroundBoxPreview: { r: 61, g: 157, b: 246 },
  },
});

export { useStore };
