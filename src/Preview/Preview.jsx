import { useStore } from "../../store";
import style from "./style.css";
const Preview = () => {
  const [shadowSettings] = useStore.shadowSettings();

  const boxShadow = `
    ${shadowSettings.inset ? "inset" : ""}
    ${shadowSettings.shiftRight}px
    ${shadowSettings.shiftDown}px
    ${shadowSettings.blur}px
    ${shadowSettings.spread}px
    rgba(${shadowSettings.color.r}, ${shadowSettings.color.g}, ${
    shadowSettings.color.b
  }, ${shadowSettings.opacity})
  `.trim();

  return (
    <div className={style.container}>
      <h2>Preview</h2>
      <div
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: "blue",
          boxShadow: boxShadow,
        }}
      />
      <p>CSS Code:</p>
      <pre>{`box-shadow: ${boxShadow};`}</pre>
    </div>
  );
};

export default Preview;
