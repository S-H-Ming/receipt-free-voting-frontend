"use client";

import { CandidateCard } from "@/components/voting";
import { Context } from "@/context";
import { useContext, useEffect, useState } from "react";
import { getAmount } from "@/libs/getResults";
import Button from "@/components/button";

export default function Tallying() {
  const { candidates, initCandidates } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [amounts, setAmounts] = useState<number[]>([]);

  useEffect(() => {
    if (!candidates || candidates.length <= 0) initCandidates();
    else {
      candidates.forEach((candidate) => {
        if (candidate.address) {
          getAmount({ address: candidate.address }).then((amount) => {
            setAmounts((prev) => [...prev, amount]);
          });
        }
      });
    }
  }, [candidates]);

  useEffect(() => {
    if (amounts.length === candidates.length && amounts.length > 0) {
      setIsLoading(false);
    }
  }, [amounts]);

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
      {amounts.length > 0 && (
        <div className="text-center text-main">Total Votes: {amounts[0]}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-12">
        {candidates.map((candidate, index) => (
          <CandidateCard
            id={candidate.id}
            image={candidate.imageURL}
            name={candidate.name}
            // amount={amounts[index]}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          disabled={true}
          type="secondary"
          onClick={() => {
            // setIsLoading(true);
            // setAmounts([]);
          }}
        >
          Reveal
        </Button>
      </div>
    </div>
  );
}
