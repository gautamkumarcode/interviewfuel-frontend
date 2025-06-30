"use client";
import React from "react";
import { frontedTopics } from "./frontedTopics";
import { CustomButton } from "@/components/custom/CustomButton/CustomButton";
import { Users } from "lucide-react";

const FrontedCard = () => {
  return (
    <div className="p-5 w-[90vw] mx-auto mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Frontend Interview Topics
      </h2>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {frontedTopics.map((data, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Card Header */}
            <div className="flex flex-col justify-center text-3xl font-semibold text-white pl-5 h-36 bg-[#008236]">
              <p>{data.title}</p>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-4">
              <p>{data.about}</p>

              <p
                className={`${
                  data.difficulty === "Beginner"
                    ? "bg-green-200"
                    : data.difficulty === "Intermediate"
                    ? "bg-orange-200"
                    : "bg-red-300"
                } w-fit px-3 py-1 rounded-full`}
              >
                {data.difficulty}
              </p>

              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-sm text-gray-700">
                  <Users className="h-4 w-4" />
                  {data.views} <span>views</span>
                </p>

                <CustomButton
                  content="Explore"
                  className="bg-[#008236] text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontedCard;
