import crypto from "crypto";

// Utility Functions
function extendedGcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
    if (a === BigInt(0)) return [b, BigInt(0), BigInt(1)];
    const [g, y, x] = extendedGcd(b % a, a);
    return [g, x - (b / a) * y, y];
}

function modInverse(a: bigint, m: bigint): bigint {
    const [g, x] = extendedGcd(a, m);
    if (g !== BigInt(1)) throw new Error("Modular inverse does not exist.");
    return (x % m + m) % m;
}

function fastModExp(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = BigInt(1);
    base = base % mod;
    while (exp > BigInt(0)) {
        if (exp % BigInt(2) === BigInt(1)) result = (result * base) % mod;
        exp = exp >> BigInt(1);
        base = (base * base) % mod;
    }
    return result;
}

// Type Definitions
type HashFunction = (input: Uint8Array) => Uint8Array;
type HashType = "sha256" | "sha512";

interface MaskedBallot {
    b1: bigint;
    b2: bigint;
}

export class Voter {
    private choiceLength: number;
    private maskLength: number;
    private mask: bigint | null = null;
    private maskInv: bigint | null = null;
    private encPairs: [bigint, bigint][] | null = null;

    constructor(choiceLength = 128, maskLength = 128) {
        this.choiceLength = choiceLength;
        this.maskLength = maskLength;
    }

    private getHashFunction(hash: HashType | HashFunction): HashFunction {
        if (typeof hash === "string") {
            switch (hash) {
                case "sha256":
                    return (input: Uint8Array) => new Uint8Array(crypto.createHash("sha256").update(input).digest());
                case "sha512":
                    return (input: Uint8Array) => new Uint8Array(crypto.createHash("sha512").update(input).digest());
                default:
                    throw new Error("Invalid hash function.");
            }
        }
        return hash;
    }

    public receiveEncPairs(encPairs: [bigint, bigint][]): void {
        this.encPairs = encPairs;
    }

    private generateMask(rsaN: bigint): void {
        while (true) {
            const mask = BigInt("0x" + crypto.randomBytes(this.maskLength).toString("hex")) % rsaN;
            if (mask > BigInt(1) && this.gcd(mask, rsaN) === BigInt(1)) {
                this.mask = mask;
                this.maskInv = modInverse(mask, rsaN);
                return;
            }
        }
    }

    private gcd(a: bigint, b: bigint): bigint {
        return b === BigInt(0) ? a : this.gcd(b, a % b);
    }

    public generateBallot(rsaN: bigint, rsaV: bigint, hash: HashType | HashFunction = "sha256"): MaskedBallot {
        if (!this.encPairs) throw new Error("No encrypted pairs received.");
        if (!this.mask || !this.maskInv) this.generateMask(rsaN);

        const _hash = this.getHashFunction(hash);
        const mask = this.mask as bigint;

        // Get original encrypted pairs
        const [b1orig, b2orig] = this.encPairs[0];

        // Hash the encrypted pairs with the mask
        const b1hash = _hash(Uint8Array.from([
            ...Uint8Array.from(Buffer.from(b1orig.toString(16), "hex")),
            ...Uint8Array.from(Buffer.from(mask.toString(16), "hex"))
        ]));

        const b2hash = _hash(Uint8Array.from([
            ...Uint8Array.from(Buffer.from(b2orig.toString(16), "hex")),
            ...Uint8Array.from(Buffer.from(mask.toString(16), "hex"))
        ]));

        // Create new ballot numbers
        const b1 = BigInt("0x" + Buffer.from([
            ...Uint8Array.from(Buffer.from(b1orig.toString(16), "hex")),
            ...b1hash
        ]).toString("hex"));

        const b2 = BigInt("0x" + Buffer.from([
            ...Uint8Array.from(Buffer.from(b2orig.toString(16), "hex")),
            ...b2hash
        ]).toString("hex"));

        if (b1 >= rsaN || b2 >= rsaN) throw new Error("Ballot values must be less than RSA modulus.");

        return {
            b1: (b1 * fastModExp(mask, rsaV, rsaN)) % rsaN,
            b2: (b2 * fastModExp(mask, rsaV, rsaN)) % rsaN
        };
    }
}

