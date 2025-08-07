import dynamic from "next/dynamic";
import React from "react";

const AdminQuestions = dynamic(() => import("./AdminQuestions"), {
    ssr: true,
});

const AdminQuestionsHOC: React.FC = () => {
    return <AdminQuestions />;
};

export default AdminQuestionsHOC;