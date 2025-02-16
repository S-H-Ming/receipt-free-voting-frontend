"use client";

import React, { useContext, useEffect, useState } from "react"
import Button from "@/components/button";
import { Context } from "@/context";

export interface VotingCardProps {
  id : number;
  imageURL: string; // 圖片的 URL
  name: string; // 候選人的名稱
  onVote: () => void;
}

// Candidate Card Component
const VotingCard = ({ id, imageURL, name, onVote} : VotingCardProps) => {
    return (
      <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-4">
        {/* Image Section */}
        <div
          className="w-full aspect-square bg-cover bg-center rounded-md bg-l3-color"
          style={{ backgroundImage: `url(${imageURL})` }}
        //   style={{ backgroundImage: `url(${imageURL})` }}
        ></div>
  
        {/* Name Section */}
        <h3 className="text-lg font-medium mt-2 mb-4 text-center text-l1-color">{name}</h3>
  
        {/* Vote Button */}
        <Button
          type = "secondary"
          onClick={onVote}
        >
          Vote
        </Button>
      </div>
    );
  };
  
  // Candidate Root Component
const VotingRoot = () => {
    const {candidates, handleVote} = useContext(Context);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-12">
        {candidates.map((candidate) => (
          <VotingCard
            id={candidate.id}
            imageURL={candidate.imageURL}
            name={candidate.name}
            onVote={() => handleVote(candidate)}
          />
        ))}
      </div>
    );
  };
  
export default VotingRoot;