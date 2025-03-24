"use client";

import { CandidateCard } from "@/components/voting";
import { Context } from "@/context";
import { useContext, useEffect, useState } from "react";
import { getTotalAmount, initAllCandidates } from "@/libs/contract_apis";
import { getVoteCount } from "@/libs/backend_apis";
import Button from "@/components/button";
import { AmountResponse } from "@/interfaces/context.interface";
import { get } from "http";

export default function Tallying() {
  const { tezos, candidates, isAdmin, initCandidates, finalizeVoting } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  // each candidate's numbers of votes ( 得票數 )
  const [voteCount, setVoteCount] = useState<AmountResponse>({});
  // total numbers of voters
  const [totalAmounts, setTotalAmounts] = useState<number|undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!candidates || candidates.length <= 0) initCandidates();
    else {
      // Get the total amount of votes
      if (candidates[0].address) {
        getTotalAmount({ address: candidates[0].address }).then((amount) => {
          setTotalAmounts(amount);
        });
      }
    }
  }, [candidates]);

  useEffect(() => {
    if (totalAmounts !== undefined) {
      setIsLoading(false);
    }
  }, [totalAmounts]);

  if (!isAdmin) {
    return (
      <div className="my-8 text-main font-bold text-center">
        Unauthorized. Please connect to an admin wallet.
      </div>
    );
  }
  else if (isLoading) {
    return (
      <div className="my-8 text-main font-bold text-center">Loading...</div>
    );
  }
  return (
    <div>
      <div className="text-2xl my-8 font-bold text-center text-main">
        Tallying
      </div>
      {totalAmounts !== undefined && (
        <div className="text-center text-main">Total Votes : {totalAmounts}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-12">
        {candidates.map((candidate, index) => (
          <CandidateCard
            id={candidate.id}
            image={candidate.imageURL}
            name={candidate.name}
            amount={voteCount[candidate.id]}
          />
        ))}
      </div>
      {isProcessing && <div className="text-center text-main">Processing...</div>}
      {!isProcessing && 
      <div className="flex justify-center gap-4">
        <Button
          disabled={isProcessing}
          type="secondary"
          onClick={() => {
            setIsProcessing(true);
            getVoteCount().then((res) => {
              setVoteCount(res);
              setIsProcessing(false);
            }).catch((error) => {
              alert(`Error while revealing: ${error}`);
              setIsProcessing(false);
            });
          }}
        >
          Reveal
        </Button>
        <Button
          disabled={isProcessing}
          type="secondary"
          onClick={() => {
            setIsProcessing(true);
            finalizeVoting().then(() => {
              alert("Voting stage has been finalized.");
              setIsProcessing(false);
            }).catch((error) => {
              alert(`Error: ${error}`);
              setIsProcessing(false);
            });
          }}
        >
          Finalize
        </Button>
        <Button
          disabled={isProcessing}
          type="secondary"
          onClick={() => {
            setIsProcessing(true);
            if (!tezos) {
              alert("Please connect your wallet first.");
              setIsProcessing(false);
              return;
            }
            initAllCandidates(tezos).then(() => {
              alert(`Success Initialization!`);
              setIsProcessing(false);
            }).catch((error) => {
              alert(`Error: ${error}`);
              setIsProcessing(false);
            });
          }}
        >
          Initialize
        </Button>
      </div>}
    </div>
  );
}
