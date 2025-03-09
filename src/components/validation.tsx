import { Context } from "@/context";
import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { VotingStep } from "@/interfaces/context.interface";
import Button from "./button";
const Validation = () => {
  const {
    wallet,
    address,
    setStep,
    currentStep,
    signOutGoogle,
    signInGoogle,
    candidates,
  } = useContext(Context);

  const { data: session, status } = useSession();

  const [walletConnected, setWalletConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  useEffect(() => {
    setWalletConnected(
      address !== undefined && address !== "" && address !== null
    );
  }, [address]);

  useEffect(() => {
    if (session?.user?.identifier) {
      setGoogleConnected(true);
    } else {
      setGoogleConnected(false);
      setStep(VotingStep.LOGIN_GOOGLE);
    }
  }, [session]);

  useEffect(() => {
    if (
      walletConnected &&
      googleConnected &&
      // candidates.length > 0 &&
      currentStep !== VotingStep.VOTING
    ) {
      setStep(VotingStep.VOTING);
    }
  }, [walletConnected, googleConnected, candidates]);

  return (
    <div className="text-main font-semibold flex flex-col mb-8 gap-4 justify-center">
      {wallet === undefined || status === "loading" ? (
        <div>loading...</div>
      ) : (
        <React.Fragment>
          <div className="flex flex-col gap-2">
            <span>Wallet connection {walletConnected ? "✅" : "❌"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span>
              Google account connection {googleConnected ? "✅" : "❌"}
            </span>
            <span className=" text-l1-color">{session?.user?.identifier}</span>
            {googleConnected && (
              <div className="mt-4">
                <Button type="secondary" onClick={() => signOutGoogle()}>
                  Logout Google
                </Button>
              </div>
            )}
          </div>
          {!googleConnected && (
            <div className="mx-auto">
              <Button
                type="primary"
                onClick={() => {
                  signInGoogle();
                }}
              >
                Login Google
              </Button>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Validation;
