"use client";

import { CandidateCard } from "@/components/voting";
import { Context } from "@/context";
import { useContext, useEffect, useState } from "react";
import { getTotalAmount } from "@/libs/contracts_apis";
import { getVoteCount } from "@/libs/backend_apis";
import Button from "@/components/button";
import { AmountResponse } from "@/interfaces/context.interface";
import { get } from "http";

export default function Tallying() {
  const { candidates, initCandidates } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  // each candidate's numbers of votes ( 得票數 )
  const [voteCount, setVoteCount] = useState<AmountResponse>({});
  // total numbers of voters
  const [totalAmounts, setTotalAmounts] = useState<number|undefined>(undefined);

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

  if (isLoading) {
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
      <div className="flex justify-center">
        <Button
          disabled={false}
          type="secondary"
          onClick={() => {
            getVoteCount().then((res) => {
              setVoteCount(res);
            });
          }}
        >
          Reveal
        </Button>
      </div>
    </div>
  );
}
