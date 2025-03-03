"use client";

import React, { useContext } from "react";
import { Context } from "@/context";
import Button from "./button";
import VotingRoot from "./voting";
import { VotingStep } from "@/interfaces/context.interface";
import Validation from "./validation";
import { useSession } from "next-auth/react";

export default function Root() {
  const { currentStep } = useContext(Context);

  const renderButton = () => {
    switch (currentStep) {
      case VotingStep.CONNECT_WALLET:
        return (
          <p className="text-2xl font-bold text-l1-color">
            Please Connect Your Wallet First.
          </p>
        );
      case VotingStep.VOTING_SUCCESS:
        return (
          <p className="text-2xl font-bold text-l1-color">Voting Success !</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <Validation />
      {renderButton()}
      {currentStep === VotingStep.VOTING && <VotingRoot />}
    </div>
  );
}
