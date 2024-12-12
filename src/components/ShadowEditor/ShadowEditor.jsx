import { useEffect, useState } from "preact/hooks";
import { useStore } from "../../store"; // Đảm bảo bạn đã cấu hình store trước
import style from "./style.css";
import { produce } from "immer";

const ShadowEditor = () => {
  const [shadowSettings, setShadowSettings] = useStore.shadowSettings(); // Mảng shadow từ store
  const [selectShadowId, setSelectShadowId] = useState(1); // ID của shadow đang được chọn
  const [draggedItemId, setDraggedItemId] = useState(null); // Quản lý item đang được kéo
  const handleDragStart = (id) => {
    setDraggedItemId(id); // Lưu lại ID của item đang kéo
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Cho phép thả (default là không cho phép)
  };

  const handleDrop = (id) => {
    console.log("id", id);
    setShadowSettings((prevSettings) => {
      const draggedItem = prevSettings.find(
        (item) => item.id === draggedItemId
      );
      const targetIndex = prevSettings.findIndex((item) => item.id === id);
      const draggedIndex = prevSettings.findIndex(
        (item) => item.id === draggedItemId
      );

      // Đổi vị trí các item trong danh sách
      const updatedSettings = [...prevSettings];
      updatedSettings.splice(draggedIndex, 1); // Xóa item bị kéo khỏi vị trí cũ
      updatedSettings.splice(targetIndex, 0, draggedItem); // Thêm vào vị trí mới

      return updatedSettings;
    });

    setDraggedItemId(null); // Reset trạng thái kéo
  };

  const currentShadow = shadowSettings.find(
    (setting) => setting.id === selectShadowId
  );

  const handleLayerItemClick = (id) => {
    setSelectShadowId(id);
  };

  const handleInputChange = (key, value, event) => {
    if (key === "color") {
      // Chuyển đổi hex sang RGB đối tượng
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

    // Cập nhật shadowSettings trong state
    setShadowSettings((prevSettings) =>
      produce(prevSettings, (draft) => {
        const setting = draft.find((s) => s.id === selectShadowId);
        if (setting) {
          setting[key] = value;
        }
      })
    );

    // Cập nhật gradient cho input nếu có sự thay đổi
    if (event) {
      const input = event.target;
      const min = Number(input.min);
      const max = Number(input.max);
      const percentage = ((value - min) / (max - min)) * 100;
      input.style.background = `linear-gradient(to right, #5c6ac4 ${percentage}%, #d3d3d3 ${percentage}%)`;
    }
  };

  useEffect(() => {
    // Lấy tất cả các slider (input type="range")
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach((input) => {
      const min = Number(input.min);
      const max = Number(input.max);
      const value = Number(input.value);
      const percentage = ((value - min) / (max - min)) * 100;

      // Áp dụng gradient cho slider
      input.style.background = `linear-gradient(to right, #5c6ac4 ${percentage}%, #d3d3d3 ${percentage}%)`;
    });
  }, [selectShadowId, shadowSettings]);

  // Hàm thêm shadow mới
  const addShadowLayer = () => {
    const newShadow = {
      id: shadowSettings.length + 1, // ID mới
      shiftRight: 0,
      shiftDown: 0,
      spread: 3,
      blur: 5,
      opacity: 20,
      color: { r: 0, g: 0, b: 0 },
      inset: false,
    };

    setShadowSettings((prevSettings) => [...prevSettings, newShadow]);
  };

  const deleteShadowLayer = (id) => {
    if (shadowSettings.length > 1) {
      // Kiểm tra nếu layer bị xóa là layer đang chọn
      if (selectShadowId === id) {
        const index = shadowSettings.findIndex((item) => item.id === id);
        if (index === shadowSettings.length - 1) {
          setSelectShadowId(shadowSettings?.[index - 1].id);
        } else {
          setSelectShadowId(shadowSettings?.[index + 1].id);
        }
      }
      setShadowSettings((prevSettings) => {
        const filteredSettings = prevSettings.filter(
          (shadow) => shadow.id !== id
        );
        return filteredSettings;
      });
    }
  };

  return (
    <div className={style.container}>
      <h2>Box-Shadow CSS Generator</h2>
      <div className={style.sliderControls}>
        <div className={style.formLayout_item}>
          <label>Shift right</label>
          <div className={style.containerSlider}>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={currentShadow.shiftRight}
              onInput={(e) =>
                handleInputChange("shiftRight", Number(e.target.value), e)
              }
              className={style.rangeSlider}
            />
            <span
              className={style.sliderValue}
              style={{
                left: `calc(${((currentShadow.shiftRight + 50) / 100) * 100}%)`,
              }}
            >
              {currentShadow.shiftRight}
            </span>
          </div>
        </div>

        <div className={style.formLayout_item}>
          <label>Shift down</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={currentShadow.shiftDown}
            onInput={(e) =>
              handleInputChange("shiftDown", Number(e.target.value), e)
            }
          />
        </div>
        <div className={style.formLayout_item}>
          <label>Spread</label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentShadow.spread}
            onInput={(e) =>
              handleInputChange("spread", Number(e.target.value), e)
            }
          />
        </div>
        <div className={style.formLayout_item}>
          <label>Blur</label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentShadow.blur}
            onInput={(e) =>
              handleInputChange("blur", Number(e.target.value), e)
            }
          />
        </div>
        <div className={style.formLayout_item}>
          <label>Opacity</label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentShadow.opacity}
            onInput={(e) =>
              handleInputChange("opacity", Number(e.target.value), e)
            }
          />
        </div>
        <div className={style.formLayout_item_2}>
          <label>
            <input
              type="checkbox"
              checked={currentShadow.inset}
              onChange={(e) => handleInputChange("inset", e.target.checked)}
            />
            Inset
          </label>
        </div>
        <div className={style.formLayout_item_2}>
          <input
            type="color"
            value={`#${(
              (1 << 24) +
              (currentShadow.color.r << 16) +
              (currentShadow.color.g << 8) +
              currentShadow.color.b
            )
              .toString(16)
              .slice(1)}`}
            onInput={(e) => handleInputChange("color", e.target.value)}
          />
        </div>
      </div>
      <div className={style.containerAddLayer}>
        <button onClick={addShadowLayer}>
          <span>Add Layer</span>
        </button>
        <div className={style.layerWrap}>
          {shadowSettings.map((shadow) => (
            <div
              key={shadow.id}
              className={`${style.layerItem} ${
                selectShadowId === shadow.id ? style.selected : ""
              }`}
              draggable // Cho phép kéo thả
              onDragStart={() => handleDragStart(shadow.id)} // Khi bắt đầu kéo
              onDragOver={handleDragOver} // Khi di chuột qua item
              onDrop={() => handleDrop(shadow.id)} // Khi thả item
              onClick={() => handleLayerItemClick(shadow.id)}
            >
              <div className={style.left}>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2m0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8m0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14m6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6m0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8m0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14"
                  />
                </svg>

                <span>
                  {`
                ${shadow.shiftRight}px
                ${shadow.shiftDown}px
                ${shadow.blur}px
                ${shadow.spread}px
                rgba(${shadow.color.r}, ${shadow.color.g}, ${shadow.color.b}, ${
                    shadow.opacity / 100
                  })
                ${shadow.inset ? "inset" : ""}
              `}
                </span>
              </div>

              <div className={style.right}>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.086 2.912a3.126 3.126 0 0 0-4.414 0l-9.379 9.379a.998.998 0 0 0-.263.464l-1 4a1 1 0 0 0 1.212 1.213l4-1c.176-.044.337-.135.465-.263l9.38-9.379a3.125 3.125 0 0 0 0-4.414zm-1.414 3L15 6.584l-1.586-1.586.672-.672a1.125 1.125 0 0 1 1.586 0 1.123 1.123 0 0 1 0 1.586zM5.414 12.998L12 6.412l1.586 1.586L7 14.584l-1.586-1.586z"
                  />
                </svg>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra bên ngoài
                    console.log("Xóa layer có ID:", shadow.id);
                    deleteShadowLayer(shadow.id);
                  }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 6H4a1 1 0 1 0 0 2h1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8h1a1 1 0 1 0 0-2zM9 4a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2H9zm2 12h2V8h-2v8zm-4 0h2V8H7v8z"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShadowEditor;
