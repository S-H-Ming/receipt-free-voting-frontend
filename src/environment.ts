import { Candidate } from "@/interfaces/context.interface"

// export const CANDIDATES: Candidate[] = [
//     { id: 1, name: "test1", imageURL: "/images/test.jpg", address: "KT1NGpC4MXhFd2nSfd4fTTew7pHMzcCmfY7L" },
//     { id: 2, name: "test2", imageURL: "/images/test.jpg", address: "KT1QxPLHtVEfk6caJK7w513GaSpvmg6vokft" },
//     { id: 3, name: "test3", imageURL: "/images/test.jpg", address: "KT1CJvtL3fJjXg3hhfcqzg21z9KPy24hvxV2" },
//     { id: 4, name: "test4", imageURL: "/images/test.jpg", address: "KT1LtgMnfBfS4SkLsQLsDGrtVxHUouUsApyS" },
//     { id: 5, name: "test5", imageURL: "/images/test.jpg", address: "KT1CKziJciRoXUe36a4SMyMs2w368QPEqPNf" }
//   ].map(candidate => ({ ...candidate, checked: false }));

export const VA_SERVER_URL = process.env.NEXT_PUBLIC_VA_SERVER_URL
export const IA_SERVER_URL = process.env.NEXT_PUBLIC_IA_SERVER_URL