import dynamic from "next/dynamic";


const Profile = dynamic(
	() => import("./Profile").then((mod) => mod.ProfilePage),
	{
		ssr: true,
	}
);

const ProfileHOC = () => {
	return <Profile />;
};

export default ProfileHOC;
