import { h } from "preact";

// Note: `user` comes from the URL, courtesy of our router
const Profile = () => {
  return (
    <div>
      <h1>Profile: Vũ Đình Phong</h1>
      <p>Zalo: 0559548503</p>
	  <p>Email: vudinhphong.26.12.2001@gmail.com</p>
      <p>
        <a
          href="https://github.com/VuDinhPhong2-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </p>
    </div>
  );
};

export default Profile;
