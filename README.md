# SmartLend (FlowAI Lend) 🚀

**AI-Powered Lending Protocol with Onchain Verification on Flow Blockchain**

SmartLend is a revolutionary DeFi lending protocol that combines AI-driven credit scoring with onchain verification to enable undercollateralized loans. Built on the Flow blockchain, it reduces traditional collateral requirements from 150%+ to as low as 100% by intelligently assessing users' onchain behavior and verification status.

## 🌟 Key Features

### 🤖 AI Trust Scoring Agent
- **Dynamic Credit Assessment**: AI analyzes onchain transaction history, repayment patterns, and trading behavior
- **Real-time Updates**: Trust scores (0-100) refresh every 24 hours or after loan repayments
- **Privacy-First**: Only aggregate metrics used - no personal data exposure
- **Transparent Algorithm**: Score formula considers repayments, trade frequency, and default history

### 💰 Flexible Lending Pools
- **Score-Based Rates**: Higher trust scores unlock better interest rates (5-10% APR)
- **Reduced Collateral**: Qualified users can borrow with 100-120% collateral vs traditional 150%+
- **Auto-Adjustments**: Dynamic limits based on real-time trust score changes
- **Flash Loan Protection**: Time-locks and security measures prevent exploitation

### 🔐 Onchain Verification System
- **Flow Attestation Contract**: Adapted from Ethereum Attestation Service (EAS) pattern
- **Verified Badge**: Link self-custodial wallet to verified external accounts (Blocto, exchanges)
- **Privacy-Preserving**: Only wallet address and optional geo-hash shared
- **Trust Boost**: +10 score bonus and access to premium pools for verified users

## 🎯 Problem We Solve

Traditional DeFi lending requires **overcollateralization** (150%+ collateral), creating barriers for:
- Users with limited liquid assets
- Emerging market participants
- Repeat borrowers seeking efficiency

**Our Solution**: Leverage Flow's efficient infrastructure and AI analysis to enable safer undercollateralized lending through intelligent risk assessment.

## 🏗️ Technical Architecture

### Blockchain Stack
- **Blockchain**: Flow (Mainnet/Testnet)
- **Smart Contracts**: Cadence language
  - `FlowAttestation.cdc` - Verification system
  - `LendingPool.cdc` - Lending mechanics
  - `TrustScoreOracle.cdc` - AI score integration

### Frontend & Backend
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: TailwindCSS v4
- **Wallet Integration**: Flow Client Library (FCL)
- **AI/Backend**: Node.js with Flow SDK
- **ML Model**: Hosted on AWS SageMaker

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Flow CLI (installed)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smartlend.git
   cd smartlend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start Flow Emulator**
   ```bash
   flow emulator start
   ```

4. **Deploy contracts** (in new terminal)
   ```bash
   flow project deploy --network emulator
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
# Start development server with Turbo
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Flow emulator commands
flow emulator start          # Start local blockchain
flow accounts list           # View test accounts
flow project deploy          # Deploy contracts
```

## 📋 User Journey

### 1. **New User Onboarding**
```
Connect Wallet → Verify Identity → AI Scan → Get Trust Score → Start Borrowing
```

### 2. **Borrowing Process**
```
View Dashboard → Check Eligible Amount → Select Pool → Approve Transaction → Receive Funds
```

### 3. **Score Improvement**
```
Repay Loans → Increase Trading → Maintain Good History → Higher Trust Score → Better Rates
```

## 🔒 Security & Compliance

- **Smart Contract Audits**: Planned with Runtime Verification
- **Bug Bounty Program**: Active security incentives
- **Privacy Compliance**: GDPR-aligned minimal data collection
- **Multi-sig Security**: Contract upgrade protection
- **Decentralized Oracles**: Manipulation-resistant scoring

## 📊 Scoring Formula

```
Base Score: 50
+ (Successful Repayments × 10)
+ (Trading Volume × 2) 
+ (Verification Status × 10)
- (Defaults × 20)
+ AI Pattern Recognition Adjustments
```

**Score Tiers:**
- **🔴 Low (0-49)**: 150% collateral, 10% APR
- **🟡 Medium (50-79)**: 120% collateral, 7% APR  
- **🟢 High (80-100)**: 100% collateral, 5% APR

## 🌍 Roadmap

### Phase 1: Foundation (✅ Current)
- [x] Project setup and architecture
- [x] Basic smart contract structure
- [x] Flow blockchain integration
- [ ] Core UI components

### Phase 2: Core Features (🔄 In Progress)
- [ ] AI Trust Scoring implementation
- [ ] Lending pool mechanics
- [ ] Onchain verification system
- [ ] Basic borrowing/lending flows

### Phase 3: Advanced Features
- [ ] Mobile wallet integration
- [ ] Advanced ML models
- [ ] Cross-chain bridges
- [ ] Governance token

### Phase 4: Scale & Optimize
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Institutional features
- [ ] Global expansion

## 🎯 Success Metrics

**Adoption Goals (6 months)**:
- 10,000 verified users
- $5M Total Value Locked (TVL)
- >95% loan repayment rate
- <120% average collateral ratio

**Performance Targets**:
- <5s trust score queries
- <0.01 FLOW transaction fees
- >90% audit coverage
- Zero security exploits

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links & Resources

- **Documentation**: [Flow Developer Docs](https://developers.flow.com/)
- **Cadence Language**: [Cadence Tutorials](https://cadence-lang.org/)
- **Flow Client Library**: [FCL Guide](https://docs.onflow.org/fcl/)
- **Community**: [Flow Discord](https://discord.gg/flow)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/smartlend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/smartlend/discussions)
- **Email**: support@smartlend.flow
- **Twitter**: [@SmartLendFlow](https://twitter.com/SmartLendFlow)

---

**Built with ❤️ on Flow Blockchain**

*SmartLend - Making DeFi accessible through intelligent lending*