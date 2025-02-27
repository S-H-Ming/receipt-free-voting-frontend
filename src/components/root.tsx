"use client";

import React, { useContext } from "react";
import { Context } from "@/context";
import Button from "./button";
import VotingRoot from "./voting";
import { VotingStep } from "@/interfaces/context.interface";

export default function Root() {
  const { currentStep, setStep, googleAccount, handleVote, setGoogleAccount } =
    useContext(Context);

  const renderButton = () => {
    switch (currentStep) {
      case VotingStep.CONNECT_WALLET:
        return (
          <p className="text-2xl font-bold text-l1-color">
            Please Connect Your Wallet First.
          </p>
        );
      case VotingStep.LOGIN_GOOGLE:
        return (
          <Button
            type="primary"
            // temporary solution
            onClick={() => {
              setStep(VotingStep.VOTING);
              setGoogleAccount("user@gmail.com");
            }}
          >
            Login Google
          </Button>
        );
      case VotingStep.VOTING:
        return (
          <div>
            <p className="text-1xl font-bold text-l1-color pb-4">
              Your Google Account : {googleAccount}
            </p>
          </div>
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
      {renderButton()}
      {currentStep === VotingStep.VOTING && <VotingRoot />}
    </div>
  );
}
