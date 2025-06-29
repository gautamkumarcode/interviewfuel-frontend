import dynamic from "next/dynamic";

type Props = {};

const Profile = dynamic(
	() => import("./Profile").then((mod) => mod.ProfilePage),
	{
		ssr: true,
	}
);

const ProfileHOC = (props: Props) => {
	return <Profile />;
};

export default ProfileHOC;
