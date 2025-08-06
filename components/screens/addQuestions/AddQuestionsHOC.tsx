
import dynamic from "next/dynamic";

// type Props = {};

const AddQuestion = dynamic(() => import("./AddQuestion"), {
    ssr: true,
});
const AddQuestionHOC = () => {
    return <AddQuestion />;
};

export default AddQuestionHOC;
