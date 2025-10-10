# **Product Requirements Document (PRD): AI Lending Agent with Onchain Verification on Flow**

## **1\. Document Overview**

### **1.1 Version History**

| Version | Date | Author | Changes |
| ----- | ----- | ----- | ----- |
| 1.0 | Oct 07, 2025 | Grok (xAI) | Initial draft |

### **1.2 Summary**

This PRD outlines the requirements for **FlowAI Lend**, a DeFi lending protocol on the Flow blockchain that integrates an AI-powered credit scoring agent with onchain verification. The system reduces collateral requirements by assessing users' onchain behavior via an AI trust score, enabling undercollateralized loans. Onchain verification adapts the Ethereum Attestation Service (EAS) pattern to Flow, allowing users to link self-custodial Flow wallets to verified external accounts (e.g., via a partner like Blocto or a Flow-compatible exchange) for a "verified badge" that enhances trust without exposing personal data.

### **1.3 Scope**

* **In Scope**: AI trust scoring, lending pool integration, onchain attestation contract, user verification flow, basic UI for wallet interaction.
* **Out of Scope**: Full KYC integration, offchain oracle for non-Flow data, advanced AI training pipelines (use pre-trained models), mobile app development.

## **2\. Problem Statement**

Traditional DeFi lending (e.g., on Ethereum or Aave) requires overcollateralization (150%+ collateral for loans), limiting accessibility for users with limited assets. This creates barriers for emerging markets and repeat borrowers. Existing credit scoring is either centralized (e.g., offchain credit bureaus) or rudimentary (e.g., simple onchain metrics).

**Opportunity**: Leverage Flow's efficient, low-cost transactions and Cadence smart contracts to build an AI agent that analyzes onchain history for dynamic trust scores. Combine with privacy-preserving onchain verification to bootstrap trust, enabling loans with 100-120% collateral ratios initially, scaling to undercollateralized based on score.

## **3\. Goals and Objectives**

### **3.1 Business Goals**

* Achieve 10,000 verified users and $5M in TVL within 6 months post-launch.
* Reduce average collateral ratio to \<120% for high-score users.
* Position FlowAI Lend as a pioneer in AI-DeFi on Flow, driving ecosystem adoption.

### **3.2 User Goals**

* Borrow with less collateral via AI-assessed trust.
* Seamlessly verify identity onchain for better rates and access.
* Transparent, automated adjustments to borrowing power.

### **3.3 Success Metrics**

* **Adoption**: Number of verified attestations issued; active borrowers.
* **Engagement**: Loan origination volume; repayment rate (\>95%).
* **Performance**: Average trust score improvement per user; gas efficiency (\<0.01 FLOW per verification).
* **Security**: Zero successful exploits; audit coverage \>90%.

## **4\. Target Audience**

* **Primary Users**: DeFi enthusiasts on Flow (e.g., NFT traders, gamers using Blocto wallets) aged 18-35, with onchain history but limited liquid collateral.
* **Secondary Users**: Lenders providing liquidity to pools; dApp integrators (e.g., NFT marketplaces).
* **Personas**:
  * **Alex the Trader**: Active on Flow DEXs, seeks quick loans for trades without locking extra assets.
  * **Jordan the Builder**: dApp developer integrating lending for users.

## **5\. Features and Requirements**

### **5.1 Core Features**

#### **5.1.1 AI Trust Scoring Agent**

* **Description**: An AI model (e.g., offchain ML via Python/TensorFlow, queried onchain via oracle) scans user's Flow onchain data to compute a trust score (0-100).
* **Inputs**:
  * Onchain history: Transaction volume, repayment history, trade frequency (via Flow Access API).
  * Verification status: Presence of onchain attestation.
* **Outputs**: Dynamic score updated every 24 hours or post-repayment; emits event for onchain record.
* **Requirements**:
  * Score formula: Base (50) \+ (repayments \* 10\) \+ (trades \* 2\) \- (defaults \* 20); AI refines with ML patterns.
  * Integration: Smart contract calls oracle for score; stores in user resource.
  * Privacy: Only aggregate metrics shared; no raw data exposed.

#### **5.1.2 Lending Pools**

* **Description**: Liquidity pools for lending FLOW/FUSD, with rates and limits based on trust score.
* **Mechanics**:
  * Low score (\<50): 150% collateral, 10% APR.
  * High score (\>80): 100% collateral, 5% APR.
  * Auto-adjust: If score drops, liquidate excess collateral or pause borrowing.
* **Requirements**:
  * Cadence contract for deposits/withdrawals.
  * Interest accrual via compounding every block.
  * Flash loan protection: Time-locks on borrows.

#### **5.1.3 Onchain Verification (Adapted EAS Pattern for Flow)**

* **Description**: Users link self-custodial Flow wallet to a verified external account (e.g., Blocto-verified profile or partner exchange like Onramp) using a Flow Attestation Contract. Creates a "verified badge" resource attached to the wallet, shareable for trust boosts. No fees; automatic updates on status changes.
* **Process** (Mirroring Coinbase Flow):
  * User signs into partner app (e.g., Blocto dashboard).
  * Connects Flow wallet via FCL (Flow Client Library).
  * Claims attestation: Partner signs claim (wallet address \+ optional country) offchain, submits to Flow contract.
  * Contract verifies signature and mints Attestation Resource to user's account.
  * Badge enables: Lower collateral thresholds (+10 score boost), access to premium pools, gasless tx via relayers.
* **Technical Adaptation to Flow**:
  * **Contract**: Cadence-based FlowAttestation contract (inspired by EAS Schema/AttestationRegistry).
    * Resources: Attestation (holds claim hash, issuer pubkey, expiry).
    * Functions: createAttestation(address: Address, claim: String, signature: String) – Verifies ECDSA sig, attaches to account.
    * Events: AttestationIssued(attester: Address, subject: Address, claimHash: String).
  * **Verification**: Uses Flow's native crypto libs for sig checks; no L2 needed (Flow is monolithic).
  * **Privacy**: Only wallet address and optional geo-hash shared; claims are revocable.
  * **Updates**: Partner monitors status; revokes via revokeAttestation(claimHash) if needed, triggering score recalc.
* **Requirements**:
  * Partner Integration: API for Blocto/Onramp to issue claims.
  * UI: Simple modal for "Verify Wallet" button.
  * Security: Multi-sig for contract upgrades; timelock for revocations.

### **5.2 User Flows**

#### **5.2.1 New User Onboarding**

1. Connect Flow wallet (Blocto/Lilico).
2. Initiate verification: Redirect to partner, sign claim.
3. Receive badge → AI scans history (initial score: 30 if verified).
4. Deposit collateral → Borrow based on score.

#### **5.2.2 Borrowing**

1. View dashboard: Score, eligible amount/rate.
2. Select pool → Approve tx for lock/borrow.
3. Repay: Auto-score update on success.

#### **5.2.3 Score Adjustment**

* Trigger: Repayment event → Oracle call → Update resource.
* Notification: Onchain event \+ offchain push (e.g., via Flow notifications).

### **5.3 Non-Functional Requirements**

* **Performance**: \<5s for score query; \<1 FLOW tx fee.
* **Security**: Audits by Runtime Verification; bug bounties.
* **Scalability**: Handle 1,000 TPS (Flow-native).
* **Accessibility**: Wallet-agnostic via FCL; multilingual UI.
* **Compliance**: GDPR-aligned (minimal data); optional geo-restrictions.

## **6\. Technical Specifications**

### **6.1 Tech Stack**

* **Blockchain**: Flow mainnet/testnet.
* **Smart Contracts**: Cadence (Attestation, LendingPool, TrustScoreOracle).
* **AI/Backend**: Node.js with Flow SDK; ML model hosted on AWS SageMaker, queried via Chainlink-like oracle on Flow.
* **Frontend**: React/Vite with FCL for wallet auth.
* **Data Sources**: FlowScan API for history; partner APIs for verification.
* **Deployment**: Use Flow CLI/Emulator for dev; Cadence tools for testing.

### **6.2 Dependencies**

* FCL v1.5+ for auth.
* Custom oracle contract for AI calls.
* Partner: Blocto for verification (fallback: Self-attest via sig).

### **6.3 Risks and Mitigations**

| Risk | Likelihood | Impact | Mitigation |
| ----- | ----- | ----- | ----- |
| Oracle manipulation | Medium | High | Use decentralized oracles (e.g., Flow's native randomness). |
| Low adoption of verification | High | Medium | Incentives: \+5% yield for verified users. |
| AI bias in scoring | Low | High | Regular audits; diverse training data from Flow txs. |

## **7\. Timeline and Milestones**

| Phase | Duration | Key Deliverables |
| ----- | ----- | ----- |
| **Design** | 2 weeks | Wireframes, contract specs. |
| **Development** | 6 weeks | Contracts deployed to testnet; AI prototype. |
| **Testing** | 2 weeks | Unit/integration tests; beta user audits. |
| **Launch** | 1 week | Mainnet deploy; marketing push. |

## **8\. Appendices**

### **8.1 Glossary**

* **Trust Score**: AI-computed metric (0-100) for creditworthiness.
* **Attestation Resource**: Cadence resource storing verification claims.
* **FCL**: Flow Client Library for user auth.

### **8.2 References**

* Flow Developer Docs: Cadence Resources, FCL Auth.
* Inspired by: Ethereum Attestation Service (adapted for Flow's resource model).
