import ShadowEditor from "../../components/ShadowEditor/ShadowEditor";
import Preview from "../../components/Preview/Preview";
import style from "./style.css";

const Home = () => {
  return (
    <div className={style.container}>
      <ShadowEditor />
      <Preview />
    </div>
  );
};

export default Home;
