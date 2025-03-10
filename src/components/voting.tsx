"use client";

import React, { useContext, useEffect, useState } from "react";
import Button from "@/components/button";
import Toggle from "@/components/toggle";
import { Context } from "@/context";

export interface VotingCardProps {
  id: number;
  image: string; // 圖片的 URL
  name: string; // 候選人的名稱
  onVote?: (checked: boolean) => void;
  amount?: number;
}

// Candidate Card Component
export const CandidateCard = ({
  id,
  image,
  name,
  onVote,
  amount,
}: VotingCardProps) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-4">
      {/* Image Section */}
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt={name}
        className="w-full h-full object-cover"
      />
      {/* Name Section */}
      <h3 className="text-lg font-medium mt-2 mb-4 text-center text-l1-color">
        {name}
      </h3>
      {onVote !== undefined && (
        <Toggle
          checked={false}
          onChange={(value) => {
            onVote(value);
          }}
        />
      )}
      <div className="text-sm text-gray-500 text-main">{amount}</div>
    </div>
  );
};

// Candidate Root Component
const VotingRoot = () => {
  const { candidates, handleVote, updateVote } = useContext(Context);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (candidates.length > 0) {
      setIsLoading(false);
    }
  }, [candidates]);

  if (isLoading) {
    return <div className="my-8 text-main font-bold">Loading...</div>;
  }
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-12">
        {candidates.map((candidate) => (
          <CandidateCard
            id={candidate.id}
            image={candidate.imageURL}
            name={candidate.name}
            onVote={(value) => updateVote(candidate.id, value)}
          />
        ))}
      </div>
      {
        <Button
          type="primary"
          onClick={() => {
            setIsLoading(true);
            // simulate voting sucess
            handleVote()
              .then(() => {
                setIsLoading(false);
              })
              .catch(() => {
                setIsLoading(false);
              });
          }}
        >
          Vote
        </Button>
      }
    </React.Fragment>
  );
};

export default VotingRoot;
