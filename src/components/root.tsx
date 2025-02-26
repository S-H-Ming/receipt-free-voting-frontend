"use client";

import React, { useContext, useEffect, useState } from "react"
import { Context } from "@/context"
import Button from "./button"
import { WalletConnect } from "./header";
import VotingRoot from "./voting_card";

export default function Root() {
  const context = useContext(Context)
  // const { currentStep, setStep, googleAccount } = useContext(Context);

  const renderButton = () => {
    switch (context.currentStep) {
      case "connect_wallet":
        return (
            <p className="text-2xl font-bold text-l1-color">Please Connect Your Wallet First.</p>
        );
      case "login_google":
        return (
          <Button
            type="primary"
            // temporary solution
            onClick={() => {
              context.setStep("voting");
              context.setGoogleAccount("user@gmail.com");
            }}
          >
            Login Google
          </Button>
        );
      case "voting":
        return (
          <div>
            <p className="text-1xl font-bold text-l1-color pb-4">Your Google Account : {context.googleAccount}</p>
            <Button
              type="primary"
              onClick={() => {
                // simulate voting sucess
                context.handleVote();
              }}
            >
              Voting Completed
            </Button>
          </div>
        );
      case "voting_success":
        return <p className="text-2xl font-bold text-l1-color">Voting Success !</p>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderButton()}
      {context.currentStep === "voting" && <VotingRoot />}
    </div>
  );
}